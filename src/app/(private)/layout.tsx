import { requireUser } from "@/lib/auth";
import PrivateShell from "@/components/layout/PrivateShell";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <PrivateShell>{children}</PrivateShell>;
}
