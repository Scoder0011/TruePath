import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROADMAPS } from "@/lib/constants/roadmaps";

type ProgressRow = {
  spec_slug: string;
  resource_id: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("spec_slug, resource_id")
    .eq("user_id", user!.id)
    .returns<ProgressRow[]>();

  // Group completed resource ids by specialization, then compute how
  // many whole STAGES are done (all resources in that stage present)
  // rather than a raw resource count -- matches how the roadmap page
  // itself defines "stage complete".
  const completedResourcesBySpec = new Map<string, Set<string>>();
  (progressRows ?? []).forEach((row) => {
    if (!completedResourcesBySpec.has(row.spec_slug)) {
      completedResourcesBySpec.set(row.spec_slug, new Set());
    }
    completedResourcesBySpec.get(row.spec_slug)!.add(row.resource_id);
  });

  const entries = Object.entries(ROADMAPS).map(([slug, roadmap]) => {
    const completedResources = completedResourcesBySpec.get(slug) ?? new Set<string>();
    const doneStages = roadmap.stages.filter(
      (stage) =>
        stage.resources.length > 0 &&
        stage.resources.every((r) => completedResources.has(r.id))
    ).length;
    const total = roadmap.stages.length;
    return {
      slug,
      roadmap,
      done: doneStages,
      total,
      pct: total ? Math.round((doneStages / total) * 100) : 0,
    };
  });

  return (
    <main className="min-h-screen bg-white px-6 py-12 dark:bg-ink-deep">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.15em] text-amber">DASHBOARD</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-2 font-body text-sm text-gray-600 dark:text-ink-soft">
          Track your progress and pick up where you left off.
        </p>

        <div className="mt-10 space-y-4">
          {entries.map(({ slug, roadmap, done, total, pct }) => (
            <div
              key={slug}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.15em] text-route">
                    {roadmap.pathSlug.toUpperCase()}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-gray-900 dark:text-white">
                    {roadmap.title}
                  </h2>
                </div>
                <Link
                  href={`/paths/${roadmap.pathSlug}/${slug}`}
                  className="shrink-0 rounded-lg bg-amber px-4 py-2 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
                >
                  {done > 0 ? "Continue" : "Start"}
                </Link>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between font-body text-xs text-gray-500 dark:text-ink-soft">
                  <span>
                    {done} of {total} stages complete
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-route transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <p className="font-body text-sm text-gray-600 dark:text-ink-soft">
                You haven&apos;t started a path yet.
              </p>
              <Link
                href="/paths"
                className="mt-3 inline-block font-body text-sm text-amber hover:opacity-80"
              >
                Browse paths →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}