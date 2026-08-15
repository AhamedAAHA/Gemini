import { describe, expect, it } from "vitest";
import { callScript, deadlineFor, draftAppealLetter, fmtDate, negotiationChecklist } from "../lib/letters";
import { getSample } from "../lib/samples";
import { parseBillText } from "../lib/parser";
import { runRulesEngine } from "../lib/rules-engine";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

describe("letters", () => {
  it("formats a friendly date", () => {
    const d = new Date("2026-08-15T00:00:00");
    expect(fmtDate(d)).toMatch(/August/);
  });

  it("computes a 30-day deadline from the statement date", () => {
    const bill = parseBillText(
      "Statement date: 07/02/2026\n01  06/10/2026  73721  MRI 1  $2,400.00  $497.00  $397.60\nTOTAL BILLED: $2,400.00",
      "x.txt"
    );
    const deadline = deadlineFor(bill);
    expect(deadline.getTime()).toBe(new Date("2026-08-01T00:00:00").getTime());
  });

  it("falls back to today for a bill with no dates", () => {
    const before = new Date();
    const bill = parseBillText(
      "01  06/10/2026  73721  MRI 1  $2,400.00  $497.00  $397.60\nTOTAL BILLED: $2,400.00",
      "x.txt"
    );
    const deadline = deadlineFor(bill);
    const after = new Date();
    expect(deadline.getTime()).toBeGreaterThanOrEqual(addDays(before, 30).getTime());
    expect(deadline.getTime()).toBeLessThanOrEqual(addDays(after, 30).getTime());
  });

  it("writes a phone script citing the first piece of evidence", () => {
    const sample = getSample("sample-mri");
    const bill = parseBillText(sample!.text, sample!.name);
    const flags = runRulesEngine(bill);
    const script = callScript(bill, flags);
    expect(script).toContain("CALL SCRIPT");
    expect(script).toContain(bill.providerName!);
    for (const f of flags) {
      expect(script).toContain(f.title);
    }
  });

  it("drafts a letter citing each flagged issue", () => {
    const sample = getSample("sample-mri");
    const bill = parseBillText(sample!.text, sample!.name);
    const flags = runRulesEngine(bill);
    const letter = draftAppealLetter(bill, flags, "Jane Doe");
    expect(letter.subject).toContain("CITY ORTHOPEDIC CENTER");
    expect(letter.body).toContain("Jane Doe");
    expect(letter.totalDisputed).toBeGreaterThan(0);
    for (const f of flags) {
      expect(letter.body).toContain(f.title);
    }
  });

  it("provides a negotiation checklist", () => {
    const sample = getSample("sample-mri");
    const bill = parseBillText(sample!.text, sample!.name);
    const list = negotiationChecklist(bill);
    expect(list.length).toBeGreaterThan(3);
    expect(list[0]).toContain("itemized bill");
  });
});
