"use client";

import { useEffect, useRef, useState } from "react";
import { DOMAINS, type Domain } from "@/lib/constants/domains";

export default function DomainSelector({
  selected,
  onSelect,
}: {
  selected: Domain;
  onSelect: (domain: Domain) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-body text-sm text-gray-900 backdrop-blur-md transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      >
        <span className="font-mono text-[10px] tracking-[0.15em] text-amber">PATHS</span>
        <span>{selected.name}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-ink-deep/90 dark:shadow-ink-deep/40">
          {DOMAINS.map((domain) => (
            <button
              key={domain.slug}
              type="button"
              disabled={!domain.available}
              onClick={() => {
                onSelect(domain);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left font-body text-sm transition-colors ${
                domain.slug === selected.slug
                  ? "bg-gray-100 text-amber dark:bg-white/10"
                  : domain.available
                  ? "text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  : "cursor-not-allowed text-gray-400 dark:text-ink-soft/50"
              }`}
            >
              {domain.name}
              {!domain.available && (
                <span className="font-mono text-[9px] tracking-[0.1em] text-gray-400 dark:text-ink-soft/60">
                  SOON
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
