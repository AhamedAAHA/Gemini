"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function ActDispute() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-title-badge">The Automated Dispute Generator</div>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
              Legal-ready dispute letters. <span className="text-scan-gradient">One click away.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              No need to hire expensive billing advocates. BillScope automatically drafts customized dispute letters citing specific CPT codes, Medicare fee schedules, and state fair-billing laws.
            </p>
            <div className="mt-8">
              <Link
                href="/analyze"
                className="glow-emerald inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4.5 text-base font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Generate your dispute letter
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="glass-card overflow-hidden rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">billscope-dispute-letter.txt</span>
              </div>
              <pre className="mt-4 max-h-72 overflow-hidden text-ellipsis font-mono text-xs leading-relaxed text-slate-300">
{`RE: FORMAL DISPUTE OF MEDICAL BILLING ERRORS
Account No: XR-998773 | Provider: CITY ORTHOPEDIC

To Billing Department & Appeals Officer,

I am formally disputing $5,818.00 in charges on the above statement due to identified billing irregularities:

1. Duplicate MRI knee joint without contrast (CPT 73721) — Billed twice on 06/10/2026 ($2,400 overcharge).
2. Inflated CPT 73721 charge at 4.8x Medicare benchmark ($1,903 overcharge).
3. Arithmetic discrepancy between line totals ($5,512) and statement total ($6,512).

Per the Patient Protection & Affordable Care Act and state fair-billing laws, please suspend collection activities during this formal audit.`}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
