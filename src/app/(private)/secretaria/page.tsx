import { requireUser } from "@/lib/auth";
import SecretariaDashboard from "@/components/secretaria/dashboard/SecretariaDashboard";

export default async function Page() {
  await requireUser();
  return <SecretariaDashboard />;
}
