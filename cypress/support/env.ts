/** CLI env vars chegam como string ("true"); normaliza para o modo mock. */
export function isMockMode(): boolean {
  const value = Cypress.env("useMocks");
  return value === true || value === "true";
}
