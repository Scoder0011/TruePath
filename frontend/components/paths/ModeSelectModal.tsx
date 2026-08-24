"use client";

import type { LearningMode } from "@/lib/supabase/learningMode";

export default function ModeSelectModal({ onSelect }: { onSelect: (mode: LearningMode) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-ink-deep">
        <p className="font-mono text-[10px] tracking-[0.15em] text-amber">HOW DO YOU WANT TO LEARN?</p>
        <h3 className="mt-2 font-display text-xl font-bold text-gray-900 dark:text-white">
          Choose a mode for this path
        </h3>
        <p className="mt-2 font-body text-sm text-gray-600 dark:text-ink-soft">
          You can change this later from the roadmap page.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("self_paced")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:border-amber dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-display text-base font-semibold text-gray-900 dark:text-white">Self-paced</p>
            <p className="mt-1 font-body text-sm text-gray-600 dark:text-ink-soft">
              Jump to any stage in any order. Good if you already know some of this.
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSelect("staged")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:border-amber dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-display text-base font-semibold text-gray-900 dark:text-white">Staged</p>
            <p className="mt-1 font-body text-sm text-gray-600 dark:text-ink-soft">
              Each stage unlocks only after you finish the one before it. Good if you want structure.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
