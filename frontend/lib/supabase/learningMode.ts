import { createClient } from "@/lib/supabase/client";

export type LearningMode = "self_paced" | "staged";

// Returns null when the user hasn't picked a mode for this specialization
// yet — that null is what triggers the ModeSelectModal to show up.
export async function getLearningMode(specSlug: string): Promise<LearningMode | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_learning_mode")
    .select("mode")
    .eq("user_id", user.id)
    .eq("spec_slug", specSlug)
    .maybeSingle();

  return (data?.mode as LearningMode) ?? null;
}

export async function setLearningMode(specSlug: string, mode: LearningMode) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("user_learning_mode")
    .upsert({ user_id: user.id, spec_slug: specSlug, mode }, { onConflict: "user_id,spec_slug" });
  if (error) throw error;
}
