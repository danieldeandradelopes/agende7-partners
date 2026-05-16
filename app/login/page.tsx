"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getToken, setSession } from "@/lib/auth";
import { partnerApi } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/");
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await partnerApi.login({ email, password });
      setSession(result.token, result.sales_rep);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral)] p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/Agende7.png" width={48} height={48} alt="Agende7" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Portal do Parceiro</h1>
            <p className="text-sm text-gray-500">Entre na sua conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Ainda não tem conta?{" "}
          <Link href="/register" className="text-[var(--color-primary)] font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
