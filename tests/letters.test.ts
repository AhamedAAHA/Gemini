import { describe, expect, it } from "vitest";
import { deadlineFor, draftAppealLetter, fmtDate, negotiationChecklist } from "../lib/letters";
import { getSample } from "../lib/samples";
import { parseBillText } from "../lib/parser";
import { runRulesEngine } from "../lib/rules-engine";

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
