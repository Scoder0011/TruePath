import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import logo from "../logo.png";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruePath — Structured career guidance for self-directed learners",
  description:
    "TruePath maps out real career paths with clear, staged roadmaps, so you don't have to guess where to begin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="font-body bg-white text-gray-900 antialiased dark:bg-ink-deep dark:text-white">
        <ThemeProvider>
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-white/10 dark:bg-ink/60">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
              >
                <Image src={logo} alt="TruePath" className="h-8 w-8" priority />
                <span className="font-display text-lg font-bold tracking-tight text-ink-deep dark:text-ink-soft">TruePath</span>
              </Link>

              <div className="flex items-center gap-3 sm:gap-5">
                <Link
                  href="/paths"
                  className="rounded-full px-3 py-1.5 font-body text-sm text-amber bg-amber/5 hover:bg-amber/10 transition-colors"
                >
                  Paths
                </Link>

                <a
                  href="https://discord.gg/pVkpAZSN"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Discord"
                  title="Join our Discord"
                  className="inline-flex items-center rounded-md p-1 text-sm font-body text-amber hover:bg-amber/10 transition-colors"
                >
                  <Image src="/icons/discord.png" alt="Discord" width={20} height={20} className="rounded-sm" />
                </a>

                <ThemeToggle />

                <div className="flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="rounded-md bg-amber px-3 py-2 text-sm font-medium text-white hover:brightness-95 transition-colors"
                  >
                    Sign up
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 font-body text-sm text-ink-deep dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
