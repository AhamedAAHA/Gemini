"use client";

import Reveal from "@/app/components/ui/Reveal";
import Counter from "@/app/components/ui/Counter";

const STATS = [
  { value: 10, prefix: "1 in ", label: "hospital bills contains a billing error" },
  { value: 2000, prefix: "$", suffix: "+", label: "average overcharge per erroneous bill" },
  { value: 49, suffix: "%", label: "of adults report a surprise or incorrect charge" },
  { value: 0, prefix: "$", label: "it costs to find out if you're overcharged" },
];

export default function StatsBand() {
  return (
    <section className="relative border-y border-white/5 bg-slate-950/60 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="text-center">
            <div className="font-display text-4xl font-bold text-scan-gradient sm:text-5xl">
              <Counter
                value={s.value}
                prefix={s.prefix ?? ""}
                suffix={s.suffix ?? ""}
              />
            </div>
            <div className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-slate-400">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
