"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAllPaths } from "@/lib/api/client";
import { getAllProgress, setResourceComplete } from "@/lib/supabase/progress";
import type { ProgressRow, StartedMode } from "@/app/(dashboard)/dashboard/page";
import type { Path, Specialization, Stage } from "@/lib/types/path-tree";
import { CYBERSECURITY_TREE } from "@/lib/constants/cybersecurityTeams";
import type { LearningMode } from "@/lib/supabase/learningMode";

type EnrolledPath = { path: Path; specialization: Specialization; mode: LearningMode };

type Props = { userName: string; initialProgress: ProgressRow[]; startedModes: StartedMode[] };

export default function DashboardWorkspace({ userName, initialProgress, startedModes }: Props) {
  const [paths, setPaths] = useState<Path[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>(initialProgress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockedStage, setLockedStage] = useState<{ title: string; previousTitle: string } | null>(null);

  useEffect(() => {
    Promise.all([getAllPaths(), getAllProgress()])
      .then(([allPaths, allProgress]) => {
        setPaths(allPaths);
        setProgress(allProgress as ProgressRow[]);
      })
      .catch(() => setError("Your learning paths could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const enrolled = useMemo<EnrolledPath[]>(() => {
    return startedModes.flatMap(({ spec_slug, mode }) => {
      for (const path of paths) {
        const specialization = path.specializations?.find((item) => item.slug === spec_slug);
        if (specialization) return [{ path, specialization, mode }];
      }
      return [];
    });
  }, [paths, startedModes]);

  const streak = useMemo(() => calculateStreak(progress), [progress]);

  async function markStageComplete(path: Path, specialization: Specialization, stage: Stage) {
    const resources = stage.topics.flatMap((topic) => topic.resources);
    if (!resources.length) return;
    const additions = resources.map((resource) => ({ path_slug: path.slug, spec_slug: specialization.slug, stage_id: stage.id, resource_id: resource.id, completed_at: new Date().toISOString() }));
    const previous = progress;
    setProgress((current) => [...current.filter((row) => !resources.some((resource) => row.resource_id === resource.id && row.spec_slug === specialization.slug)), ...additions]);
    try {
      await Promise.all(resources.map((resource) => setResourceComplete(path.slug, specialization.slug, stage.id, resource.id, true)));
    } catch {
      setProgress(previous);
      setError("Stage completion could not be saved. Please try again.");
    }
  }

  return (
    <main className="dashboard-shell min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><div className="flex items-center gap-3"><p className="font-mono text-sm tracking-[0.18em] text-emerald-200">YOUR LEARNING CONSOLE</p>{streak > 0 && <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 font-mono text-xs text-orange-400">{streak} day streak</span>}</div><h1 className="mt-2 font-display text-3xl font-bold">Welcome back, {userName}</h1><p className="mt-2 font-body text-sm text-slate-300">Continue the paths you have added to your dashboard.</p></div>
          <Link href="/paths" className="font-body text-sm text-blue-300 hover:text-white">Browse paths →</Link>
        </header>

        {error && <p className="mt-5 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 font-body text-sm text-red-200">{error}</p>}
        <section className="mt-8">
          {loading && <p className="rounded-xl border border-slate-600 bg-[#0b0b0b] px-5 py-6 font-body text-sm text-slate-300">Loading your paths...</p>}
          {!loading && !enrolled.length && <div className="rounded-xl border border-dashed border-slate-600 bg-[#0b0b0b] px-5 py-8"><h2 className="font-display text-lg font-semibold">You haven&apos;t added any paths yet.</h2><Link href="/paths" className="mt-4 inline-block font-body text-sm text-blue-300 hover:text-white">Browse paths →</Link></div>}
          <div className="grid gap-6 lg:grid-cols-2">{enrolled.map(({ path, specialization, mode }) => <PathwayCard key={`${path.slug}-${specialization.slug}`} path={path} specialization={specialization} mode={mode} progress={progress} onLocked={(stage, previous) => setLockedStage({ title: stage.title, previousTitle: previous.title })} onComplete={markStageComplete} />)}</div>
        </section>
      </div>
      {lockedStage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101522] p-6 shadow-2xl"><h2 className="font-display text-xl font-semibold">{lockedStage.title} is locked</h2><p className="mt-3 font-body text-sm leading-6 text-slate-300">Have you completed {lockedStage.previousTitle}? Mark it complete to unlock {lockedStage.title}.</p><button type="button" onClick={() => setLockedStage(null)} className="mt-6 rounded-lg bg-amber px-4 py-2 font-body text-sm font-semibold text-ink">Close</button></div></div>}
    </main>
  );
}

function PathwayCard({ path, specialization, mode, progress, onLocked, onComplete }: { path: Path; specialization: Specialization; mode: LearningMode; progress: ProgressRow[]; onLocked: (stage: Stage, previous: Stage) => void; onComplete: (path: Path, specialization: Specialization, stage: Stage) => void }) {
  const stages = specialization.stages ?? [];
  const completed = new Set(progress.filter((row) => row.spec_slug === specialization.slug).map((row) => row.resource_id));
  const allResources = stages.flatMap((stage) => stage.topics.flatMap((topic) => topic.resources));
  const percent = allResources.length ? Math.round((allResources.filter((resource) => completed.has(resource.id)).length / allResources.length) * 100) : 0;
  const team = CYBERSECURITY_TREE.find((item) => item.specializations.some((item) => item.slug === specialization.slug));

  function isComplete(stage: Stage) {
    const resources = stage.topics.flatMap((topic) => topic.resources);
    return resources.length > 0 && resources.every((resource) => completed.has(resource.id));
  }

  return <article className="rounded-2xl border border-slate-600 bg-[#0b0b0b] p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[0.15em] text-slate-400">{path.title} <span aria-hidden="true">›</span> {team?.label ?? "Team"}</p><Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-2 block font-display text-xl font-semibold text-white hover:text-blue-300">{specialization.title}</Link></div><span className="rounded-full border border-route/50 px-2 py-1 font-mono text-[10px] uppercase text-route">{mode.replace("_", "-")}</span></div><div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800"><div className="h-full bg-route" style={{ width: `${percent}%` }} /></div><span className="font-mono text-xs text-slate-300">{percent}%</span></div><div className="mt-6 space-y-3">{stages.map((stage, index) => { const complete = isComplete(stage); const previous = index > 0 ? stages[index - 1] : null; const unlocked = mode === "self_paced" || index === 0 || Boolean(previous && isComplete(previous)); return <div key={stage.id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${unlocked ? "border-slate-600 bg-white/[0.03]" : "border-slate-700 bg-black/20 opacity-70"}`}><button type="button" disabled={unlocked} onClick={() => previous && onLocked(stage, previous)} className="min-w-0 flex-1 text-left"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">Stage {index + 1}</p><p className="mt-1 truncate font-body text-sm text-white">{stage.title}</p></button>{complete ? <span className="font-mono text-xs text-emerald-300">Complete</span> : unlocked ? <button type="button" onClick={() => onComplete(path, specialization, stage)} className="shrink-0 rounded-lg border border-amber/50 px-3 py-1.5 font-body text-xs text-amber hover:bg-amber/10">Mark Stage Complete</button> : <span className="font-mono text-[10px] text-slate-500">Locked</span>}</div>; })}</div><Link href={`/paths/${path.slug}/${specialization.slug}`} className="mt-5 inline-block font-body text-sm text-blue-300 hover:text-white">Continue in canvas →</Link></article>;
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
