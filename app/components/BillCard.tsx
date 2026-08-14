"use client";

import type { AnalysisResult, Flag } from "@/lib/types";
import { usd } from "@/lib/format";

export default function BillCard({ result }: { result: AnalysisResult }) {
  const flaggedLines = new Set<number>();
  result.flags.forEach((f) => f.itemLines.forEach((l) => flaggedLines.add(l)));

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 p-4">
        <div>
          <h3 className="font-semibold">{result.bill.providerName ?? "Bill"}</h3>
          <p className="text-xs text-slate-500">
            {result.bill.patientName ? `${result.bill.patientName} · ` : ""}
            {result.bill.serviceDate ?? "unknown date"} · {result.bill.fileName}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Billed: <span className="font-semibold text-slate-200">{usd(result.bill.totalBilled)}</span></div>
          <div>Due: <span className="font-semibold text-rose-300">{usd(result.bill.patientDue ?? 0)}</span></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Billed</th>
              <th className="px-4 py-3 text-right">Allowed</th>
              <th className="px-4 py-3 text-right">Paid</th>
            </tr>
          </thead>
          <tbody>
            {result.bill.items.map((item) => {
              const flagged = flaggedLines.has(item.line);
              return (
                <tr
                  key={item.line}
                  className={`border-b border-slate-800/50 ${
                    flagged ? "bg-rose-500/10" : "odd:bg-transparent"
                  }`}
                >
                  <td className="px-4 py-2.5 text-slate-500">
                    {String(item.line).padStart(2, "0")}
                    {flagged && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-rose-400" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">{item.date ?? "—"}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-400">
                    {item.code ?? "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={flagged ? "text-rose-200" : "text-slate-200"}>
                      {item.description}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-100">
                    {usd(item.amount)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-400">
                    {item.allowed !== undefined ? usd(item.allowed) : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-400">
                    {item.paid !== undefined ? usd(item.paid) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 text-xs text-slate-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400 align-middle" />{" "}
        <span className="align-middle">flagged lines — click an issue below for the full explanation.</span>
      </p>
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
