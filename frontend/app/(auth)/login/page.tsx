"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import OAuthButtons from "@/components/auth/OAuthButtons";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 font-body text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-md outline-none transition-colors focus:border-amber dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-soft/60";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/paths");
    router.refresh();
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to pick up where you left off.">
      <div className="space-y-5">
        <OAuthButtons />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-gray-500 dark:text-ink-soft">OR</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-body text-xs text-gray-600 dark:text-ink-soft">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="font-body text-xs text-gray-600 dark:text-ink-soft">
                Password
              </label>
              <Link href="/forgot-password" className="font-body text-xs text-amber hover:opacity-80">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-gray-600 dark:text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
