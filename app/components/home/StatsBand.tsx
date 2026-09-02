"use client";

import Reveal from "@/app/components/ui/Reveal";
import Counter from "@/app/components/ui/Counter";

const STATS = [
  { value: 80, suffix: "%", label: "of hospital bills contain billing errors" },
  { value: 2000, prefix: "$", suffix: "+", label: "average overcharge on disputed statements" },
  { value: 49, suffix: "%", label: "of patients receive surprise out-of-network fees" },
  { value: 0, prefix: "$", label: "cost to run a line-by-line audit with BillScope" },
];

export default function StatsBand() {
  return (
    <section className="relative border-y border-white/10 bg-slate-950/80 py-16 backdrop-blur-xl">
      <div className="section-container">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08} className="text-center">
              <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 transition hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <div className="font-display text-4xl font-extrabold text-scan-gradient sm:text-5xl">
                  <Counter value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
                </div>
                <div className="mt-3 text-xs font-semibold leading-relaxed text-slate-300 sm:text-sm">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
