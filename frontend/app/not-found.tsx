import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-gray-900 dark:bg-ink-deep dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-ink-soft">
          The page you were looking for does not exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-amber px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
