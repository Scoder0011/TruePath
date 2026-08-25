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

export const ROADMAPS: Record<string, Roadmap> = {
  "penetration-testing": {
    title: "Penetration Testing",
    pathSlug: "cybersecurity",
    stages: [
      {
        id: "networking-fundamentals",
        title: "Networking Fundamentals",
        resources: [
          { id: "r1", name: "Professor Messer: Network+", url: "https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/" },
          { id: "r2", name: "TryHackMe: Network Fundamentals", url: "https://tryhackme.com/module/network-fundamentals" },
        ],
      },
      {
        id: "linux-fundamentals",
        title: "Linux Fundamentals",
        resources: [
          { id: "r3", name: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/" },
          { id: "r4", name: "TryHackMe: Linux Fundamentals", url: "https://tryhackme.com/module/linux-fundamentals" },
        ],
      },
      {
        id: "web-fundamentals",
        title: "Web Application Fundamentals",
        resources: [
          { id: "r5", name: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security" },
        ],
      },
      {
        id: "pentest-methodology",
        title: "Penetration Testing Methodology",
        resources: [
          { id: "r6", name: "PTES Technical Guidelines", url: "http://www.pentest-standard.org/index.php/PTES_Technical_Guidelines" },
        ],
      },
      {
        id: "certifications-and-practice",
        title: "Certifications & Practice",
        resources: [
          { id: "r7", name: "TryHackMe: Jr Penetration Tester Path", url: "https://tryhackme.com/path/outline/jrpenetrationtester" },
          { id: "r8", name: "HackTheBox Academy", url: "https://academy.hackthebox.com/" },
        ],
      },
    ],
  },
};
