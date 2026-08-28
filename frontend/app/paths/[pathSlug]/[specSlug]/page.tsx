"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ROADMAPS, type RoadmapStage, type RoadmapResource } from "@/lib/constants/roadmaps";
import { getProgressForSpec, setResourceComplete } from "@/lib/supabase/progress";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { createClient } from "@/lib/supabase/client";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import ConfirmModal from "@/components/paths/ConfirmModal";
import { markPathwayVisited } from "@/lib/supabase/pathActivity";

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
  const roadmap = ROADMAPS[params.specSlug];

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

    if (!roadmap) return;

    getProgressForSpec(params.specSlug).then(setCompleted);
    getLearningMode(params.specSlug).then((m) => {
      setMode(m);
      setModeLoaded(true);
    });
  }, [params.specSlug, roadmap]);

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

  if (!roadmap) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <p className="font-mono text-xs tracking-[0.15em] text-zinc-400">ROADMAP</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-white">Coming soon</h1>
        <p className="mt-2 max-w-sm font-body text-sm text-zinc-400">
          This specialization&apos;s staged roadmap isn&apos;t built out yet.
        </p>
        <Link href="/paths" className="mt-6 font-body text-sm text-blue-300 hover:text-white">
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
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-body text-sm text-blue-300 hover:text-white"
        >
          ← Back to previous page
        </button>

        <p className="mt-4 font-mono text-xs tracking-[0.15em] text-zinc-400">{roadmap.pathSlug.toUpperCase()}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-white">{roadmap.title}</h1>
          {loggedIn && mode && (
            <button
              type="button"
              onClick={() => setMode(null)}
              className="rounded-full border border-zinc-700 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-zinc-400 hover:border-blue-400 hover:text-blue-300"
            >
              MODE: {mode === "staged" ? "STAGED" : "SELF-PACED"} · CHANGE
            </button>
          )}
        </div>

        {loggedIn === false && (
          <p className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-body text-sm text-zinc-300">
            <Link href={`/login?next=/paths/${params.pathSlug}/${params.specSlug}`} className="underline">
              Log in
            </Link>{" "}
            to track your progress and unlock staged mode.
          </p>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between font-body text-xs text-zinc-400">
            <span>
              {doneStages} of {totalStages} stages complete
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-route transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-zinc-800" role="tablist" aria-label="Roadmap levels">
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
                className={`relative shrink-0 px-3 pb-3 font-body text-sm transition-colors ${selectedLevel === level ? "font-medium text-white" : "text-white/70 hover:text-white"}`}
              >
                {LEVEL_LABELS[level]}
                {levelComplete && <span className="ml-2 text-blue-300" aria-label="complete">✓</span>}
                {selectedLevel === level && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400" />}
              </button>
            );
          })}
        </div>

        {effectiveMode === "staged" && firstIncompleteStage && (
          <p className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-body text-sm text-zinc-300">
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
                    ? "border-zinc-300 bg-zinc-100 opacity-60"
                    : "border-zinc-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] ${
                      stageComplete
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-zinc-300"
                    }`}
                  >
                    {stageComplete ? "✓" : locked ? "🔒" : ""}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] text-zinc-500">{LEVEL_LABELS[selectedLevel].toUpperCase()} · STAGE {index + 1}</p>
                    <h3
                      className={`mt-0.5 font-display text-base font-medium ${
                        stageComplete
                          ? "text-blue-600 line-through"
                          : "text-zinc-900"
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {locked ? (
                      <p className="mt-2 font-body text-xs text-zinc-600">
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
                                  isDone ? "text-blue-600 line-through" : "text-blue-600 hover:text-blue-800"
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
                                      ? "bg-blue-700 text-white hover:bg-blue-600"
                                      : "bg-blue-700 text-white hover:bg-blue-600"
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
