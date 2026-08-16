import Link from "next/link";
import RoutePath from "@/components/landing/RoutePath";

const problems = [
  {
    label: "NO STRUCTURE",
    body: "Free, high-quality courses exist across every field — but no one tells you the order to take them in.",
  },
  {
    label: "NO MENTORSHIP",
    body: "Asking in forums is hit-or-miss. Answers are inconsistent, and help is not always there when you need it.",
  },
  {
    label: "NO CLEAR OUTCOME",
    body: "Even when someone starts learning, it's unclear what job or role that learning actually leads to.",
  },
];

const gettingStarted = [
  {
    step: "01",
    title: "Create your account",
    body: "Free, takes 30 seconds.",
  },
  {
    step: "02",
    title: "Pick a path",
    body: "See what's live now and what's coming.",
  },
  {
    step: "03",
    title: "Track your progress",
    body: "Save your place, pick up where you left off.",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Paths", href: "/paths" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function LandingPage() {
  return (
    <main>
      <header className="border-b border-ink-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            TruePath
          </Link>
          <div className="flex items-center gap-5 sm:gap-8">
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

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.15em] text-amber">
            CAREER GUIDANCE, STRUCTURED
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Stop guessing where to start.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-soft md:text-lg">
            TruePath maps out career paths as staged roadmaps — free resources,
            the right order, and exactly what it leads to. No guesswork, no dead ends.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Get started — it&apos;s free
            </Link>
            <a
              href="#solution"
              className="font-body text-sm text-ink-soft transition-colors hover:text-white"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-xl font-display text-2xl font-bold leading-snug md:text-3xl">
            Self-directed learners keep hitting the same three walls.
          </h2>
          <div className="mt-12 grid gap-10 border-t border-paper-line pt-10 md:grid-cols-3">
            {problems.map((problem) => (
              <div key={problem.label}>
                <p className="font-mono text-xs tracking-[0.15em] text-ink/50">
                  {problem.label}
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/80">
                  {problem.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="scroll-mt-8 border-t border-ink-line">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.15em] text-amber">THE SOLUTION</p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
              How TruePath works.
            </h2>
            <p className="mt-5 max-w-lg font-body text-sm leading-relaxed text-ink-soft">
              Every path on TruePath answers the same four questions, so you can
              understand the destination before committing your time to the journey.
            </p>
          </div>
          <RoutePath />
        </div>
      </section>

      <section className="border-t border-ink-line bg-paper text-ink">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.15em] text-ink/50">GET STARTED</p>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
            A clearer next step is waiting.
          </h2>
          <div className="mt-12 grid gap-10 border-t border-paper-line pt-10 md:grid-cols-3">
            {gettingStarted.map((item) => (
              <div key={item.step}>
                <p className="font-mono text-xs text-amber">{item.step}</p>
                <p className="mt-2 font-display text-lg font-medium">{item.title}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/80">{item.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="mt-12 inline-block rounded-md bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink-line">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-12 md:grid-cols-[1.7fr_repeat(3,1fr)]">
            <div>
              <Link href="/" className="font-display text-xl font-bold tracking-tight">
                TruePath
              </Link>
              <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
                Structured career guidance for self-directed learners.
              </p>
            </div>
            {footerLinks.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-xs tracking-[0.15em] text-amber">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-sm text-ink-soft transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-ink-line pt-6 font-mono text-xs text-ink-soft">
            © 2026 TruePath. Built for people figuring it out on their own terms.
          </p>
        </div>
      </footer>
    </main>
  );
}
