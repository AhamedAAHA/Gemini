import Reveal from "@/app/components/ui/Reveal";

const STATS = [
  { value: "1 in 10", label: "hospital bills contains a billing error" },
  { value: "$2,000+", label: "average overcharge per erroneous bill" },
  { value: "49%", label: "of adults report a surprise or incorrect charge" },
  { value: "$0", label: "it costs to find out if you're overcharged" },
];

export default function StatsBand() {
  return (
    <section className="relative border-y border-white/5 bg-slate-950/60 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="text-center">
            <div className="font-display text-4xl font-bold text-slate-100 sm:text-5xl">{s.value}</div>
            <div className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-slate-400">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
