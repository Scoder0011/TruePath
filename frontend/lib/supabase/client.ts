import { createBrowserClient } from "@supabase/ssr";

// Used inside "use client" components — login/signup forms, OAuth buttons.
// Reads the same project URL/key as the server client, just via the
// browser-safe NEXT_PUBLIC_ env vars.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
