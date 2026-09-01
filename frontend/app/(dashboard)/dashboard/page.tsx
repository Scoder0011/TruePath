import { createClient } from "@/lib/supabase/server";
import DashboardWorkspace from "@/components/dashboard/DashboardWorkspace";

type ProgressRow = {
  path_slug: string | null;
  spec_slug: string;
  stage_id: string;
  resource_id: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawRows } = await supabase
    .from("user_progress")
    .select("path_slug, spec_slug, stage_id, resource_id")
    .eq("user_id", user!.id as string);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id as string)
    .single();

  const greetingName = profile?.display_name || user?.email?.split("@")[0] || "there";

  return (
    <DashboardWorkspace userName={greetingName} initialProgress={(rawRows ?? []) as ProgressRow[]} />
  );
}
