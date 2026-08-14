import { describe, expect, it } from "vitest";
import { computeRecoverable, computeTotals, runRulesEngine } from "../lib/rules-engine";
import { parseBillText } from "../lib/parser";
import { getSample } from "../lib/samples";

describe("runRulesEngine", () => {
  it("flags a duplicated MRI line", () => {
    const bill = parseBillText(
      `EXPLANATION OF BENEFITS
Member: Jane Doe
01  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $497.00  $397.60
02  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $497.00  $397.60
TOTAL BILLED: $4,800.00`,
      "dup.txt"
    );
    const flags = runRulesEngine(bill);
    const dup = flags.find((f) => f.type === "duplicate");
    expect(dup).toBeDefined();
    expect(dup?.overcharge).toBe(2400);
  });

  it("flags an arithmetic total mismatch", () => {
    const bill = parseBillText(
      `EXPLANATION OF BENEFITS
Member: Jane Doe
01  06/10/2026  99213  Office visit, established, level 3  1  $320.00  $78.00  $62.40
02  06/10/2026  99213  Office visit, established, level 3  1  $320.00  $78.00  $62.40
TOTAL BILLED: $700.00`,
      "arith.txt"
    );
    const flags = runRulesEngine(bill);
    const arith = flags.find((f) => f.type === "arithmetic" && f.id === "arith-total");
    expect(arith).toBeDefined();
    expect(arith?.overcharge).toBe(60);
  });

  it("flags a balance-billed non-covered charge", () => {
    const bill = parseBillText(
      `EXPLANATION OF BENEFITS
Member: Jane Doe
01  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $0.00  $0.00
TOTAL BILLED: $2,400.00`,
      "bb.txt"
    );
    const flags = runRulesEngine(bill);
    const bb = flags.find((f) => f.type === "balance-bill");
    expect(bb).toBeDefined();
    expect(bb?.overcharge).toBe(2400);
  });

  it("runs clean on a sample bill", () => {
    const sample = getSample("sample-mri");
    expect(sample).toBeDefined();
    const bill = parseBillText(sample!.text, sample!.name);
    const flags = runRulesEngine(bill);
    expect(flags.length).toBeGreaterThan(0);
    const total = computeRecoverable(bill, flags);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(bill.totalBilled);
  });
});

describe("computeTotals", () => {
  it("sums line items and derives patient due", () => {
    const bill = parseBillText(
      `EXPLANATION OF BENEFITS
01  06/10/2026  73721  MRI knee joint without contrast  1  $2,400.00  $497.00  $397.60
02  06/10/2026  99213  Office visit, established, level 3  1  $320.00  $78.00  $62.40`,
      "t.txt"
    );
    const totals = computeTotals(bill);
    expect(totals.totalBilled).toBe(2720);
    expect(totals.totalAllowed).toBe(575);
    expect(totals.totalPaid).toBe(460);
    expect(totals.patientDue).toBe(115);
  });
});
