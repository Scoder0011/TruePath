import type { Path } from "@/lib/types/path-tree";

// Works in both Server Components (API_URL) and Client Components
// (NEXT_PUBLIC_API_URL, which gets inlined into the browser bundle).
const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API_URL or NEXT_PUBLIC_API_URL environment variable");
}

const apiBaseUrl = apiUrl.replace(/\/+$/, "");

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
