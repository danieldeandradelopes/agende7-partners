"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatBrazilianDocument, formatPhone, onlyDigits } from "@/lib/masks";
import { partnerApi } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await partnerApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone ? onlyDigits(form.phone) : undefined,
        document: form.document ? onlyDigits(form.document) : undefined,
      });
      setSuccess(result.message);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro");
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
            <h1 className="text-xl font-bold text-gray-900">Cadastro de parceiro</h1>
            <p className="text-sm text-gray-500">
              Após o cadastro, aguarde aprovação da equipe
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome completo</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefone</label>
            <input
              className="input"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: formatPhone(e.target.value) })
              }
              placeholder="(11) 99999-9999"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">CPF/CNPJ (opcional)</label>
            <input
              className="input"
              value={form.document}
              onChange={(e) =>
                setForm({
                  ...form,
                  document: formatBrazilianDocument(e.target.value),
                })
              }
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Senha (mín. 8 caracteres)</label>
            <input
              type="password"
              className="input"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Cadastrando…" : "Criar conta"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
