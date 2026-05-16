"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBRL } from "@/lib/format";
import { partnerApi, type CommissionSummary, type PartnerMe } from "@/services/api";

export default function DashboardPage() {
  const [me, setMe] = useState<PartnerMe | null>(null);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);

  useEffect(() => {
    void Promise.all([partnerApi.getMe(), partnerApi.getCommissionSummary()]).then(
      ([profile, sums]) => {
        setMe(profile);
        setSummary(sums);
      },
    );
  }, []);

  const cards = [
    {
      label: "Em carência (14 dias)",
      value: summary?.pending_clearance ?? 0,
      hint: "Aguardando liberação após o pagamento do cliente",
    },
    {
      label: "Disponível para saque",
      value: summary?.available ?? 0,
      hint: "A equipe Agende7 registra o pagamento manualmente",
    },
    {
      label: "Já recebido",
      value: summary?.paid ?? 0,
      hint: "Comissões já pagas a você",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Olá, {me?.name?.split(" ")[0] ?? "parceiro"}
      </h1>
      <p className="text-gray-600 mb-8">
        Seu código de indicação:{" "}
        <code className="text-[var(--color-primary)] font-semibold">
          {me?.code}
        </code>
        {" · "}
        Comissão padrão: {me?.default_commission_percent ?? "—"}%
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <p className="text-sm text-gray-500">{c.label}</p>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {formatBRL(c.value)}
            </div>
            <p className="text-xs text-gray-400 mt-2">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/links" className="btn btn-primary">
          Ver meus links
        </Link>
        <Link href="/comissoes" className="btn btn-outline">
          Ver comissões
        </Link>
        <Link href="/perfil" className="btn btn-outline">
          Dados de pagamento
        </Link>
      </div>
    </div>
  );
}
