"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { SAMPLE_BILLS } from "@/lib/samples";
import Uploader from "./Uploader";
import SavingsSummary from "./SavingsSummary";
import BillCard from "./BillCard";
import FlagCard from "./FlagCard";

type Phase = "input" | "parsing" | "results";

export default function Analyzer() {
  const [phase, setPhase] = useState<Phase>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (payload: { text?: string; fileName?: string; sampleId?: string }) => {
    setPhase("parsing");
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data.result);
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setPhase("input");
    }
  };

  if (phase === "parsing") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center py-32 text-center">
        <div className="glow-emerald flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-emerald-500/10">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-emerald-400">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
            <path d="M8 13v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" />
            <path d="M12 13v5M8.5 10.5 7 7M15.5 10.5 17 7" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold">Auditing every line…</h2>
        <p className="mt-2 text-sm text-slate-400">
          Checking for duplicates, math errors, inflated prices and non-covered charges.
        </p>
      </div>
    );
  }

  if (phase === "results" && result) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit report</h1>
            <p className="text-sm text-slate-500">
              Generated {new Date(result.generatedAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setPhase("input")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-500/50"
          >
            ← Analyze another bill
          </button>
        </div>

        <SavingsSummary result={result} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <BillCard result={result} />
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Issues found
              </h3>
              {result.flags.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  No errors detected — this bill looks clean.
                </div>
              ) : (
                <div className="space-y-3">
                  {result.flags.map((f) => (
                    <FlagCard key={f.id} flag={f} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit a medical bill</h1>
        <p className="mt-2 text-slate-400">
          Choose a sample with planted errors for the demo, or paste/upload your own.
          Everything runs locally or through our AWS pipeline — no signup.
        </p>
      </div>
      <Uploader
        busy={false}
        samples={SAMPLE_BILLS}
        onAnalyzeSample={(id) => run({ sampleId: id })}
        onAnalyzeText={(text, fileName) => run({ text, fileName })}
        error={error}
      />
    </div>
  );
}
