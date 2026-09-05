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

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      startedModes.map(async ({ spec_slug, mode }) => {
        const path = await getPathForSpec(spec_slug);
        const specialization = path.specializations?.find((item) => item.slug === spec_slug);
        return specialization ? { path, specialization, mode } : null;
      }),
    )
      .then((items) => {
        if (!cancelled) setEnrolled(items.filter((item): item is EnrolledPath => Boolean(item)));
      })
      .catch(() => {
        if (!cancelled) setError("Your learning paths could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getAllProgress()
      .then((rows) => {
        if (!cancelled) setProgress(rows as ProgressRow[]);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
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
      return complete
        ? [...withoutResource, { path_slug: path.slug, spec_slug: specialization.slug, stage_id: stage.id, resource_id: resource.id, completed_at: new Date().toISOString() }]
        : withoutResource;
    });
    try {
      await setResourceComplete(path.slug, specialization.slug, stage.id, resource.id, complete);
    } catch {
      setProgress(previous);
      setError("Progress could not be saved. Please try again.");
    }
  }

  return (
    <main className="dashboard-shell min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-sm tracking-[0.18em] text-emerald-200">YOUR LEARNING CONSOLE</p>
              {streak > 0 && <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-xs text-orange-400">{streak} day streak</span>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold">Welcome back, {userName}</h1>
            <p className="mt-2 font-body text-sm text-slate-300">Continue the paths you have added to your dashboard.</p>
          </div>
          <Link href="/paths" className="font-body text-sm text-blue-300 hover:text-white">Browse paths →</Link>
        </header>

        {error && <p className="mt-5 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 font-body text-sm text-red-200">{error}</p>}
        <section className="mt-8">
          {loading && <p className="rounded-xl border border-slate-600 bg-[#0b0b0b] px-5 py-6 font-body text-sm text-slate-300">Loading your paths...</p>}
          {!loading && !enrolled.length && <div className="rounded-xl border border-dashed border-slate-600 bg-[#0b0b0b] px-5 py-8"><h2 className="font-display text-lg font-semibold">You haven&apos;t added any paths yet.</h2><Link href="/paths" className="mt-4 inline-block font-body text-sm text-blue-300 hover:text-white">Browse paths →</Link></div>}
          <div className="grid gap-6 lg:grid-cols-2">
            {enrolled.map(({ path, specialization, mode }) => <PathwayCard key={`${path.slug}-${specialization.slug}`} path={path} specialization={specialization} mode={mode} progress={progress} onModeSwitch={handleModeSwitch} onRemove={handleRemove} onLocked={setLockedStage} onResourceToggle={handleResourceToggle} />)}
          </div>
        </section>
      </div>
      {lockedStage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101522] p-6 shadow-2xl"><h2 className="font-display text-xl font-semibold">Stage locked</h2><p className="mt-3 font-body text-sm leading-6 text-slate-300">{lockedStage}</p><button type="button" onClick={() => setLockedStage(null)} className="mt-6 rounded-lg bg-amber px-4 py-2 font-body text-sm font-semibold text-ink">Close</button></div></div>}
    </main>
  );
}

async function getPathForSpec(specSlug: string) {
  const path = await getPath("cybersecurity");
  if (!path.specializations?.some((specialization) => specialization.slug === specSlug)) throw new Error("Path not found");
  return path;
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

  return <article className="rounded-2xl border border-slate-600 bg-[#0b0b0b] p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[0.15em] text-slate-400">{path.title} <span aria-hidden="true">›</span> {team?.label ?? "Team"}</p><Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-2 block font-display text-xl font-semibold text-white hover:text-blue-300">{specialization.title}</Link></div><div className="relative"><button type="button" aria-label="Path settings" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg px-2 py-1 text-lg text-slate-300 hover:bg-white/10">⋯</button>{menuOpen && <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-white/10 bg-[#101522] p-1 shadow-xl"><button type="button" onClick={() => { onModeSwitch(specialization.slug, mode); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm text-slate-200 hover:bg-white/10">Switch mode</button><button type="button" onClick={() => { onRemove(specialization.slug); setMenuOpen(false); }} className="block w-full rounded-lg px-3 py-2 text-left font-body text-sm text-red-300 hover:bg-white/10">Remove from dashboard</button></div>}</div></div><div className="mt-3 flex items-center justify-between gap-3"><span className="rounded-full border border-route/50 px-2 py-1 font-mono text-[10px] uppercase text-route">{mode === "staged" ? "staged" : "self-paced"}</span><span className="font-mono text-xs text-slate-300">{percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full bg-route" style={{ width: `${percent}%` }} /></div><div className="mt-6 space-y-3">{stages.map((stage, index) => { const complete = isComplete(stage); const unlocked = isUnlocked(index); const expanded = expandedStages.has(stage.id); return <section key={stage.id} className={`rounded-xl border ${unlocked ? "border-slate-600 bg-white/[0.03]" : "border-slate-700 bg-black/20"}`}><button type="button" onClick={() => { if (!unlocked) { onLocked("Complete the previous stage first"); return; } setExpandedStages((current) => { const next = new Set(current); next.has(stage.id) ? next.delete(stage.id) : next.add(stage.id); return next; }); }} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"><span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">Stage {index + 1}</span><span className="mt-1 block font-body text-sm text-white">{stage.title}</span></span><span className="flex items-center gap-2 font-mono text-xs">{complete ? <span className="text-emerald-300">✓ Complete</span> : !unlocked ? <span className="text-slate-500">🔒</span> : expanded ? <span className="text-slate-400">−</span> : <span className="text-slate-400">+</span>}</span></button>{!unlocked && <p className="px-4 pb-3 font-body text-xs text-slate-500">Complete Stage {index} to unlock</p>}{unlocked && expanded && <div className="border-t border-slate-700 px-4 py-3">{stage.topics.map((topic) => <div key={topic.id} className="mb-4 last:mb-0"><p className="font-body text-xs font-semibold text-slate-300">{topic.title}</p><div className="mt-2 space-y-2">{topic.resources.map((resource) => <ResourceRow key={resource.id} resource={resource} completed={completed.has(resource.id)} onToggle={(done) => onResourceToggle(path, specialization, stage, resource, done)} />)}</div></div>)}</div>}</section>; })}</div><Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-5 inline-block font-body text-sm text-blue-300 hover:text-white">Continue in canvas →</Link></article>;
+}
+
+function ResourceRow({ resource, completed, onToggle }: { resource: Resource; completed: boolean; onToggle: (completed: boolean) => void }) {
+  return <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-black/20 px-3 py-2"><input type="checkbox" checked={completed} onChange={(event) => onToggle(event.target.checked)} aria-label={`Mark ${resource.title ?? resource.type} complete`} className="h-4 w-4 accent-amber" /><span className={`min-w-0 flex-1 font-body text-sm ${completed ? "text-emerald-300 line-through" : "text-white"}`}>{resource.title ?? resource.type}</span><span className="rounded-full border border-slate-600 px-2 py-0.5 font-mono text-[9px] uppercase text-slate-400">{resource.type}</span><span className="rounded-full border border-slate-600 px-2 py-0.5 font-mono text-[9px] text-slate-400">{resource.is_free ? "Free" : "Paid"}</span>{resource.url && <a href={resource.url} target="_blank" rel="noreferrer" className="shrink-0 font-body text-xs text-blue-300 hover:text-white">Open ↗</a>}</div>;
+}
+
+function calculateStreak(progress: ProgressRow[]) {
+  const dates = [...new Set(progress.filter((row) => row.completed_at).map((row) => new Date(row.completed_at as string).toISOString().slice(0, 10)))].sort().reverse();
+  if (!dates.length) return 0;
+  const today = new Date();
+  const todayString = today.toISOString().slice(0, 10);
+  today.setDate(today.getDate() - 1);
+  const yesterdayString = today.toISOString().slice(0, 10);
+  if (dates[0] !== todayString && dates[0] !== yesterdayString) return 0;
+  let count = 1;
+  for (let index = 1; index < dates.length; index += 1) {
+    const expected = new Date(`${dates[index - 1]}T00:00:00Z`);
+    expected.setUTCDate(expected.getUTCDate() - 1);
+    if (dates[index] !== expected.toISOString().slice(0, 10)) break;
+    count += 1;
+  }
+  return count;
+}
