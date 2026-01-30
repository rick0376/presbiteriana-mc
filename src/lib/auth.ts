import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ✅ precisa await no seu setup
  const sessionToken = cookieStore.get("token")?.value;

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) return null;

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function requireRole(user: { role: string }, roles: string[]) {
  if (!roles.includes(user.role)) redirect("/sem-permissao");
}
