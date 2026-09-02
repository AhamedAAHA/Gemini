"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Magnetic from "@/app/components/ui/Magnetic";
import { usd } from "@/lib/format";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden py-24">
      <div className="cinematic-grid pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headline & Action */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="glass-pill mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <span className="scan-pulse h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              80% of hospital bills contain hidden overcharges
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
              Upload a hospital bill.
              <br />
              <span className="text-scan-gradient">Find the money you don&apos;t owe.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              BillScope scans your itemized medical statements line by line, identifies duplicate CPT charges,
              inflated rates, and math errors — then generates your formal dispute letter in seconds.
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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Instant Audit · No Signup · Zero PHI Stored</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Audit HUD Card Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="glass-card relative overflow-hidden rounded-3xl p-6 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              {/* Laser Scan Beam */}
              <div className="scan-beam" />

              {/* HUD Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                    Live Audit Scanner
                  </span>
                </div>
                <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                  REAL-TIME PARSER
                </span>
              </div>

              {/* HUD Sample Line Items */}
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 transition hover:bg-rose-500/15">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-rose-200">CPT 73721 · MRI Knee Joint</span>
                    <span className="font-bold text-rose-300">{usd(2400)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Line 02 · Duplicate of Line 01</span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 font-mono font-bold text-rose-300 border border-rose-500/30">
                      FLAGGED DUPLICATE
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 transition hover:bg-amber-500/15">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-amber-200">CPT 99213 · Office Visit L3</span>
                    <span className="font-bold text-amber-300">{usd(320)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Reference Benchmark: $74.00</span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono font-bold text-amber-300 border border-amber-500/30">
                      4.3× INFLATED
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-medium text-slate-300">CPT 99214 · Office Visit L4</span>
                    <span className="font-semibold text-slate-200">{usd(109)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Line 04 · Single occurrence</span>
                    <span className="text-emerald-400 font-medium">✓ Clean Item</span>
                  </div>
                </div>
              </div>

              {/* HUD Summary Bottom Bar */}
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                      Total Disputed Overcharge
                    </div>
                    <div className="font-mono text-3xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                      {usd(5818)}
                    </div>
                  </div>
                  <Link
                    href="/analyze"
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 transition hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    Audit Yours →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">scroll to explore</span>
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
