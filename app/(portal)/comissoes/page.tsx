"use client";

import { useEffect, useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { partnerApi, type PartnerCommission } from "@/services/api";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "trial", label: "Em teste" },
  { value: "expired", label: "Teste encerrado" },
  { value: "pending_clearance", label: "Em carência" },
  { value: "available", label: "Disponível" },
  { value: "paid", label: "Pago" },
  { value: "canceled", label: "Cancelado" },
];

const STATUS_LABEL: Record<string, string> = {
  trial: "Em teste",
  expired: "Teste encerrado",
  pending_clearance: "Em carência",
  available: "Disponível",
  paid: "Pago a você",
  canceled: "Cancelado / reembolsado",
};

const CYCLE_LABEL: Record<string, string> = {
  monthly: "Mensal",
  semiannual: "Semestral",
  yearly: "Anual",
};

function daysLeft(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return null;
  const diff = Math.ceil((end - Date.now()) / (24 * 60 * 60 * 1000));
  return Math.max(0, diff);
}

export default function ComissoesPage() {
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<PartnerCommission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    partnerApi
      .getCommissions(status || undefined)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div data-cy="partner-commissions-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Lojas e comissões
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Cada linha é uma barbearia indicada pelo seu link. Valor previsto no
        trial só vira saldo depois do pagamento e dos 30 dias de garantia.
      </p>

      <div className="mb-4">
        <label className="text-sm text-gray-600 mr-2">Filtrar por status</label>
        <select
          className="input max-w-xs"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Carregando…</p>}

      {!loading && items.length === 0 && (
        <p className="text-gray-500">
          Nenhuma indicação ainda. Compartilhe seus links com o parâmetro{" "}
          <code>?ref=</code> para atribuir trials e vendas.
        </p>
      )}

      <div className="space-y-3">
        {items.map((c) => {
          const remaining = daysLeft(c.trial_ends_at);
          return (
            <div
              key={c.id}
              className="card flex flex-wrap justify-between gap-2"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {c.barbershop_name || `Barbearia #${c.barbershop_id}`}
                </p>
                <p className="text-sm text-gray-500">
                  Entrou em {formatDate(c.created_at)}
                  {c.billing_cycle
                    ? ` · ${CYCLE_LABEL[c.billing_cycle] || c.billing_cycle}`
                    : ""}
                  {` · ${Number(c.commission_percent)}%`}
                </p>
                {c.status === "trial" && remaining != null && (
                  <p className="text-xs text-amber-700 mt-1">
                    {remaining} dia(s) restantes de teste · previsto{" "}
                    {formatBRL(c.commission_value)}
                  </p>
                )}
                {c.eligible_at && c.status === "pending_clearance" && (
                  <p className="text-xs text-amber-700 mt-1">
                    Libera em {formatDate(c.eligible_at)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-[var(--color-primary)]">
                  {c.status === "expired" || c.status === "canceled"
                    ? formatBRL(0)
                    : formatBRL(c.commission_value)}
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
                {c.status === "trial" && (
                  <p className="text-[10px] text-gray-400 mt-1">previsto</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
