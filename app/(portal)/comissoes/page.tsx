"use client";

import { useEffect, useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { partnerApi, type PartnerCommission } from "@/services/api";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "pending_clearance", label: "Em carência" },
  { value: "available", label: "Disponível" },
  { value: "paid", label: "Pago" },
  { value: "canceled", label: "Cancelado" },
];

const STATUS_LABEL: Record<string, string> = {
  pending_clearance: "Em carência",
  available: "Disponível",
  paid: "Pago",
  canceled: "Cancelado",
};

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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas comissões</h1>

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
          Nenhuma comissão encontrada. Compartilhe seus links com o parâmetro{" "}
          <code>?ref=</code> para atribuir vendas.
        </p>
      )}

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="card flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">
                {c.barbershop_name || `Barbearia #${c.barbershop_id}`}
              </p>
              <p className="text-sm text-gray-500">
                {Number(c.commission_percent)}% sobre{" "}
                {formatBRL(c.base_amount)} · {formatDate(c.created_at)}
              </p>
              {c.eligible_at && c.status === "pending_clearance" && (
                <p className="text-xs text-amber-700 mt-1">
                  Libera em {formatDate(c.eligible_at)}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-[var(--color-primary)]">
                {formatBRL(c.commission_value)}
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {STATUS_LABEL[c.status] ?? c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
