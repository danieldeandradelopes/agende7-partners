const TOKEN_KEY = "agende7_partner_token";
const REP_KEY = "agende7_partner_rep";

export interface PartnerSession {
  id: number;
  name: string;
  email: string;
  code: string;
  is_active: boolean;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, rep: PartnerSession): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REP_KEY, JSON.stringify(rep));
}

export function getStoredRep(): PartnerSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PartnerSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REP_KEY);
}
