const VISITED_KEY = "truepath-visited-pathways";

export type VisitedPathway = { pathSlug: string; specSlug: string };

export function getVisitedPathways(): VisitedPathway[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(VISITED_KEY) ?? "[]") as VisitedPathway[];
  } catch {
    return [];
  }
}

export function markPathwayVisited(pathSlug: string, specSlug: string) {
  if (typeof window === "undefined") return;
  const current = getVisitedPathways();
  if (current.some((item) => item.pathSlug === pathSlug && item.specSlug === specSlug)) return;
  window.localStorage.setItem(VISITED_KEY, JSON.stringify([...current, { pathSlug, specSlug }]));
  window.dispatchEvent(new Event("truepath-pathway-visited"));
}