import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const user = await requireUser();

  // se seu user.igrejaId pode ser null, resolve igual você fez no [id]/route.ts
  if (!user.igrejaId) {
    return NextResponse.json(
      { error: "Igreja não encontrada." },
      { status: 400 },
    );
  }

  const membro = await prisma.membro.findFirst({
    where: { id, igrejaId: user.igrejaId },
  });

  if (!membro) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
