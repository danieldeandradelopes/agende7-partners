"use client";

import { useState } from "react";
import type { PartnerLinkGroup } from "@/services/api";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn btn-outline text-xs shrink-0"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function LinkGroups({ groups }: { groups: PartnerLinkGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {group.title}
          </h2>
          <div className="space-y-3">
            {group.links.map((link) => (
              <div key={link.url} className="card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">{link.label}</div>
                    <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                    <code className="block mt-2 text-xs text-[var(--color-primary)] break-all">
                      {link.url}
                    </code>
                  </div>
                  <CopyButton value={link.url} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
