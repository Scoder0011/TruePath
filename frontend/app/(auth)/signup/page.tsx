"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import OAuthButtons from "@/components/auth/OAuthButtons";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-[#101214] px-4 py-2.5 font-body text-sm text-white placeholder:text-zinc-500 backdrop-blur-md outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700/40";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <p className="font-body text-sm leading-relaxed text-zinc-300">
          We sent a confirmation link to <span className="text-white">{email}</span>. Click it
          to activate your account, then log in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-white px-4 py-2.5 font-body text-sm font-medium text-black transition-opacity hover:bg-zinc-200"
        >
          Back to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Track your progress across every path.">
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
            <label htmlFor="password" className="mb-1.5 block font-body text-xs text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2.5 font-body text-sm font-medium text-black transition-opacity hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-200 transition-colors hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
