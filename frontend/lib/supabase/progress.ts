import { createClient } from "@/lib/supabase/client";

export type ProgressRow = { path_slug: string | null; spec_slug: string; stage_id: string; resource_id: string; completed_at?: string };

// Returns the set of resource ids the user has completed within one
// specialization. Stage-level "done" is derived from this on the
// frontend (a stage is done when all its resource ids are in this set),
// rather than stored as its own flag.
export async function getProgressForSpec(specSlug: string): Promise<Set<string>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("user_progress")
    .select("resource_id")
    .eq("user_id", user.id)
    .eq("spec_slug", specSlug);

  return new Set((data ?? []).map((row) => row.resource_id));
}

export async function getAllProgress(): Promise<ProgressRow[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_progress")
    .select("path_slug, spec_slug, stage_id, resource_id, completed_at")
    .eq("user_id", user.id);

  return data ?? [];
}

export async function setResourceComplete(
  pathSlug: string,
  specSlug: string,
  stageId: string,
  resourceId: string,
  completed: boolean
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  if (completed) {
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        path_slug: pathSlug,
        spec_slug: specSlug,
        stage_id: stageId,
        resource_id: resourceId,
      },
      { onConflict: "user_id,spec_slug,resource_id" }
    );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("spec_slug", specSlug)
      .eq("resource_id", resourceId);
    if (error) throw error;
  }
}
