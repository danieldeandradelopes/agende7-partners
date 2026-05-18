const apiBase = () =>
  String(Cypress.env("apiUrl") ?? "http://localhost:3000").replace(/\/$/, "");

Cypress.Commands.add("mockPartnerApi", () => {
  const base = apiBase();

  cy.fixture("payments").then((payments) => {
    cy.intercept("POST", `${base}/sales-partner/auth/login`, {
      statusCode: 200,
      body: payments.partnerLogin,
    }).as("partnerLogin");

    cy.intercept("GET", `${base}/sales-partner/me`, {
      statusCode: 200,
      body: payments.partnerMe,
    }).as("partnerMe");

    cy.intercept("GET", `${base}/sales-partner/me/commissions/summary`, {
      statusCode: 200,
      body: payments.partnerCommissionSummary,
    }).as("partnerCommissionSummary");

    cy.intercept("GET", `${base}/sales-partner/me/commissions*`, {
      statusCode: 200,
      body: [],
    }).as("partnerCommissions");

    cy.intercept("GET", `${base}/sales-partner/me/links`, {
      statusCode: 200,
      body: payments.partnerLinks,
    }).as("partnerLinks");
  });
});

Cypress.Commands.add(
  "setPartnerAuth",
  (token: string, salesRep: Record<string, unknown>) => {
    cy.window().then((win) => {
      win.localStorage.setItem("agende7_partner_token", token);
      win.localStorage.setItem("agende7_partner_rep", JSON.stringify(salesRep));
    });
  },
);
