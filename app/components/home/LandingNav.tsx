"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Logo from "@/app/components/Logo";

export default function LandingNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  const links = [
    { href: "#problem", label: "The problem" },
    { href: "#audit", label: "The audit" },
    { href: "#money", label: "The money" },
    { href: "#dispute", label: "The dispute" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`mt-4 flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "glass-strong" : "border border-transparent"
          }`}
        >
          <Logo />

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex" aria-label="Sections">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-emerald-300">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 sm:block"
            >
              Analyze a bill
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-emerald-500/50 md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-4 md:hidden">
            <nav className="flex flex-col gap-1 text-sm text-slate-400" aria-label="Sections">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-emerald-300"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <Link
              href="/analyze"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Analyze a bill
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
