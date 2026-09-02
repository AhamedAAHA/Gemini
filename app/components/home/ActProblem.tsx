"use client";

import { motion } from "motion/react";

const BUGS = [
  {
    title: "Duplicate charges",
    stat: "1 in 4 bills",
    desc: "The same procedure listed twice — e.g. two MRIs, two blood tests or double emergency room facility fees.",
  },
  {
    title: "Inflated CPT prices",
    stat: "3x to 10x fair market",
    desc: "Charging $2,400 for a routine $497 knee MRI. Benchmark fee schedule comparison catches this immediately.",
  },
  {
    title: "Unbundled services",
    stat: "Hidden line items",
    desc: "Breaking a standard package into multiple individual line items to charge separate fees for every sub-step.",
  },
];

export default function ActProblem() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400">
            The Problem
          </div>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
            80% of medical bills contain <span className="text-rose-glow">costly errors</span>.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Hospitals process millions of complex codes every day. Most patients pay without itemizing — assuming the total is always correct.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {BUGS.map((bug, i) => (
            <motion.div
              key={bug.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card flex flex-col justify-between rounded-3xl p-8 transition hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
            >
              <div>
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {bug.stat}
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-100">{bug.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{bug.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
