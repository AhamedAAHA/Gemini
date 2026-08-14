"use client";

import { motion } from "motion/react";
import Reveal from "@/app/components/ui/Reveal";

const CHIPS = [
  { label: "DUPLICATE CHARGE", delay: 0 },
  { label: "INFLATED ×8.4", delay: 0.3 },
  { label: "MATH ERROR +$1,000", delay: 0.6 },
  { label: "UPCODED 99284", delay: 0.9 },
];

export default function ActProblem() {
  return (
    <section className="relative border-y border-white/5 py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            The problem
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            1 in 10 hospital bills <span className="text-blood">is wrong</span> — and it&apos;s
            written to be unreadable.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            CPT codes. Revenue codes. Adjustments. The average patient can&apos;t decipher a
            single line — and that&apos;s exactly how a $4,200 MRI and a phantom $1,000 make it
            onto your balance.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CHIPS.map((c, i) => (
              <motion.div
                key={c.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 + i, ease: "easeInOut" }}
                className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 font-mono text-xs tracking-wider text-rose-300 backdrop-blur"
              >
                ⚠ {c.label}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
