"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./styles.module.scss";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [buildOpen, setBuildOpen] = useState(false);
  const [buildPage, setBuildPage] = useState("");

  function openBuildModal(pageName: string) {
    setBuildPage(pageName);
    setBuildOpen(true);
  }

  const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard" },
    {
      icon: "👥",
      label: "Usuários",
      href: "/dashboard/usuarios",
      building: true,
    },
    { icon: "🔒", label: "Permissões", href: "/permissoes", building: true },
    { icon: "⛪️", label: "Secretaria", href: "/secretaria/membros" },
  ];

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>LHP SaaS</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              onClick={(e) => {
                // ✅ se estiver em construção, não navega
                if (item.building) {
                  e.preventDefault();
                  onClose();
                  openBuildModal(item.label);
                  return;
                }

                // normal
                onClose();
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      {/* ✅ MODAL EM CONSTRUÇÃO */}
      {buildOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setBuildOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🚧</div>
            <h3 className={styles.modalTitle}>Página em construção</h3>
            <p className={styles.modalText}>
              A área de <strong>{buildPage}</strong> ainda está sendo
              desenvolvida.
            </p>
            <button
              type="button"
              className={styles.modalBtn}
              onClick={() => setBuildOpen(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
