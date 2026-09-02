"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { SAMPLE_BILLS } from "@/lib/samples";
import Uploader from "./Uploader";
import SavingsSummary from "./SavingsSummary";
import BillCard from "./BillCard";
import FlagCard from "./FlagCard";
import LetterGenerator from "./LetterGenerator";
import AgentChat from "./AgentChat";

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
      <div className="section-container flex flex-col items-center justify-center py-36 text-center">
        <div className="glow-emerald-lg relative flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/40 bg-emerald-500/10">
          <div className="scan-beam" />
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-emerald-400" aria-hidden="true">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
            <path d="M8 13v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" />
            <path d="M12 13v5M8.5 10.5 7 7M15.5 10.5 17 7" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-display mt-8 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
          Scanning statement line items…
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-400">
          Running duplicate detection, CPT fee schedule benchmarks, and math validation checks.
        </p>
      </div>
    );
  }

  if (phase === "results" && result) {
    const context = {
      bill: result.bill,
      flags: result.flags,
      totalRecoverable: result.totalRecoverable,
    };
    return (
      <div className="section-container space-y-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              Audit Report Summary
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-400">
              Generated {new Date(result.generatedAt).toLocaleString()} · ID: {result.bill.id}
            </p>
          </div>
          <button
            onClick={() => setPhase("input")}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-2.5 text-xs font-bold text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-300"
          >
            ← Audit another statement
          </button>
        </div>

        <SavingsSummary result={result} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <BillCard result={result} />
            <div>
              <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                Identified Billing Error Flags ({result.flags.length})
              </h3>
              {result.flags.length === 0 ? (
                <div className="glass-card rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-sm font-semibold text-emerald-300">
                  ✓ No errors detected — this statement matches expected benchmarks.
                </div>
              ) : (
                <div className="space-y-4">
                  {result.flags.map((f) => (
                    <FlagCard key={f.id} flag={f} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <AgentChat context={context} />
          </div>
        </div>

        <LetterGenerator result={result} />
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <div className="mb-10">
        <div className="glass-pill mb-3 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 px-4 py-1.5 text-xs font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Audit Lab v2.0
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
          Audit a Medical Bill
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
          Select a sample hospital statement loaded with common errors, or paste/upload your itemized bill to calculate recoverable overcharges immediately.
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
