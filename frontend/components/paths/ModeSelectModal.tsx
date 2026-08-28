"use client";

import type { LearningMode } from "@/lib/supabase/learningMode";

export default function ModeSelectModal({ onSelect }: { onSelect: (mode: LearningMode) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-[#0b0b0b] p-7 shadow-2xl">
        <p className="font-mono text-[10px] tracking-[0.15em] text-zinc-400">HOW DO YOU WANT TO LEARN?</p>
        <h3 className="mt-2 font-display text-xl font-bold text-white">
          Choose a mode for this path
        </h3>
        <p className="mt-2 font-body text-sm text-zinc-400">
          You can change this later from the roadmap page.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("self_paced")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-left transition-colors hover:border-blue-400"
          >
            <p className="font-display text-base font-semibold text-white">Self-paced</p>
            <p className="mt-1 font-body text-sm text-zinc-400">
              Jump to any stage in any order. Good if you already know some of this.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSelect("staged")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-left transition-colors hover:border-blue-400"
          >
            <p className="font-display text-base font-semibold text-white">Staged</p>
            <p className="mt-1 font-body text-sm text-zinc-400">
              Each stage unlocks only after you finish the one before it. Good if you want structure.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
