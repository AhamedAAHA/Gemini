import { describe, expect, it } from "vitest";
import { classifyCode, detectBillType, parseBillText, parseMoney } from "../lib/parser";

describe("parseMoney", () => {
  it("parses formatted currency", () => {
    expect(parseMoney("$2,400.00")).toBe(2400);
    expect(parseMoney("0.00")).toBe(0);
    expect(parseMoney("bogus")).toBeNaN();
  });
});

describe("classifyCode", () => {
  it("classifies cpt, hcpcs, revenue, and unknown codes", () => {
    expect(classifyCode("73721")).toBe("cpt");
    expect(classifyCode("E0434")).toBe("hcpcs");
    expect(classifyCode("270")).toBe("revenue");
    expect(classifyCode("NOPE")).toBe("unknown");
  });
});

describe("detectBillType", () => {
  it("detects eob and hospital types", () => {
    expect(detectBillType("EXPLANATION OF BENEFITS")).toBe("EOB");
    expect(detectBillType("Hospital statement")).toBe("hospital");
    expect(detectBillType("anything else")).toBe("unknown");
  });
});

describe("parseBillText", () => {
  const SAMPLE = `EXPLANATION OF BENEFITS
Member: Jane Doe
Member ID: 123456789
Provider: St. Mary's Hospital
Date of service: 06/10/2026
Statement date: 06/30/2026

Line  Date        Code    Description                               Qty  Billed      Allowed     Paid
01  06/10/2026  73721  MRI knee joint without contrast           1  $2,400.00  $497.00  $397.60
02  06/10/2026  99213  Office visit, established, level 3        1  $320.00    $78.00    $62.40

TOTAL BILLED: $2,720.00
TOTAL ALLOWED: $575.00
TOTAL PAID: $460.00
AMOUNT YOU OWE: $115.00`;

  it("parses header fields and line items", () => {
    const bill = parseBillText(SAMPLE, "eob.txt");
    expect(bill.fileName).toBe("eob.txt");
    expect(bill.type).toBe("EOB");
    expect(bill.patientName).toBe("Jane Doe");
    expect(bill.memberId).toBe("123456789");
    expect(bill.providerName).toBe("St. Mary's Hospital");
    expect(bill.serviceDate).toBe("06/10/2026");
    expect(bill.items).toHaveLength(2);
    expect(bill.items[0]).toMatchObject({
      line: 1,
      code: "73721",
      codeType: "cpt",
      quantity: 1,
      amount: 2400,
      allowed: 497,
      paid: 397.6,
    });
    expect(bill.totalBilled).toBe(2720);
    expect(bill.totalAllowed).toBe(575);
    expect(bill.totalPaid).toBe(460);
  });

  it("honors an explicit amount you owe", () => {
    const bill = parseBillText(SAMPLE, "eob.txt");
    expect(bill.patientDue).toBe(115);
  });

  it("falls back to allowed minus paid when no amount owed is given", () => {
    const noOwe = SAMPLE.replace("AMOUNT YOU OWE: $115.00", "");
    const bill = parseBillText(noOwe, "eob.txt");
    expect(bill.patientDue).toBe(115);
  });
});
