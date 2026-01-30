"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

type Membro = {
  id: string;
  nome: string;
  cargo: string;
  telefone: string | null;
  numeroCarteirinha: string | null;
  dataNascimento: string | null;
  dataBatismo: string | null;
  dataCriacaoCarteirinha: string | null;
  dataVencCarteirinha: string | null;
  observacoes: string | null;
};

export default function EditarMembroClient({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    telefone: "",
    numeroCarteirinha: "",
    dataNascimento: "",
    dataBatismo: "",
    dataCriacaoCarteirinha: "",
    dataVencCarteirinha: "",
    observacoes: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/membros/${id}`);
      if (!res.ok) {
        setError("Erro ao carregar membro");
        setLoading(false);
        return;
      }

      const m = (await res.json()) as Membro;

      setForm({
        nome: m.nome ?? "",
        cargo: m.cargo ?? "",
        telefone: m.telefone ?? "",
        numeroCarteirinha: m.numeroCarteirinha ?? "",
        dataNascimento: m.dataNascimento ? m.dataNascimento.slice(0, 10) : "",
        dataBatismo: m.dataBatismo ? m.dataBatismo.slice(0, 10) : "",
        dataCriacaoCarteirinha: m.dataCriacaoCarteirinha
          ? m.dataCriacaoCarteirinha.slice(0, 10)
          : "",
        dataVencCarteirinha: m.dataVencCarteirinha
          ? m.dataVencCarteirinha.slice(0, 10)
          : "",
        observacoes: m.observacoes ?? "",
      });

      setLoading(false);
    })();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(`/api/membros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        telefone: form.telefone || null,
        numeroCarteirinha: form.numeroCarteirinha || null,
        dataNascimento: form.dataNascimento || null,
        dataBatismo: form.dataBatismo || null,
        dataCriacaoCarteirinha: form.dataCriacaoCarteirinha || null,
        dataVencCarteirinha: form.dataVencCarteirinha || null,
        observacoes: form.observacoes || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}) as any);
      setError(json?.error || "Erro ao salvar");
      return;
    }

    router.replace("/secretaria/membros");
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <button className={styles.back} onClick={() => router.back()}>
          ← Voltar
        </button>
        <h1 className={styles.h1Editar}>Editar Membro</h1>
      </div>

      <form className={styles.form} onSubmit={save}>
        <input
          className={styles.input}
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
          required
        />
        <input
          className={styles.input}
          placeholder="Cargo"
          value={form.cargo}
          onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value }))}
          required
        />
        <input
          className={styles.input}
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))}
        />
        <input
          className={styles.input}
          placeholder="Nº Carteirinha"
          value={form.numeroCarteirinha}
          onChange={(e) =>
            setForm((p) => ({ ...p, numeroCarteirinha: e.target.value }))
          }
        />
        <label className={styles.label}>
          Data Nascimento
          <input
            className={styles.input}
            type="date"
            value={form.dataNascimento}
            onChange={(e) =>
              setForm((p) => ({ ...p, dataNascimento: e.target.value }))
            }
          />
        </label>
        <label className={styles.label}>
          Data Batismo
          <input
            className={styles.input}
            type="date"
            value={form.dataBatismo}
            onChange={(e) =>
              setForm((p) => ({ ...p, dataBatismo: e.target.value }))
            }
          />
        </label>
        <label className={styles.label}>
          Data Criação Carteirinha
          <input
            className={styles.input}
            type="date"
            value={form.dataCriacaoCarteirinha}
            onChange={(e) =>
              setForm((p) => ({ ...p, dataCriacaoCarteirinha: e.target.value }))
            }
          />
        </label>
        <label className={styles.label}>
          Data Vencimento Carteirinha
          <input
            className={styles.input}
            type="date"
            value={form.dataVencCarteirinha}
            onChange={(e) =>
              setForm((p) => ({ ...p, dataVencCarteirinha: e.target.value }))
            }
          />
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Observações"
          rows={3}
          value={form.observacoes}
          onChange={(e) =>
            setForm((p) => ({ ...p, observacoes: e.target.value }))
          }
        />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
