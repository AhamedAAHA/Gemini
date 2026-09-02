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
    <section className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 bg-slate-950/40">
        <div>
          <h3 className="font-bold text-slate-100">Negotiation Toolkit</h3>
          <p className="font-mono text-xs text-slate-400">
            Disputed: <span className="font-bold text-rose-300">{usd(letter.totalDisputed)}</span> · Deadline: <span className="text-slate-200">{fmtDate(letter.deadline)}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setMode("letter")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === "letter"
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-emerald-500/50"
            }`}
          >
            Appeal Letter
          </button>
          <button
            onClick={() => setMode("script")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              mode === "script"
                ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-emerald-500/50"
            }`}
          >
            Call Script
          </button>
          <button
            onClick={copy}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-300"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button
            onClick={download}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-300"
          >
            Download .txt
          </button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-6 font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/80">
        {content}
      </pre>
    </section>
  );
}
