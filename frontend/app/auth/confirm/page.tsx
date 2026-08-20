"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/paths";

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state change — fires when PKCE exchange completes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace(next);
      }
    });

    // Also check if session already exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(next);
        return;
      }

      // Handle PKCE code in URL query params
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) router.replace("/login?error=auth-callback-failed");
          // success handled by onAuthStateChange above
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [router, next]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-ink-deep">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
        <p className="font-mono text-sm text-gray-500 dark:text-ink-soft">
          Completing sign in…
        </p>
      </div>
    </div>
  );
}