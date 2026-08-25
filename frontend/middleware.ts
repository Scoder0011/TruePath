import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Supabase access tokens expire (default 1hr). Without this, a user's
// session would silently die mid-visit until they reload. This runs on
// every request, refreshes the token if needed, and keeps the cookie
// in sync between the browser and server.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (pathname.startsWith("/auth")) {
    return NextResponse.next({ request });
  }

  if (!url || !key) {
    console.error("Supabase middleware configuration is missing", {
      hasUrl: Boolean(url),
      hasAnonKey: Boolean(key),
    });
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touching getUser() is what actually triggers the refresh.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|favicon.ico).*)"],
};
