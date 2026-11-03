"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBRL, formatDate } from "@/lib/format";
import {
  partnerApi,
  type PartnerFunnelSummary,
  type PartnerMe,
} from "@/services/api";

export default function DashboardPage() {
  const [me, setMe] = useState<PartnerMe | null>(null);
  const [funnel, setFunnel] = useState<PartnerFunnelSummary | null>(null);

  useEffect(() => {
    void Promise.all([
      partnerApi.getMe(),
      partnerApi.getFunnelSummary(),
    ]).then(([profile, summary]) => {
      setMe(profile);
      setFunnel(summary);
    });
  }, []);

  const funnelCards = [
    {
      label: "Cliques (7 dias)",
      value: String(funnel?.clicks.last_7_days ?? 0),
      hint: `Total: ${funnel?.clicks.total ?? 0} · Último: ${formatDate(funnel?.clicks.last_clicked_at)}`,
    },
    {
      label: "Trials iniciados",
      value: String(funnel?.trials_started ?? 0),
      hint: `${funnel?.trials_active ?? 0} ainda ativos`,
    },
    {
      label: "Lojas que pagaram",
      value: String(funnel?.paid_shops ?? 0),
      hint: "Primeira cobrança confirmada",
    },
  ];

  const moneyCards = [
    {
      label: "Previsto (trial)",
      value: funnel?.predicted ?? 0,
      hint: "Não é saldo — só se a loja pagar",
    },
    {
      label: "Em carência (30 dias)",
      value: funnel?.pending_clearance ?? 0,
      hint: "Aguardando fim da garantia do cliente",
    },
    {
      label: "Disponível para saque",
      value: funnel?.available ?? 0,
      hint: "A equipe Agende7 registra o PIX manualmente",
    },
    {
      label: "Já recebido",
      value: funnel?.paid ?? 0,
      hint: "Comissões já pagas a você",
    },
  ];

  return (
    <div data-cy="partner-dashboard">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Olá, {me?.name?.split(" ")[0] ?? "parceiro"}
      </h1>
      <p className="text-gray-600 mb-6">
        Seu código de indicação:{" "}
        <code className="text-[var(--color-primary)] font-semibold">
          {me?.code}
        </code>
        {" · "}
        Comissão padrão: {me?.default_commission_percent ?? "—"}%
        {me?.commission_duration_months != null && (
          <> · {me.commission_duration_months} mês(es) de duração</>
        )}
      </p>

      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-6">
        Valor previsto não é saldo. Você recebe quando a loja pagar e passarem
        30 dias da garantia.
      </p>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Funil (atividade)
      </h2>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {funnelCards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-gray-500">{c.label}</p>
            <div className="text-2xl font-bold text-gray-900 mt-1">{c.value}</div>
            <p className="text-xs text-gray-400 mt-2">{c.hint}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Comissões
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {moneyCards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-gray-500">{c.label}</p>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {formatBRL(c.value)}
            </div>
            <p className="text-xs text-gray-400 mt-2">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/links" className="btn btn-primary">
          Ver meus links
        </Link>
        <Link href="/comissoes" className="btn btn-outline">
          Ver lojas e extrato
        </Link>
        <Link href="/perfil" className="btn btn-outline">
          Dados de pagamento
        </Link>
      </div>
    </div>
  );
}
