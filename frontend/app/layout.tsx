import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import NavbarClient from "@/components/layout/NavbarClient";
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
          <NavbarClient />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}