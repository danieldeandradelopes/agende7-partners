export {};

declare global {
  namespace Cypress {
    interface Chainable {
      mockPartnerApi(): Chainable<void>;
      setPartnerAuth(
        token: string,
        salesRep: Record<string, unknown>,
      ): Chainable<void>;
    }
  }
}
