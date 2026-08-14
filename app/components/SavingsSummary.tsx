"use client";

import type { AnalysisResult } from "@/lib/types";
import { usd } from "@/lib/format";

const SCORE_META = {
  clean: { label: "Looks clean", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  minor: { label: "Minor issues", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  major: { label: "Major errors", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
} as const;

export default function SavingsSummary({ result }: { result: AnalysisResult }) {
  const meta = SCORE_META[result.score];
  const bill = result.bill;
  const due = bill.patientDue ?? 0;
  const recoverPct = result.totalRecoverable > 0
    ? Math.min(100, Math.round((result.totalRecoverable / bill.totalBilled) * 100))
    : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-400">
            {result.flags.length} issue{result.flags.length === 1 ? "" : "s"} found on this bill
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-5xl font-black text-emerald-400">
              {usd(result.totalRecoverable)}
            </span>
            <span className="text-sm text-slate-400">recoverable</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-2.5 py-1 font-medium ${meta.cls}`}>
              {meta.label}
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-300">
              {recoverPct}% of the bill is disputed
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-300">
              parsed by {result.parsedBy}
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-300">
              {result.analyzedBy}
            </span>
          </div>
        </div>

        <div className="min-w-52">
          <div className="text-xs font-medium text-slate-500">
            Billed {usd(bill.totalBilled)} · Due {usd(due)}
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-emerald-400"
              style={{ width: `${recoverPct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>$0</span>
            <span>{usd(bill.totalBilled)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
