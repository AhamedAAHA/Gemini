"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Logo from "@/app/components/Logo";

export default function LandingNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

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
