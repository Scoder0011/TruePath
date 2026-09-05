"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPath } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { getAllProgress, setResourceComplete } from "@/lib/supabase/progress";
import type { ProgressRow, StartedMode } from "@/app/(dashboard)/dashboard/page";
import type { Path, Resource, Specialization, Stage } from "@/lib/types/path-tree";
import { CYBERSECURITY_TREE } from "@/lib/constants/cybersecurityTeams";

type EnrolledPath = { path: Path; specialization: Specialization; mode: LearningMode };

type Props = {
  userName: string;
  initialProgress: ProgressRow[];
  startedModes: StartedMode[];
};

type CardProps = {
  path: Path;
  specialization: Specialization;
  mode: LearningMode;
  progress: ProgressRow[];
  onModeSwitch: (specSlug: string, mode: LearningMode) => void;
  onRemove: (specSlug: string) => void;
  onLocked: (message: string) => void;
  onResourceToggle: (path: Path, specialization: Specialization, stage: Stage, resource: Resource, complete: boolean) => void;
};

export default function DashboardWorkspace({ userName, initialProgress, startedModes }: Props) {
  const [enrolled, setEnrolled] = useState<EnrolledPath[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>(initialProgress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockedStage, setLockedStage] = useState<string | null>(null);
  const [showResourceInfo, setShowResourceInfo] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(startedModes.map(async ({ spec_slug, mode }) => {
      const path = await getPath("cybersecurity");
      const specialization = path.specializations?.find((item) => item.slug === spec_slug);
      return specialization ? { path, specialization, mode } : null;
    }))
      .then((items) => {
        if (!cancelled) setEnrolled(items.filter((item): item is EnrolledPath => Boolean(item)));
      })
      .catch(() => { if (!cancelled) setError("Your learning paths could not be loaded."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    getAllProgress().then((rows) => {
      if (!cancelled) setProgress(rows as ProgressRow[]);
    }).catch(() => undefined);

    return () => { cancelled = true; };
  }, [startedModes]);

  const streak = useMemo(() => calculateStreak(progress), [progress]);

  async function handleModeSwitch(specSlug: string, currentMode: LearningMode) {
    const nextMode: LearningMode = currentMode === "staged" ? "self_paced" : "staged";
    setEnrolled((current) => current.map((item) => item.specialization.slug === specSlug ? { ...item, mode: nextMode } : item));
    try {
      await setLearningMode(specSlug, nextMode);
    } catch {
      setEnrolled((current) => current.map((item) => item.specialization.slug === specSlug ? { ...item, mode: currentMode } : item));
      setError("Learning mode could not be changed. Please try again.");
    }
  }

  async function handleRemove(specSlug: string) {
    if (!window.confirm("Remove this path and reset all progress? This cannot be undone.")) return;
    const previousEnrolled = enrolled;
    const previousProgress = progress;
    setEnrolled((current) => current.filter((item) => item.specialization.slug !== specSlug));
    setProgress((current) => current.filter((row) => row.spec_slug !== specSlug));

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setEnrolled(previousEnrolled);
      setProgress(previousProgress);
      setError("You need to be signed in to remove a path.");
      return;
    }

    const [modeResult, progressResult] = await Promise.all([
      supabase.from("user_learning_mode").delete().eq("user_id", user.id).eq("spec_slug", specSlug),
      supabase.from("user_progress").delete().eq("user_id", user.id).eq("spec_slug", specSlug),
    ]);
    if (modeResult.error || progressResult.error) {
      setEnrolled(previousEnrolled);
      setProgress(previousProgress);
      setError("This path could not be removed. Please try again.");
    }
  }

  async function handleResourceToggle(path: Path, specialization: Specialization, stage: Stage, resource: Resource, complete: boolean) {
    const previous = progress;
    setProgress((current) => {
      const withoutResource = current.filter((row) => !(row.spec_slug === specialization.slug && row.resource_id === resource.id));
      return complete ? [...withoutResource, { path_slug: path.slug, spec_slug: specialization.slug, stage_id: stage.id, resource_id: resource.id, completed_at: new Date().toISOString() }] : withoutResource;
    });
    try {
      await setResourceComplete(path.slug, specialization.slug, stage.id, resource.id, complete);
    } catch {
      setProgress(previous);
      setError("Progress could not be saved. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 dark:bg-ink-deep dark:text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-8 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-sm tracking-[0.18em] text-route">YOUR LEARNING CONSOLE</p>
              {streak > 0 && <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-xs text-orange-500">{streak} day streak</span>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold">Welcome back, {userName}</h1>
            <p className="mt-2 font-body text-sm text-gray-500 dark:text-ink-soft">Continue the paths you have added to your dashboard.</p>
          </div>
          <Link href="/paths" className="font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white">Browse paths →</Link>
        </header>

        {error && <p className="mt-5 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 font-body text-sm text-red-600 dark:text-red-200">{error}</p>}
        <section className="mt-8">
          {loading && <p className="rounded-xl border border-gray-200 bg-white/5 px-5 py-6 font-body text-sm text-gray-500 dark:border-white/10 dark:text-ink-soft">Loading your paths...</p>}
          {!loading && !enrolled.length && <div className="rounded-xl border border-dashed border-gray-200 bg-white/5 px-5 py-8 dark:border-white/10"><h2 className="font-display text-lg font-semibold">You haven&apos;t added any paths yet.</h2><Link href="/paths" className="mt-4 inline-block font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white">Browse paths →</Link></div>}
          {showResourceInfo && <div className="relative mb-6 rounded-xl border border-amber/20 bg-amber/10 px-5 py-4"><button type="button" onClick={() => setShowResourceInfo(false)} aria-label="Dismiss resource information" className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:text-ink-soft dark:hover:text-white">✕</button><p className="pr-8 font-mono text-xs uppercase tracking-widest text-amber">About the resources</p><p className="mt-2 pr-8 font-body text-sm text-gray-600 dark:text-ink-soft">Some topics include 2–3 resources covering the same concept — one might be a video, another a reading or a practice lab. You don&apos;t need to complete all of them. Pick whichever format works best for you, go through it, then mark all resources in that topic as done.</p></div>}
          <div className="grid gap-6 lg:grid-cols-2">
            {enrolled.map(({ path, specialization, mode }) => <PathwayCard key={`${path.slug}-${specialization.slug}`} path={path} specialization={specialization} mode={mode} progress={progress} onModeSwitch={handleModeSwitch} onRemove={handleRemove} onLocked={setLockedStage} onResourceToggle={handleResourceToggle} />)}
          </div>
        </section>
      </div>
      {lockedStage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 px-5"><div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-ink-deep"><h2 className="font-display text-xl font-semibold">Stage locked</h2><p className="mt-3 font-body text-sm leading-6 text-gray-500 dark:text-ink-soft">{lockedStage}</p><button type="button" onClick={() => setLockedStage(null)} className="mt-6 rounded-lg bg-amber px-4 py-2 font-body text-sm font-semibold text-ink">Close</button></div></div>}
    </main>
  );
}

function PathwayCard({ path, specialization, mode, progress, onModeSwitch, onRemove, onLocked, onResourceToggle }: CardProps) {
  const stages = specialization.stages ?? [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(() => new Set(stages.map((stage) => stage.id)));
  const completed = new Set(progress.filter((row) => row.spec_slug === specialization.slug).map((row) => row.resource_id));
  const allResources = stages.flatMap((stage) => stage.topics.flatMap((topic) => topic.resources));
  const percent = allResources.length ? Math.round((allResources.filter((resource) => completed.has(resource.id)).length / allResources.length) * 100) : 0;
  const team = CYBERSECURITY_TREE.find((item) => item.specializations.some((item) => item.slug === specialization.slug));

  function isComplete(stage: Stage) {
    const resources = stage.topics.flatMap((topic) => topic.resources);
    return resources.length > 0 && resources.every((resource) => completed.has(resource.id));
  }

  function isUnlocked(index: number) {
    return mode === "self_paced" || index === 0 || isComplete(stages[index - 1]);
  }

  useEffect(() => {
    setExpandedStages((current) => {
      const next = new Set(current);
      stages.forEach((stage) => { if (isComplete(stage)) next.delete(stage.id); });
      return next;
    });
  }, [progress, mode, specialization.slug]);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white/5 p-5 dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.15em] text-gray-500 dark:text-ink-soft">{path.title} <span aria-hidden="true">›</span> {team?.label ?? "Team"}</p>
          <Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-2 block font-display text-xl font-semibold text-gray-900 hover:text-amber dark:text-white">{specialization.title}</Link>
        </div>
        <div className="relative">
          <button type="button" aria-label="Path settings" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg px-2 py-1 text-lg text-gray-500 hover:bg-white/10 dark:text-ink-soft">⋯</button>
          {menuOpen && <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-ink-deep"><button type="button" onClick={() => { onModeSwitch(specialization.slug, mode); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm text-gray-900 hover:bg-white/10 dark:text-white">Switch mode</button><button type="button" onClick={() => { onRemove(specialization.slug); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm text-red-600 hover:bg-white/10 dark:text-red-300">Remove from dashboard</button></div>}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3"><span className="rounded-full border border-route/50 px-2 py-1 font-mono text-[10px] uppercase text-route">{mode === "staged" ? "staged" : "self-paced"}</span><span className="font-mono text-xs text-gray-500 dark:text-ink-soft">{percent}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-route" style={{ width: `${percent}%` }} /></div>

      <div className="mt-6 space-y-3">
        {stages.map((stage, index) => {
          const complete = isComplete(stage);
          const unlocked = isUnlocked(index);
          const expanded = expandedStages.has(stage.id);
          return (
            <section key={stage.id} className={`rounded-xl border ${unlocked ? "border-gray-200 bg-white/5 dark:border-white/10" : "border-gray-200 bg-white/5 opacity-70 dark:border-white/10"}`}>
              <button type="button" onClick={() => { if (!unlocked) { onLocked("Complete the previous stage first"); return; } setExpandedStages((current) => { const next = new Set(current); next.has(stage.id) ? next.delete(stage.id) : next.add(stage.id); return next; }); }} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-500 dark:text-ink-soft">Stage {index + 1}</span><span className="mt-1 block font-body text-sm text-gray-900 dark:text-white">{stage.title}</span></span>
                <span className="flex items-center gap-2 font-mono text-xs">{complete ? <span className="text-route">✓ Complete</span> : !unlocked ? <span className="text-gray-500 dark:text-ink-soft">🔒</span> : expanded ? <span className="text-gray-500 dark:text-ink-soft">−</span> : <span className="text-gray-500 dark:text-ink-soft">+</span>}</span>
              </button>
              {!unlocked && <p className="px-4 pb-3 font-body text-xs text-gray-500 dark:text-ink-soft">Complete Stage {index} to unlock</p>}
              {unlocked && expanded && <div className="border-t border-gray-200 px-4 py-3 dark:border-white/10">{stage.topics.map((topic) => <div key={topic.id} className="mb-4 last:mb-0"><p className="font-body text-xs font-semibold text-gray-500 dark:text-ink-soft">{topic.title}</p><div className="mt-2 space-y-2">{topic.resources.map((resource) => <ResourceRow key={resource.id} resource={resource} completed={completed.has(resource.id)} onToggle={(done) => onResourceToggle(path, specialization, stage, resource, done)} />)}</div></div>)}</div>}
            </section>
          );
        })}
      </div>
      <Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-5 inline-block font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white">Continue in canvas →</Link>
    </article>
  );
}

function ResourceRow({ resource, completed, onToggle }: { resource: Resource; completed: boolean; onToggle: (completed: boolean) => void }) {
  return <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white/5 px-3 py-2 dark:border-white/10"><input type="checkbox" checked={completed} onChange={(event) => onToggle(event.target.checked)} aria-label={`Mark ${resource.title ?? resource.type} complete`} className="h-4 w-4 accent-amber" /><span className={`min-w-0 flex-1 font-body text-sm ${completed ? "text-route line-through" : "text-gray-900 dark:text-white"}`}>{resource.title ?? resource.type}</span><span className="rounded-full border border-gray-200 px-2 py-0.5 font-mono text-[9px] uppercase text-gray-500 dark:border-white/10 dark:text-ink-soft">{resource.type}</span><span className="rounded-full border border-gray-200 px-2 py-0.5 font-mono text-[9px] text-gray-500 dark:border-white/10 dark:text-ink-soft">{resource.is_free ? "Free" : "Paid"}</span>{resource.url && <a href={resource.url} target="_blank" rel="noreferrer" className="shrink-0 font-body text-xs text-amber hover:text-gray-900 dark:hover:text-white">Open ↗</a>}</div>;
}

function calculateStreak(progress: ProgressRow[]) {
  const dates = [...new Set(progress.filter((row) => row.completed_at).map((row) => new Date(row.completed_at as string).toISOString().slice(0, 10)))].sort().reverse();
  if (!dates.length) return 0;
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  today.setDate(today.getDate() - 1);
  const yesterdayString = today.toISOString().slice(0, 10);
  if (dates[0] !== todayString && dates[0] !== yesterdayString) return 0;
  let count = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const expected = new Date(`${dates[index - 1]}T00:00:00Z`);
    expected.setUTCDate(expected.getUTCDate() - 1);
    if (dates[index] !== expected.toISOString().slice(0, 10)) break;
    count += 1;
  }
  return count;
}
