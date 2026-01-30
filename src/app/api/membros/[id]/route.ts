export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

async function resolveIgrejaId(user: {
  id: string;
  role: string;
  igrejaId?: string | null;
}) {
  if (user.igrejaId) return user.igrejaId;

  const igreja = await prisma.igreja.findFirst({
    where: { adminId: user.id },
    select: { id: true },
  });

  return igreja?.id ?? null;
}

/* ================== GET ================== */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireUser();
  const igrejaId = await resolveIgrejaId(user);

  if (!igrejaId) return jsonError("Igreja não encontrada.");

  const membro = await prisma.membro.findFirst({
    where: { id: params.id, igrejaId },
  });

  if (!membro) return jsonError("Membro não encontrado.", 404);

  return NextResponse.json(membro);
}

/* ================== PUT ================== */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireUser();
  const igrejaId = await resolveIgrejaId(user);

  if (!igrejaId) return jsonError("Igreja não encontrada.");

  const body = await req.json();

  const membro = await prisma.membro.findFirst({
    where: { id: params.id, igrejaId },
  });

  if (!membro) return jsonError("Membro não encontrado.", 404);

  const atualizado = await prisma.membro.update({
    where: { id: params.id },
    data: {
      nome: body.nome,
      cargo: body.cargo,
      telefone: body.telefone || null,
      numeroCarteirinha: body.numeroCarteirinha || null,
      dataNascimento: parseDate(body.dataNascimento),
      dataBatismo: parseDate(body.dataBatismo),
      dataCriacaoCarteirinha: parseDate(body.dataCriacaoCarteirinha),
      dataVencCarteirinha: parseDate(body.dataVencCarteirinha),
      observacoes: body.observacoes || null,
    },
  });

  return NextResponse.json(atualizado);
}

/* ================== DELETE ================== */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireUser();
  const igrejaId = await resolveIgrejaId(user);

  if (!igrejaId) return jsonError("Igreja não encontrada.");

  const membro = await prisma.membro.findFirst({
    where: { id: params.id, igrejaId },
  });

  if (!membro) return jsonError("Membro não encontrado.", 404);

  await prisma.membro.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}
