import type { Metadata } from "next";
import Analyzer from "@/app/components/Analyzer";

export const metadata: Metadata = {
  title: "Audit a bill — BillScope",
  description: "Upload a medical bill and see the money you don't owe.",
};

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-lab">
      <Analyzer />
    </main>
  );
}
