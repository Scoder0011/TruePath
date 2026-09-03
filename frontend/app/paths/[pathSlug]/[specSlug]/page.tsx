"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { type Roadmap, type RoadmapStage, type RoadmapResource } from "@/lib/constants/roadmaps";
import { getProgressForSpec, setResourceComplete } from "@/lib/supabase/progress";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { createClient } from "@/lib/supabase/client";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import ConfirmModal from "@/components/paths/ConfirmModal";
import { markPathwayVisited } from "@/lib/supabase/pathActivity";
import { getPath } from "@/lib/api/client";

const LEVELS = ["fundamentals", "intermediate", "expert"] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_LABELS: Record<Level, string> = {
  fundamentals: "Fundamentals",
  intermediate: "Intermediate",
  expert: "Expert",
};

function isStageComplete(stage: RoadmapStage, completed: Set<string>): boolean {
  return stage.resources.length > 0 && stage.resources.every((r) => completed.has(r.id));
}

function getStageLevel(index: number, total: number): Level {
  if (index < Math.ceil(total / 3)) return "fundamentals";
  if (index < Math.ceil((total * 2) / 3)) return "intermediate";
  return "expert";
}

export default function RoadmapPage() {
  const params = useParams<{ pathSlug: string; specSlug: string }>();
  const router = useRouter();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<LearningMode | null>(null);
  const [modeLoaded, setModeLoaded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level>("fundamentals");
  const [pendingResource, setPendingResource] = useState<{ stage: RoadmapStage; resource: RoadmapResource } | null>(
    null
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    markPathwayVisited(params.pathSlug, params.specSlug);

    getPath(params.pathSlug)
      .then((pathData) => {
        const spec = pathData.specializations.find((s: any) => s.slug === params.specSlug);
        if (spec && spec.stages && spec.stages.length > 0) {
          const fetchedRoadmap: Roadmap = {
            title: spec.title,
            pathSlug: params.pathSlug,
            stages: spec.stages.map((stage: any) => ({
              id: stage.slug,
              title: stage.title,
              resources: stage.topics.flatMap((t: any) => t.resources).map((r: any) => ({
                id: r.id,
                name: r.title,
                url: r.url
              }))
            }))
          };
          setRoadmap(fetchedRoadmap);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    getProgressForSpec(params.specSlug).then(setCompleted);
    getLearningMode(params.specSlug).then((m) => {
      setMode(m);
      setModeLoaded(true);
    });
  }, [params.pathSlug, params.specSlug]);

  async function handleModeSelect(newMode: LearningMode) {
    setMode(newMode); // optimistic, so the modal closes immediately
    try {
      await setLearningMode(params.specSlug, newMode);
    } catch {
      // If saving fails, the modal simply won't reappear until reload --
      // acceptable for now, worth revisiting with a toast if it recurs.
    }
  }

  function requestComplete(stage: RoadmapStage, resource: RoadmapResource) {
    setPendingResource({ stage, resource });
  }

  async function confirmComplete() {
    if (!pendingResource) return;
    const { stage, resource } = pendingResource;
    setPendingResource(null);
    setSavingId(resource.id);

    setCompleted((prev) => new Set(prev).add(resource.id)); // optimistic
    try {
      await setResourceComplete(params.pathSlug, params.specSlug, stage.id, resource.id, true);
    } catch {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.delete(resource.id);
        return next;
      });
    } finally {
      setSavingId(null);
    }
  }

  async function unmarkComplete(stage: RoadmapStage, resource: RoadmapResource) {
    setSavingId(resource.id);
    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(resource.id);
      return next;
    }); // optimistic
    try {
      await setResourceComplete(params.pathSlug, params.specSlug, stage.id, resource.id, false);
    } catch {
      setCompleted((prev) => new Set(prev).add(resource.id));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-ink-deep px-6 text-center">
        <p className="font-mono text-xs tracking-[0.15em] text-gray-500 dark:text-ink-soft">ROADMAP</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">Loading...</h1>
      </main>
    );
  }

  if (!roadmap) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-ink-deep px-6 text-center">
        <p className="font-mono text-xs tracking-[0.15em] text-gray-500 dark:text-ink-soft">ROADMAP</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">Coming soon</h1>
        <p className="mt-2 max-w-sm font-body text-sm text-gray-500 dark:text-ink-soft">
          This specialization&apos;s staged roadmap isn&apos;t built out yet.
        </p>
        <Link href="/paths" className="mt-6 font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white">
          ← Back to paths
        </Link>
      </main>
    );
  }

  const totalStages = roadmap.stages.length;
  const doneStages = roadmap.stages.filter((s) => isStageComplete(s, completed)).length;
  const pct = Math.round((doneStages / totalStages) * 100);

  // Only "staged" mode locks anything. Logged-out visitors and
  // self-paced users always see every stage unlocked.
  const effectiveMode: LearningMode = loggedIn && mode ? mode : "self_paced";

  const stagesByLevel = LEVELS.reduce<Record<Level, Array<{ stage: RoadmapStage; index: number }>>>((groups, level) => {
    groups[level] = roadmap.stages
      .map((stage, index) => ({ stage, index }))
      .filter(({ index }) => getStageLevel(index, roadmap.stages.length) === level);
    return groups;
  }, { fundamentals: [], intermediate: [], expert: [] });

  const selectedStages = stagesByLevel[selectedLevel];
  const firstIncompleteStage = selectedStages.find(({ stage }) => !isStageComplete(stage, completed)) ?? selectedStages[0];
  const visibleStages = effectiveMode === "staged" && firstIncompleteStage ? [firstIncompleteStage] : selectedStages;

  function isStageLocked(index: number): boolean {
    if (effectiveMode !== "staged") return false;
    return index !== firstIncompleteStage?.index;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-ink-deep px-6 py-12 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white"
        >
          ← Back to previous page
        </button>

        <p className="mt-4 font-mono text-xs tracking-[0.15em] text-gray-500 dark:text-ink-soft">{roadmap.pathSlug.toUpperCase()}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">{roadmap.title}</h1>
          {loggedIn && mode && (
            <button
              type="button"
              onClick={() => setMode(null)}
              className="rounded-full border border-gray-200 dark:border-white/10 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-gray-500 dark:text-ink-soft hover:border-amber hover:text-amber"
            >
              MODE: {mode === "staged" ? "STAGED" : "SELF-PACED"} · CHANGE
            </button>
          )}
        </div>

        {loggedIn === false && (
          <p className="mt-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 font-body text-sm text-gray-600 dark:text-ink-soft">
            <Link href={`/login?next=/paths/${params.pathSlug}/${params.specSlug}`} className="underline">
              Log in
            </Link>{" "}
            to track your progress and unlock staged mode.
          </p>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between font-body text-xs text-gray-500 dark:text-ink-soft">
            <span>
              {doneStages} of {totalStages} stages complete
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-route transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-white/10" role="tablist" aria-label="Roadmap levels">
          {LEVELS.map((level) => {
            const levelStages = stagesByLevel[level];
            const levelComplete = levelStages.length > 0 && levelStages.every(({ stage }) => isStageComplete(stage, completed));

            return (
              <button
                key={level}
                type="button"
                role="tab"
                aria-selected={selectedLevel === level}
                onClick={() => setSelectedLevel(level)}
                className={`relative shrink-0 px-3 pb-3 font-body text-sm transition-colors ${selectedLevel === level ? "font-medium text-gray-900 dark:text-white" : "text-gray-900/70 dark:text-white/70 hover:text-gray-900 dark:hover:text-white"}`}
              >
                {LEVEL_LABELS[level]}
                {levelComplete && <span className="ml-2 text-amber" aria-label="complete">✓</span>}
                {selectedLevel === level && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber" />}
              </button>
            );
          })}
        </div>

        {effectiveMode === "staged" && firstIncompleteStage && (
          <p className="mt-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 py-3 font-body text-sm text-gray-600 dark:text-ink-soft">
            Staged mode is showing your current {LEVEL_LABELS[selectedLevel].toLowerCase()} stage. Complete it to continue.
          </p>
        )}

        <div className="mt-8 space-y-3">
          {visibleStages.map(({ stage, index }) => {
            const stageComplete = isStageComplete(stage, completed);
            const locked = isStageLocked(index);

            return (
              <div
                key={stage.id}
                className={`rounded-xl border p-5 transition-opacity ${
                  locked
                    ? "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 opacity-60"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-ink-deep"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] ${
                      stageComplete
                        ? "border-amber bg-amber text-gray-900 dark:text-white"
                        : "border-gray-200 dark:border-white/10"
                    }`}
                  >
                    {stageComplete ? "✓" : locked ? "🔒" : ""}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] text-gray-500 dark:text-ink-soft">{LEVEL_LABELS[selectedLevel].toUpperCase()} · STAGE {index + 1}</p>
                    <h3
                      className={`mt-0.5 font-display text-base font-medium ${
                        stageComplete
                          ? "text-amber line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {locked ? (
                      <p className="mt-2 font-body text-xs text-gray-600 dark:text-ink-soft">
                        Complete the previous stage to unlock this one.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {stage.resources.map((resource) => {
                          const isDone = completed.has(resource.id);
                          const isSaving = savingId === resource.id;

                          return (
                            <li key={resource.id} className="flex items-center justify-between gap-3">
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`font-body text-sm hover:opacity-80 ${
                                  isDone ? "text-amber line-through" : "text-amber"
                                }`}
                              >
                                {resource.name} ↗
                              </a>

                              {loggedIn ? (
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    isDone ? unmarkComplete(stage, resource) : requestComplete(stage, resource)
                                  }
                                  className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.05em] transition-colors ${
                                    isDone
                                      ? "bg-amber text-gray-900 dark:text-white hover:opacity-80"
                                      : "bg-amber text-gray-900 dark:text-white hover:opacity-80"
                                  }`}
                                >
                                  {isDone ? "DONE ✓" : "MARK DONE"}
                                </button>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* First-visit mode picker -- only for logged-in users who haven't chosen yet */}
      {loggedIn && modeLoaded && mode === null && <ModeSelectModal onSelect={handleModeSelect} />}

      {pendingResource && (
        <ConfirmModal
          title="Mark this as done?"
          message={`Have you actually completed "${pendingResource.resource.name}"? Only confirm if you've genuinely gone through it -- this path only works if your progress reflects reality.`}
          onConfirm={confirmComplete}
          onCancel={() => setPendingResource(null)}
        />
      )}
    </main>
  );
}
