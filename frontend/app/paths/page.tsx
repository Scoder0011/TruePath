"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PathOption = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "active" | "coming_soon";
};

type SpecializationItem = {
  id: string;
  label: string;
  slug: string;
  status: "active" | "coming_soon";
  description: string;
  whoFor: string;
  duration: string;
};

type TeamNode = {
  id: string;
  label: string;
  description: string;
  icon: string;
  specializations: SpecializationItem[];
};

const PATHS: PathOption[] = [
  {
    id: "cybersecurity",
    slug: "cybersecurity",
    title: "Cybersecurity",
    description: "Learn to protect systems, networks, and data from digital attacks.",
    status: "active",
  },
  {
    id: "web-development",
    slug: "web-development",
    title: "Web Development",
    description: "Build full-stack web applications.",
    status: "coming_soon",
  },
  {
    id: "data-science",
    slug: "data-science",
    title: "Data Science",
    description: "Work with data, build models, and extract insights.",
    status: "coming_soon",
  },
  {
    id: "cloud-devops",
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    description: "Deploy and manage scalable infrastructure.",
    status: "coming_soon",
  },
];

const CYBERSECURITY_TREE: TeamNode[] = [
  {
    id: "red-team",
    label: "Red Team — Offensive",
    description: "Finding and exploiting weaknesses before real attackers do.",
    icon: "⚔️",
    specializations: [
      {
        id: "penetration-testing",
        label: "Penetration Testing",
        slug: "penetration-testing",
        status: "active",
        description:
          "Test systems, networks, and apps for exploitable vulnerabilities under a defined scope.",
        whoFor: "People who like breaking things methodically and writing reports.",
        duration: "10–15 months",
      },
      {
        id: "red-team-ops",
        label: "Red Team Operations",
        slug: "red-team-ops",
        status: "coming_soon",
        description: "Full adversary simulation campaigns mimicking real attacker TTPs.",
        whoFor: "Experienced pentesters ready to go beyond scoped assessments.",
        duration: "Advanced",
      },
      {
        id: "bug-bounty",
        label: "Bug Bounty Hunting",
        slug: "bug-bounty",
        status: "coming_soon",
        description: "Find vulnerabilities in real production systems for monetary rewards.",
        whoFor: "Self-directed learners who want flexible, outcome-based work.",
        duration: "Ongoing",
      },
      {
        id: "vuln-research",
        label: "Vulnerability Research & Exploit Dev",
        slug: "vuln-research",
        status: "coming_soon",
        description: "Discover new vulnerabilities and write working exploits.",
        whoFor: "People who like low-level systems, C/C++, and original research.",
        duration: "Advanced",
      },
      {
        id: "web-app-pentest",
        label: "Web App Pentesting",
        slug: "web-app-pentest",
        status: "coming_soon",
        description: "Specialize in finding and exploiting web application vulnerabilities.",
        whoFor: "People focused on web technologies and browser-based attack surfaces.",
        duration: "6–10 months",
      },
      {
        id: "mobile-security",
        label: "Mobile App Security Testing",
        slug: "mobile-security",
        status: "coming_soon",
        description: "Assess iOS and Android applications for security weaknesses.",
        whoFor: "People interested in mobile platforms and reverse engineering apps.",
        duration: "6–8 months",
      },
      {
        id: "network-infra-pentest",
        label: "Network & Infrastructure Pentesting",
        slug: "network-infra-pentest",
        status: "coming_soon",
        description: "Test internal and external network infrastructure for vulnerabilities.",
        whoFor: "People who like networking, protocols, and Active Directory attacks.",
        duration: "8–12 months",
      },
      {
        id: "social-engineering",
        label: "Social Engineering",
        slug: "social-engineering",
        status: "coming_soon",
        description: "Human-focused attacks — phishing campaigns, pretexting, physical security.",
        whoFor: "People with strong communication skills and interest in human psychology.",
        duration: "4–6 months",
      },
      {
        id: "hardware-iot",
        label: "Hardware / Embedded / IoT Hacking",
        slug: "hardware-iot",
        status: "coming_soon",
        description: "Attack physical devices, embedded systems, and IoT products.",
        whoFor: "People with electronics/hardware interest alongside software skills.",
        duration: "Advanced",
      },
      {
        id: "blockchain-security",
        label: "Blockchain / Smart Contract / Web3 Security",
        slug: "blockchain-security",
        status: "coming_soon",
        description: "Audit smart contracts and find vulnerabilities in Web3 protocols.",
        whoFor: "People with programming background interested in blockchain technology.",
        duration: "6–9 months",
      },
    ],
  },
  {
    id: "blue-team",
    label: "Blue Team — Defensive",
    description: "Detecting, responding to, and preventing attacks.",
    icon: "🛡️",
    specializations: [
      {
        id: "soc-analyst",
        label: "SOC Analyst",
        slug: "soc-analyst",
        status: "coming_soon",
        description: "Monitor alerts, triage incidents, and escalate threats in a Security Operations Center.",
        whoFor: "People who like investigation, pattern recognition, and working under pressure.",
        duration: "4–6 months",
      },
      {
        id: "incident-response",
        label: "Incident Response",
        slug: "incident-response",
        status: "coming_soon",
        description: "Contain and remediate active security breaches.",
        whoFor: "People who stay calm under pressure and like solving live problems fast.",
        duration: "6–9 months",
      },
      {
        id: "threat-hunting",
        label: "Threat Hunting",
        slug: "threat-hunting",
        status: "coming_soon",
        description: "Proactively search for threats that evaded automated detection.",
        whoFor: "Experienced defenders with strong analytical and hypothesis-driven thinking.",
        duration: "Advanced",
      },
      {
        id: "digital-forensics",
        label: "Digital Forensics",
        slug: "digital-forensics",
        status: "coming_soon",
        description: "Investigate security incidents by recovering and analyzing digital evidence.",
        whoFor: "Detail-oriented people who like piecing together what happened after an attack.",
        duration: "6–9 months",
      },
      {
        id: "malware-analysis",
        label: "Malware Analysis & Reverse Engineering",
        slug: "malware-analysis",
        status: "coming_soon",
        description: "Dissect malicious software to understand how it works and what it does.",
        whoFor: "People who like low-level code, assembly, and understanding attacker tools deeply.",
        duration: "Advanced",
      },
      {
        id: "detection-engineering",
        label: "Detection Engineering",
        slug: "detection-engineering",
        status: "coming_soon",
        description: "Build and tune detection rules that power SOC alerts and SIEM platforms.",
        whoFor: "People who like coding + security + data — writing rules that catch real attacks.",
        duration: "6–9 months",
      },
      {
        id: "security-engineering",
        label: "Security Engineering",
        slug: "security-engineering",
        status: "coming_soon",
        description: "Build security tooling, platforms, and infrastructure for an organization.",
        whoFor: "Software engineers pivoting into security who like building internal tools.",
        duration: "8–12 months",
      },
      {
        id: "iam",
        label: "Identity & Access Management (IAM)",
        slug: "iam",
        status: "coming_soon",
        description: "Manage who has access to what — authentication, authorization, and identity systems.",
        whoFor: "People interested in enterprise systems, compliance, and access control design.",
        duration: "4–6 months",
      },
    ],
  },
  {
    id: "purple-team",
    label: "Purple Team — Hybrid",
    description: "Combining offensive and defensive skills, bridging both sides.",
    icon: "🔮",
    specializations: [
      {
        id: "appsec",
        label: "Application Security (AppSec)",
        slug: "appsec",
        status: "coming_soon",
        description: "Secure software during development — code review, SAST/DAST, secure SDLC.",
        whoFor: "Developers who want to specialize in security or security people who can code.",
        duration: "6–9 months",
      },
      {
        id: "cloud-security",
        label: "Cloud Security",
        slug: "cloud-security",
        status: "coming_soon",
        description: "Secure cloud infrastructure across AWS, Azure, and GCP.",
        whoFor: "People interested in cloud platforms, infrastructure, and automation.",
        duration: "6–9 months",
      },
      {
        id: "devsecops",
        label: "DevSecOps",
        slug: "devsecops",
        status: "coming_soon",
        description: "Integrate security into CI/CD pipelines and development workflows.",
        whoFor: "DevOps engineers or developers who want to shift security left in the SDLC.",
        duration: "6–9 months",
      },
      {
        id: "security-architecture",
        label: "Security Architecture",
        slug: "security-architecture",
        status: "coming_soon",
        description: "Design secure systems and networks from the ground up.",
        whoFor: "Experienced security professionals moving into strategic/design roles.",
        duration: "Advanced",
      },
      {
        id: "threat-intelligence",
        label: "Threat Intelligence",
        slug: "threat-intelligence",
        status: "coming_soon",
        description: "Track attacker groups, TTPs, and feed intelligence back into defenses.",
        whoFor: "People who like research, geopolitics, and connecting dots across data sources.",
        duration: "6–9 months",
      },
      {
        id: "ai-ml-security",
        label: "AI / ML Security",
        slug: "ai-ml-security",
        status: "coming_soon",
        description: "Secure AI systems and find vulnerabilities in machine learning models.",
        whoFor: "People with ML background who want to apply security thinking to AI systems.",
        duration: "Emerging field",
      },
      {
        id: "grc",
        label: "GRC (Governance, Risk & Compliance)",
        slug: "grc",
        status: "coming_soon",
        description: "Frameworks, audits, risk assessments, and compliance programs.",
        whoFor: "Less hands-on-technical people who are strong in communication and process.",
        duration: "4–6 months",
      },
      {
        id: "osint",
        label: "Open Source Intelligence (OSINT)",
        slug: "osint",
        status: "coming_soon",
        description: "Gather and analyze publicly available information for security investigations.",
        whoFor: "People who like research, investigation, and piecing together information.",
        duration: "3–5 months",
      },
    ],
  },
];

export default function PathsPage() {
  const [activePathSlug, setActivePathSlug] = useState("cybersecurity");
  const [search, setSearch] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    "red-team": true,
    "blue-team": true,
    "purple-team": true,
  });
  const [hoveredSpec, setHoveredSpec] = useState<SpecializationItem | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<SpecializationItem | null>(null);
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const activePath = PATHS.find((path) => path.slug === activePathSlug) ?? PATHS[0];
  const activeTree = activePathSlug === "cybersecurity" ? CYBERSECURITY_TREE : [];

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activeTree
      .filter((team) => {
        if (!query) return true;
        return team.specializations.some((specialization) => specialization.label.toLowerCase().includes(query));
      })
      .map((team) => ({
        ...team,
        visibleSpecializations: query
          ? team.specializations.filter((specialization) => specialization.label.toLowerCase().includes(query))
          : team.specializations,
      }));
  }, [activeTree, search]);

  const visibleSpec = hoveredSpec ?? selectedSpec;
  const visibleTeam = useMemo(() => {
    if (visibleSpec) return null;
    if (!hoveredTeamId) return null;
    return activeTree.find((team) => team.id === hoveredTeamId) ?? null;
  }, [activeTree, hoveredTeamId, visibleSpec]);

  const handlePathChange = (slug: string) => {
    setActivePathSlug(slug);
    setSelectedSpec(null);
    setHoveredSpec(null);
    setHoveredTeamId(null);
    setSheetOpen(false);
  };

  const handleSpecClick = (specialization: SpecializationItem) => {
    setSelectedSpec(specialization);
    setHoveredSpec(null);
    setSheetOpen(true);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-ink-deep">
      <div className="flex h-full w-full flex-row">
        <aside className="border-r border-white/10 bg-ink-deep p-3 lg:w-[30%] lg:p-4">
          <div className="mb-4 lg:mb-6">
            <p className="font-mono text-[10px] tracking-[0.2em] text-amber">PATHS</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {PATHS.map((path) => {
              const isCurrent = path.slug === activePathSlug;
              const isActive = path.status === "active";

              return (
                <button
                  key={path.slug}
                  type="button"
                  onClick={() => {
                    if (!isActive) return;
                    handlePathChange(path.slug);
                  }}
                  disabled={!isActive}
                  className={[
                    "group shrink-0 rounded-xl border px-3 py-3 text-left transition-colors lg:w-full",
                    isCurrent
                      ? "border-amber/80 bg-white/8 text-white"
                      : isActive
                        ? "border-white/10 bg-white/5 text-ink-soft hover:bg-white/8 hover:text-white"
                        : "cursor-not-allowed border-white/5 bg-white/[0.03] text-ink-soft/70",
                    "border-l-2",
                    isCurrent ? "border-l-amber" : "border-l-transparent",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-body text-sm font-medium text-current">{path.title}</span>
                    {isCurrent && <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />}
                  </div>
                  {!isActive && (
                    <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex h-full min-h-0 flex-col overflow-hidden bg-ink-deep lg:w-[40%] lg:border-r lg:border-white/10">
          <div className="border-b border-white/10 bg-ink-deep px-4 pb-3 pt-4 lg:px-6">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base">📂</span>
              <p className="font-display text-sm font-semibold text-white">{activePath.title}</p>
            </div>
          </div>

          <div className="border-b border-white/10 bg-ink-deep px-4 py-4 lg:px-6">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search paths..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white placeholder:text-ink-soft/70 outline-none transition-colors focus:border-amber"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-6">
            <div className="space-y-4">
              {filteredTeams.map((team) => {
                const isExpanded = expandedTeams[team.id] ?? true;

                return (
                  <div key={team.id} className="ml-4 border-l border-white/10 pl-3">
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredTeamId(team.id)}
                      onMouseLeave={() => setHoveredTeamId((current) => (current === team.id ? null : current))}
                      onFocus={() => setHoveredTeamId(team.id)}
                      onBlur={() => setHoveredTeamId((current) => (current === team.id ? null : current))}
                      onClick={() => setExpandedTeams((current) => ({ ...current, [team.id]: !(current[team.id] ?? true) }))}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base" aria-hidden="true">{team.icon}</span>
                        <p className="font-display text-sm font-semibold text-white">{team.label}</p>
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1 pb-1">
                        {team.visibleSpecializations.map((specialization) => {
                          const isSelected = selectedSpec?.id === specialization.id;
                          const isHovered = hoveredSpec?.id === specialization.id;
                          const isActive = specialization.status === "active";

                          return (
                            <button
                              key={specialization.id}
                              type="button"
                              onMouseEnter={() => setHoveredSpec(specialization)}
                              onMouseLeave={() => setHoveredSpec(null)}
                              onFocus={() => setHoveredSpec(specialization)}
                              onBlur={() => setHoveredSpec((current) => (current?.id === specialization.id ? null : current))}
                              onClick={() => handleSpecClick(specialization)}
                              className={[
                                "ml-8 flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                                isSelected
                                  ? "border-l-2 border-amber bg-white/8"
                                  : isHovered
                                    ? "bg-white/5"
                                    : "border-white/0 bg-transparent hover:bg-white/5",
                              ].join(" ")}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-body text-sm text-white">{specialization.label}</p>
                              </div>

                              <span
                                className={[
                                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium",
                                  isActive ? "bg-route/10 text-route" : "bg-white/5 text-ink-soft",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "inline-block h-1.5 w-1.5 rounded-full",
                                    isActive ? "bg-route" : "bg-ink-soft",
                                  ].join(" ")}
                                  aria-hidden="true"
                                />
                                {isActive ? "Active" : "Soon"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredTeams.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <p className="font-body text-sm text-ink-soft">No matching specializations found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside
          className={[
            "fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-deep p-4 shadow-2xl shadow-ink-deep/60 transition-transform duration-200 lg:static lg:h-full lg:w-[30%] lg:border-t-0 lg:border-l lg:p-6 lg:translate-y-0",
            sheetOpen ? "translate-y-0" : "translate-y-[calc(100%-4rem)] lg:translate-y-0",
          ].join(" ")}
        >
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Details</p>
            <button type="button" onClick={() => setSheetOpen(false)} className="font-body text-sm text-ink-soft">
              Close
            </button>
          </div>

          <div className="h-full overflow-y-auto">
            {!visibleSpec && !visibleTeam && (
              <div className="flex min-h-[220px] items-center justify-center text-center">
                <p className="max-w-xs font-body text-base text-ink-soft">Select a path to see details</p>
              </div>
            )}

            {visibleTeam && (
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
                  {visibleTeam.id.replace("-", " ").toUpperCase()}
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-white">{visibleTeam.label}</h2>
                  <p className="mt-3 font-body text-sm leading-6 text-ink-soft">{visibleTeam.description}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Specializations</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visibleTeam.specializations.map((specialization) => (
                      <span
                        key={specialization.id}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-body text-[11px] text-ink-soft"
                      >
                        {specialization.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {visibleSpec && (
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber">
                  {activeTree
                    .find((team) => team.specializations.some((specialization) => specialization.id === visibleSpec.id))
                    ?.id.replace("-", " ")
                    .toUpperCase() ?? "PATH"}
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-white">{visibleSpec.label}</h2>
                  <p className="mt-3 font-body text-sm leading-6 text-ink-soft">{visibleSpec.description}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">WHO IT&apos;S FOR:</p>
                  <p className="mt-2 font-body text-sm leading-6 text-ink-soft">{visibleSpec.whoFor}</p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">DURATION:</p>
                  <p className="mt-2 font-body text-sm leading-6 text-ink-soft">{visibleSpec.duration}</p>
                </div>

                {visibleSpec.status === "active" ? (
                  <Link
                    href={`/paths/${activePath.slug}/${visibleSpec.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber px-4 py-2.5 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
                  >
                    Start this path <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <p className="font-body text-sm text-ink-soft">Coming soon — roadmap in progress</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
