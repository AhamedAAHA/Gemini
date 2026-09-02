import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";

describe("Health API Route", () => {
  it("returns status ok and ISO timestamp", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });
});
