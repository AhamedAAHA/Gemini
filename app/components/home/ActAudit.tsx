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
      <div className="relative mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            The audit
          </div>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Every line gets scanned. <span className="text-blood">Every error glows.</span>
          </h2>
        </motion.div>

        <div className="glass-strong relative overflow-hidden rounded-2xl p-2">
          <div className="scan-beam" />
          <div className="space-y-1.5">
            {ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.09 }}
                className={`relative flex items-center justify-between rounded-lg border px-4 py-3 transition-colors duration-500 ${
                  item.bad
                    ? "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/15"
                    : "border-emerald-500/30 bg-emerald-500/5"
                }`}
              >
                <span className="font-mono text-xs text-slate-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate px-3 text-sm text-slate-200">{item.desc}</span>
                <span className={`tabular font-mono text-sm ${item.bad ? "text-rose-300" : "text-slate-300"}`}>
                  {usd(item.billed)}
                </span>
                <span
                  className={`ml-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    item.bad ? "bg-rose-500 text-slate-950" : "bg-emerald-500 text-slate-950"
                  }`}
                >
                  {item.bad ? "!" : "✓"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-slate-500">
          duplicate → inflated → math error → non-covered — caught in milliseconds
        </p>
      </div>
    </section>
  );
}
