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
                <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">TruePath</span>
              </Link>
              <div className="flex items-center gap-3 sm:gap-5">
                <Link
                  href="/paths"
                  className="rounded-md px-2 py-1.5 font-body text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-ink-soft dark:hover:text-white"
                >
                  Paths
                </Link>
                <ThemeToggle />
                <Link
                  href="/login"
                  className="rounded-lg border border-gray-200 bg-gray-100 px-3.5 py-2 font-body text-sm text-gray-700 backdrop-blur-md transition-colors hover:bg-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </nav>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
