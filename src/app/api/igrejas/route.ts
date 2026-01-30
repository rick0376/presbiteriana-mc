import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const user = await requireUser();

  if (user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const igrejas = await prisma.igreja.findMany({
    select: { id: true, nome: true, slug: true },
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(igrejas);
}
