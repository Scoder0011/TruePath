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
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-body text-sm text-white backdrop-blur-md transition-colors hover:bg-white/10"
      >
        <span className="font-mono text-[10px] tracking-[0.15em] text-amber">PATHS</span>
        <span>{selected.name}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-deep/90 shadow-2xl shadow-ink-deep/40 backdrop-blur-xl">
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
                  ? "bg-white/10 text-amber"
                  : domain.available
                  ? "text-white hover:bg-white/5"
                  : "cursor-not-allowed text-ink-soft/50"
              }`}
            >
              {domain.name}
              {!domain.available && (
                <span className="font-mono text-[9px] tracking-[0.1em] text-ink-soft/60">
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
