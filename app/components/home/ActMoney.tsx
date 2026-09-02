"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usd } from "@/lib/format";

export default function ActMoney() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-container">
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="section-title-badge">The Financial Breakdown</div>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
                See exactly what you <span className="text-emerald-glow">don&apos;t owe</span>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                Instead of confusing medical jargon, BillScope gives you a crystal-clear audit summary with exact dollar savings and fair-market reference rates.
              </p>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-mono text-5xl font-black text-emerald-400 sm:text-6xl drop-shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                  {usd(5818)}
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  disputed on sample statement
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl border border-white/15 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <span className="font-mono text-xs text-slate-400">Stated Total Billed</span>
                  <span className="font-mono text-base font-bold text-slate-100">{usd(6512)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="font-mono text-xs text-rose-300">Errors Flagged</span>
                  <span className="font-mono text-base font-bold text-rose-300">-{usd(5818)}</span>
                </div>
                <div className="flex items-center justify-between pt-5">
                  <span className="font-mono text-xs font-semibold text-emerald-400">Fair Patient Due</span>
                  <span className="font-mono text-xl font-extrabold text-emerald-400">{usd(340)}</span>
                </div>
                <Link
                  href="/analyze"
                  className="glow-emerald mt-8 block w-full rounded-2xl bg-emerald-500 py-4 text-center text-base font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  Audit your bill now
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
