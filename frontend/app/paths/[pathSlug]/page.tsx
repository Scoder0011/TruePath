"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CanvasTree from "@/components/path-tree/CanvasTree";
import { getPath } from "@/lib/api/client";
import { pathToTree, type Path, type Specialization } from "@/lib/types/path-tree";

export default function PathDetailPage({ params }: { params: { pathSlug: string } }) {
  const [path, setPath] = useState<Path | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getPath(params.pathSlug)
      .then((data) => {
        if (cancelled) return;
        setPath(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error(`Failed to load path "${params.pathSlug}"`, err);
        setError(`Couldn't load this path right now. Please try again in a moment.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.pathSlug]);

  const primarySpecialization = useMemo<Specialization | null>(() => {
    if (!path?.specializations?.length) return null;
    return path.specializations.find((specialization) => specialization.stages?.length > 0) ?? path.specializations[0];
  }, [path]);

  const tree = useMemo(() => {
    if (!path) return null;
    return pathToTree(path);
  }, [path]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink-deep px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full bg-amber/20 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-route/20 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">CAREER PATH</p>
          <h1 className="mt-2 font-display text-3xl text-white md:text-5xl">
            {path?.title ?? "Loading..."}
          </h1>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-[30%]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-ink-deep/30 backdrop-blur-xl">
              {loading && (
                <div className="flex min-h-[220px] items-center justify-center">
                  <p className="font-mono text-sm text-ink-soft">Loading path details…</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex min-h-[220px] items-center justify-center text-center">
                  <p className="font-body text-sm text-red-400">{error}</p>
                </div>
              )}

              {!loading && !error && path && primarySpecialization && (
                <>
                  <Link
                    href="/paths"
                    className="inline-flex items-center gap-2 font-body text-sm text-amber transition-opacity hover:opacity-80"
                  >
                    <span aria-hidden="true">←</span> Back to all paths
                  </Link>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Overview</p>
                      <p className="mt-3 font-body text-sm leading-6 text-ink-soft">{path.description}</p>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Prerequisites</p>
                      <p className="mt-3 font-body text-sm leading-6 text-ink-soft">
                        {primarySpecialization.prerequisites || "No formal prerequisites listed yet."}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Duration</p>
                      <p className="mt-3 font-body text-sm leading-6 text-ink-soft">
                        {primarySpecialization.duration || "Flexible"}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Career outcomes</p>
                      <p className="mt-3 font-body text-sm leading-6 text-ink-soft">
                        {primarySpecialization.career_outcomes || "Career outcomes will be added soon."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>

          <section className="lg:w-[70%]">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
              <span className="font-mono text-sm text-ink-soft">⌕</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search stages, tools, resources…"
                className="w-full bg-transparent font-body text-sm text-white placeholder:text-ink-soft/60 outline-none"
              />
            </div>

            {loading && (
              <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <p className="font-mono text-sm text-ink-soft">Loading path timeline…</p>
              </div>
            )}

            {!loading && error && (
              <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <p className="font-body text-sm text-red-400">{error}</p>
              </div>
            )}

            {!loading && !error && tree && <CanvasTree root={tree} searchQuery={searchQuery} />}
          </section>
        </div>
      </div>
    </main>
  );
}
