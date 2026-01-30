import { requireUser } from "@/lib/auth";
import SecretariaPageClient from "@/components/secretaria/membros/SecretariaPageClient";

export default async function SecretariaPage() {
  const user = await requireUser();
  return <SecretariaPageClient userRole={user.role} />;
}
