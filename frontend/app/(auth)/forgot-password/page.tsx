"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-[#101214] px-4 py-2.5 font-body text-sm text-white placeholder:text-zinc-500 backdrop-blur-md outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-700/40";

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
        <p className="font-body text-sm leading-relaxed text-zinc-300">
          If an account exists for <span className="text-white">{email}</span>, we sent a link to
          reset your password.
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
    <AuthCard title="Reset your password" subtitle="We'll email you a link to set a new one.">
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

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white px-4 py-2.5 font-body text-sm font-medium text-black transition-opacity hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-zinc-400">
        Remembered it?{" "}
        <Link href="/login" className="text-zinc-200 transition-colors hover:text-white">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
