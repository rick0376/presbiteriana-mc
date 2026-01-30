"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/ui/AlertModal/AlertModal";
import styles from "./styles.module.scss";

type Props = { userRole: string };
type Igreja = { id: string; nome: string };

export default function NovoMembroClient({ userRole }: Props) {
  const router = useRouter();
  const isSuperAdmin = userRole === "SUPERADMIN";

  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [igrejaId, setIgrejaId] = useState("");

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [numeroCarteirinha, setNumeroCarteirinha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataBatismo, setDataBatismo] = useState("");
  const [dataCriacaoCarteirinha, setDataCriacaoCarteirinha] = useState("");
  const [dataVencCarteirinha, setDataVencCarteirinha] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  function showAlert(title: string, message: string) {
    setAlertTitle(title);
    setAlertMsg(message);
    setAlertOpen(true);
  }

  useEffect(() => {
    if (!isSuperAdmin) return;

    (async () => {
      try {
        const r = await fetch("/api/igrejas");

        if (!r.ok) {
          showAlert("Erro", "Não foi possível carregar as igrejas.");
          return;
        }

        const data = await r.json();
        if (Array.isArray(data)) {
          setIgrejas(data);
          if (data[0]) setIgrejaId(data[0].id);
          return;
        }

        showAlert("Erro", "Resposta inválida ao carregar igrejas.");
      } catch {
        showAlert("Erro", "Falha de conexão ao carregar igrejas.");
      }
    })();
  }, [isSuperAdmin]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      showAlert("Aviso", "Informe o nome.");
      return;
    }

    if (!cargo.trim()) {
      showAlert("Aviso", "Informe o cargo.");
      return;
    }

    if (isSuperAdmin && !igrejaId) {
      showAlert("Aviso", "Selecione uma igreja.");
      return;
    }

    setLoading(true);

    const url = isSuperAdmin
      ? `/api/membros?igrejaId=${igrejaId}`
      : "/api/membros";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cargo,
          telefone: telefone || null,
          numeroCarteirinha: numeroCarteirinha || null,
          dataNascimento: dataNascimento || null,
          dataBatismo: dataBatismo || null,
          dataCriacaoCarteirinha: dataCriacaoCarteirinha || null,
          dataVencCarteirinha: dataVencCarteirinha || null,
          observacoes: observacoes || null,
        }),
      });

      setLoading(false);

      if (!res.ok) {
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        showAlert("Erro", json?.error || "Erro ao salvar.");
        return;
      }

      router.replace("/secretaria");
    } catch {
      setLoading(false);
      showAlert("Erro", "Falha de conexão ao salvar.");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.textH1}>Novo Membro</h1>

      <form className={styles.form} onSubmit={submit}>
        {isSuperAdmin && (
          <select
            className={styles.input}
            value={igrejaId}
            onChange={(e) => setIgrejaId(e.target.value)}
          >
            {igrejas.length === 0 ? (
              <option value="">Carregando igrejas...</option>
            ) : (
              igrejas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome}
                </option>
              ))
            )}
          </select>
        )}

        <input
          className={styles.input}
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Cargo"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="Nº Carteirinha"
          value={numeroCarteirinha}
          onChange={(e) => setNumeroCarteirinha(e.target.value)}
        />

        <input
          className={styles.input}
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <input
          className={styles.input}
          type="date"
          value={dataBatismo}
          onChange={(e) => setDataBatismo(e.target.value)}
        />

        <input
          className={styles.input}
          type="date"
          value={dataCriacaoCarteirinha}
          onChange={(e) => setDataCriacaoCarteirinha(e.target.value)}
        />

        <input
          className={styles.input}
          type="date"
          value={dataVencCarteirinha}
          onChange={(e) => setDataVencCarteirinha(e.target.value)}
        />

        <textarea
          className={styles.textarea}
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />

        <button className={styles.button} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>

      <AlertModal
        open={alertOpen}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}
