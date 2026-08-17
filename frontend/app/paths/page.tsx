"use client";

import { useEffect, useState } from "react";
import { getPath } from "@/lib/api/client";
import { pathToTree, type TreeNode } from "@/lib/types/path-tree";
import { DOMAINS, type Domain } from "@/lib/constants/domains";
import CanvasTree from "@/components/path-tree/CanvasTree";
import DomainSelector from "@/components/path-tree/DomainSelector";

export default function PathsPage() {
  const [domain, setDomain] = useState<Domain>(DOMAINS[0]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!domain.available) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getPath(domain.slug)
      .then((path) => {
        if (cancelled) return;
        setTree(pathToTree(path));
      })
      .catch(() => {
        if (cancelled) return;
        setError(`Couldn't load the ${domain.name} path. Try again in a moment.`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [domain]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink-deep px-6 pb-16 pt-10">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full bg-amber/20 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-route/20 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Search bar, centered, with the domain dropdown alongside it */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md focus-within:border-amber">
              <span className="font-mono text-sm text-ink-soft">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stages, tools, resources…"
                className="w-full bg-transparent font-body text-sm text-white placeholder:text-ink-soft/60 outline-none"
              />
            </div>
          </div>

          <DomainSelector selected={domain} onSelect={setDomain} />
        </div>

        {/* Canvas */}
        <div className="mt-10">
          {!domain.available && (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur-xl">
              <p className="font-mono text-xs tracking-[0.15em] text-amber">COMING SOON</p>
              <p className="mt-3 font-display text-xl font-medium text-white">
                {domain.name} isn&apos;t built out yet
              </p>
              <p className="mt-2 max-w-sm font-body text-sm text-ink-soft">
                Cybersecurity is the only fully staged path right now. Switch back using the Paths
                dropdown above.
              </p>
            </div>
          )}

          {domain.available && loading && (
            <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <p className="font-mono text-sm text-ink-soft">Loading {domain.name}…</p>
            </div>
          )}

          {domain.available && !loading && error && (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur-xl">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          {domain.available && !loading && !error && tree && (
            <CanvasTree root={tree} searchQuery={search} />
          )}
        </div>
      </div>
    </main>
  );
}
