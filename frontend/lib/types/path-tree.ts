// Mirrors the shapes described in shared/types/paths.ts (README).
// Once the shared/ workspace package exists, delete this file and import
// from "@truepath/shared" (or whatever the package gets named) instead —
// keeping one copy of these types is the whole point of the shared folder.

export type Resource = {
  id: string;
  name: string;
  url: string;
  type?: string; // e.g. "video", "article", "lab", "course"
};

export type Stage = {
  id: string;
  name: string;
  resources: Resource[];
};

export type SubPath = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  stages: Stage[];
};

export type Path = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  subPaths: SubPath[];
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
    label: path.name,
    kind: "path",
    children: path.subPaths.map((sp) => ({
      id: sp.id,
      label: sp.name,
      kind: "subPath",
      children: sp.stages.map((stage) => ({
        id: stage.id,
        label: stage.name,
        kind: "stage",
        children: stage.resources.map((r) => ({
          id: r.id,
          label: r.name,
          kind: "resource",
          url: r.url,
        })),
      })),
    })),
  };
}
