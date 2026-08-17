import type { Path } from "@/lib/types/path-tree";

// Works in both Server Components (API_URL) and Client Components
// (NEXT_PUBLIC_API_URL, which gets inlined into the browser bundle).
const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API_URL or NEXT_PUBLIC_API_URL environment variable");
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, init);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function getPath(slug: string): Promise<Path> {
  return apiClient<Path>(`/paths/${slug}`);
}

export async function getAllPaths(): Promise<Path[]> {
  return apiClient<Path[]>(`/paths`);
}