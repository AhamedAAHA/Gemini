import { describe, expect, it } from "vitest";
import { usd, usdCompact } from "../lib/format";

describe("usd", () => {
  it("formats as currency", () => {
    expect(usd(5818)).toBe("$5,818.00");
    expect(usd(0)).toBe("$0.00");
    expect(usd(694.5)).toBe("$694.50");
  });
});

describe("usdCompact", () => {
  it("abbreviates large numbers", () => {
    expect(usdCompact(2000)).toBe("$2k");
    expect(usdCompact(2500)).toBe("$2.5k");
    expect(usdCompact(999)).toBe("$999");
  });
});
