import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );

  response.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
