"use client";

import type { AnalysisResult } from "@/lib/types";
import { usd } from "@/lib/format";

export default function SavingsSummary({ result }: { result: AnalysisResult }) {
  const bill = result.bill;
  const due = bill.patientDue ?? 0;
  const recoverPct = result.totalRecoverable > 0
    ? Math.min(100, Math.round((result.totalRecoverable / bill.totalBilled) * 100))
    : 0;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="text-sm font-medium text-slate-400">
        {result.flags.length} issue{result.flags.length === 1 ? "" : "s"} found on this bill
      </div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-5xl font-black text-emerald-400">
          {usd(result.totalRecoverable)}
        </span>
        <span className="text-sm text-slate-400">recoverable</span>
      </div>
      <div className="mt-2 text-xs font-medium text-slate-500">
        Billed {usd(bill.totalBilled)} · Due {usd(due)} · {recoverPct}% disputed
      </div>
    </section>
  );
}
