"use client";

import { useState } from "react";
import type { Flag } from "@/lib/types";
import { usd } from "@/lib/format";
import { flagTypeLabel } from "./BillCard";

const SEVERITY_CLS = {
  high: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  low: "border-slate-700 bg-slate-800 text-slate-300",
} as const;

export default function FlagCard({ flag }: { flag: Flag }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-900"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${SEVERITY_CLS[flag.severity]}`}>
              {flagTypeLabel(flag.type)}
            </span>
            {flag.heuristic && (
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400">
                heuristic
              </span>
            )}
            <span className="text-[11px] text-slate-500">lines {flag.itemLines.join(", ")}</span>
          </div>
          <div className="mt-1 font-semibold text-slate-100">{flag.title}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-rose-300">{usd(flag.overcharge)}</div>
          <div className="text-[11px] text-slate-500">disputed</div>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-4 py-3">
          <p className="text-sm leading-relaxed text-slate-300">{flag.explanation}</p>
          <ul className="mt-2 space-y-1">
            {flag.evidence.map((e, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-400">
                <span className="text-emerald-400">→</span>
                <span className="font-mono">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
