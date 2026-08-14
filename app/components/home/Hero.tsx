"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="grid-overlay pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            Upload a hospital bill.
            <br />
            <span className="text-scan-gradient">Find the money you don&apos;t owe.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">
            BillScope reads your bill line by line, flags the duplicates, inflated prices and
            math errors — then drafts the dispute for you.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/analyze"
              className="glow-emerald inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Analyze a bill — free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="font-mono text-xs text-slate-400">~30 seconds · no signup</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
