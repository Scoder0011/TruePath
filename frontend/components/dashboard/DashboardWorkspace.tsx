"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CanvasTree from "@/components/path-tree/CanvasTree";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import { DOMAINS } from "@/lib/constants/domains";
import { getAllPaths, getPath } from "@/lib/api/client";
import { getAllProgress, setResourceComplete } from "@/lib/supabase/progress";
import { setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { pathToTree, type Path, type TreeNode } from "@/lib/types/path-tree";

type ProgressRow = { path_slug: string | null; spec_slug: string; stage_id: string; resource_id: string };

export default function DashboardWorkspace({ userName, initialProgress }: { userName: string; initialProgress: ProgressRow[] }) {
  const [paths, setPaths] = useState<Path[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>(initialProgress);
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [pendingDomain, setPendingDomain] = useState<string | null>(null);
  const [mode, setMode] = useState<LearningMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTree, setLoadingTree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPaths().then(setPaths).catch(() => setError("Path catalog is unavailable right now.")).finally(() => setLoading(false));
    getAllProgress().then((rows) => setProgress(rows.map((row) => ({ ...row, path_slug: null })))).catch(() => undefined);
  }, []);

  const domains = useMemo(() => {
    const remote = paths.map((path) => ({ slug: path.slug, name: path.title, available: true }));
    const fallback = DOMAINS.filter((domain) => !remote.some((item) => item.slug === domain.slug));
    return [...remote, ...fallback].filter((domain) => domain.name.toLowerCase().includes(query.toLowerCase()));
  }, [paths, query]);

  const visiblePaths = paths.filter((path) => `${path.title} ${path.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const inProgress = paths.filter((path) => progress.some((row) => row.path_slug === path.slug));
  const completedIds = useMemo(() => new Set(progress.filter((row) => !selectedPath || row.path_slug === selectedPath.slug).map((row) => row.resource_id)), [progress, selectedPath]);

  function requestDomain(slug: string) {
    setPendingDomain(slug);
  }

  async function handleModeSelect(newMode: LearningMode) {
    if (!pendingDomain) return;
    const slug = pendingDomain;
    setPendingDomain(null);
    setMode(newMode);
    setSelectedSlug(slug);
    setLoadingTree(true);
    try {
      const path = await getPath(slug);
      setSelectedPath(path);
      await Promise.all((path.specializations ?? []).map((spec) => setLearningMode(spec.slug, newMode)));
      setError(null);
    } catch {
      setSelectedPath(null);
      setError("This roadmap is not available yet.");
    } finally {
      setLoadingTree(false);
    }
  }

  function closeRoadmap() {
    setSelectedSlug(null);
    setSelectedPath(null);
  }

  async function toggleResource(node: TreeNode, complete: boolean) {
    const resource = node.progress;
    if (!resource) return;
    setProgress((current) => complete
      ? [...current, { path_slug: resource.pathSlug, spec_slug: resource.specSlug, stage_id: resource.stageId, resource_id: resource.resourceId }]
      : current.filter((row) => !(row.spec_slug === resource.specSlug && row.resource_id === resource.resourceId)));
    try {
      await setResourceComplete(resource.pathSlug, resource.specSlug, resource.stageId, resource.resourceId, complete);
    } catch {
      setProgress(initialProgress);
      setError("Progress could not be saved. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-ink-deep sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-gray-200 pb-8 dark:border-white/10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-amber">YOUR LEARNING CONSOLE</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userName}</h1>
            <p className="mt-2 max-w-xl font-body text-sm text-gray-600 dark:text-ink-soft">Choose a domain and keep building your next capability.</p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 md:max-w-sm dark:border-white/10 dark:bg-white/5">
            <span className="font-mono text-lg text-route">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search domains and paths" className="w-full bg-transparent font-body text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white" />
          </label>
        </header>

        {error && <p className="mt-4 rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 font-body text-sm text-gray-700 dark:text-amber">{error}</p>}

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">In progress</h2><Link href="/paths" className="font-body text-sm text-route hover:underline">Browse all paths</Link></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{inProgress.map((path) => <ProgressCard key={path.slug} path={path} progress={progress} onSelect={requestDomain} />)}{!loading && !inProgress.length && <p className="font-body text-sm text-gray-600 dark:text-ink-soft">Your started paths will appear here as you complete resources.</p>}</div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-white">Explore domains</h2>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">{domains.map((domain) => <button key={domain.slug} onClick={() => domain.available && requestDomain(domain.slug)} disabled={!domain.available} className={`shrink-0 border-b-2 px-3 py-2 font-body text-sm ${selectedSlug === domain.slug ? "border-amber text-amber" : "border-transparent text-gray-600 hover:text-route dark:text-ink-soft"} ${!domain.available ? "cursor-not-allowed opacity-40" : ""}`}>{domain.name}</button>)}</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visiblePaths.map((path) => <ProgressCard key={path.slug} path={path} progress={progress} onSelect={requestDomain} />)}</div>
        </section>

        {selectedSlug && <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10"><div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10"><div><p className="font-mono text-[10px] tracking-[0.15em] text-route">ROADMAP VIEW</p><h2 className="mt-1 font-display text-xl font-semibold text-gray-900 dark:text-white">{selectedPath?.title ?? "Loading roadmap"}</h2></div><button onClick={closeRoadmap} className="font-mono text-xs text-gray-500 hover:text-amber dark:text-ink-soft">CLOSE</button></div><div className="h-[620px]">{loadingTree ? <p className="p-6 font-body text-sm text-gray-600 dark:text-ink-soft">Loading roadmap...</p> : selectedPath ? <CanvasTree root={pathToTree(selectedPath)} completedResourceIds={completedIds} onResourceToggle={toggleResource} lockedNodeIds={mode === "staged" ? getLockedStageIds(selectedPath, progress) : new Set()} /> : <p className="p-6 font-body text-sm text-gray-600 dark:text-ink-soft">No roadmap data is available for this domain yet.</p>}</div></section>}
        {pendingDomain && <ModeSelectModal onSelect={handleModeSelect} />}
      </div>
    </main>
  );
}

function ProgressCard({ path, progress, onSelect }: { path: Path; progress: ProgressRow[]; onSelect: (slug: string) => void }) {
  const completed = progress.filter((row) => row.path_slug === path.slug).length;
  const total = (path?.specializations ?? []).reduce((sum, spec) => sum + (spec?.stages ?? []).reduce((stageSum, stage) => stageSum + (stage?.topics ?? []).reduce((topicSum, topic) => topicSum + (topic?.resources ?? []).length, 0), 0), 0) ?? 0;
  const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const description = path.slug === "cybersecurity" ? "Protect systems, networks, and data from digital attacks." : "Build practical skills with a guided roadmap.";
  return <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[0.15em] text-route">PATH</p><button type="button" onClick={() => onSelect(path.slug)} className="mt-1 text-left font-display text-lg font-semibold text-gray-900 hover:text-amber dark:text-white">{path.title}</button></div><span className="rounded-full border border-amber/50 px-2 py-1 font-mono text-[10px] text-amber">{percent === 100 ? "BADGE EARNED" : `${percent}%`}</span></div><p className="mt-2 line-clamp-2 font-body text-sm text-gray-600 dark:text-ink-soft">{description}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10"><div className="h-full bg-route transition-all" style={{ width: `${percent}%` }} /></div><button onClick={() => onSelect(path.slug)} className="mt-4 font-body text-sm font-medium text-amber hover:underline">{completed ? "Continue path" : "Explore path"} <span aria-hidden="true">→</span></button></article>;
}

function getLockedStageIds(path: Path, progress: ProgressRow[]) {
  const completed = new Set(progress.map((row) => row.resource_id));
  const locked = new Set<string>();
  for (const specialization of path.specializations ?? []) {
    const stages = specialization.stages ?? [];
    stages.forEach((stage, index) => {
      if (index === 0) return;
      const previousResources = (stages[index - 1].topics ?? []).flatMap((topic) => topic.resources ?? []);
      if (!previousResources.length || !previousResources.every((resource) => completed.has(resource.id))) locked.add(stage.id);
    });
  }
  return locked;
}
