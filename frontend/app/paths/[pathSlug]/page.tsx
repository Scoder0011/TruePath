"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CanvasTree from "@/components/path-tree/CanvasTree";
import { getPath } from "@/lib/api/client";
import { pathToTree, type Path, type TreeNode } from "@/lib/types/path-tree";

type SidebarCard = {
  title: string;
  description?: string | null;
  prerequisites?: string | null;
  duration?: string | null;
  career_outcomes?: string | null;
  resources?: Array<{
    title: string;
    url: string | null;
    type: string;
    isFree: boolean;
  }>;
  kind?: "path" | "specialization" | "stage" | "topic" | "resource";
  typeLabel?: string;
  url?: string | null;
};

function getDefaultPathInfo(pathData: Path): SidebarCard {
  const primarySpec =
    pathData.specializations.find(
      (specialization) => (specialization.stages ?? []).some((stage) => (stage.topics ?? []).length > 0),
    ) ?? pathData.specializations[0];

  return {
    title: pathData.title,
    description: pathData.description ?? "",
    prerequisites: primarySpec?.prerequisites ?? "No formal prerequisites listed yet.",
    duration: primarySpec?.duration ?? "Flexible",
    career_outcomes: primarySpec?.career_outcomes ?? "Career outcomes will be added soon.",
    kind: "path",
  };
}

function getNodeDetail(node: TreeNode, pathData: Path): SidebarCard | null {
  if (node.kind === "path") {
    return {
      title: pathData.title,
      description: pathData.description ?? "",
      kind: "path",
    };
  }

  if (node.kind === "specialization") {
    const specialization = pathData.specializations.find((item) => item.id === node.id);
    if (!specialization) return null;

    return {
      title: specialization.title,
      description: specialization.description ?? "",
      prerequisites: specialization.prerequisites ?? "No formal prerequisites listed yet.",
      duration: specialization.duration ?? "Flexible",
      career_outcomes: specialization.career_outcomes ?? "Career outcomes will be added soon.",
      kind: "specialization",
    };
  }

  if (node.kind === "stage") {
    const stage = pathData.specializations
      .flatMap((specialization) => specialization.stages ?? [])
      .find((item) => item.id === node.id);

    if (!stage) return null;

    return {
      title: stage.title,
      description: stage.description ?? "No stage overview yet.",
      kind: "stage",
    };
  }

  if (node.kind === "topic") {
    const topic = pathData.specializations
      .flatMap((specialization) => specialization.stages ?? [])
      .flatMap((stage) => stage.topics ?? [])
      .find((item) => item.id === node.id);

    if (!topic) return null;

    return {
      title: topic.title,
      description: topic.description ?? "No topic summary yet.",
      resources: (topic.resources ?? []).map((resource) => ({
        title: resource.title ?? resource.type,
        url: resource.url ?? null,
        type: resource.type,
        isFree: Boolean(resource.is_free),
      })),
      kind: "topic",
    };
  }

  if (node.kind === "resource") {
    const resource = pathData.specializations
      .flatMap((specialization) => specialization.stages ?? [])
      .flatMap((stage) => stage.topics ?? [])
      .flatMap((topic) => topic.resources ?? [])
      .find((item) => item.id === node.id);

    if (!resource) return null;

    return {
      title: resource.title ?? resource.type,
      description: resource.type,
      kind: "resource",
      typeLabel: resource.type,
      url: resource.url ?? null,
      resources: [
        {
          title: resource.title ?? resource.type,
          url: resource.url ?? null,
          type: resource.type,
          isFree: Boolean(resource.is_free),
        },
      ],
    };
  }

  return null;
}

export default function PathDetailPage({ params }: { params: { pathSlug: string } }) {
  const [path, setPath] = useState<Path | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getPath(params.pathSlug)
      .then((data) => {
        if (cancelled) return;
        setPath(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error(`Failed to load path "${params.pathSlug}"`, err);
        setError("Couldn't load this path right now. Please try again in a moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.pathSlug]);

  const defaultInfo = useMemo(() => (path ? getDefaultPathInfo(path) : null), [path]);
  const currentInfo = useMemo(() => {
    if (!path) return defaultInfo;
    if (!hoveredNode) return defaultInfo;
    return getNodeDetail(hoveredNode, path) ?? defaultInfo;
  }, [defaultInfo, hoveredNode, path]);

  const renderContent = (info: SidebarCard | null) => {
    if (!info) {
      return <p className="font-body text-sm text-gray-600 dark:text-ink-soft">No details available for this node.</p>;
    }

    return (
      <div className="space-y-5">
        {info.kind !== "topic" && info.kind !== "resource" && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
              {info.kind === "path" ? "OVERVIEW" : info.kind === "specialization" ? "DESCRIPTION" : "STAGE"}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">{info.title}</h2>
            {info.description && (
              <p className="mt-3 font-body text-sm leading-6 text-gray-600 dark:text-ink-soft">{info.description}</p>
            )}
          </div>
        )}

        {info.kind === "topic" && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">TOPIC</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">{info.title}</h2>
            {info.description && <p className="mt-3 font-body text-sm leading-6 text-gray-600 dark:text-ink-soft">{info.description}</p>}
          </div>
        )}

        {info.kind === "resource" && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">RESOURCE</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 dark:text-white">{info.title}</h2>
            {info.typeLabel && (
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-soft">
                  {info.typeLabel}
                </span>
                <span
                  className={[
                    "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                    info.resources?.[0]?.isFree
                      ? "bg-route/10 text-route"
                      : "border border-gray-200 bg-gray-100 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-ink-soft",
                  ].join(" ")}
                >
                  {info.resources?.[0]?.isFree ? "Free" : "Paid"}
                </span>
              </div>
            )}
            {info.url && (
              <a
                href={info.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
              >
                Open resource <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        )}

        {info.kind !== "resource" && info.kind !== "topic" && (
          <>
            {info.prerequisites && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">PREREQUISITES</p>
                <p className="mt-2 font-body text-sm leading-6 text-gray-600 dark:text-ink-soft">{info.prerequisites}</p>
              </div>
            )}

            {info.duration && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">DURATION</p>
                <p className="mt-2 font-body text-sm leading-6 text-gray-600 dark:text-ink-soft">{info.duration}</p>
              </div>
            )}

            {info.career_outcomes && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">CAREER OUTCOMES</p>
                <p className="mt-2 font-body text-sm leading-6 text-gray-600 dark:text-ink-soft">{info.career_outcomes}</p>
              </div>
            )}
          </>
        )}

        {info.kind === "topic" && info.resources && info.resources.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">RESOURCES</p>
            <div className="mt-3 space-y-3">
              {info.resources.map((resource) => (
                <a
                  key={`${resource.title}-${resource.type}-${resource.url ?? "local"}`}
                  href={resource.url ?? undefined}
                  target={resource.url ? "_blank" : undefined}
                  rel={resource.url ? "noreferrer" : undefined}
                  className="block rounded-xl border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-amber/70 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-body text-sm text-gray-900 dark:text-white">{resource.title}</span>
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-soft">
                      {resource.type}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-600 dark:text-ink-soft">
                      {resource.url ? "Open" : "No link"}
                    </span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                        resource.isFree ? "bg-route/10 text-route" : "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-ink-soft",
                      ].join(" ")}
                    >
                      {resource.isFree ? "Free" : "Paid"}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="h-screen overflow-hidden bg-white text-gray-900 dark:bg-ink-deep dark:text-white">
      <div className="relative flex h-screen flex-col md:flex-row">
        <button
          type="button"
          onClick={() => setSidebarOpen((current) => !current)}
          className="absolute left-4 top-4 z-20 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-soft md:hidden"
        >
          {sidebarOpen ? "Hide info" : "Path info"}
        </button>

        <aside
          className={[
            "z-10 h-full w-full border-r border-gray-200 bg-gray-50/80 backdrop-blur-xl md:w-[280px] md:shrink-0 dark:border-white/10 dark:bg-white/5",
            sidebarOpen ? "absolute inset-y-0 left-0 flex" : "hidden md:flex",
          ].join(" ")}
        >
          <div className="flex min-h-0 w-full flex-col">
            <div className="px-4 pb-3 pt-4">
              <Link href="/paths" className="font-mono text-xs text-gray-600 transition-opacity hover:opacity-80 dark:text-ink-soft">
                ← Back to all paths
              </Link>

              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">CAREER PATH</p>
                <h1 className="mt-2 font-display text-2xl font-bold text-gray-900 dark:text-white">
                  {path?.title ?? "Loading..."}
                </h1>
              </div>

              <div className="mt-4 border-t border-gray-200 dark:border-white/10" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {loading && (
                <div className="flex min-h-[220px] items-center justify-center">
                  <p className="font-mono text-sm text-gray-600 dark:text-ink-soft">Loading path details…</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex min-h-[220px] items-center justify-center text-center">
                  <p className="font-body text-sm text-red-400">{error}</p>
                </div>
              )}

              {!loading && !error && currentInfo && renderContent(currentInfo)}
            </div>
          </div>
        </aside>

        <div className="relative h-screen flex-1 overflow-hidden">
          {loading && (
            <div className="flex h-full items-center justify-center border-l border-gray-200 bg-gray-100/80 dark:border-white/10 dark:bg-ink-deep/70">
              <p className="font-mono text-sm text-gray-600 dark:text-ink-soft">Loading path timeline…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full items-center justify-center border-l border-gray-200 bg-gray-100/80 dark:border-white/10 dark:bg-ink-deep/70">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && path && (
            <CanvasTree root={pathToTree(path)} onNodeHover={setHoveredNode} />
          )}
        </div>
      </div>
    </main>
  );
}
