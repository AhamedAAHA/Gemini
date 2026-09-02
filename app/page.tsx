import ProgressBar from "@/app/components/home/ProgressBar";
import LandingNav from "@/app/components/home/LandingNav";
import LiveBackground from "@/app/components/three/LiveBackground";
import Hero from "@/app/components/home/Hero";
import StatsBand from "@/app/components/home/StatsBand";
import ActProblem from "@/app/components/home/ActProblem";
import ActAudit from "@/app/components/home/ActAudit";
import ActMoney from "@/app/components/home/ActMoney";
import ActDispute from "@/app/components/home/ActDispute";
import Footer from "@/app/components/home/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <ProgressBar />

      {/* 3D Background canvas cleanly placed at z-0 behind all page content */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <LiveBackground />
      </div>

      {/* Main page content cleanly elevated at z-10 */}
      <div className="relative z-10">
        <LandingNav />
        <Hero />
        <StatsBand />
        <div id="problem" className="scroll-mt-24">
          <ActProblem />
        </div>
        <div id="audit" className="scroll-mt-24">
          <ActAudit />
        </div>
        <div id="money" className="scroll-mt-24">
          <ActMoney />
        </div>
        <div id="dispute" className="scroll-mt-24">
          <ActDispute />
        </div>
        <Footer />
      </div>
    </main>
  );
}
