import type { Metadata } from "next";
import Link from "next/link";
import Analyzer from "@/app/components/Analyzer";
import Logo from "@/app/components/Logo";

export const metadata: Metadata = {
  title: "Audit a bill — BillScope",
  description: "Upload a medical bill and see the money you don't owe.",
};

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-lab">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="glass-strong mt-4 flex items-center justify-between rounded-2xl px-5 py-3">
            <Logo />
            <Link
              href="/"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>
      <div className="pt-24">
        <Analyzer />
      </div>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        Demo uses sample bills · no PHI stored · not legal/financial advice
      </footer>
    </main>
  );
}
