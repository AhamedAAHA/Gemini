"use client";

import type { AnalysisResult } from "@/lib/types";
import { usd } from "@/lib/format";

const SCORE_META = {
  clean: { label: "Clean Statement", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  minor: { label: "Minor Issues", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  major: { label: "Major Hospital Errors", cls: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
} as const;

export default function SavingsSummary({ result }: { result: AnalysisResult }) {
  const meta = SCORE_META[result.score];
  const bill = result.bill;
  const due = bill.patientDue ?? 0;
  const recoverPct = result.totalRecoverable > 0
    ? Math.min(100, Math.round((result.totalRecoverable / bill.totalBilled) * 100))
    : 0;

  return (
    <section className="glass-card relative overflow-hidden rounded-3xl p-8 border border-white/10 shadow-2xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            {result.flags.length} issue{result.flags.length === 1 ? "" : "s"} identified
          </div>
          <div className="mt-2 flex items-baseline gap-4">
            <span className="font-mono text-5xl font-black text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.4)] sm:text-6xl">
              {usd(result.totalRecoverable)}
            </span>
            <span className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-400">
              Recoverable Savings
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-medium">
            <span className={`rounded-full border px-3 py-1 font-bold ${meta.cls}`}>
              {meta.label}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-slate-300">
              {recoverPct}% of bill total disputed
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-slate-300">
              Engine: {result.analyzedBy}
            </span>
          </div>
        </div>

        <div className="min-w-64">
          <div className="flex justify-between font-mono text-xs text-slate-400">
            <span>Stated Total: <strong className="text-slate-200">{usd(bill.totalBilled)}</strong></span>
            <span>Patient Due: <strong className="text-rose-300">{usd(due)}</strong></span>
          </div>
          <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 via-teal-400 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
              style={{ width: `${recoverPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-500">
            <span>$0</span>
            <span>{usd(bill.totalBilled)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
