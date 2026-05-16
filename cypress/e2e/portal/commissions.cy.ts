describe("Partners — comissões (mock API)", () => {
  beforeEach(() => {
    cy.mockPartnerApi();
    cy.fixture("payments").then((payments) => {
      cy.setPartnerAuth(
        payments.partnerLogin.token,
        payments.partnerLogin.sales_rep,
      );
    });
    cy.visit("/comissoes");
  });

  it("lista comissões e filtros", () => {
    cy.wait("@partnerCommissions");
    cy.contains("Minhas comissões").should("be.visible");
    cy.get("select").should("exist");
  });
});
