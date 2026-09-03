// PLACEHOLDER CONTENT — this is stand-in data so the roadmap/progress
// mechanism has something real to work against. Replace with actual
// staged content from database/seeds/cybersecurity.sql once that's
// fleshed out, ideally fetched from the backend instead of hardcoded
// here. Only "penetration-testing" is filled in; any other specSlug
// falls through to the "coming soon" state on the roadmap page.

export type RoadmapResource = { id: string; name: string; url: string };
export type RoadmapStage = { id: string; title: string; resources: RoadmapResource[] };
export type Roadmap = { title: string; pathSlug: string; stages: RoadmapStage[] };

// The backend is the source of truth. These types mirror its nested path
// response while the compact Roadmap types above remain as an offline/API
// fallback for the existing dashboard and specialization page.
export type RoadmapTreeResource = {
  id: string;
  title: string | null;
  url: string | null;
  type: string;
  is_free: boolean;
  order_index: number;
};

export type RoadmapTreeTopic = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order_index: number;
  resources: RoadmapTreeResource[];
};

export type RoadmapTreeStage = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  order_index: number;
  topics: RoadmapTreeTopic[];
  notes?: Array<{ id: string; content: string; after_topic_slug: string | null; order_index: number }>;
};

export type RoadmapTreeSpecialization = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  prerequisites?: string | null;
  duration?: string | null;
  career_outcomes?: string | null;
  order_index: number;
  stages: RoadmapTreeStage[];
};
