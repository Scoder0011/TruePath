"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import OAuthButtons from "@/components/auth/OAuthButtons";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-[#101214] px-4 py-2.5 font-body text-sm text-white placeholder:text-zinc-500 backdrop-blur-md outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700/40";

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
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-body text-xs text-zinc-300">
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
              <label htmlFor="password" className="font-body text-xs text-zinc-300">
                Password
              </label>
              <Link href="/forgot-password" className="font-body text-xs text-zinc-300 transition-colors hover:text-white">
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
            className="w-full rounded-lg bg-white px-4 py-2.5 font-body text-sm font-medium text-black transition-opacity hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-zinc-200 transition-colors hover:text-white">
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
