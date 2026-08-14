"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { draftAppealLetter, callScript, fmtDate } from "@/lib/letters";
import { usd } from "@/lib/format";

export default function LetterGenerator({ result }: { result: AnalysisResult }) {
  const [mode, setMode] = useState<"letter" | "script">("letter");
  const [copied, setCopied] = useState(false);

  const letter = draftAppealLetter(result.bill, result.flags, result.bill.patientName);
  const script = callScript(result.bill, result.flags);
  const content = mode === "letter" ? `${letter.salutation}\n\n${letter.body}` : script;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "letter" ? "billscope-dispute-letter.txt" : "billscope-call-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4">
        <div>
          <h3 className="font-semibold">Negotiation toolkit</h3>
          <p className="text-xs text-slate-500">
            Dispute {usd(letter.totalDisputed)} · deadline {fmtDate(letter.deadline)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("letter")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              mode === "letter"
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-300 hover:border-emerald-500/50"
            }`}
          >
            Appeal letter
          </button>
          <button
            onClick={() => setMode("script")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              mode === "script"
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-300 hover:border-emerald-500/50"
            }`}
          >
            Call script
          </button>
          <button
            onClick={copy}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500/50"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={download}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500/50"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-slate-300">
        {content}
      </pre>
    </section>
  );
}
