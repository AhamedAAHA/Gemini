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
Or just try a sample bill on the left — they're full of planted errors.`;

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
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Try a sample bill
        </h3>
        <div className="space-y-3">
          {samples.map((s) => (
            <button
              key={s.id}
              disabled={busy}
              onClick={() => onAnalyzeSample(s.id)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-emerald-500/50 hover:bg-slate-900 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{s.name}</span>
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {s.type}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{s.blurb}</p>
              <span className="mt-2 inline-block text-sm font-medium text-emerald-400">
                Analyze this bill →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            …or paste / upload your own
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
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-emerald-500/60"
          >
            Upload .txt
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="h-64 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 outline-none transition focus:border-emerald-500/60"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Parsed locally by a regex engine; production routes photos/PDFs through Amazon
            Bedrock vision.
          </p>
          <button
            disabled={busy || text.trim().length === 0}
            onClick={() => onAnalyzeText(text, "pasted-bill.txt")}
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Analyzing…" : "Audit this bill"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
