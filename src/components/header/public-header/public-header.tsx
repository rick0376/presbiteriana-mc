"use client";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/igrejas" className={styles.logo}>
          <img
            src="/images/logo_transparente.png"
            alt="Logo Igreja Matriz"
            className={styles.logoImg}
          />
          <span className={styles.logoText}>
            IPRB - Igreja Presbiteriana Renovada
          </span>
        </Link>

        <div className={styles.actions}>
          <Link href="/login-superadmin" className={styles.superadminBtn}>
            🔑 SuperAdmin
          </Link>
        </div>
      </div>
    </header>
  );
}
