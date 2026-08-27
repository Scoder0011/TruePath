import Link from "next/link";
import Image from "next/image";
import RoutePath from "@/components/landing/RoutePath";
import logo from "../logo.png";
import background from "../background.jpg";

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
    title: "Browse freely, no login required",
    body: "See the full roadmap before signing up.",
    icon: "↗",
  },
  {
    title: "Log in to track progress",
    body: "Mark stages complete, pick up where you left off.",
    icon: "✓",
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
    <main className="overflow-hidden bg-[#050505] text-white">
      <section className="relative isolate min-h-[650px] overflow-hidden border-b border-zinc-500/15">
        <Image src={background} alt="A glowing route with waypoints" fill priority className="-z-20 object-cover object-center opacity-45 grayscale-[20%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,.94)_35%,rgba(5,5,5,.58)_75%,#050505_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/25 mix-blend-multiply" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="mx-auto flex min-h-[650px] max-w-6xl items-end px-6 pb-20 pt-24 md:pb-28">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-zinc-300">Career guidance, structured</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">Find the route that fits your future.</h1>
            <p className="mt-7 max-w-lg font-body text-base leading-8 text-slate-200 md:text-lg">TruePath turns a vague career goal into a clear sequence of skills, resources, and milestones you can actually follow.</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link href="/paths" className="rounded-md bg-white px-5 py-3 font-body text-sm font-semibold text-[#07101e] shadow-[0_0_28px_rgba(255,255,255,.12)] transition hover:bg-zinc-200">Explore career paths</Link>
              <Link href="#solution" className="font-body text-sm font-medium text-zinc-300 underline decoration-zinc-500/60 underline-offset-8 transition hover:text-white">See how it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">A better starting point for self-directed learners</p>
          <p className="font-body text-xs text-zinc-300">Validated in Razorpay&apos;s Top 10,000 Problems of India initiative <span className="ml-2 text-zinc-500">Top 10 · 88/100</span></p>
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-700">THE PROBLEM</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight md:text-4xl">Good intentions are not a roadmap.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {problems.map((problem) => (
              <article key={problem.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7 shadow-sm md:p-8">
                <p className="font-mono text-xs tracking-[0.18em] text-zinc-900">{problem.label}</p>
                <p className="mt-6 font-body text-sm leading-7 text-zinc-600">{problem.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="scroll-mt-24 border-y border-white/10 bg-[#050505]">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[.85fr_1.15fr] md:items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-zinc-400">THE SOLUTION</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">A route you can see, trust, and return to.</h2>
            <p className="mt-6 max-w-lg font-body text-sm leading-7 text-slate-300">Every path is broken into understandable stages, with free resources and a destination attached. You choose the pace. The route stays clear.</p>
          </div>
          <div className="border border-white/10 bg-[#0b0b0b] p-5 shadow-[0_20px_80px_rgba(0,0,0,.24)] sm:p-8"><RoutePath /></div>
        </div>
      </section>

      <section className="bg-[#0b0b0b]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-400">HOW IT WORKS</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight md:text-4xl">Start with information. Keep the momentum.</h2>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
            {howItWorks.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-display text-lg text-white">
                    {item.icon}
                  </span>
                  <h3 className="font-display text-xl font-medium text-white">{item.title}</h3>
                </div>
                <p className="mt-4 max-w-sm font-body text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-white text-black">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-zinc-600">WHO IT&apos;S FOR</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl">
            Anyone figuring out where to start — whether you left formal education,
            are studying alongside it, or are pivoting into something new.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-7 text-zinc-600">
            No age or background requirement. Just the willingness to learn on your own terms.
          </p>
          <Link
            href="/paths"
            className="mt-8 inline-block rounded-md bg-black px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-12 md:grid-cols-[1.7fr_repeat(3,1fr)]">
            <div>
              <Link href="/" className="flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-offset-4">
                <Image src={logo} alt="" className="h-7 w-7" />
                <span className="font-display text-xl font-bold tracking-tight text-white">TruePath</span>
              </Link>
              <p className="mt-3 max-w-xs font-body text-sm leading-7 text-slate-400">
                Structured career guidance for self-directed learners.
              </p>
            </div>
            {footerLinks.map((column) => (
              <div key={column.title}>
                <p className="font-mono text-xs tracking-[0.15em] text-white">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="rounded-sm font-body text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-white/10 pt-6 font-mono text-xs text-slate-500">
            © 2026 TruePath. Built for people figuring it out on their own terms.
          </p>
        </div>
      </footer>
    </main>
  );
}
