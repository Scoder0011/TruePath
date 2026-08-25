import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/paths";

  console.info("OAuth callback received", {
    hasCode: Boolean(code),
    hasError: Boolean(searchParams.get("error")),
    error: searchParams.get("error"),
    errorDescription: searchParams.get("error_description"),
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });

  if (!code) {
    console.error("OAuth callback is missing an authorization code", {
      error: searchParams.get("error"),
      errorDescription: searchParams.get("error_description"),
    });
    return NextResponse.redirect(`${origin}/auth/login?error=no-code`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth code exchange failed", {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
    }

    if (!data.session || !data.user) {
      console.error("OAuth code exchange returned no session", {
        hasSession: Boolean(data.session),
        hasUser: Boolean(data.user),
      });
      return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
    }

    console.info("OAuth code exchange succeeded", { userId: data.user.id, next });
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error("OAuth callback threw before completing the code exchange", error);
    return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
  }
}
