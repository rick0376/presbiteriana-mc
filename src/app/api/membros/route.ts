import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type VencimentoFilter = "vencidos" | "30dias";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

async function resolveIgrejaId(
  user: { id: string; role: string; igrejaId?: string | null },
  igrejaIdParam: string | null,
) {
  // SuperAdmin escolhe
  if (user.role === "SUPERADMIN") return igrejaIdParam || null;

  // Admin/User normal
  if (user.igrejaId) return user.igrejaId;

  // fallback: se ele for admin de alguma igreja
  const igreja = await prisma.igreja.findFirst({
    where: { adminId: user.id },
    select: { id: true },
  });

  return igreja?.id || null;
}

export async function GET(req: Request) {
  const user = await requireUser();
  const { searchParams } = new URL(req.url);

  const nome = (searchParams.get("nome") || "").trim();
  const cargo = searchParams.get("cargo")?.trim() || "";
  const vencimento =
    (searchParams.get("vencimento") as VencimentoFilter | null) ?? null;

  const igrejaId = await resolveIgrejaId(user, searchParams.get("igrejaId"));

  if (!igrejaId) return jsonError("Igreja não encontrada para este usuário.");

  const where: any = { igrejaId };

  if (nome) {
    where.nome = { contains: nome, mode: "insensitive" };
  }

  if (cargo) {
    where.cargo = cargo;
  }

  if (vencimento === "vencidos") {
    where.dataVencCarteirinha = { lt: new Date() };
  }

  if (vencimento === "30dias") {
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 30);
    where.dataVencCarteirinha = { gte: hoje, lte: limite };
  }

  const membros = await prisma.membro.findMany({
    where,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(membros);
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => ({}));

  const { searchParams } = new URL(req.url);
  const igrejaId = await resolveIgrejaId(user, searchParams.get("igrejaId"));

  if (!igrejaId) return jsonError("Igreja não encontrada para este usuário.");

  const nome = String(body.nome || "").trim();
  const cargo = String(body.cargo || "").trim();

  if (!nome) return jsonError("Nome é obrigatório.");
  if (!cargo) return jsonError("Cargo é obrigatório.");

  const membro = await prisma.membro.create({
    data: {
      igrejaId,
      nome,
      cargo,
      telefone: body.telefone ? String(body.telefone).trim() : null,
      numeroCarteirinha: body.numeroCarteirinha
        ? String(body.numeroCarteirinha).trim()
        : null,
      dataNascimento: parseDate(body.dataNascimento),
      dataBatismo: parseDate(body.dataBatismo),
      dataCriacaoCarteirinha: parseDate(body.dataCriacaoCarteirinha),
      dataVencCarteirinha: parseDate(body.dataVencCarteirinha),
      observacoes: body.observacoes ? String(body.observacoes).trim() : null,
    },
  });

  return NextResponse.json(membro, { status: 201 });
}
