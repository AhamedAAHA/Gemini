"use client";

import { useState } from "react";
import type { Flag } from "@/lib/types";
import { usd } from "@/lib/format";
import { flagTypeLabel } from "./BillCard";

const SEVERITY_CLS = {
  high: "border-rose-500/50 bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]",
  medium: "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  low: "border-slate-700 bg-slate-800/80 text-slate-300",
} as const;

export default function FlagCard({ flag }: { flag: Flag }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden rounded-2xl border border-white/10 transition hover:border-emerald-500/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-900/60"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-bold ${SEVERITY_CLS[flag.severity]}`}>
              {flagTypeLabel(flag.type)}
            </span>
            {flag.heuristic && (
              <span className="rounded-full border border-white/10 bg-slate-800/80 px-2.5 py-0.5 font-mono text-[11px] text-slate-400">
                heuristic
              </span>
            )}
            <span className="font-mono text-xs text-slate-400">lines {flag.itemLines.join(", ")}</span>
          </div>
          <div className="mt-2 text-base font-bold text-slate-100">{flag.title}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-xl font-extrabold text-rose-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.4)]">
            {usd(flag.overcharge)}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">Disputed</div>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 p-5 bg-slate-950/60">
          <p className="text-sm leading-relaxed text-slate-300">{flag.explanation}</p>
          <ul className="mt-3 space-y-1.5">
            {flag.evidence.map((e, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-slate-400">
                <span className="text-emerald-400 font-bold">→</span>
                <span className="font-mono">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
