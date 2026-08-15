import { describe, expect, it } from "vitest";
import { analyzeBill, analyzeBillSync, scoreFor } from "../lib/analyze";
import { getSample } from "../lib/samples";
import type { Flag } from "../lib/types";

function flag(overcharge: number): Flag {
  return {
    id: `f-${overcharge}`,
    type: "duplicate",
    severity: "high",
    title: "Duplicate charge",
    explanation: "Test flag.",
    evidence: [],
    overcharge,
    itemLines: [1],
  };
}

describe("analyzeBillSync", () => {
  it("runs a sample bill end to end", () => {
    const result = analyzeBillSync({ sampleId: "sample-mri" });
    expect(result.parsedBy).toBe("sample");
    expect(result.bill.items.length).toBeGreaterThan(0);
    expect(result.flags.length).toBeGreaterThan(0);
    expect(result.score).toBe("major");
    expect(result.totalRecoverable).toBeGreaterThan(0);
    expect(result.totalRecoverable).toBeLessThanOrEqual(result.bill.totalBilled);
  });

  it("throws on unrecognized text", () => {
    expect(() => analyzeBillSync({ text: "gibberish" })).toThrow();
  });
});

describe("analyzeBill", () => {
  it("runs the full async pipeline for a sample bill", async () => {
    const result = await analyzeBill({ sampleId: "sample-mri" });
    expect(result.parsedBy).toBe("sample");
    expect(result.bill.items.length).toBeGreaterThan(0);
    expect(result.flags.length).toBeGreaterThan(0);
    expect(result.analyzedBy).toContain("rules");
    expect(result.totalRecoverable).toBeGreaterThan(0);
  });
});

describe("scoreFor", () => {
  it("returns clean, minor, and major scores", () => {
    expect(scoreFor([])).toBe("clean");
    expect(scoreFor([flag(500)])).toBe("minor");
    expect(scoreFor([flag(2500)])).toBe("minor");
    expect(scoreFor([flag(500), flag(400), flag(300)])).toBe("major");
  });
});
