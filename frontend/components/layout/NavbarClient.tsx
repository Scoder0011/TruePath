"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import logo from "@/logo.png";
import type { User } from "@supabase/supabase-js";

export default function NavbarClient() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Get display name and avatar
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Account";

  const avatarUrl = user?.user_metadata?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-ink/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
        >
          <Image src={logo} alt="TruePath" className="h-8 w-8" priority />
          <span className="font-display text-lg font-bold tracking-tight text-ink-deep dark:text-ink-soft">
            TᖇᑌEᑭᗩTᕼ
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/paths"
            className="rounded-full px-3 py-1.5 font-body text-sm text-route bg-route/5 hover:bg-route/10 transition-colors"
          >
            Paths
          </Link>

          <a
            href="https://discord.gg/pVkpAZSN"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join our Discord"
            title="Join our Discord"
            className="inline-flex items-center rounded-md p-1 text-sm font-body text-route hover:bg-route/10 transition-colors"
          >
            <Image
              src="/icons/discord.png"
              alt="Discord"
              width={20}
              height={20}
              className="rounded-sm"
            />
          </a>

          <ThemeToggle />

          {/* Auth section */}
          {loading ? (
            // Loading skeleton — prevents flash of sign in buttons
            <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
          ) : user ? (
            // Logged in state
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-amber/30"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber/20 ring-1 ring-amber/30">
                    <span className="font-mono text-xs font-medium text-route">
                      {initial}
                    </span>
                  </div>
                )}
                <span className="hidden max-w-[120px] truncate font-body text-sm text-gray-700 dark:text-ink-soft sm:block">
                  {displayName}
                </span>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 font-body text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-ink-soft dark:hover:bg-white/10 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            // Logged out state
            <div className="flex items-center gap-2">
              <Link
                href="/signup"
                className="rounded-md bg-amber px-3 py-2 text-sm font-medium text-white transition-colors hover:brightness-95"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 font-body text-sm text-ink-deep transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}