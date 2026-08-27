"use client";

import type { LearningMode } from "@/lib/supabase/learningMode";

export default function ModeSelectModal({ onSelect }: { onSelect: (mode: LearningMode) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-2xl">
        <p className="font-mono text-[10px] tracking-[0.15em] text-route">HOW DO YOU WANT TO LEARN?</p>
        <h3 className="mt-2 font-display text-xl font-bold text-zinc-900">
          Choose a mode for this path
        </h3>
        <p className="mt-2 font-body text-sm text-zinc-600">
          You can change this later from the roadmap page.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("self_paced")}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:border-zinc-300"
          >
            <p className="font-display text-base font-semibold text-zinc-900">Self-paced</p>
            <p className="mt-1 font-body text-sm text-zinc-600">
              Jump to any stage in any order. Good if you already know some of this.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSelect("staged")}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-colors hover:border-zinc-300"
          >
            <p className="font-display text-base font-semibold text-zinc-900">Staged</p>
            <p className="mt-1 font-body text-sm text-zinc-600">
              Each stage unlocks only after you finish the one before it. Good if you want structure.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
