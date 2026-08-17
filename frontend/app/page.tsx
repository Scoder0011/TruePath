import Link from "next/link";
import Image from "next/image";
import RoutePath from "@/components/landing/RoutePath";
import logo from "../logo.png";

const problems = [
  {
    label: "NO STRUCTURE",
    body: "Free, high-quality courses exist — but no one tells you the right order to go through them in.",
  },
  {
    label: "NO MENTORSHIP",
    body: "Asking in forums or Discord is hit-or-miss. Answers are inconsistent, and volunteers aren't always around.",
  },
  {
    label: "NO CLEAR OUTCOME",
    body: "Even when someone starts learning, it's unclear what job or role it actually leads to.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse freely, no login required",
    body: "See the full roadmap before signing up.",
  },
  {
    step: "02",
    title: "Log in to track progress",
    body: "Mark stages complete, pick up where you left off.",
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
    <main className="overflow-hidden">
      <section className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full bg-amber/25 blur-3xl sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-20 -z-10 h-80 w-80 rounded-full bg-route/25 blur-3xl sm:h-[30rem] sm:w-[30rem]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/3 -z-10 h-48 w-48 rounded-full bg-amber/15 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-ink-deep/30 backdrop-blur-xl sm:p-10 md:p-12">
            <p className="font-mono text-xs tracking-[0.15em] text-amber">
              CAREER GUIDANCE, STRUCTURED
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
              Stop guessing where to start.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-soft md:text-lg">
              TruePath maps out real career paths as staged roadmaps — free resources,
              the right order, and exactly what it leads to.
            </p>
            <Link
              href="/paths"
              className="mt-8 inline-block rounded-lg bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-8 md:pb-12">
        <div className="mx-auto w-fit max-w-full rounded-full border border-white/10 bg-white/5 px-6 py-2 text-center font-body text-xs leading-relaxed text-ink-soft backdrop-blur-md sm:text-sm">
          Validated in Razorpay&apos;s Top 10,000 Problems of India initiative — ranked Top 10, scored 88/100
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink/70">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.15em] text-amber">THE PROBLEM</p>
          <h2 className="mt-3 max-w-xl font-display text-2xl font-bold leading-snug text-white md:text-3xl">
            Self-directed learners keep hitting the same three walls.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problems.map((problem) => (
              <article
                key={problem.label}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <p className="font-mono text-xs tracking-[0.15em] text-amber">{problem.label}</p>
                <p className="mt-4 font-body text-sm leading-relaxed text-ink-soft">{problem.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="scroll-mt-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.15em] text-route">THE SOLUTION</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              A roadmap built around the questions that matter.
            </h2>
            <p className="mt-5 max-w-lg font-body text-sm leading-relaxed text-ink-soft">
              TruePath turns an uncertain career decision into a sequence you can understand,
              follow, and return to on your own terms.
            </p>
          </div>
          <RoutePath />
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink/70">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.15em] text-amber">HOW IT WORKS</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            Start with the information. Keep the momentum.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {howItWorks.map((item) => (
              <article
                key={item.step}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8"
              >
                <p className="font-mono text-xs text-route">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-medium text-white">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-[0.15em] text-ink/50">WHO IT&apos;S FOR</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-2xl font-bold leading-snug md:text-3xl">
            Anyone figuring out where to start — whether you left formal education,
            are studying alongside it, or are pivoting into something new.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/75">
            No age or background requirement. Just the willingness to learn on your own terms.
          </p>
          <Link
            href="/paths"
            className="mt-8 inline-block rounded-lg bg-amber px-6 py-3 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-ink-deep">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-12 md:grid-cols-[1.7fr_repeat(3,1fr)]">
            <div>
              <Link href="/" className="flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-offset-4">
                <Image src={logo} alt="" className="h-7 w-7" />
                <span className="font-display text-xl font-bold tracking-tight">TruePath</span>
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
                        className="rounded-sm font-body text-sm text-ink-soft transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-white/10 pt-6 font-mono text-xs text-ink-soft">
            © 2026 TruePath. Built for people figuring it out on their own terms.
          </p>
        </div>
      </footer>
    </main>
  );
}
