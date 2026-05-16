describe("Partners — login (mock API)", () => {
  beforeEach(() => {
    cy.mockPartnerApi();
    cy.visit("/login");
    cy.window().then((win) => {
      win.localStorage.removeItem("agende7_partner_token");
      win.localStorage.removeItem("agende7_partner_rep");
    });
    cy.visit("/login");
  });

  it("autentica e abre o dashboard", () => {
    cy.fixture("users").then((users) => {
      cy.get('[data-cy="login-email"]').type(users.partner.email);
      cy.get('[data-cy="login-password"]').type(users.partner.password);
      cy.get('[data-cy="login-submit"]').click();
    });

    cy.wait("@partnerLogin");
    cy.url({ timeout: 15000 }).should("eq", Cypress.config().baseUrl + "/");
    cy.get('[data-cy="partner-dashboard"]', { timeout: 15000 }).should("exist");
  });
});
