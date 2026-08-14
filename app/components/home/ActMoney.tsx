"use client";

import { motion } from "motion/react";
import Counter from "@/app/components/ui/Counter";
import { usd } from "@/lib/format";

const BILLED = 6512;
const FAIR = 694;

function Meter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="tabular text-xl font-bold text-slate-100">{usd(value)}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${accent}`}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

export default function ActMoney() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            The money
          </div>

          <div className="mt-6 flex items-baseline justify-center gap-4">
            <span className="font-display tabular text-7xl font-bold text-scan-gradient sm:text-8xl">
              <Counter value={5818} prefix="$" />
            </span>
            <span className="text-xl text-slate-400">recoverable</span>
          </div>
          <p className="mt-3 text-slate-400">
            on a single <span className="text-slate-200">$6,512</span> bill — that&apos;s{" "}
            <span className="font-bold text-rose-300">89%</span> of it.
          </p>

          <div className="glass-strong mx-auto mt-10 max-w-xl space-y-6 rounded-2xl p-6 text-left">
            <Meter
              label="What they billed you"
              value={BILLED}
              accent="bg-gradient-to-r from-rose-500 to-rose-400"
            />
            <Meter
              label="Fair price (reference)"
              value={FAIR}
              accent="bg-gradient-to-r from-emerald-400 to-teal-300"
            />
          </div>

          <p className="mx-auto mt-8 max-w-md font-mono text-xs leading-relaxed text-slate-300">
            price matched against the CMS fee schedule · duplicates & phantom totals removed ·
            you shouldn&apos;t pay a cent until it&apos;s fixed
          </p>
        </motion.div>
      </div>
    </section>
  );
}
