/**
 * Simula o fluxo completo do programa de parceiros com Playwright:
 * 1) Parceiro se cadastra no portal
 * 2) Admin (via SQL) aprova a conta
 * 3) Visitante abre a LP com ?ref=
 * 4) Parceiro faz login e vê funil (cliques) + links + comissões
 *
 * Pré-requisitos: backend :3000, LP :3001, partners :3002, Postgres com tabelas sales_*.
 *
 * Uso (a partir de agende7-backend, onde está o playwright):
 *   node ../agende7-partners/scripts/playwright-partner-flow.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../playwright-output");
const API = process.env.API_URL || "http://localhost:3000";
const LP = process.env.LP_URL || "http://localhost:3001";
const PARTNERS = process.env.PARTNERS_URL || "http://localhost:3002";
const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || "5444",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "pix",
};

const stamp = Date.now();
const partner = {
  name: "Lucas Mentor E2E",
  email: `lucas.e2e.${stamp}@test.local`,
  phone: "11987654321",
  password: "senha12345",
};

function psql(sql) {
  const result = spawnSync(
    "psql",
    [
      "-h",
      DB.host,
      "-p",
      String(DB.port),
      "-U",
      DB.user,
      "-d",
      DB.database,
      "-t",
      "-A",
      "-c",
      sql,
    ],
    {
      env: { ...process.env, PGPASSWORD: DB.password },
      encoding: "utf8",
    },
  );
  if (result.status !== 0) {
    throw new Error(`psql falhou: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || "").trim();
}

function log(step, detail = "") {
  console.log(`\n▶ ${step}${detail ? ` — ${detail}` : ""}`);
}

async function shot(page, name) {
  const path = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`  📸 ${path}`);
  return path;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  log("Checando serviços");
  for (const [name, url] of [
    ["API", `${API}/uptimerobot`],
    ["LP", LP],
    ["Partners", `${PARTNERS}/register`],
  ]) {
    const res = await fetch(url);
    if (!res.ok && res.status >= 500) {
      throw new Error(`${name} indisponível em ${url} (HTTP ${res.status})`);
    }
    console.log(`  ✓ ${name} ${url}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: "pt-BR",
  });
  const page = await context.newPage();

  try {
    // 1) Cadastro do parceiro
    log("1/5 Cadastro do parceiro", partner.email);
    await page.goto(`${PARTNERS}/register`, { waitUntil: "networkidle" });
    await page.locator('[data-cy="register-name"]').fill(partner.name);
    await page.locator('[data-cy="register-email"]').fill(partner.email);
    await page.locator('[data-cy="register-phone"]').fill(partner.phone);
    await page.locator('[data-cy="register-password"]').fill(partner.password);
    await shot(page, "01-register-form");
    await page.locator('[data-cy="register-submit"]').click();
    await page.locator('[data-cy="register-success"]').waitFor({
      timeout: 15000,
    });
    await shot(page, "02-register-success");
    console.log("  ✓ Cadastro enviado (aguardando aprovação)");

    // 2) Aprovação (simula admin)
    log("2/5 Aprovação da conta no banco");
    const activated = psql(
      `UPDATE sales_reps SET is_active = true, updated_at = NOW() WHERE email = '${partner.email}' RETURNING code;`,
    );
    if (!activated) {
      throw new Error("Não foi possível ativar o parceiro no banco");
    }
    const code = activated.split("\n")[0].trim();
    console.log(`  ✓ Conta ativa · código ${code}`);

    // 3) Visitante abre o link de indicação
    log("3/5 Visitante acessa LP com ?ref=", code);
    const visitor = await context.newPage();
    await visitor.goto(`${LP}/?ref=${encodeURIComponent(code)}`, {
      waitUntil: "networkidle",
    });
    await visitor.locator('[data-cy="referral-banner"]').waitFor({
      timeout: 15000,
    });
    const bannerText = await visitor
      .locator('[data-cy="referral-banner"]')
      .innerText();
    console.log(`  ✓ Banner: ${bannerText.replace(/\s+/g, " ").trim()}`);
    await shot(visitor, "03-visitor-lp-banner");
    await visitor.close();

    // Confirma clique na API/funil
    const clickCount = psql(
      `SELECT count(*) FROM sales_partner_clicks c JOIN sales_reps r ON r.id = c.sales_rep_id WHERE r.email = '${partner.email}';`,
    );
    console.log(`  ✓ Cliques registrados: ${clickCount}`);

    // 4) Login do parceiro
    log("4/5 Login no portal");
    await page.goto(`${PARTNERS}/login`, { waitUntil: "networkidle" });
    await page.locator('[data-cy="login-email"]').fill(partner.email);
    await page.locator('[data-cy="login-password"]').fill(partner.password);
    await page.locator('[data-cy="login-submit"]').click();
    await page.locator('[data-cy="partner-dashboard"]').waitFor({
      timeout: 15000,
    });
    await shot(page, "04-dashboard");

    const dashText = await page.locator('[data-cy="partner-dashboard"]').innerText();
    if (!dashText.includes(code) && !dashText.includes("Lucas")) {
      console.warn("  ⚠ Dashboard sem código/nome visível — conferir screenshot");
    }
    console.log("  ✓ Dashboard carregou");

    // Funil: cliques (7 dias) deve ser > 0
    const funnelHasClicks =
      /Cliques \(7 dias\)[\s\S]*?[1-9]\d*/.test(dashText) ||
      dashText.includes("Total:");
    console.log(
      funnelHasClicks
        ? "  ✓ Funil visível (cliques/trials/comissões)"
        : "  ⚠ Texto do funil incompleto — ver screenshot",
    );

    // 5) Links e comissões
    log("5/5 Navega links e comissões");
    await page.getByRole("link", { name: "Ver meus links" }).click();
    await page.locator('[data-cy="partner-links-page"]').waitFor({
      timeout: 10000,
    });
    await shot(page, "05-links");
    const linksText = await page
      .locator('[data-cy="partner-links-page"]')
      .innerText();
    if (!linksText.includes(`ref=${code}`) && !linksText.includes(code)) {
      throw new Error("Links do parceiro não contêm o código ref");
    }
    console.log("  ✓ Página de links com ?ref=");

    await page.getByRole("link", { name: "Comissões" }).click();
    await page.locator('[data-cy="partner-commissions-page"]').waitFor({
      timeout: 10000,
    });
    await shot(page, "06-comissoes");
    console.log("  ✓ Página de comissões");

    console.log("\n✅ Fluxo Playwright concluído com sucesso");
    console.log(`   Parceiro: ${partner.email}`);
    console.log(`   Código:   ${code}`);
    console.log(`   Link:     ${LP}/?ref=${code}`);
    console.log(`   Shots:    ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("\n❌ Falha no fluxo:", err);
  process.exit(1);
});
