import "./commands";
import { isMockMode } from "./env";

beforeEach(() => {
  if (isMockMode()) {
    cy.mockPartnerApi();
  }
});
