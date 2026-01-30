import Header from "@/components/header/public-header/public-header";
import styles from "./styles.module.scss";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.publicLayout}>
      <Header />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
