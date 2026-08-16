import Link from "next/link";
import { getAllPaths } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export default async function PathsPage() {
  const paths = await getAllPaths();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs tracking-[0.15em] text-amber">PATHS</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white">Explore career paths</h1>
      <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink-soft">
        Choose a path to explore its specializations, stages, and learning resources.
      </p>

      {paths.length === 0 ? (
        <p className="mt-10 font-body text-sm text-ink-soft">No paths are available yet.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <Link
              key={path.id}
              href={`/paths/${path.slug}`}
              className="group rounded-lg border border-ink-line p-6 transition-colors hover:border-amber"
            >
              <p className="font-display text-xl font-medium text-white group-hover:text-amber">{path.name}</p>
              {path.description && (
                <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">{path.description}</p>
              )}
              <p className="mt-6 font-mono text-xs tracking-[0.12em] text-route">VIEW PATH →</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
