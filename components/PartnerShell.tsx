"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { clearSession, getToken } from "@/lib/auth";
import { partnerApi, type PartnerMe } from "@/services/api";
import ApprovalBanner from "./ApprovalBanner";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/comissoes", label: "Comissões" },
  { href: "/links", label: "Meus links" },
  { href: "/perfil", label: "Perfil" },
];

export default function PartnerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<PartnerMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    partnerApi
      .getMe()
      .then(setMe)
      .catch(() => {
        clearSession();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]">
      <header className="bg-[var(--color-primary-dark)] text-white">
        <div className="container py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/Agende7.png" width={40} height={40} alt="Agende7" />
            <div>
              <div className="font-bold">Portal do Parceiro</div>
              <div className="text-sm opacity-80">{me?.name}</div>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname === item.href
                    ? "bg-white/20 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="text-sm opacity-90 hover:opacity-100 underline"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="container py-8">
        {me && !me.is_active && <ApprovalBanner />}
        {children}
      </main>
    </div>
  );
}
