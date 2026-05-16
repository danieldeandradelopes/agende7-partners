import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    requestTimeout: 20000,
    pageLoadTimeout: 60000,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
  env: {
    apiUrl: "http://localhost:3000",
  },
});
