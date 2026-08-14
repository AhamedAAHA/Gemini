import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-lab flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">404</div>
      <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        This bill doesn&apos;t add up.
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        The page you&apos;re looking for isn&apos;t here — but your money might still be recoverable
        on the analyzer.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
      >
        ← Back home
      </Link>
    </main>
  );
}
