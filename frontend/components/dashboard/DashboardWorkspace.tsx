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
import { CYBERSECURITY_TREE } from "@/lib/constants/cybersecurityTeams";
import { getVisitedPathways, type VisitedPathway } from "@/lib/supabase/pathActivity";

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
  const [visitedPathways, setVisitedPathways] = useState<VisitedPathway[]>([]);

  useEffect(() => {
    getAllPaths().then(setPaths).catch(() => setError("Path catalog is unavailable right now.")).finally(() => setLoading(false));
    getAllProgress().then(setProgress).catch(() => undefined);
    setVisitedPathways(getVisitedPathways());
    const refreshVisited = () => setVisitedPathways(getVisitedPathways());
    window.addEventListener("truepath-pathway-visited", refreshVisited);
    window.addEventListener("storage", refreshVisited);
    return () => {
      window.removeEventListener("truepath-pathway-visited", refreshVisited);
      window.removeEventListener("storage", refreshVisited);
    };
  }, []);

  const domains = useMemo(() => {
    const remote = paths.map((path) => ({ slug: path.slug, name: path.title, available: true }));
    const fallback = DOMAINS.filter((domain) => !remote.some((item) => item.slug === domain.slug));
    return [...remote, ...fallback].filter((domain) => domain.name.toLowerCase().includes(query.toLowerCase()));
  }, [paths, query]);

  const visiblePaths = paths.filter((path) => `${path.title} ${path.description ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const inProgress = paths.flatMap((path) => {
    const specSlugs = new Set([
      ...progress.filter((row) => row.path_slug === path.slug).map((row) => row.spec_slug),
      ...visitedPathways.filter((item) => item.pathSlug === path.slug).map((item) => item.specSlug),
    ]);
    return [...specSlugs].map((specSlug) => ({ path, spec: path.specializations?.find((item) => item.slug === specSlug) })).filter((item): item is { path: Path; spec: NonNullable<Path["specializations"]>[number] } => Boolean(item.spec));
  });
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
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-zinc-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-zinc-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-route">YOUR LEARNING CONSOLE</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-zinc-900">Welcome back, {userName}</h1>
            <p className="mt-2 max-w-xl font-body text-sm text-zinc-600">Choose a domain and keep building your next capability.</p>
          </div>
          <label className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 md:max-w-sm">
            <span className="font-mono text-lg text-route">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search domains and paths" className="w-full bg-transparent font-body text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
          </label>
        </header>

        {error && <p className="mt-4 rounded-lg border border-route/40 bg-route/10 px-4 py-3 font-body text-sm text-route">{error}</p>}

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4"><h2 className="font-display text-xl font-semibold text-zinc-900">In progress</h2><Link href="/paths" className="font-body text-sm text-route hover:underline">Browse all paths</Link></div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{loading && <div className="rounded-xl border border-zinc-200 bg-white px-5 py-6 font-body text-sm text-zinc-600 md:col-span-2 lg:col-span-3" role="status">Loading your paths...</div>}{inProgress.map(({ path, spec }) => <ProgressCard key={`${path.slug}-${spec.slug}`} path={path} spec={spec} progress={progress} />)}{!loading && !inProgress.length && <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-6 md:col-span-2 lg:col-span-3"><p className="font-display text-base font-semibold text-zinc-900">No path currently underway</p><p className="mt-2 font-body text-sm text-zinc-600">Start any roadmap or pathway and your progress will appear here.</p><Link href="/paths" className="mt-4 inline-block font-body text-sm font-medium text-route hover:underline">Browse pathways <span aria-hidden="true">→</span></Link></div>}</div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-route">DOMAIN MAP</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
                <h2 className="font-display text-xl font-semibold text-zinc-900">Explore</h2>
                <div className="flex gap-1 overflow-x-auto rounded-lg bg-zinc-100 p-1">
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain.slug}
                      type="button"
                      disabled={!domain.available}
                      onClick={() => domain.available && requestDomain(domain.slug)}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 font-body text-xs transition-colors ${domain.slug === "cybersecurity" ? "bg-white font-medium text-zinc-900 shadow-sm" : "text-zinc-500"} ${!domain.available ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {domain.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white px-4 py-8 sm:px-8">
            <div className="relative mx-auto max-w-3xl">
              <Link href="/paths" className="relative z-10 mx-auto flex min-h-24 max-w-xs flex-col items-center justify-center rounded-xl border-2 border-amber/60 bg-[#fffaf0] px-5 py-4 text-center shadow-sm transition-transform hover:-translate-y-1">
                <span className="font-mono text-[10px] tracking-[0.18em] text-route">DOMAIN</span>
                <span className="mt-1 font-display text-lg font-semibold text-zinc-900">Cybersecurity</span>
                <span className="mt-1 font-body text-xs text-zinc-600">Protect systems, networks, and data.</span>
              </Link>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {CYBERSECURITY_TREE.map((team) => (
                  <Link key={team.id} href={`/dashboard/teams/${team.id}`} className="relative z-10 flex min-h-32 flex-col rounded-xl border border-zinc-200 bg-[#f7f7f5] p-4 transition-all hover:-translate-y-1 hover:border-zinc-400 hover:shadow-md">
                    <span className="text-xl" aria-hidden="true">{team.icon}</span>
                    <span className="mt-2 font-display text-sm font-semibold text-zinc-900">{team.label}</span>
                    <span className="mt-1 line-clamp-2 font-body text-xs leading-5 text-zinc-600">{team.description}</span>
                    <span className="mt-auto pt-3 font-mono text-[10px] tracking-[0.12em] text-route">VIEW SPECIALIZATIONS →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {selectedSlug && <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white"><div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4"><div><p className="font-mono text-[10px] tracking-[0.15em] text-route">ROADMAP VIEW</p><h2 className="mt-1 font-display text-xl font-semibold text-zinc-900">{selectedPath?.title ?? "Loading roadmap"}</h2></div><button onClick={closeRoadmap} className="font-mono text-xs text-zinc-500 hover:text-route">CLOSE</button></div><div className="h-[620px]">{loadingTree ? <p className="p-6 font-body text-sm text-zinc-600">Loading roadmap...</p> : selectedPath ? <CanvasTree root={pathToTree(selectedPath)} completedResourceIds={completedIds} onResourceToggle={toggleResource} lockedNodeIds={mode === "staged" ? getLockedStageIds(selectedPath, progress) : new Set()} /> : <p className="p-6 font-body text-sm text-zinc-600">No roadmap data is available for this domain yet.</p>}</div></section>}
        {pendingDomain && <ModeSelectModal onSelect={handleModeSelect} />}
      </div>
    </main>
  );
}

function ProgressCard({ path, spec, progress }: { path: Path; spec: NonNullable<Path["specializations"]>[number]; progress: ProgressRow[] }) {
  const completed = progress.filter((row) => row.path_slug === path.slug && row.spec_slug === spec.slug).length;
  const total = (spec.stages ?? []).reduce((sum, stage) => sum + (stage.topics ?? []).reduce((topicSum, topic) => topicSum + (topic.resources ?? []).length, 0), 0);
  const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const team = CYBERSECURITY_TREE.find((item) => item.specializations.some((specialization) => specialization.slug === spec.slug));
  return <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[0.15em] text-route">PATHWAY</p><p className="mt-1 font-body text-xs text-zinc-500">{path.title} <span aria-hidden="true">›</span> {team?.label ?? "Team"} <span aria-hidden="true">›</span></p><Link href={`/paths/${path.slug}/${spec.slug}`} className="mt-1 block font-display text-lg font-semibold text-zinc-900 hover:text-route">{spec.title}</Link></div><span className="rounded-full border border-route/50 px-2 py-1 font-mono text-[10px] text-route">{percent === 100 ? "BADGE EARNED" : `${percent}%`}</span></div><p className="mt-2 line-clamp-2 font-body text-sm text-zinc-600">{spec.description ?? "Continue building this capability."}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200"><div className="h-full bg-route transition-all" style={{ width: `${percent}%` }} /></div><Link href={`/paths/${path.slug}/${spec.slug}`} className="mt-4 inline-block font-body text-sm font-medium text-route hover:underline">{completed ? "Continue path" : "Open pathway"} <span aria-hidden="true">→</span></Link></article>;
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
