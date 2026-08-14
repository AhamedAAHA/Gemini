import type { Bill, BillItem, Flag } from "./types";
import { REFERENCE_PRICES, REFERENCE_RATIO_THRESHOLD } from "./reference-data";

const round2 = (n: number): number => Math.round(n * 100) / 100;
const sum = (arr: number[]): number => round2(arr.reduce((a, b) => a + (b || 0), 0));
const centsEqual = (a: number | undefined, b: number | undefined, tol = 0.011): boolean =>
  a === undefined || b === undefined ? false : Math.abs(a - b) < tol;

export function runRulesEngine(bill: Bill): Flag[] {
  const flags: Flag[] = [];
  const excluded = new Set<number>();

  const dups = detectDuplicates(bill);
  flags.push(...dups.flags);
  dups.excludedLines.forEach((l) => excluded.add(l));

  flags.push(...detectArithmetic(bill));
  flags.push(...detectInflated(bill, excluded));

  return flags.sort((a, b) => b.overcharge - a.overcharge);
}

function push(flags: Flag[], flag: Flag): void {
  if (flag.overcharge > 0) flags.push(flag);
}

function detectDuplicates(bill: Bill): { flags: Flag[]; excludedLines: number[] } {
  const out: Flag[] = [];
  const excludedLines: number[] = [];
  const groups = new Map<string, BillItem[]>();
  for (const item of bill.items) {
    const key = [item.code || "", item.date || "", item.amount, item.description.toLowerCase().trim()].join("|");
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  for (const [key, items] of groups) {
    if (items.length <= 1) continue;
    const extras = items.slice(1);
    extras.forEach((i) => excludedLines.push(i.line));
    const overcharge = sum(extras.map((i) => i.amount));
    push(out, {
      id: `dup-${key.slice(0, 24)}`,
      type: "duplicate",
      severity: "high",
      title: `Duplicate charge${extras.length > 1 ? "s" : ""}: ${items[0].description}`,
      explanation:
        "The same service appears more than once on this bill with identical code, date and amount. Duplicate line items are one of the most common billing errors — you should never pay for the same service twice.",
      evidence: [
        `${items[0].description} (${items[0].code ?? "no code"}) × ${items.length} on ${items[0].date ?? "same date"}`,
        `Lines ${items.map((i) => i.line).join(", ")} are identical`,
      ],
      overcharge,
      itemLines: extras.map((i) => i.line),
    });
  }
  return { flags: out, excludedLines };
}

function detectArithmetic(bill: Bill): Flag[] {
  const out: Flag[] = [];
  for (const item of bill.items) {
    if (item.unitPrice !== undefined && !centsEqual(item.quantity * item.unitPrice, item.amount)) {
      const correct = round2(item.quantity * item.unitPrice);
      push(out, {
        id: `arith-${item.line}`,
        type: "arithmetic",
        severity: "high",
        title: `Math error on line ${item.line}: quantity × unit price ≠ total`,
        explanation: `${item.quantity} × $${item.unitPrice.toFixed(2)} should equal $${correct.toFixed(2)}, but the bill says $${item.amount.toFixed(2)}. Billing software arithmetic errors are extremely common and easy to win on appeal.`,
        evidence: [
          `${item.quantity} × $${item.unitPrice.toFixed(2)} = $${correct.toFixed(2)} (billed: $${item.amount.toFixed(2)})`,
        ],
        overcharge: Math.abs(item.amount - correct),
        itemLines: [item.line],
      });
    }
  }

  const lineSum = sum(bill.items.map((i) => i.amount));
  if (!centsEqual(lineSum, bill.totalBilled) && bill.items.length > 0) {
    push(out, {
      id: "arith-total",
      type: "arithmetic",
      severity: "medium",
      title: "Line items don't add up to the total",
      explanation: `The itemized charges sum to $${lineSum.toFixed(2)}, but the bill's total is $${bill.totalBilled.toFixed(2)}. Someone (or some system) added the numbers wrong.`,
      evidence: [
        `Sum of itemized lines: $${lineSum.toFixed(2)}`,
        `Stated total: $${bill.totalBilled.toFixed(2)}`,
      ],
      overcharge: Math.max(0, bill.totalBilled - lineSum),
      itemLines: bill.items.map((i) => i.line),
    });
  }

  return out;
}

function detectInflated(bill: Bill, excluded = new Set<number>()): Flag[] {
  const out: Flag[] = [];
  for (const item of bill.items) {
    if (excluded.has(item.line)) continue;
    const code = item.code?.toUpperCase();
    if (!code || !REFERENCE_PRICES[code]) continue;
    const ref = REFERENCE_PRICES[code];
    const ratio = item.amount / ref.allowable;
    if (ratio >= REFERENCE_RATIO_THRESHOLD) {
      push(out, {
        id: `infl-${code}`,
        type: "inflated",
        severity: ratio >= 3 ? "high" : "medium",
        title: `${ref.description} charged ${ratio.toFixed(1)}× the reference price`,
        explanation: `This bill charges $${item.amount.toFixed(2)} for a service whose fair-market reference price is about $${ref.allowable.toFixed(2)} (Medicare-fee-schedule benchmark for ${code}). Prices 2×+ above benchmark are a strong negotiation target.`,
        evidence: [
          `Billed: $${item.amount.toFixed(2)} for ${code}`,
          `Reference price: $${ref.allowable.toFixed(2)} (${ratio.toFixed(1)}×)`,
        ],
        overcharge: Math.max(0, item.amount - ref.allowable),
        itemLines: [item.line],
      });
    }
  }
  return out;
}
