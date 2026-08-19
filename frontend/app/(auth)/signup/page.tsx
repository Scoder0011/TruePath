"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import OAuthButtons from "@/components/auth/OAuthButtons";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 font-body text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-md outline-none transition-colors focus:border-amber dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-soft/60";

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
        <p className="font-body text-sm leading-relaxed text-gray-600 dark:text-ink-soft">
          We sent a confirmation link to <span className="text-gray-900 dark:text-white">{email}</span>. Click it
          to activate your account, then log in.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
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
            <label htmlFor="password" className="mb-1.5 block font-body text-xs text-gray-600 dark:text-ink-soft">
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
            className="w-full rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-gray-600 dark:text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="text-amber hover:opacity-80">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
