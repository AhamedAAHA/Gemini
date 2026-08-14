"use client";

import { useRef, useState } from "react";

type UploaderProps = {
  busy: boolean;
  onAnalyzeText: (text: string, fileName: string) => void;
  error?: string | null;
};

const PLACEHOLDER = `Paste a medical bill / EOB here.

The parser understands lines like:
01  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $497.00  $397.60

Date, code, description, qty, billed, allowed, paid — one line per service.`;

export default function Uploader({ busy, onAnalyzeText, error }: UploaderProps) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    const content = await f.text();
    setText(content);
    onAnalyzeText(content, f.name);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Paste or upload a bill
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
  );
}
