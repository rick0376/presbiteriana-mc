"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import AlertModal from "@/components/ui/AlertModal/AlertModal";
import styles from "./styles.module.scss";
import { PencilLine, Trash2 } from "lucide-react";

type Membro = {
  id: string;
  nome: string;
  cargo: string;
  telefone: string | null;
  numeroCarteirinha: string | null;
  dataVencCarteirinha: string | null;
};

type Igreja = { id: string; nome: string; slug: string };

const CARGOS = [
  "ADMIN",
  "PASTOR",
  "USER",
  "SECRETARIO",
  "TESOUREIRO",
  "MEMBRO",
];

export default function SecretariaPageClient({
  userRole,
}: {
  userRole: string;
}) {
  const isSuperAdmin = userRole === "SUPERADMIN";

  // ✅ estado do formulário (digitando/selecionando)
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [debouncedNome, setDebouncedNome] = useState("");

  // ✅ estado aplicado (o que realmente filtra)
  const [appliedNome, setAppliedNome] = useState("");
  const [appliedCargo, setAppliedCargo] = useState("");
  const [appliedVencimento, setAppliedVencimento] = useState("");

  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [igrejaId, setIgrejaId] = useState("");

  const [items, setItems] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedNome(nome);
    }, 400);

    return () => clearTimeout(t);
  }, [nome]);

  function showAlert(title: string, message: string) {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertOpen(true);
  }

  async function load(selectedIgrejaId?: string) {
    setLoading(true);

    const qs = new URLSearchParams();
    if (debouncedNome) qs.set("nome", debouncedNome);
    if (cargo) qs.set("cargo", cargo);
    if (vencimento) qs.set("vencimento", vencimento);

    const finalIgrejaId = selectedIgrejaId ?? igrejaId;
    if (isSuperAdmin && finalIgrejaId) qs.set("igrejaId", finalIgrejaId);

    try {
      const res = await fetch(`/api/membros?${qs.toString()}`);

      if (!res.ok) {
        setItems([]);
        setLoading(false);
        showAlert("Erro", "Não foi possível carregar os membros.");
        return;
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : [];
      setItems(Array.isArray(json) ? json : []);
      setLoading(false);
    } catch {
      setItems([]);
      setLoading(false);
      showAlert("Erro", "Falha de conexão ao carregar os membros.");
    }
  }

  function applyFiltersAndLoad(selectedIgrejaId?: string) {
    setAppliedNome(nome);
    setAppliedCargo(cargo);
    setAppliedVencimento(vencimento);
    load(selectedIgrejaId);
  }

  function getStatus(venc?: string | null) {
    if (!venc) return { label: "—", type: "neutro" as const };

    const hoje = new Date();
    const d = new Date(venc);
    const diff = Math.ceil((+d - +hoje) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { label: "Vencida", type: "danger" as const };
    if (diff <= 30) return { label: "A vencer", type: "warn" as const };
    return { label: "OK", type: "ok" as const };
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNome, cargo, vencimento]);

  useEffect(() => {
    (async () => {
      if (isSuperAdmin) {
        try {
          const r = await fetch("/api/igrejas");
          if (!r.ok) {
            showAlert("Erro", "Não foi possível carregar as igrejas.");
            setLoading(false);
            return;
          }

          const j = await r.json();
          if (Array.isArray(j)) {
            setIgrejas(j);

            const first = j[0]?.id || "";
            setIgrejaId(first);

            // primeira carga: sem filtros
            setAppliedNome("");
            setAppliedCargo("");
            setAppliedVencimento("");
            await load(first);

            return;
          }

          showAlert("Erro", "Resposta inválida ao carregar igrejas.");
          setLoading(false);
          return;
        } catch {
          showAlert("Erro", "Falha de conexão ao carregar igrejas.");
          setLoading(false);
          return;
        }
      }

      // primeira carga: sem filtros
      setAppliedNome("");
      setAppliedCargo("");
      setAppliedVencimento("");
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Secretaria</h1>

      <div className={styles.filters}>
        <input
          className={styles.input}
          placeholder="Buscar por nome..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <select
          className={styles.select}
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        >
          <option value="">Todos cargos</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={vencimento}
          onChange={(e) => setVencimento(e.target.value)}
        >
          <option value="">Todos vencimentos</option>
          <option value="vencidos">Vencidos</option>
          <option value="30dias">Vence em 30 dias</option>
        </select>

        {isSuperAdmin && (
          <select
            className={styles.select}
            value={igrejaId}
            onChange={(e) => {
              const id = e.target.value;
              setIgrejaId(id);
              load(id); // ✅ mantém igual
            }}
          >
            {igrejas.length === 0 ? (
              <option value="">Carregando igrejas...</option>
            ) : (
              igrejas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} ({i.slug})
                </option>
              ))
            )}
          </select>
        )}

        <button
          className={styles.btn}
          onClick={() => applyFiltersAndLoad()}
          type="button"
        >
          Filtrar
        </button>

        <a className={styles.btnSecondary} href="/secretaria/membros/novo">
          + Novo Membro
        </a>
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        <div className={styles.cards}>
          {items.map((m) => {
            const s = getStatus(m.dataVencCarteirinha);

            return (
              <div key={m.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{m.nome}</div>
                  <span className={styles[s.type]}>{s.label}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <span className={styles.k}>Cargo</span>
                    <span className={styles.v}>{m.cargo}</span>
                  </div>

                  <div className={styles.row}>
                    <span className={styles.k}>Venc.</span>
                    <span className={styles.v}>
                      {m.dataVencCarteirinha
                        ? new Date(m.dataVencCarteirinha).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <a
                    href={`/secretaria/membros/editar/${m.id}`}
                    className={styles.edit}
                    title="Editar"
                  >
                    <PencilLine size={18} />
                  </a>

                  <button
                    className={styles.delete}
                    title="Excluir"
                    type="button"
                    onClick={() => {
                      setConfirmId(m.id);
                      setConfirmOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className={styles.emptyCard}>Nenhum membro encontrado.</div>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Excluir membro?"
        message="Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);

          const res = await fetch(`/api/membros/${confirmId}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            showAlert("Erro", "Não foi possível excluir.");
            return;
          }

          load();
        }}
      />

      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
