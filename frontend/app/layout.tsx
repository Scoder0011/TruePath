import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "TruePath", description: "Learning paths" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

