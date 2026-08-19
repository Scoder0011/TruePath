"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const PATHS = [
  {
    id: "cybersecurity",
    slug: "cybersecurity",
    title: "Cybersecurity",
    description:
      "Learn to protect systems, networks, and data from digital attacks.",
    specializations: [
      "Penetration Testing",
      "Bug Bounty",
      "Red Team",
      "Blue Team",
      "AppSec",
      "Cloud Security",
      "GRC",
      "Digital Forensics",
      "Security Research",
    ],
    whoItsFor:
      "Anyone interested in offensive or defensive security, ethical hacking, or protecting digital infrastructure.",
    status: "active",
  },
  {
    id: "web-dev",
    slug: "web-dev",
    title: "Web Development",
    description: "Build full-stack web applications.",
    specializations: [],
    whoItsFor: "",
    status: "coming_soon",
  },
  {
    id: "data-science",
    slug: "data-science",
    title: "Data Science",
    description: "Work with data, build models, and extract insights.",
    specializations: [],
    whoItsFor: "",
    status: "coming_soon",
  },
  {
    id: "cloud-devops",
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    description: "Deploy and manage scalable infrastructure.",
    specializations: [],
    whoItsFor: "",
    status: "coming_soon",
  },
] as const;

export default function PathsPage() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const currentPath = useMemo(() => {
    if (selectedSlug) {
      return PATHS.find((path) => path.slug === selectedSlug) ?? null;
    }

    if (hoveredSlug) {
      return PATHS.find((path) => path.slug === hoveredSlug) ?? null;
    }

    return null;
  }, [hoveredSlug, selectedSlug]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink-deep px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute -left-28 top-0 -z-10 h-72 w-72 rounded-full bg-amber/20 blur-3xl sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-40 -z-10 h-80 w-80 rounded-full bg-route/20 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.18em] text-amber">PATHS</p>
          <h1 className="mt-2 font-display text-3xl text-white md:text-5xl">Choose your route</h1>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="lg:w-[65%]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-ink-deep/30 backdrop-blur-xl sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {PATHS.map((path) => {
                  const isActive = path.status === "active";
                  const isSelected = selectedSlug === path.slug;

                  return (
                    <button
                      key={path.id}
                      type="button"
                      onMouseEnter={() => setHoveredSlug(path.slug)}
                      onMouseLeave={() => setHoveredSlug((current) => (current === path.slug ? null : current))}
                      onFocus={() => setHoveredSlug(path.slug)}
                      onBlur={() => setHoveredSlug((current) => (current === path.slug ? null : current))}
                      onClick={() => {
                        if (!isActive) return;
                        setSelectedSlug(path.slug);
                        setHoveredSlug(path.slug);
                      }}
                      disabled={!isActive}
                      className={[
                        "group relative min-h-[180px] rounded-2xl border p-5 text-left transition-all duration-200",
                        isActive
                          ? "cursor-pointer border-amber/80 bg-amber/10 text-white hover:border-amber hover:bg-amber/15"
                          : "cursor-not-allowed border-ink-line bg-white/5 text-ink-soft",
                        isSelected && isActive ? "ring-2 ring-amber ring-offset-2 ring-offset-ink-deep" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-amber">
                          {isActive ? "ACTIVE" : "COMING SOON"}
                        </span>
                        {isActive && (
                          <span className="font-mono text-[10px] uppercase text-route">{path.slug}</span>
                        )}
                      </div>

                      <div className="mt-6">
                        <h2 className="font-display text-2xl font-medium leading-tight text-current">
                          {path.title}
                        </h2>
                        <p className="mt-3 font-body text-sm leading-6 text-current/80">
                          {path.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        {isActive ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
                            OPEN
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                            CHECK BACK LATER
                          </span>
                        )}
                        {isActive && (
                          <span className="text-lg text-amber transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="lg:w-[35%]">
            <div className="sticky top-6 max-h-[75vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-ink-deep/30 backdrop-blur-xl">
              {!currentPath && (
                <div className="flex h-full min-h-[260px] items-center justify-center text-center">
                  <p className="max-w-xs font-body text-base text-ink-soft">
                    Hover over a path to learn more.
                  </p>
                </div>
              )}

              {currentPath && (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                    {currentPath.status === "active" ? "ACTIVE PATH" : "COMING SOON"}
                  </p>
                  <h2 className="mt-4 font-display text-3xl leading-tight text-white">
                    {currentPath.title}
                  </h2>
                  <p className="mt-4 font-body text-sm leading-6 text-ink-soft">
                    {currentPath.description}
                  </p>

                  {currentPath.status === "coming_soon" ? (
                    <div className="mt-6 rounded-xl border border-ink-line bg-white/5 p-4">
                      <p className="font-body text-sm text-ink-soft">Coming soon — check back later.</p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                          Specializations in this path:
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {currentPath.specializations.map((specialization) => (
                            <span
                              key={specialization}
                              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-body text-xs text-ink-soft"
                            >
                              {specialization}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
                          Who it&apos;s for:
                        </p>
                        <p className="mt-3 font-body text-sm leading-6 text-ink-soft">
                          {currentPath.whoItsFor}
                        </p>
                      </div>

                      {selectedSlug === currentPath.slug && (
                        <Link
                          href={`/paths/${currentPath.slug}`}
                          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber px-4 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
                        >
                          Go to path <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
