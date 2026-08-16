import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
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
    "TruePath maps out real career paths with clear, staged roadmaps — starting with Cybersecurity — so you don't have to guess where to begin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} font-body bg-ink text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
