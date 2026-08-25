import type { Path } from "@/lib/types/path-tree";

// Works in both Server Components (API_URL) and Client Components
// (NEXT_PUBLIC_API_URL, which gets inlined into the browser bundle).
const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API_URL or NEXT_PUBLIC_API_URL environment variable");
}

const configuredApiUrl = apiUrl.replace(/\/+$/, "");
// Render is configured with the service origin, while Express mounts every
// route beneath /api. Keep URLs that already include /api valid as well.
const apiBaseUrl = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(path.replace(/^\/+/, ""), `${apiBaseUrl}/`).toString();
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `API request failed for ${url}: ${response.status} ${response.statusText}${
        detail ? ` — ${detail}` : ""
      }`,
    );
  }
  return response.json() as Promise<T>;
}

export async function getPath(slug: string): Promise<Path> {
  return apiClient<Path>(`/paths/${slug}`);
}

export async function getAllPaths(): Promise<Path[]> {
  return apiClient<Path[]>(`/paths`);
}

export async function getSpecialization(pathSlug: string, specSlug: string) {
  return apiClient<import("@/lib/types/path-tree").Specialization>(
    `/paths/${pathSlug}/specializations/${specSlug}`
  );
}
