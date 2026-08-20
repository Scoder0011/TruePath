import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/paths";

  if (code) {
    const cookieStore = cookies();
    const cookiesToSet: { name: string; value: string; options?: object }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(incoming) {
            incoming.forEach(({ name, value, options }) => {
              cookiesToSet.push({ name, value, options });
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectResponse = NextResponse.redirect(`${origin}${next}`);
      cookiesToSet.forEach(({ name, value, options }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        redirectResponse.cookies.set(name, value, (options ?? {}) as any);
      });
      return redirectResponse;
    }
  }

  return NextResponse.redirect(`${origin}/auth/confirm`);
}