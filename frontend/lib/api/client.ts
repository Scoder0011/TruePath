import type { Path } from "@/lib/types/path-tree";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, init);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

// Path-specific calls built on top of apiClient, so CanvasTree and the
// paths page don't need to know the raw endpoint URLs.
export async function getPath(slug: string): Promise<Path> {
  return apiClient<Path>(`/paths/${slug}`);
}

export async function getAllPaths(): Promise<Path[]> {
  return apiClient<Path[]>(`/paths`);
}