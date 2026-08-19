"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthCard from "@/components/auth/AuthCard";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-body text-sm text-gray-900 placeholder:text-gray-400 backdrop-blur-md outline-none transition-colors focus:border-amber dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-ink-soft/60";

// Reached only via the /auth/callback redirect after clicking the email
// link — by the time this page renders, the callback route has already
// exchanged the reset code for a temporary session, so updateUser() here
// applies to the right account without needing to re-verify anything.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/login?reset=success");
  }

  return (
    <AuthCard title="Set a new password" subtitle="Make it something you'll remember this time.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block font-body text-xs text-gray-600 dark:text-ink-soft">
            New password
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

        <div>
          <label htmlFor="confirm" className="mb-1.5 block font-body text-xs text-gray-600 dark:text-ink-soft">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
            placeholder="Re-enter password"
          />
        </div>

        {error && <p className="font-body text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
