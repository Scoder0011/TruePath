import Link from "next/link";
import Image from "next/image";
import logo from "../../logo.png";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 py-16">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full bg-zinc-800/60 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-zinc-700/40 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0b0b0b]/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-10">
        <Link href="/" className="flex w-fit items-center gap-2.5 text-white">
          <Image src={logo} alt="TruePath" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            TruePath
          </span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold text-white">{title}</h1>
        <p className="mt-2 font-body text-sm text-zinc-400">{subtitle}</p>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
