"use client";

import { motion } from "motion/react";

export default function ActDispute() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            The dispute
          </div>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Don&apos;t ask what you owe.
            <br />
            <span className="text-scan-gradient">Find what you don&apos;t.</span>
          </h2>
          <p className="mt-5 max-w-md text-slate-400">
            The final act isn&apos;t fighting the bill — it&apos;s a 15-second dispute letter,
            with every error spelled out, addressed to the right person.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
