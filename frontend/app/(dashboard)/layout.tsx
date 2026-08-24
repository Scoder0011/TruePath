import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Guards every page inside app/(dashboard)/ — dashboard and settings
// both sit behind this. Anyone not logged in gets bounced to /login,
// with ?next= so they land back here after signing in.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard");

  return <>{children}</>;
}
