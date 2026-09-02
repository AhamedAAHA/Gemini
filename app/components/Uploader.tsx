"use client";

import { useRef, useState } from "react";
import type { SampleBill } from "@/lib/samples";

type UploaderProps = {
  busy: boolean;
  samples: SampleBill[];
  onAnalyzeText: (text: string, fileName: string) => void;
  onAnalyzeSample: (sampleId: string) => void;
  error?: string | null;
};

const PLACEHOLDER = `Paste a medical bill / EOB here.

The parser understands lines like:
01  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $497.00  $397.60

Date, code, description, qty, billed, allowed, paid — one line per service.
Or select a sample bill on the left to see planted hospital errors in action.`;

export default function Uploader({
  busy,
  samples,
  onAnalyzeText,
  onAnalyzeSample,
  error,
}: UploaderProps) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    const content = await f.text();
    setText(content);
    onAnalyzeText(content, f.name);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Try a Sample Bill
        </h3>
        <div className="space-y-4">
          {samples.map((s) => (
            <button
              key={s.id}
              disabled={busy}
              onClick={() => onAnalyzeSample(s.id)}
              className="glass-card w-full rounded-2xl p-5 text-left transition hover:border-emerald-500/50 hover:bg-slate-900/90 disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 group-hover:text-emerald-300 transition">{s.name}</span>
                <span className="rounded-lg border border-white/10 bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-300">
                  {s.type}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Audit this bill →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Paste or Upload Statement
          </h3>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <button
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-300"
          >
            Upload .txt / .csv
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="h-72 w-full rounded-2xl border border-white/10 bg-slate-950/80 p-5 font-mono text-xs text-slate-200 outline-none transition focus:border-emerald-500/60"
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Parsed by deterministic rules & Medicare benchmarks. No PHI saved.
          </p>
          <button
            disabled={busy || text.trim().length === 0}
            onClick={() => onAnalyzeText(text, "pasted-bill.txt")}
            className="glow-emerald rounded-xl bg-emerald-500 px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Analyzing…" : "Audit statement"}
          </button>
        </div>
        {error ? (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
