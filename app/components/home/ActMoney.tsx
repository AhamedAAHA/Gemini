"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usd } from "@/lib/format";

export default function ActMoney() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">
                The Recoverable Total
              </div>
              <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                See exactly what you <span className="text-emerald-glow">don&apos;t owe</span>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                Instead of confusing medical codes, BillScope gives you a clear audit summary with exact dollar savings breakdown and fair-market reference prices.
              </p>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-mono text-5xl font-black text-emerald-400 sm:text-6xl drop-shadow-[0_0_25px_rgba(52,211,153,0.4)]">
                  {usd(5818)}
                </span>
                <span className="font-mono text-sm uppercase tracking-wider text-slate-400">
                  disputed on sample bill
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
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-xs text-slate-400">Total Billed</span>
                  <span className="font-mono font-bold text-slate-100">{usd(6512)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 py-4">
                  <span className="font-mono text-xs text-rose-300">Errors Flagged</span>
                  <span className="font-mono font-bold text-rose-300">-{usd(5818)}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-mono text-xs font-semibold text-emerald-400">Fair Patient Due</span>
                  <span className="font-mono text-lg font-extrabold text-emerald-400">{usd(340)}</span>
                </div>
                <Link
                  href="/analyze"
                  className="glow-emerald mt-6 block w-full rounded-xl bg-emerald-500 py-3.5 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
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
