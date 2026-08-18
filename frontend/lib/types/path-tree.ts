// Mirrors the new database schema:
// paths → specializations → stages → topics → resources
// Plus notes attached to stages.

export type Resource = {
  id: string;
  title: string | null;
  url: string | null;
  type: string;
  is_free: boolean;
  order_index: number;
};

export type Topic = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order_index: number;
  resources: Resource[];
};

export type Note = {
  id: string;
  content: string;
  after_topic_slug: string | null;
  order_index: number;
};

export type Stage = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order_index: number;
  topics: Topic[];
  notes: Note[];
};

export type Specialization = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  prerequisites?: string | null;
  duration?: string | null;
  career_outcomes?: string | null;
  order_index: number;
  stages: Stage[];
};

export type Path = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order_index: number;
  specializations: Specialization[];
};

// Generic tree node — CanvasTree only knows this shape,
// keeping it reusable across any path structure.
export type TreeNode = {
  id: string;
  label: string;
  kind: "path" | "specialization" | "stage" | "topic" | "resource";
  url?: string;
  children?: TreeNode[];
};

export function pathToTree(path: Path): TreeNode {
  return {
    id: path.id,
    label: path.title,
    kind: "path",
    children: (path.specializations ?? [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((spec) => ({
        id: spec.id,
        label: spec.title,
        kind: "specialization",
        children: (spec.stages ?? [])
          .sort((a, b) => a.order_index - b.order_index)
          .map((stage) => ({
            id: stage.id,
            label: stage.title,
            kind: "stage",
            children: (stage.topics ?? [])
              .sort((a, b) => a.order_index - b.order_index)
              .map((topic) => ({
                id: topic.id,
                label: topic.title,
                kind: "topic",
                children: (topic.resources ?? [])
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((r) => ({
                    id: r.id,
                    label: r.title ?? r.type,
                    kind: "resource",
                    url: r.url ?? undefined,
                  })),
              })),
          })),
      })),
  };
}