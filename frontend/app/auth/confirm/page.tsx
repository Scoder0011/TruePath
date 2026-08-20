"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // This handles the implicit flow hash token automatically
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/paths");
      } else {
        router.replace("/login?error=auth-callback-failed");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-deep">
      <p className="font-mono text-sm text-ink-soft">Completing sign in…</p>
    </div>
  );
}
