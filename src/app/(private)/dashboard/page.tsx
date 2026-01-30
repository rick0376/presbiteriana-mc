import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./styles.module.scss";

interface Igreja {
  nome: string;
  membros: number;
}

async function getIgrejas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/igrejas`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falha ao carregar");
  return res.json() as Promise<Igreja[]>;
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let igrejas: Igreja[] = [];
  try {
    igrejas = await getIgrejas();
  } catch {
    igrejas = [];
  }

  const totalMembros = igrejas.reduce((sum, i) => sum + i.membros, 0);

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <h1>Bem-vindo ao Dashboard!</h1>
        <p>{igrejas.length} igrejas ativas</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h2>{igrejas.length}</h2>
          <p>Igrejas</p>
        </div>
        <div className={styles.statCard}>
          <h2>{totalMembros}</h2>
          <p>Total Membros</p>
        </div>
        <div className={styles.statCard}>
          <h2>{Math.round(totalMembros / igrejas.length || 0)}</h2>
          <p>Média/Igreja</p>
        </div>
      </div>
    </div>
  );
}
