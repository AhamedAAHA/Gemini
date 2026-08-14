"use client";

import type { AnalysisResult } from "@/lib/types";
import { draftAppealLetter, fmtDate } from "@/lib/letters";
import { usd } from "@/lib/format";

export default function LetterGenerator({ result }: { result: AnalysisResult }) {
  const letter = draftAppealLetter(result.bill, result.flags, result.bill.patientName);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="border-b border-slate-800 p-4">
        <h3 className="font-semibold">Appeal letter</h3>
        <p className="text-xs text-slate-500">
          Dispute {usd(letter.totalDisputed)} · deadline {fmtDate(letter.deadline)}
        </p>
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-slate-300">
        {letter.salutation}
        {"\n\n"}
        {letter.body}
      </pre>
    </section>
  );
}
