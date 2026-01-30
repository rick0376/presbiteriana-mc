import { requireUser } from "@/lib/auth";
import { requireSuperAdmin } from "@/lib/guards";
import PermissoesManager from "@/components/permissoes/PermissoesManager";

export default async function Page() {
  const user = await requireUser();
  requireSuperAdmin(user.role);

  return <PermissoesManager />;
}
