import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: false,
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

  setupNodeEvents(_on, config) {
    const raw = config.env.useMocks;
    const fromCliOrConfig = raw === true || raw === "true";
    const fromCi = process.env.CYPRESS_USE_MOCKS === "true";
    config.env.useMocks = fromCliOrConfig || fromCi;
    return config;
  },
});
