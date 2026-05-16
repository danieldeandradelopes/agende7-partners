"use client";

import { FormEvent, useEffect, useState } from "react";
import { partnerApi, type PartnerMe } from "@/services/api";

export default function PerfilPage() {
  const [me, setMe] = useState<PartnerMe | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    partnerApi.getMe().then(setMe);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!me) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await partnerApi.updateMe({
        phone: me.phone,
        document: me.document,
        payout_method: me.payout_method,
        pix_key_type: me.pix_key_type,
        pix_key: me.pix_key,
        bank_code: me.bank_code,
        bank_name: me.bank_name,
        bank_agency: me.bank_agency,
        bank_account: me.bank_account,
        bank_account_digit: me.bank_account_digit,
        bank_account_type: me.bank_account_type,
      });
      setMe(updated);
      setMessage("Dados salvos com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (!me) {
    return <p className="text-gray-500">Carregando perfil…</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nome</label>
          <input className="input bg-gray-50" value={me.name} disabled />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">E-mail</label>
          <input className="input bg-gray-50" value={me.email} disabled />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Telefone</label>
          <input
            className="input"
            value={me.phone ?? ""}
            onChange={(e) => setMe({ ...me, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">CPF/CNPJ</label>
          <input
            className="input"
            value={me.document ?? ""}
            onChange={(e) => setMe({ ...me, document: e.target.value })}
          />
        </div>

        <hr className="border-gray-200 my-6" />
        <h2 className="font-semibold text-gray-900">Dados para receber comissões</h2>
        <p className="text-sm text-gray-500 mb-4">
          Informe PIX ou conta bancária para que a equipe registre seus pagamentos.
        </p>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Forma de pagamento</label>
          <select
            className="input"
            value={me.payout_method ?? ""}
            onChange={(e) =>
              setMe({
                ...me,
                payout_method: e.target.value || null,
              })
            }
          >
            <option value="">Selecione</option>
            <option value="pix">PIX</option>
            <option value="bank_transfer">Transferência bancária</option>
          </select>
        </div>

        {me.payout_method === "pix" && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de chave PIX</label>
              <select
                className="input"
                value={me.pix_key_type ?? ""}
                onChange={(e) =>
                  setMe({ ...me, pix_key_type: e.target.value || null })
                }
              >
                <option value="">Selecione</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave aleatória</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chave PIX</label>
              <input
                className="input"
                value={me.pix_key ?? ""}
                onChange={(e) => setMe({ ...me, pix_key: e.target.value })}
              />
            </div>
          </>
        )}

        {me.payout_method === "bank_transfer" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Banco (código)</label>
              <input
                className="input"
                value={me.bank_code ?? ""}
                onChange={(e) => setMe({ ...me, bank_code: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome do banco</label>
              <input
                className="input"
                value={me.bank_name ?? ""}
                onChange={(e) => setMe({ ...me, bank_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Agência</label>
              <input
                className="input"
                value={me.bank_agency ?? ""}
                onChange={(e) => setMe({ ...me, bank_agency: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Conta</label>
              <input
                className="input"
                value={me.bank_account ?? ""}
                onChange={(e) => setMe({ ...me, bank_account: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dígito</label>
              <input
                className="input"
                value={me.bank_account_digit ?? ""}
                onChange={(e) =>
                  setMe({ ...me, bank_account_digit: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de conta</label>
              <select
                className="input"
                value={me.bank_account_type ?? ""}
                onChange={(e) =>
                  setMe({ ...me, bank_account_type: e.target.value || null })
                }
              >
                <option value="">Selecione</option>
                <option value="checking">Corrente</option>
                <option value="savings">Poupança</option>
              </select>
            </div>
          </div>
        )}

        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
