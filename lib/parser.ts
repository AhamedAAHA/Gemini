import type { Bill, BillItem, CodeType } from "./types";

const MONEY = /^\$?([\d,]+\.\d{2})$/;
const LINE_RE =
  /^\s*(\d{1,3})\s+(\d{2}\/\d{2}\/\d{4})\s+([A-Z0-9]{1,6})\s+(.+?)\s{2,}(\d{1,2})\s+\$?([\d,]+\.\d{2})\s+\$?([\d,]+\.\d{2})\s+\$?([\d,]+\.\d{2})\s*$/;

export function classifyCode(code: string): CodeType {
  const c = code.toUpperCase().trim();
  if (/^\d{5}$/.test(c)) return "cpt";
  if (/^[A-Z]\d{4}$/.test(c)) return "hcpcs";
  if (/^\d{1,4}$/.test(c)) return "revenue";
  return "unknown";
}

export function parseMoney(s: string): number {
  const m = MONEY.exec(s.trim());
  return m ? parseFloat(m[1].replace(/,/g, "")) : NaN;
}

const TYPE_MAP: Record<string, Bill["type"]> = {
  EOB: "EOB",
  "EXPLANATION OF BENEFITS": "EOB",
  HOSPITAL: "hospital",
  DENTAL: "dental",
  AMBULANCE: "ambulance",
};

export function detectBillType(raw: string): Bill["type"] {
  const upper = raw.toUpperCase();
  for (const [key, value] of Object.entries(TYPE_MAP)) {
    if (upper.includes(key)) return value;
  }
  return "unknown";
}

export function parseBillText(raw: string, fileName: string): Bill {
  const lines = raw.split(/\r?\n/);
  const items: BillItem[] = [];

  let providerName: string | undefined;
  let patientName: string | undefined;
  let memberId: string | undefined;
  let serviceDate: string | undefined;
  let statementDate: string | undefined;
  let totalBilled = 0;
  let totalAllowed = 0;
  let totalPaid = 0;
  let patientDue: number | undefined;
  let sawItems = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (!sawItems) {
      const m = /^(?:provider|rendering provider)\s*:\s*(.+)$/i.exec(line);
      if (m && !providerName) providerName = m[1].trim();

      const n = /^member\s*(?:name)?\s*:\s*(.+)$/i.exec(line);
      if (n && !patientName) patientName = n[1].trim();

      const id = /^member\s*id\s*:\s*(\S+)/i.exec(line);
      if (id && !memberId) memberId = id[1].trim();

      const sd = /^date\s*of\s*service\s*:\s*([\d/]+)/i.exec(line);
      if (sd && !serviceDate) serviceDate = sd[1].trim();

      const st = /^statement\s*date\s*:\s*([\d/]+)/i.exec(line);
      if (st && !statementDate) statementDate = st[1].trim();
    }

    const lm = LINE_RE.exec(line);
    if (lm) {
      sawItems = true;
      const [, ln, date, code, description, qty, billed, allowed, paid] = lm;
      const amount = parseFloat(billed.replace(/,/g, ""));
      items.push({
        line: parseInt(ln, 10),
        date,
        description: description.replace(/\s+/g, " ").trim(),
        code,
        codeType: classifyCode(code),
        quantity: parseInt(qty, 10),
        amount,
        allowed: parseFloat(allowed.replace(/,/g, "")),
        paid: parseFloat(paid.replace(/,/g, "")),
      });
      totalBilled += amount;
      totalAllowed += parseFloat(allowed.replace(/,/g, ""));
      totalPaid += parseFloat(paid.replace(/,/g, ""));
    }

    const t = /^total\s+billed\s*:\s*\$?([\d,]+\.\d{2})/i.exec(line);
    if (t) totalBilled = parseFloat(t[1].replace(/,/g, ""));

    const pd = /^(?:amount\s+you\s+owe|you\s+may\s+owe)\s*:\s*\$?([\d,]+\.\d{2})/i.exec(line);
    if (pd) patientDue = parseFloat(pd[1].replace(/,/g, ""));
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    id: `bill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fileName,
    source: "upload",
    type: detectBillType(raw),
    providerName,
    patientName,
    memberId,
    serviceDate,
    statementDate,
    totalBilled: round2(totalBilled),
    totalAllowed: round2(totalAllowed),
    totalPaid: round2(totalPaid),
    patientDue: patientDue !== undefined ? round2(patientDue) : round2(Math.max(0, totalAllowed - totalPaid)),
    items,
  };
}
