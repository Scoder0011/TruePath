import Link from "next/link";
import RoutePath from "@/components/landing/RoutePath";

const problems = [
  {
    label: "NO STRUCTURE",
    body: "Free, high-quality courses exist — TryHackMe, PortSwigger Academy, freeCodeCamp — but no one tells you the right order to go through them in.",
  },
  {
    label: "NO MENTORSHIP",
    body: "Asking in forums or Discord is hit-or-miss. Answers are inconsistent, and volunteers aren't always around when you need them.",
  },
  {
    label: "NO CLEAR OUTCOME",
    body: "Even when someone starts learning, it's unclear what job or role that learning actually leads to.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse freely",
    body: "View a full path — roadmap, stages, prerequisites, resources — with no login required. Real value first, nothing gated.",
  },
  {
    step: "02",
    title: "Log in to track",
    body: "Create an account to mark stages and resources as complete, and see where you stand on your path over time.",
  },
  {
    step: "03",
    title: "Follow the roadmap",
    body: "Work stage by stage through free, open-source resources in the order that actually gets you job-ready.",
  },
];

const subPaths = [
  { name: "Red Team", desc: "Offensive security, exploitation, adversary simulation." },
  { name: "Blue Team", desc: "Detection, monitoring, and incident response." },
  { name: "AppSec", desc: "Secure development and application-layer security." },
  { name: "Cloud Security", desc: "Securing infrastructure across cloud providers." },
  { name: "GRC", desc: "Governance, risk, and compliance." },
];

export default function LandingPage() {
  return (
    <main>
      {/* ---------- NAV ---------- */}
      <header className="border-b border-ink-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-lg font-bold tracking-tight">
            TruePath
          </span>
          <div className="flex items-center gap-8">
            <Link
              href="/paths"
              className="font-body text-sm text-ink-soft transition-colors hover:text-white"
            >
              Paths
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-ink-line px-4 py-2 font-body text-sm text-white transition-colors hover:border-amber hover:text-amber"
            >
              Log in
            </Link>
          </div>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs tracking-[0.15em] text-amber">
            CAREER PATH · CYBERSECURITY
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            Stop guessing where to start.
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink-soft">
            TruePath maps out real career paths as staged roadmaps, built
            from free and open-source resources — so you always know what to
            learn next, and what it leads to.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/paths/cybersecurity"
              className="rounded-md bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Browse the Cybersecurity path
            </Link>
            <Link
              href="/paths"
              className="font-body text-sm text-ink-soft transition-colors hover:text-white"
            >
              See all paths →
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-ink-soft">
            No login required to browse.
          </p>
        </div>

        <div className="flex items-center">
          <RoutePath />
        </div>
      </section>

      {/* ---------- PROBLEM ---------- */}
      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-xl font-display text-2xl font-bold leading-snug md:text-3xl">
            Self-directed learners keep hitting the same three walls.
          </h2>
          <div className="mt-12 grid gap-10 border-t border-paper-line pt-10 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.label}>
                <p className="font-mono text-xs tracking-[0.15em] text-ink/50">
                  {p.label}
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/80">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {howItWorks.map((s) => (
            <div key={s.step} className="border-t border-ink-line pt-6">
              <p className="font-mono text-xs text-amber">{s.step}</p>
              <p className="mt-2 font-display text-lg font-medium">
                {s.title}
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SUB-PATHS PREVIEW ---------- */}
      <section className="border-t border-ink-line bg-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.15em] text-amber">
            CYBERSECURITY · 5 SUB-PATHS
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
            One field, five specializations.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {subPaths.map((sp) => (
              <Link
                key={sp.name}
                href={`/paths/cybersecurity/${sp.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group rounded-lg border border-ink-line p-5 transition-colors hover:border-route"
              >
                <p className="font-display text-base font-medium text-white">
                  {sp.name}
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                  {sp.desc}
                </p>
                <p className="mt-4 font-mono text-xs text-route opacity-0 transition-opacity group-hover:opacity-100">
                  VIEW ROADMAP →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER CTA ---------- */}
      <section className="border-t border-ink-line">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Figure out your next step.
          </h2>
          <Link
            href="/paths/cybersecurity"
            className="mt-6 inline-block rounded-md bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Start with Cybersecurity
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 font-mono text-xs text-ink-soft">
          <span>TruePath</span>
          <span>Built for people learning on their own terms.</span>
        </div>
      </footer>
    </main>
  );
}
