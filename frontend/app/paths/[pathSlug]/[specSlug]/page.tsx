"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { type Roadmap, type RoadmapStage, type RoadmapResource } from "@/lib/constants/roadmaps";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { createClient } from "@/lib/supabase/client";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import { markPathwayVisited } from "@/lib/supabase/pathActivity";
import { getPath } from "@/lib/api/client";

const LEVELS = ["fundamentals", "intermediate", "expert"] as const;
type Level = (typeof LEVELS)[number];

const LEVEL_LABELS: Record<Level, string> = {
  fundamentals: "Fundamentals",
  intermediate: "Intermediate",
  expert: "Expert",
};

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
  const [mode, setMode] = useState<LearningMode | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>("fundamentals");
  const [showModeModal, setShowModeModal] = useState(false);

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

    getLearningMode(params.specSlug).then((m) => {
      setMode(m);
    });
  }, [params.pathSlug, params.specSlug]);

  async function handleModeSelect(newMode: LearningMode) {
    try {
      await setLearningMode(params.specSlug, newMode);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    }
  }

  function handleStartClick() {
    if (mode) {
      router.push("/dashboard");
      return;
    }
    if (!loggedIn) {
      router.push(`/login?next=/paths/${params.pathSlug}/${params.specSlug}`);
      return;
    }
    setShowModeModal(true);
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

  const stagesByLevel = LEVELS.reduce<Record<Level, Array<{ stage: RoadmapStage; index: number }>>>((groups, level) => {
    groups[level] = roadmap.stages
      .map((stage, index) => ({ stage, index }))
      .filter(({ index }) => getStageLevel(index, roadmap.stages.length) === level);
    return groups;
  }, { fundamentals: [], intermediate: [], expert: [] });

  const selectedStages = stagesByLevel[selectedLevel];

  return (
    <main className="min-h-screen bg-white dark:bg-ink-deep px-6 py-12 text-gray-900 dark:text-white relative">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="font-body text-sm text-amber hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to previous page
            </button>
            <p className="mt-4 font-mono text-xs tracking-[0.15em] text-gray-500 dark:text-ink-soft">{roadmap.pathSlug.toUpperCase()}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 dark:text-white">{roadmap.title}</h1>
          </div>
          
          <button
            type="button"
            onClick={handleStartClick}
            className="sticky top-6 z-10 shrink-0 inline-flex items-center gap-2 rounded-xl bg-black dark:bg-white px-5 py-3 font-body text-sm font-medium text-white dark:text-black shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
          >
            {mode ? "Continue in Dashboard" : "Start this path"} <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-white/10" role="tablist" aria-label="Roadmap levels">
          {LEVELS.map((level) => {
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
                {selectedLevel === level && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          {selectedStages.map(({ stage, index }) => {
            return (
              <div
                key={stage.id}
                className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-ink-deep p-5 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-mono text-[10px] text-gray-500 dark:text-ink-soft">{LEVEL_LABELS[selectedLevel].toUpperCase()} · STAGE {index + 1}</p>
                    <h3 className="mt-0.5 font-display text-base font-medium text-gray-900 dark:text-white">
                      {stage.title}
                    </h3>
                    
                    <ul className="mt-3 space-y-2">
                      {stage.resources.map((resource) => (
                        <li key={resource.id} className="flex items-center justify-between gap-3">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-body text-sm text-amber hover:opacity-80"
                          >
                            {resource.name} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModeModal && <ModeSelectModal onSelect={handleModeSelect} />}
    </main>
  );
}
