import Link from "next/link";
import styles from "./styles.module.scss";

export default function SecretariaDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Secretaria</h1>

      <div className={styles.cards}>
        <Link href="/secretaria/membros" className={styles.card}>
          👥 Membros
        </Link>
      </div>
    </div>
  );
}
