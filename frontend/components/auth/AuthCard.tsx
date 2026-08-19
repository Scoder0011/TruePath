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
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-16 dark:bg-ink-deep">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full bg-amber/25 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-route/25 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-2xl shadow-gray-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-ink-deep/30 sm:p-10">
        <Link href="/" className="flex w-fit items-center gap-2.5">
          <Image src={logo} alt="TruePath" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            TruePath
          </span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-2 font-body text-sm text-gray-600 dark:text-ink-soft">{subtitle}</p>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
