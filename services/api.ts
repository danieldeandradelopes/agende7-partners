import { getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface PartnerMe {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  code: string;
  is_active: boolean;
  default_commission_percent: number;
  commission_duration_months: number | null;
  payout_method: string | null;
  pix_key_type: string | null;
  pix_key: string | null;
  bank_code: string | null;
  bank_name: string | null;
  bank_agency: string | null;
  bank_account: string | null;
  bank_account_digit: string | null;
  bank_account_type: string | null;
}

export interface CommissionSummary {
  pending_clearance: number;
  available: number;
  paid: number;
  canceled: number;
  total_count: number;
}

export interface PartnerCommission {
  id: number;
  status: string;
  base_amount: number;
  commission_percent: number;
  commission_value: number;
  barbershop_id: number;
  barbershop_name?: string;
  payment_id: number;
  eligible_at: string | null;
  paid_at: string | null;
  created_at?: string;
}

export interface PartnerLinkEntry {
  label: string;
  url: string;
  description: string;
}

export interface PartnerLinkGroup {
  title: string;
  links: PartnerLinkEntry[];
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao processar requisição",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const partnerApi = {
  register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    document?: string;
  }) {
    return fetchAPI<{ message: string }>("/sales-partner/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data: { email: string; password: string }) {
    return fetchAPI<{
      token: string;
      sales_rep: {
        id: number;
        name: string;
        email: string;
        code: string;
        is_active: boolean;
      };
    }>("/sales-partner/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe() {
    return fetchAPI<PartnerMe>("/sales-partner/me");
  },

  updateMe(data: Partial<PartnerMe>) {
    return fetchAPI<PartnerMe>("/sales-partner/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  getCommissionSummary() {
    return fetchAPI<CommissionSummary>(
      "/sales-partner/me/commissions/summary",
    );
  },

  getCommissions(status?: string) {
    const q = status ? `?status=${encodeURIComponent(status)}` : "";
    return fetchAPI<PartnerCommission[]>(
      `/sales-partner/me/commissions${q}`,
    );
  },

  getLinks() {
    return fetchAPI<{
      code: string;
      is_active: boolean;
      groups: PartnerLinkGroup[];
    }>("/sales-partner/me/links");
  },
};
