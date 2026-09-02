"use client";

import { motion } from "motion/react";

const BUGS = [
  {
    title: "Duplicate Charges",
    stat: "1 IN 4 STATEMENTS",
    desc: "The exact same procedure listed twice — e.g. duplicate MRIs, overlapping blood tests, or double emergency room facility fees.",
  },
  {
    title: "Inflated CPT Prices",
    stat: "3X TO 10X FAIR MARKET",
    desc: "Charging $2,400 for a routine $497 knee MRI. Fair-market Medicare fee schedule comparisons catch this immediately.",
  },
  {
    title: "Unbundled Services",
    stat: "HIDDEN SUB-CHARGES",
    desc: "Breaking a standard package into multiple individual line items to charge separate facility and doctor fees for each step.",
  },
];

export default function ActProblem() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="section-title-badge">The Hidden Problem</div>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
            80% of medical bills contain <span className="text-rose-glow">costly overcharges</span>.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Hospitals process millions of complex billing codes daily. Most patients pay without itemizing — assuming the statement is accurate.
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
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {bug.stat}
                </div>
                <h3 className="font-display mt-3 text-2xl font-bold tracking-tight text-slate-100">{bug.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{bug.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
