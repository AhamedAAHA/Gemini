import type { Bill, BillItem, Flag } from "./types";
import { BUNDLED_RULES, REFERENCE_PRICES, REFERENCE_RATIO_THRESHOLD } from "./reference-data";

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
  flags.push(...detectUpcode(bill, excluded));
  flags.push(...detectBundled(bill));
  flags.push(...detectBalanceBilled(bill));

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

const SEVERITY_KEYWORDS: Array<[string, number]> = [
  ["minimal", 1],
  ["level 1", 1],
  ["level 2", 2],
  ["level 3", 3],
  ["level 4", 4],
  ["level 5", 5],
  ["brief", 2],
  ["limited", 2],
];

function detectUpcode(bill: Bill, excluded = new Set<number>()): Flag[] {
  const out: Flag[] = [];
  for (const item of bill.items) {
    if (excluded.has(item.line)) continue;
    const code = item.code?.toUpperCase();
    if (!code || !REFERENCE_PRICES[code]) continue;
    const ref = REFERENCE_PRICES[code];
    if (!ref.severity) continue;
    const desc = item.description.toLowerCase();
    const hint = SEVERITY_KEYWORDS.find(([kw]) => desc.includes(kw));
    if (hint && hint[1] < ref.severity) {
      push(out, {
        id: `upcode-${item.line}`,
        type: "upcode",
        severity: "medium",
        heuristic: true,
        title: `Possible upcoding on ${code} (${ref.description})`,
        explanation: `The line item's own description reads "${item.description}", which suggests a lower service level, yet it was billed as ${code}. Upcoding (billing a more expensive level than provided) inflates your bill.`,
        evidence: [
          `Description hints at level ${hint[1]}, billed as level ${ref.severity} (${code})`,
          `Reference price for ${code}: $${ref.allowable.toFixed(2)}`,
        ],
        overcharge: Math.max(0, item.amount - ref.allowable),
        itemLines: [item.line],
      });
    }
  }
  return out;
}

function detectBundled(bill: Bill): Flag[] {
  const out: Flag[] = [];
  const codes = new Set(bill.items.map((i) => i.code?.toUpperCase()).filter(Boolean));
  for (const item of bill.items) {
    const code = item.code?.toUpperCase();
    if (!code || !BUNDLED_RULES[code]) continue;
    const rule = BUNDLED_RULES[code];
    if (codes.has(rule.requires)) {
      push(out, {
        id: `bundle-${item.line}`,
        type: "bundled",
        severity: "high",
        title: `${item.description} should be bundled into the ${rule.requires} service`,
        explanation: rule.note,
        evidence: [
          `${code} ($${item.amount.toFixed(2)}) billed separately while ${rule.requires} is also on the bill`,
        ],
        overcharge: item.amount,
        itemLines: [item.line],
      });
    }
  }
  return out;
}

function detectBalanceBilled(bill: Bill): Flag[] {
  const out: Flag[] = [];
  for (const item of bill.items) {
    if (item.amount > 0 && item.allowed === 0 && item.paid === 0) {
      push(out, {
        id: `bb-${item.line}`,
        type: "balance-bill",
        severity: "medium",
        title: `Possible non-covered / balance-billed charge: ${item.description}`,
        explanation:
          "This line shows a full charge with nothing paid or allowed by insurance — a classic sign of a denied, non-covered, or balance-billed service. This is exactly the kind of charge worth an appeal or a negotiation call.",
        evidence: [
          `Charged $${item.amount.toFixed(2)} with $0 allowed and $0 paid by insurer`,
        ],
        overcharge: item.amount,
        itemLines: [item.line],
      });
    }
  }
  return out;
}

export function computeTotals(bill: Bill): {
  totalBilled: number;
  totalAllowed: number;
  totalPaid: number;
  patientDue: number;
} {
  const totalBilled = sum(bill.items.map((i) => i.amount));
  const totalAllowed = sum(bill.items.map((i) => i.allowed ?? 0));
  const totalPaid = sum(bill.items.map((i) => i.paid ?? 0));
  const patientDue = round2(Math.max(0, totalAllowed - totalPaid));
  return { totalBilled, totalAllowed, totalPaid, patientDue };
}

// "Recoverable" is an upper bound with no double counting: flags targeting the
// same line are claims against the same charge, so only the largest applies.
// Bill-level findings (e.g. a total mismatch) add on top, capped at the bill.
export function computeRecoverable(bill: Bill, flags: Flag[]): number {
  const perLine = new Map<number, number>();
  let billLevel = 0;
  for (const f of flags) {
    if (f.itemLines.length === 0) {
      billLevel += f.overcharge;
      continue;
    }
    if (f.itemLines.length === bill.items.length && bill.items.length > 1) {
      billLevel += f.overcharge;
      continue;
    }
    const primary = f.itemLines[0];
    perLine.set(primary, Math.max(perLine.get(primary) ?? 0, f.overcharge));
  }
  const total = billLevel + [...perLine.values()].reduce((a, b) => a + b, 0);
  return Math.min(bill.totalBilled, Math.round(total * 100) / 100);
}
