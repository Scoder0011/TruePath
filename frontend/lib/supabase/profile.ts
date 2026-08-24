import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateProfile(updates: Partial<Pick<Profile, "display_name" | "avatar_url">>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) throw error;
}

// Uploads to avatars/{userId}/avatar.{ext} — always the same filename per
// user, so re-uploading replaces the old picture instead of piling up
// orphaned files in storage.
export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  // Cache-bust so the new image shows immediately instead of a stale
  // browser-cached version at the same URL.
  const bustedUrl = `${publicUrl}?t=${Date.now()}`;
  await updateProfile({ avatar_url: bustedUrl });

  return bustedUrl;
}
