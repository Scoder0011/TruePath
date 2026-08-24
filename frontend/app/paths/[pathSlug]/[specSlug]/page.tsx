"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ROADMAPS, type RoadmapStage, type RoadmapResource } from "@/lib/constants/roadmaps";
import { getProgressForSpec, setResourceComplete } from "@/lib/supabase/progress";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { createClient } from "@/lib/supabase/client";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import ConfirmModal from "@/components/paths/ConfirmModal";

function isStageComplete(stage: RoadmapStage, completed: Set<string>): boolean {
  return stage.resources.length > 0 && stage.resources.every((r) => completed.has(r.id));
}

export default function RoadmapPage() {
  const params = useParams<{ pathSlug: string; specSlug: string }>();
  const roadmap = ROADMAPS[params.specSlug];

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<LearningMode | null>(null);
  const [modeLoaded, setModeLoaded] = useState(false);
  const [pendingResource, setPendingResource] = useState<{ stage: RoadmapStage; resource: RoadmapResource } | null>(
    null
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center dark:bg-ink-deep">
        <p className="font-mono text-xs tracking-[0.15em] text-amber">ROADMAP</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">Coming soon</h1>
        <p className="mt-2 max-w-sm font-body text-sm text-gray-600 dark:text-ink-soft">
          This specialization&apos;s staged roadmap isn&apos;t built out yet.
        </p>
        <Link href="/paths" className="mt-6 font-body text-sm text-amber hover:opacity-80">
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

  function isStageLocked(index: number): boolean {
    if (effectiveMode !== "staged") return false;
    if (index === 0) return false; // first stage is always open
    return !isStageComplete(roadmap.stages[index - 1], completed);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 dark:bg-ink-deep">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/paths"
          className="font-body text-sm text-gray-500 hover:text-gray-900 dark:text-ink-soft dark:hover:text-white"
        >
          ← Back to paths
        </Link>

        <p className="mt-4 font-mono text-xs tracking-[0.15em] text-amber">{roadmap.pathSlug.toUpperCase()}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">{roadmap.title}</h1>
          {loggedIn && mode && (
            <button
              type="button"
              onClick={() => setMode(null)}
              className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-gray-500 hover:border-amber hover:text-amber dark:border-white/10 dark:text-ink-soft"
            >
              MODE: {mode === "staged" ? "STAGED" : "SELF-PACED"} · CHANGE
            </button>
          )}
        </div>

        {loggedIn === false && (
          <p className="mt-4 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 font-body text-sm text-amber">
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

        <div className="mt-8 space-y-3">
          {roadmap.stages.map((stage, i) => {
            const stageComplete = isStageComplete(stage, completed);
            const locked = isStageLocked(i);

            return (
              <div
                key={stage.id}
                className={`rounded-xl border p-5 transition-opacity ${
                  locked
                    ? "border-gray-200 bg-gray-50/60 opacity-60 dark:border-white/10 dark:bg-white/[0.02]"
                    : "border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] ${
                      stageComplete
                        ? "border-route bg-route text-white"
                        : "border-gray-300 dark:border-white/20"
                    }`}
                  >
                    {stageComplete ? "✓" : locked ? "🔒" : ""}
                  </span>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] text-gray-400 dark:text-ink-soft">STAGE {i + 1}</p>
                    <h3
                      className={`mt-0.5 font-display text-base font-medium ${
                        stageComplete
                          ? "text-gray-400 line-through dark:text-ink-soft"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {locked ? (
                      <p className="mt-2 font-body text-xs text-gray-500 dark:text-ink-soft">
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
                                  isDone ? "text-gray-400 line-through dark:text-ink-soft" : "text-amber"
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
                                      ? "bg-route/10 text-route hover:bg-route/20"
                                      : "border border-gray-300 text-gray-500 hover:border-amber hover:text-amber dark:border-white/15 dark:text-ink-soft"
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
