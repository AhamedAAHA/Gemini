export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">
            Bill<span className="text-scan-gradient">Scope</span>
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-slate-500">
          BillScope is a hackathon project. It analyzes sample bills or your own, never stores
          PHI, and does not constitute legal or financial advice.
        </p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
          rules-first · explainable · free
        </p>
      </div>
    </footer>
  );
}
