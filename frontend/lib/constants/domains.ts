export type Domain = {
  slug: string;
  name: string;
  available: boolean;
};

// Only Cybersecurity has real backend data right now. Add new domains
// here as they're built — the UI already renders "coming soon" for any
// entry with available: false, no other code changes needed.
export const DOMAINS: Domain[] = [
  { slug: "cybersecurity", name: "Cybersecurity", available: true },
  { slug: "ai-ml", name: "AI / ML", available: false },
  { slug: "data-science", name: "Data Science", available: false },
  { slug: "web-development", name: "Web Development", available: false },
];
