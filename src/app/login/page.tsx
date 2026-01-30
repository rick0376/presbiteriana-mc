"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function Login() {
  const [email, setEmail] = useState("admin@lhp.com");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const openModal = (msg: string) => {
    setModalMsg(msg);
    setModalOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("LOGIN PAGE: submit");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
      credentials: "include", // <-- COLOQUE ISSO
    });

    console.log("LOGIN PAGE: status", res.status);

    const data = await res.json();
    console.log("LOGIN PAGE: response body", data);

    window.location.replace("/dashboard");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.card}>
        <Link href="/igrejas" className={styles.back}>
          ← Voltar
        </Link>
        <h1 className={styles.title}>Login LHP SaaS</h1>

        <input
          type="email"
          placeholder="admin@lhp.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitle}>Atenção</div>
            <div className={styles.modalText}>{modalMsg}</div>
            <button
              className={styles.modalBtn}
              onClick={() => setModalOpen(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
