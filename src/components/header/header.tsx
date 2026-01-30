"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import styles from "./styles.module.scss";
import { LogOut } from "lucide-react";

export default function DashboardHeader({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ← MODAL STATE

  const handleLogoutConfirm = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.mainContainer}>
          <Link href="/dashboard" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={62}
                height={62}
                priority
              />
            </span>

            <span className={styles.logoText}>
              <span className={styles.logoLine1}>IPRB-Presbiteriana</span>
              <span className={styles.logoLine2}>Renovada do Brasil</span>
            </span>

            <span className={styles.logoTextMobile}>
              <span className={styles.logoLine1}>IPRB</span>
              <span className={styles.logoLine2}>Presbiteriana Renovada</span>
            </span>
          </Link>

          <div className={styles.rightSection}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>A</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>Admin Igreja</div>
                <div className={styles.userRole}>Admin</div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className={styles.logoutBtn}
              >
                <LogOut className={styles.icoLogout} size={18} />
              </button>
            </div>
            <button className={styles.menuToggle} onClick={onMenuToggle}>
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ← MODAL BONITO */}
      {showLogoutModal && (
        <div className={styles.logoutModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>🚪</div>
            <h3>Sair do sistema?</h3>
            <p>Todas sessões serão encerradas.</p>
            <div className={styles.modalButtons}>
              <button
                onClick={handleLogoutConfirm}
                className={styles.confirmBtn}
              >
                Sair
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={styles.cancelBtn}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
