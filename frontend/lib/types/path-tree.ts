// Mirrors the shapes described in shared/types/paths.ts (README).
// Once the shared/ workspace package exists, delete this file and import
// from "@truepath/shared" (or whatever the package gets named) instead —
// keeping one copy of these types is the whole point of the shared folder.

export type Resource = {
  id: string;
  title: string;
  url: string;
  type?: string; // e.g. "video", "article", "practice", "course"
};

export type Stage = {
  id: string;
  title: string;
  resources: Resource[];
};

export type SubPath = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  stages: Stage[];
};

export type Path = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  sub_paths: SubPath[];
};

// The tree component doesn't know about Path/SubPath/Stage/Resource
// specifically — it only knows about generic TreeNodes. This keeps
// CanvasTree reusable if a future path (e.g. Web Development) has a
// differently-shaped hierarchy.
export type TreeNode = {
  id: string;
  label: string;
  kind: "path" | "subPath" | "stage" | "resource";
  url?: string; // only resource nodes typically have this
  children?: TreeNode[];
};

export function pathToTree(path: Path): TreeNode {
  return {
    id: path.id,
    label: path.title,
    kind: "path",
    children: (path.sub_paths ?? []).map((sp) => ({
      id: sp.id,
      label: sp.title,
      kind: "subPath",
      children: (sp.stages ?? []).map((stage) => ({
        id: stage.id,
        label: stage.title,
        kind: "stage",
        children: (stage.resources ?? []).map((r) => ({
          id: r.id,
          label: r.title,
          kind: "resource",
          url: r.url,
        })),
      })),
    })),
  };
}
