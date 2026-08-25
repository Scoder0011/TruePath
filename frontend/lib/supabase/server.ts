import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used inside Server Components, Server Actions, and Route Handlers —
// e.g. the OAuth callback route. Reads/writes the session via cookies
// instead of localStorage, so the server always knows who's logged in
// without an extra client-side round trip.
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({
                name,
                value,
                ...options,
              })
            );
          } catch {
            // setAll gets called from a Server Component in some cases,
            // where cookies can't be written — safe to ignore as long as
            // middleware.ts is also refreshing the session (it is).
          }
        },
      },
    }
  );
}
