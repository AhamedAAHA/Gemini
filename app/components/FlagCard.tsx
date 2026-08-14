"use client";

import type { Flag } from "@/lib/types";
import { usd } from "@/lib/format";
import { flagTypeLabel } from "./BillCard";

const SEVERITY_CLS = {
  high: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  low: "border-slate-700 bg-slate-800 text-slate-300",
} as const;

export default function FlagCard({ flag }: { flag: Flag }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
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
      <div className="mt-2 text-lg font-bold text-rose-300">{usd(flag.overcharge)} disputed</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{flag.explanation}</p>
    </div>
  );
}
