"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-lab flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-sm uppercase tracking-[0.3em] text-rose-400">Error</div>
      <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Something went wrong auditing your bill.
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        It usually fixes itself — try running the audit again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
      >
        Try again
      </button>
    </main>
  );
}
