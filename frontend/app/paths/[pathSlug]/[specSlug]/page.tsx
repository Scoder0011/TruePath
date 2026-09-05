"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CanvasTree from "@/components/path-tree/CanvasTree";
import ModeSelectModal from "@/components/paths/ModeSelectModal";
import { getSpecialization } from "@/lib/api/client";
import { createClient } from "@/lib/supabase/client";
import { getLearningMode, setLearningMode, type LearningMode } from "@/lib/supabase/learningMode";
import { markPathwayVisited } from "@/lib/supabase/pathActivity";
import type { Specialization, TreeNode } from "@/lib/types/path-tree";

type SidebarInfo = {
  title: string;
  kind: TreeNode["kind"];
  description?: string | null;
  prerequisites?: string | null;
  duration?: string | null;
  careerOutcomes?: string | null;
};

function specializationToTree(specialization: Specialization, pathSlug: string): TreeNode {
  return {
    id: specialization.id,
    label: specialization.title,
    kind: "specialization",
    children: (specialization.stages ?? []).sort((a, b) => a.order_index - b.order_index).map((stage) => ({
      id: stage.id,
      label: stage.title,
      kind: "stage",
      children: (stage.topics ?? []).sort((a, b) => a.order_index - b.order_index).map((topic) => ({
        id: topic.id,
        label: topic.title,
        kind: "topic",
        children: (topic.resources ?? []).sort((a, b) => a.order_index - b.order_index).map((resource) => ({
          id: resource.id,
          label: resource.title ?? resource.type,
          kind: "resource",
          url: resource.url ?? undefined,
          progress: { pathSlug, specSlug: specialization.slug, stageId: stage.id, resourceId: resource.id },
        })),
      })),
    })),
  };
}

function getSidebarInfo(specialization: Specialization, node: TreeNode | null): SidebarInfo {
  const base = {
    description: specialization.description ?? "",
    prerequisites: specialization.prerequisites ?? "No formal prerequisites listed yet.",
    duration: specialization.duration ?? "Flexible",
    careerOutcomes: specialization.career_outcomes ?? "Career outcomes will be added soon.",
  };
  if (!node || node.kind === "specialization") return { title: specialization.title, kind: "specialization", ...base };
  if (node.kind === "stage") {
    const stage = specialization.stages.find((item) => item.id === node.id);
    return { title: stage?.title ?? node.label, kind: "stage", description: stage?.description ?? "No stage overview yet." };
  }
  const topic = specialization.stages.flatMap((stage) => stage.topics).find((item) => item.id === node.id);
  if (topic) return { title: topic.title, kind: "topic", description: topic.description ?? "No topic summary yet." };
  const resource = specialization.stages.flatMap((stage) => stage.topics).flatMap((topicItem) => topicItem.resources).find((item) => item.id === node.id);
  return { title: resource?.title ?? node.label, kind: "resource", description: resource?.type ?? "Resource" };
}

export default function SpecializationPage() {
  const params = useParams<{ pathSlug: string; specSlug: string }>();
  const router = useRouter();
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState<LearningMode | null>(null);
  const [showModeModal, setShowModeModal] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => { if (!cancelled) setLoggedIn(Boolean(data.user)); });
    getLearningMode(params.specSlug).then((savedMode) => { if (!cancelled) setMode(savedMode); });
    markPathwayVisited(params.pathSlug, params.specSlug);
    getSpecialization(params.pathSlug, params.specSlug)
      .then((data) => { if (!cancelled) setSpecialization(data); })
      .catch(() => { if (!cancelled) setError("This specialization could not be loaded."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params.pathSlug, params.specSlug]);

  const tree = useMemo(() => specialization ? specializationToTree(specialization, params.pathSlug) : null, [specialization, params.pathSlug]);
  const sidebarInfo = useMemo(() => specialization ? getSidebarInfo(specialization, hoveredNode) : null, [specialization, hoveredNode]);

  async function handleModeSelect(newMode: LearningMode) {
    try {
      await setLearningMode(params.specSlug, newMode);
      setMode(newMode);
      setShowModeModal(false);
    } catch {
      setError("Your learning mode could not be saved. Please try again.");
    }
  }

  function handleDashboardAction() {
    if (mode) return router.push("/dashboard");
    if (!loggedIn) return router.push(`/login?next=/paths/${params.pathSlug}/${params.specSlug}`);
    setShowModeModal(true);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f7f7f5] text-zinc-900">
      <div className="relative flex h-screen flex-col md:flex-row">
        <aside className="z-10 flex h-full w-full shrink-0 flex-col overflow-y-auto border-r border-zinc-200 bg-[#f5f5f4] md:w-[300px]">
          <div className="border-b border-zinc-200 px-5 pb-4 pt-5">
            <Link href="/paths" className="font-mono text-xs text-zinc-600 hover:text-zinc-900">← Back to all paths</Link>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-route">CYBERSECURITY PATH</p><h1 className="mt-2 font-display text-2xl font-bold text-zinc-900">{specialization?.title ?? "Loading..."}</h1></div>
            </div>
          </div>
          <div className="flex-1 px-5 py-6">
            {loading && <p className="font-mono text-sm text-zinc-600">Loading specialization...</p>}
            {!loading && error && <p className="font-body text-sm text-red-500">{error}</p>}
            {!loading && !error && sidebarInfo && <div className="space-y-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-route">{sidebarInfo.kind}</p><h2 className="mt-3 font-display text-xl font-bold text-zinc-900">{sidebarInfo.title}</h2>{sidebarInfo.description && <p className="mt-3 font-body text-sm leading-6 text-zinc-600">{sidebarInfo.description}</p>}</div>{sidebarInfo.kind === "specialization" && <><InfoBlock label="PREREQUISITES" value={sidebarInfo.prerequisites} /><InfoBlock label="DURATION" value={sidebarInfo.duration} /><InfoBlock label="CAREER OUTCOMES" value={sidebarInfo.careerOutcomes} /></>}</div>}
          </div>
        </aside>
        <section className="relative h-full flex-1 touch-none overflow-hidden">
          <button type="button" onClick={handleDashboardAction} className="absolute right-5 top-5 z-20 rounded-xl bg-amber px-4 py-2.5 font-body text-sm font-semibold text-ink shadow-lg hover:opacity-90">{mode ? "Continue in Dashboard →" : "Add to Dashboard"}</button>
          {loading && <div className="flex h-full items-center justify-center bg-zinc-100/80"><p className="font-mono text-sm text-zinc-600">Loading canvas...</p></div>}
          {!loading && error && <div className="flex h-full items-center justify-center bg-zinc-100/80"><p className="font-body text-sm text-red-500">{error}</p></div>}
          {!loading && !error && tree && <CanvasTree root={tree} onNodeHover={setHoveredNode} />}
        </section>
      </div>
      {showModeModal && <ModeSelectModal onSelect={handleModeSelect} />}
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-route">{label}</p><p className="mt-2 font-body text-sm leading-6 text-zinc-600">{value}</p></div>;
}
