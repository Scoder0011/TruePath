import { createClient } from "@/lib/supabase/server";
import DashboardWorkspace from "@/components/dashboard/DashboardWorkspace";
import { type LearningMode } from "@/lib/supabase/learningMode";

export type ProgressRow = {
  path_slug: string | null;
  spec_slug: string;
  stage_id: string;
  resource_id: string;
  completed_at?: string;
};

export type StartedMode = {
  spec_slug: string;
  mode: LearningMode;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawRows } = await supabase
    .from("user_progress")
    .select("path_slug, spec_slug, stage_id, resource_id, completed_at")
    .eq("user_id", user!.id as string);

  const { data: modes } = await supabase
    .from("user_learning_mode")
    .select("spec_slug, mode")
    .eq("user_id", user!.id as string);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id as string)
    .single();

  const greetingName = profile?.display_name || user?.email?.split("@")[0] || "there";

  return (
    <DashboardWorkspace
      userName={greetingName}
      initialProgress={(rawRows ?? []) as ProgressRow[]}
      startedModes={(modes ?? []) as StartedMode[]}
    />
  );
}
