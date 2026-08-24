"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile, updateProfile, uploadAvatar } from "@/lib/supabase/profile";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-body text-sm text-gray-900 outline-none transition-colors focus:border-amber dark:border-white/10 dark:bg-white/5 dark:text-white";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    getProfile().then((profile) => {
      setDisplayName(profile?.display_name ?? "");
      setAvatarPreview(profile?.avatar_url ?? null);
    });
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview); // instant feedback while it uploads

    try {
      const url = await uploadAvatar(file);
      setAvatarPreview(url);
      setStatus({ type: "success", message: "Profile picture updated." });
    } catch {
      setStatus({ type: "error", message: "Couldn't upload that image. Try a smaller file." });
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setStatus(null);
    try {
      await updateProfile({ display_name: displayName });
      setStatus({ type: "success", message: "Profile saved." });
    } catch {
      setStatus({ type: "error", message: "Couldn't save your profile." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords don't match." });
      return;
    }

    setSavingPassword(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setStatus({ type: "success", message: "Password updated." });
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 dark:bg-ink-deep">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <p className="font-mono text-xs tracking-[0.15em] text-amber">SETTINGS</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 dark:text-white">
            Account settings
          </h1>
        </div>

        {status && (
          <p
            className={`font-body text-sm ${status.type === "success" ? "text-route" : "text-red-500"}`}
          >
            {status.message}
          </p>
        )}

        {/* Profile picture */}
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
            Profile picture
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 font-display text-xl text-gray-500 dark:border-white/10 dark:bg-white/10 dark:text-ink-soft">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                (displayName || email || "?").slice(0, 1).toUpperCase()
              )}
            </div>
            <label className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 font-body text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              Upload new picture
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </section>

        {/* Profile info */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5"
        >
          <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-xs text-gray-500 dark:text-ink-soft">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs text-gray-500 dark:text-ink-soft">
                Email
              </label>
              <input type="email" value={email} disabled className={`${inputClass} cursor-not-allowed opacity-60`} />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {savingProfile ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>

        {/* Password */}
        <form
          onSubmit={handleChangePassword}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5"
        >
          <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
            Change password
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block font-body text-xs text-gray-500 dark:text-ink-soft">
                New password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs text-gray-500 dark:text-ink-soft">
                Confirm new password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Re-enter password"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-lg bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {savingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
