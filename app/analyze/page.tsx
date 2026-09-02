import type { Metadata } from "next";
import Link from "next/link";
import Analyzer from "@/app/components/Analyzer";
import Logo from "@/app/components/Logo";

export const metadata: Metadata = {
  title: "Audit a Bill — BillScope",
  description: "Upload a medical bill statement to audit CPT line items, duplicate charges, and overcharges.",
};

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-lab text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
        <div className="section-container">
          <div className="glass-nav mt-4 flex items-center justify-between rounded-2xl px-6 py-3.5 shadow-2xl">
            <Logo />
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>
      <div className="pt-24 pb-16">
        <Analyzer />
      </div>
      <footer className="border-t border-white/10 bg-slate-950/80 py-8 text-center font-mono text-xs text-slate-400">
        BillScope Audit Engine · Zero PHI Stored · Educational & Negotiation Aid Only
      </footer>
    </main>
  );
}
