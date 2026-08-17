import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google/GitHub OAuth (and Supabase's email confirmation link) redirect
// here with a one-time ?code=. We exchange it for a real session, then
// forward the user wherever they were headed — /paths by default, or
// wherever the login/signup page asked for via ?next=.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/paths";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
