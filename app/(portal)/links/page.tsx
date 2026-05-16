"use client";

import { useEffect, useState } from "react";
import LinkGroups from "@/components/LinkGroups";
import { partnerApi, type PartnerLinkGroup } from "@/services/api";

export default function LinksPage() {
  const [groups, setGroups] = useState<PartnerLinkGroup[]>([]);
  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    partnerApi
      .getLinks()
      .then((data) => {
        setGroups(data.groups);
        setCode(data.code);
        setActive(data.is_active);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Carregando links…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Meus links</h1>
      <p className="text-gray-600 mb-6">
        Código <code className="text-[var(--color-primary)]">{code}</code>
        {!active && (
          <span className="text-amber-700">
            {" "}
            — links ativos após aprovação da conta
          </span>
        )}
      </p>
      <LinkGroups groups={groups} />
    </div>
  );
}
