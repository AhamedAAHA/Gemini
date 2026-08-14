import type { AnalysisResult, Flag } from "./types";
import { parseBillText } from "./parser";
import { runRulesEngine, computeTotals, computeRecoverable } from "./rules-engine";
import { getSample } from "./samples";

export type AnalyzeInput = {
  text?: string;
  fileName?: string;
  sampleId?: string;
  patientName?: string;
};

export function scoreFor(flags: Flag[]): AnalysisResult["score"] {
  const total = flags.reduce((a, f) => a + f.overcharge, 0);
  if (flags.length === 0) return "clean";
  if (flags.length <= 2 || total < 1000) return "minor";
  return "major";
}

export function analyzeBillSync(input: AnalyzeInput): AnalysisResult {
  let text = input.text ?? "";
  let fileName = input.fileName ?? "paste.txt";
  let parsedBy: AnalysisResult["parsedBy"] = "regex";

  if (input.sampleId) {
    const sample = getSample(input.sampleId);
    if (!sample) throw new Error(`Unknown sample: ${input.sampleId}`);
    text = sample.text;
    fileName = sample.name;
    parsedBy = "sample";
  }

  const bill = parseBillText(text, fileName);
  if (bill.items.length === 0) {
    throw new Error("No bill line items were recognized. Try a sample bill or check the format.");
  }
  const totals = computeTotals(bill);
  bill.totalBilled = bill.totalBilled || totals.totalBilled;
  bill.totalAllowed = bill.totalAllowed || totals.totalAllowed;
  bill.totalPaid = bill.totalPaid || totals.totalPaid;
  bill.patientDue = bill.patientDue ?? totals.patientDue;

  const flags = runRulesEngine(bill);
  const result: AnalysisResult = {
    bill,
    flags,
    totalRecoverable: computeRecoverable(bill, flags),
    score: scoreFor(flags),
    parsedBy,
    analyzedBy: "rules",
    generatedAt: new Date().toISOString(),
  };
  return result;
}
