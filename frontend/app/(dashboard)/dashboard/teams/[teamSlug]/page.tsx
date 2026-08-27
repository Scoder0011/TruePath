"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CYBERSECURITY_TREE, type SpecializationItem } from "@/lib/constants/cybersecurityTeams";

export default function TeamPage({ params }: { params: { teamSlug: string } }) {
  const team = CYBERSECURITY_TREE.find((item) => item.id === params.teamSlug);
  const [selectedId, setSelectedId] = useState<string | null>(team?.specializations[0]?.id ?? null);
  const selected = useMemo(
    () => team?.specializations.find((item) => item.id === selectedId) ?? team?.specializations[0],
    [selectedId, team],
  );

  if (!team) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 text-center">
        <div><h1 className="font-display text-2xl font-bold text-zinc-900">Team not found</h1><Link href="/dashboard" className="mt-4 inline-block font-body text-sm text-route hover:underline">Back to dashboard</Link></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-zinc-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="font-mono text-xs tracking-[0.12em] text-zinc-600 hover:text-zinc-900">← BACK TO DASHBOARD</Link>
        <header className="mt-8 max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.18em] text-route">CYBERSECURITY / TEAM</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-zinc-900">{team.icon} {team.label}</h1>
          <p className="mt-3 font-body text-sm leading-6 text-zinc-600">{team.description}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.4fr)]">
          <nav className="rounded-2xl border border-zinc-200 bg-white p-3" aria-label={`${team.label} specializations`}>
            <p className="px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-route">SPECIALIZATIONS</p>
            <div className="space-y-1">
              {team.specializations.map((specialization) => (
                <TeamOption key={specialization.id} specialization={specialization} selected={selected?.id === specialization.id} onSelect={() => setSelectedId(specialization.id)} />
              ))}
            </div>
          </nav>

          <section className="min-h-[420px] rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            {selected && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><p className="font-mono text-[10px] tracking-[0.16em] text-route">SPECIALIZATION</p><h2 className="mt-2 font-display text-2xl font-bold text-zinc-900">{selected.label}</h2></div>
                  <span className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.08em] ${selected.status === "active" ? "bg-route/10 text-route" : "bg-zinc-100 text-zinc-500"}`}>{selected.status === "active" ? "ACTIVE" : "COMING SOON"}</span>
                </div>
                <p className="mt-6 font-body text-sm leading-7 text-zinc-600">{selected.description}</p>
                <div className="mt-8 grid gap-5 border-t border-zinc-200 pt-6 sm:grid-cols-2"><Detail label="WHO IT'S FOR" value={selected.whoFor} /><Detail label="DURATION" value={selected.duration} /></div>
                {selected.status === "active" ? <Link href={`/paths/cybersecurity/${selected.slug}`} className="mt-8 inline-flex rounded-lg bg-black px-4 py-2.5 font-body text-sm font-medium text-white hover:bg-zinc-800">Open roadmap <span className="ml-2" aria-hidden="true">→</span></Link> : <p className="mt-8 font-body text-sm text-zinc-500">This specialization is being prepared.</p>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function TeamOption({ specialization, selected, onSelect }: { specialization: SpecializationItem; selected: boolean; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} className={`flex w-full items-center justify-between gap-3 rounded-lg border-l-2 px-3 py-3 text-left transition-colors ${selected ? "border-amber bg-zinc-100" : "border-transparent hover:bg-zinc-50"}`}><span className={`font-body text-sm ${selected ? "font-medium text-zinc-900" : "text-zinc-600"}`}>{specialization.label}</span><span className={`shrink-0 text-[10px] ${specialization.status === "active" ? "text-route" : "text-zinc-400"}`}>{specialization.status === "active" ? "●" : "○"}</span></button>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="font-mono text-[10px] tracking-[0.14em] text-route">{label}</p><p className="mt-2 font-body text-sm leading-6 text-zinc-600">{value}</p></div>;
}