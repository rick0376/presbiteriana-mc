"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard" },
    { icon: "👥", label: "Usuários", href: "/dashboard/usuarios" },
    { icon: "🔒", label: "Permissões", href: "/permissoes" },
    { icon: "⛪️", label: "Secretaria", href: "/secretaria/membros" },
  ];

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>LHP SaaS</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              onClick={onClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && <div className={styles.overlay} onClick={onClose} />}
    </>
  );
}
