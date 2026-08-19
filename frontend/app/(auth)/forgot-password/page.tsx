"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 font-body text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-md outline-none transition-colors focus:border-amber dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-soft/60";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
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
          If an account exists for <span className="text-gray-900 dark:text-white">{email}</span>, we sent a link to
          reset your password.
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
    <AuthCard title="Reset your password" subtitle="We'll email you a link to set a new one.">
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

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-gray-600 dark:text-ink-soft">
        Remembered it?{" "}
        <Link href="/login" className="text-amber hover:opacity-80">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
