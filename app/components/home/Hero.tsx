"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Magnetic from "@/app/components/ui/Magnetic";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="cinematic-grid pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="glass-pill mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="scan-pulse h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            Billing errors cost Americans tens of billions a year
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-7xl">
            Upload a hospital bill.
            <br />
            <span className="text-scan-gradient">Find the money you don&apos;t owe.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            BillScope scans your medical statements line by line, highlights duplicate charges,
            inflated CPT prices, and math errors — then generates your custom dispute letter in seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic>
              <Link
                href="/analyze"
                className="glow-emerald inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4.5 text-base font-bold text-slate-950 transition hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
              >
                Analyze a bill — free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Magnetic>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Instant audit · No signup · Zero PHI stored</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">scroll to audit</span>
          <motion.div
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-emerald-400">
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
