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
    <main className="min-h-screen overflow-x-clip">
      <ProgressBar />
      <LiveBackground />

      {/* soft left-edge gradient for hero text legibility; rest of the page stays clear */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-0 w-1/2 bg-[linear-gradient(90deg,rgba(3,7,18,0.92),rgba(3,7,18,0.45)_45%,transparent_75%)]"
      />

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
