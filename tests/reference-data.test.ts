import { describe, expect, it } from "vitest";
import { BUNDLED_RULES, getReference, REFERENCE_PRICES, REFERENCE_RATIO_THRESHOLD } from "../lib/reference-data";

describe("reference-data", () => {
  it("looks up a code case-insensitively", () => {
    const ref = getReference("73721");
    expect(ref).toBeDefined();
    expect(ref?.description).toContain("MRI knee");
    expect(getReference("g0008")?.code).toBe("G0008");
    expect(getReference("99999")).toBeUndefined();
  });

  it("covers imaging and office visit anchors", () => {
    expect(REFERENCE_PRICES["73721"].allowable).toBe(497);
    expect(REFERENCE_PRICES["99213"].allowable).toBe(74);
    expect(REFERENCE_RATIO_THRESHOLD).toBe(2);
  });

  it("defines bundling rules for venipuncture", () => {
    expect(BUNDLED_RULES["36415"].requires).toBe("99213");
  });
});
