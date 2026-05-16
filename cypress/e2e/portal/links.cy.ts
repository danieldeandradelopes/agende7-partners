describe("Partners — links (mock API)", () => {
  beforeEach(() => {
    cy.mockPartnerApi();
    cy.fixture("payments").then((payments) => {
      cy.setPartnerAuth(
        payments.partnerLogin.token,
        payments.partnerLogin.sales_rep,
      );
    });
    cy.visit("/links");
  });

  it("exibe código e grupos de links", () => {
    cy.wait("@partnerLinks");
    cy.get('[data-cy="partner-links-page"]').should("exist");
    cy.contains("E2E001").should("be.visible");
    cy.contains("Landing").should("be.visible");
  });
});
