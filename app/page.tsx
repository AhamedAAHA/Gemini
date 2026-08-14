import LandingNav from "@/app/components/home/LandingNav";
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
    </main>
  );
}
