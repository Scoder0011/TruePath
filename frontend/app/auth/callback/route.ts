import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/paths";
  return NextResponse.redirect(`${origin}/auth/confirm?next=${encodeURIComponent(next)}`);
}