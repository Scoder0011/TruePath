import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard";

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("OAuth callback is missing Supabase configuration", {
      hasUrl: Boolean(url),
      hasAnonKey: Boolean(key),
    });
    return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
  }

  // Create the redirect response before exchanging the code. Supabase writes
  // the resulting session cookies through setAll(), and those exact cookies
  // must be returned to the browser with the redirect.
  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange failed:", error);
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
    return response;
  } catch (error) {
    console.error("OAuth callback threw before completing the code exchange", error);
    return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
  }
}
