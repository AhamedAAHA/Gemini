"use client";

import { motion } from "motion/react";
import Magnetic from "@/app/components/ui/Magnetic";
import Link from "next/link";

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

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link
                href="/analyze"
                className="glow-emerald inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Analyze a bill — free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Magnetic>
            <span className="font-mono text-xs text-slate-500">no signup · no PHI stored</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
