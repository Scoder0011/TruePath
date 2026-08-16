import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import logo from "../logo.png";
import "./globals.css";

// next/font loads and self-hosts Google Fonts at build time — no layout
// shift, no separate <link> tags to manage. Each one exposes a CSS
// variable we wire into tailwind.config.ts under fontFamily.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} font-body bg-ink-deep text-white antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/60 backdrop-blur-lg">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-offset-4"
            >
              <Image src={logo} alt="TruePath" className="h-8 w-8" priority />
              <span className="font-display text-lg font-bold tracking-tight">TruePath</span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-5">
              <Link
                href="/paths"
                className="rounded-md px-2 py-1.5 font-body text-sm text-ink-soft transition-colors hover:text-white"
              >
                Paths
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 font-body text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
