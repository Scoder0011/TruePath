"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Keeps the nav in sync the instant someone logs in/out anywhere in
  // the app — no full page reload needed for the icon to appear/disappear.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      setDisplayName(null);
      return;
    }
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("avatar_url, display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setAvatarUrl(data?.avatar_url ?? null);
        setDisplayName(data?.display_name ?? null);
      });
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 font-body text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10"
      >
        Log in
      </Link>
    );
  }

  const initials = (displayName ?? user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 font-body text-sm font-medium text-white"
        aria-label="Account menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-52 overflow-hidden rounded-xl border border-white/10 bg-ink-deep/95 shadow-2xl shadow-ink-deep/40 backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate font-body text-sm font-medium text-white">{displayName ?? "Your account"}</p>
            <p className="truncate font-body text-xs text-ink-soft">{user.email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-body text-sm text-ink-soft transition-colors hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-body text-sm text-ink-soft transition-colors hover:bg-white/5 hover:text-white"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left font-body text-sm text-red-400 transition-colors hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
