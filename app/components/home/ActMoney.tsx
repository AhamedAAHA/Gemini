"use client";

import { motion } from "motion/react";
import Counter from "@/app/components/ui/Counter";

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

          <p className="mx-auto mt-8 max-w-md font-mono text-xs leading-relaxed text-slate-400">
            price matched against the CMS fee schedule · duplicates & phantom totals removed ·
            you shouldn&apos;t pay a cent until it&apos;s fixed
          </p>
        </motion.div>
      </div>
    </section>
  );
}
