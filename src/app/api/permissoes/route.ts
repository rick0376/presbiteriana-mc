import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    roles: ["ADMIN", "PASTOR", "USER"],
    permissions: {
      ADMIN: ["dashboard", "usuarios", "eventos"],
      PASTOR: ["dashboard", "eventos"],
      USER: ["dashboard"],
    },
  });
}

export async function POST() {
  return NextResponse.json({ ok: true });
}
