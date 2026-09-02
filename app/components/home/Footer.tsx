"use client";

import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-16 backdrop-blur-xl">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Logo />
            <p className="max-w-xs text-center font-sans text-xs leading-relaxed text-slate-400 md:text-left">
              BillScope is an automated medical billing audit lab designed to catch line-item errors, duplicate CPT charges, and inflated rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs text-slate-400">
            <a href="#problem" className="transition hover:text-emerald-300">
              The Problem
            </a>
            <a href="#audit" className="transition hover:text-emerald-300">
              The Audit
            </a>
            <a href="#money" className="transition hover:text-emerald-300">
              The Money
            </a>
            <a href="#dispute" className="transition hover:text-emerald-300">
              The Dispute
            </a>
            <Link href="/analyze" className="font-bold text-emerald-400 hover:text-emerald-300">
              Audit a Bill →
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center font-mono text-xs text-slate-400">
          © {new Date().getFullYear()} BillScope. All rights reserved. Zero PHI stored.
        </div>
      </div>
    </footer>
  );
}
