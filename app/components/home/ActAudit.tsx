"use client";

import { motion } from "motion/react";
import { usd } from "@/lib/format";

const ITEMS = [
  { desc: "MRI knee joint, without contrast", billed: 2400, bad: true },
  { desc: "MRI knee joint, without contrast", billed: 2400, bad: true },
  { desc: "Office visit, established, level 3", billed: 320, bad: true },
  { desc: "Medical supplies — non-covered", billed: 225, bad: true },
  { desc: "Office visit, established, level 4", billed: 109, bad: false },
  { desc: "Blood count, automated ×2", billed: 58, bad: true },
];

export default function ActAudit() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">
            The Audit Engine
          </div>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Every line gets scanned. <span className="text-rose-glow">Every error glows.</span>
          </h2>
        </motion.div>

        <div className="glass-card relative overflow-hidden rounded-3xl p-3 shadow-2xl">
          <div className="scan-beam" />
          <div className="space-y-2">
            {ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`relative flex items-center justify-between rounded-xl border px-5 py-3.5 transition-colors duration-500 ${
                  item.bad
                    ? "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/15"
                    : "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                }`}
              >
                <span className="font-mono text-xs text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate px-4 text-sm font-medium text-slate-100">{item.desc}</span>
                <span className={`tabular font-mono text-sm font-semibold ${item.bad ? "text-rose-300" : "text-slate-300"}`}>
                  {usd(item.billed)}
                </span>
                <span
                  className={`ml-4 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    item.bad ? "bg-rose-500 text-slate-950 shadow-[0_0_12px_rgba(244,63,94,0.6)]" : "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  }`}
                >
                  {item.bad ? "!" : "✓"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs tracking-wide text-slate-400">
          duplicate → inflated → math error → non-covered — caught in milliseconds
        </p>
      </div>
    </section>
  );
}
