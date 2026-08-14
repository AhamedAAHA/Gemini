import type { Bill, Flag } from "./types";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function deadlineFor(bill: Bill): Date {
  const base = bill.statementDate
    ? new Date(bill.statementDate)
    : bill.serviceDate
      ? new Date(bill.serviceDate)
      : new Date();
  if (isNaN(base.getTime())) return addDays(new Date(), 30);
  return addDays(base, 30);
}

export type AppealLetter = {
  subject: string;
  salutation: string;
  body: string;
  deadline: Date;
  totalDisputed: number;
};

export function draftAppealLetter(bill: Bill, flags: Flag[], patientName?: string): AppealLetter {
  const name = patientName || bill.patientName || "the policyholder";
  const provider = bill.providerName || "your facility";
  const deadline = deadlineFor(bill);
  const totalDisputed = flags.reduce((a, f) => a + f.overcharge, 0);

  const bullets = flags
    .map(
      (f) =>
        `- **${f.title}** — ${f.explanation}\n    Evidence: ${f.evidence.join("; ")}`
    )
    .join("\n");

  const body = [
    `Dear Billing Department,`,
    ``,
    `I am writing to formally dispute the balance on my account (Statement dated ${bill.statementDate ?? "recently"}) from ${provider} in the amount of $${bill.patientDue?.toFixed(2) ?? "N/A"}, because it contains charges that I believe are incorrect. My analysis identified the following issues:`,
    ``,
    bullets,
    ``,
    `In total, I am disputing $${totalDisputed.toFixed(2)} of this bill. Per the Patient Protection and Affordable Care Act and fair-billing standards, I request that you:`,
    ``,
    `1. Re-audit these line items against the actual services provided.`,
    `2. Provide written documentation (itemized coding and audit trail) supporting each disputed charge.`,
    `3. Suspend any collections activity on the disputed amount until the review is complete.`,
    ``,
    `Please respond in writing within 30 days. I am prepared to file a formal appeal with my insurer and a complaint with my state's Attorney General and Department of Insurance if this is not resolved fairly.`,
    ``,
    `Thank you for your prompt attention to this matter.`,
    ``,
    `Sincerely,`,
    name,
  ].join("\n");

  return {
    subject: `Dispute of account balance — ${provider}`,
    salutation: `To: Billing Department, ${provider}`,
    body,
    deadline,
    totalDisputed,
  };
}

export function callScript(bill: Bill, flags: Flag[]): string {
  const items = flags
    .map((f) => `   - "${f.title}": ${f.evidence[0]}`)
    .join("\n");
  return [
    `CALL SCRIPT — Billing department of ${bill.providerName ?? "the provider"}`,
    ``,
    `"Hi, my name is _____, a patient at your facility. I received bill [${bill.fileName}] and I'm calling to dispute several charges. I'd like to speak with the billing supervisor, please."`,
    ``,
    `If asked which charges:`,
    items,
    ``,
    `Key phrases:`,
    `   - "I'd like this re-audited and an itemized statement with the coding audit trail."`,
    `   - "Please put the disputed balance on hold while this is reviewed."`,
    `   - "If we can't resolve this today, I will file a formal appeal and a complaint with the state insurance department."`,
    ``,
    `Take notes: date, time, name of the person you spoke to, reference number, and exactly what they promised.`,
  ].join("\n");
}

export function negotiationChecklist(bill: Bill): string[] {
  return [
    `Gather the itemized bill, your insurer's EOB, and this analysis.`,
    `Call the provider's billing department (script above) before the deadline.`,
    `If the provider won't move, file a formal appeal with your insurer.`,
    `Contact your state's Department of Insurance if the dispute is unresolved.`,
    `Never pay the disputed amount while it is under review.`,
  ];
}
