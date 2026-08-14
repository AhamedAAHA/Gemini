export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-slate-400">
      <div className="glow-emerald flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
          <path d="M8 13v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" />
          <path d="M12 13v5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-mono text-xs uppercase tracking-widest">loading billscope</span>
    </div>
  );
}
