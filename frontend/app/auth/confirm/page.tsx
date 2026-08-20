"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/paths";

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace(next);
      }
    });

    async function handleAuth() {
      // Check existing session first
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      // Exchange code if present
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Code exchange failed:", error);
          router.replace("/login?error=auth-callback-failed");
        }
        // success handled by onAuthStateChange
        return;
      }

      // No code, no session — timeout fallback after 5 seconds
      setTimeout(() => {
        router.replace("/login?error=auth-callback-failed");
      }, 5000);
    }

    handleAuth();

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

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-ink-deep">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
      </div>
    }>
      <ConfirmInner />
    </Suspense>
  );
}