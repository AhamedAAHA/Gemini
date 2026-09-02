"use client";

import type { AnalysisResult, Flag } from "@/lib/types";
import { usd } from "@/lib/format";

export default function BillCard({ result }: { result: AnalysisResult }) {
  const flaggedLines = new Set<number>();
  result.flags.forEach((f) => f.itemLines.forEach((l) => flaggedLines.add(l)));

  return (
    <section className="glass-card overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 bg-slate-950/40">
        <div>
          <h3 className="font-bold text-slate-100">{result.bill.providerName ?? "Medical Bill"}</h3>
          <p className="font-mono text-xs text-slate-400">
            {result.bill.patientName ? `${result.bill.patientName} · ` : ""}
            {result.bill.serviceDate ?? "unknown date"} · {result.bill.fileName}
          </p>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <div>Total Billed: <span className="font-bold text-slate-100">{usd(result.bill.totalBilled)}</span></div>
          <div>Patient Due: <span className="font-bold text-rose-300">{usd(result.bill.patientDue ?? 0)}</span></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="px-5 py-3.5">#</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">CPT Code</th>
              <th className="px-5 py-3.5">Description</th>
              <th className="px-5 py-3.5 text-right">Billed</th>
              <th className="px-5 py-3.5 text-right">Allowed</th>
              <th className="px-5 py-3.5 text-right">Paid</th>
            </tr>
          </thead>
          <tbody>
            {result.bill.items.map((item) => {
              const flagged = flaggedLines.has(item.line);
              return (
                <tr
                  key={item.line}
                  className={`border-b border-white/5 transition-colors ${
                    flagged ? "bg-rose-500/15" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">
                    {String(item.line).padStart(2, "0")}
                    {flagged && (
                      <span className="ml-2 inline-block h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{item.date ?? "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-300">
                    {item.code ?? "—"}
                  </td>
                  <td className="px-5 py-3 font-medium">
                    <span className={flagged ? "text-rose-200 font-semibold" : "text-slate-200"}>
                      {item.description}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-slate-100">
                    {usd(item.amount)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-slate-400">
                    {item.allowed !== undefined ? usd(item.allowed) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-slate-400">
                    {item.paid !== undefined ? usd(item.paid) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-400 bg-slate-950/40">
        <span className="inline-block h-2 w-2 rounded-full bg-rose-400 align-middle shadow-[0_0_8px_rgba(251,113,133,0.8)]" />{" "}
        <span className="align-middle font-mono">Red rows indicate flagged billing errors or benchmark discrepancies.</span>
      </div>
    </section>
  );
}

export function flagTypeLabel(type: Flag["type"]): string {
  const labels: Record<Flag["type"], string> = {
    duplicate: "Duplicate charge",
    arithmetic: "Math error",
    inflated: "Inflated price",
    upcode: "Possible upcoding",
    bundled: "Bundling violation",
    "balance-bill": "Non-covered charge",
    semantic: "Audit finding",
  };
  return labels[type];
}
