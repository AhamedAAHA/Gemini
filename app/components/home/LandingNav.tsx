import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="glass-strong mt-4 flex items-center justify-between rounded-2xl px-5 py-3">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#problem" className="transition hover:text-emerald-300">The problem</a>
            <a href="#audit" className="transition hover:text-emerald-300">The audit</a>
            <a href="#money" className="transition hover:text-emerald-300">The money</a>
            <a href="#dispute" className="transition hover:text-emerald-300">The dispute</a>
          </nav>

          <Link
            href="/analyze"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Analyze a bill
          </Link>
        </div>
      </div>
    </header>
  );
}
