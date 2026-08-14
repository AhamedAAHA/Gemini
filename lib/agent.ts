import type { AgentContext, ChatMessage } from "./types";
import { draftAppealLetter, callScript, deadlineFor, fmtDate, negotiationChecklist } from "./letters";
import { getReference } from "./reference-data";
import { bedrockAgentReply, bedrockConfigured } from "./bedrock";

function localReply(ctx: AgentContext, history: ChatMessage[]): string {
  const text = (history[history.length - 1]?.content ?? "").toLowerCase();

  if (/(letter|appeal|dispute|write to|formal)/i.test(text)) {
    const letter = draftAppealLetter(ctx.bill, ctx.flags, ctx.bill.patientName);
    return [
      `Here's your dispute letter (file by ${fmtDate(letter.deadline)}, $${letter.totalDisputed.toFixed(2)} disputed):`,
      ``,
      `**Subject:** ${letter.subject}`,
      ``,
      letter.body,
    ].join("\n");
  }
  if (/(call script|what do i say|phone|call the|on the phone)/i.test(text)) {
    return callScript(ctx.bill, ctx.flags);
  }
  if (/(deadline|how long|when.*file|how much time)/i.test(text)) {
    return `File your dispute by **${fmtDate(deadlineFor(ctx.bill))}**. After that, the provider can send the balance to collections. Start with a call to the billing department today, then follow up in writing.`;
  }
  if (/(checklist|what do i do next|steps|next steps)/i.test(text)) {
    return negotiationChecklist(ctx.bill).map((s, i) => `${i + 1}. ${s}`).join("\n");
  }
  if (/(lookup|what.*code|code 99|what is 992|what does.*mean)/i.test(text)) {
    const m = /(?:code\s*)?(\d{5}|[A-Z]\d{4})/.exec(text);
    if (m) {
      const ref = getReference(m[1]);
      return ref
        ? `**${ref.code}** — ${ref.description}. Reference price ~$${ref.allowable.toFixed(2)}. Compare this against what was billed on your bill.`
        : `I don't have a reference price for code ${m[1]} in my curated dataset (production uses the full CMS fee schedule).`;
    }
    return `Tell me the 5-digit code (e.g., "lookup 99213") and I'll pull its description and fair price.`;
  }
  if (/(how much|owe|total|recover|save|money)/i.test(text)) {
    return [
      `Here's the money picture:`,
      `- Total billed: **$${ctx.bill.totalBilled.toFixed(2)}**`,
      `- Insurance paid: **$${(ctx.bill.totalPaid ?? 0).toFixed(2)}**`,
      `- Patient responsibility: **$${(ctx.bill.patientDue ?? 0).toFixed(2)}**`,
      `- **Est. recoverable by disputing: $${ctx.totalRecoverable.toFixed(2)}** (${ctx.flags.length} issue${ctx.flags.length === 1 ? "" : "s"} found)`,
      ``,
      `I would not pay a cent until the flagged charges are resolved. Want me to draft the dispute letter?`,
    ].join("\n");
  }
  if (/(why|explain|this high|help me understand|is this fair|normal)/i.test(text)) {
    const top = ctx.flags[0];
    if (top) {
      return [
        `The biggest problem on this bill is: **${top.title}**`,
        ``,
        top.explanation,
        ``,
        `That alone is worth about **$${top.overcharge.toFixed(2)}** in disputed charges.`,
      ].join("\n");
    }
    return `This bill actually looks clean — I didn't find obvious errors. The total is $${ctx.bill.totalBilled.toFixed(2)} and there's nothing to dispute.`;
  }
  if (/(what.*wrong|issues|flags|problems|catch)/i.test(text)) {
    if (ctx.flags.length === 0) return `No issues detected — this bill looks clean.`;
    return [
      `I found **${ctx.flags.length} issue${ctx.flags.length === 1 ? "" : "s"}**, worth ~$${ctx.totalRecoverable.toFixed(2)}:`,
      ``,
      ...ctx.flags.map((f) => `- **${f.title}** (~$${f.overcharge.toFixed(2)})\n  ${f.explanation}`),
    ].join("\n");
  }
  if (/(hi|hello|hey|help)/i.test(text)) {
    return [
      `Hi! I'm Fin, your billing concierge. I just analyzed your bill and found **${ctx.flags.length} issue${ctx.flags.length === 1 ? "" : "s"}** worth about **$${ctx.totalRecoverable.toFixed(2)}**.`,
      ``,
      `Try asking me: "why is this so high?", "what did you find?", "how much do I owe?", "draft the dispute letter", or "what do I say on the phone?".`,
    ].join("\n");
  }
  return `I can help you understand this bill and fight unfair charges. Try asking: "what's wrong with my bill?", "how much can I save?", "why is this so high?", "draft the dispute letter", or "what do I say on the phone?".`;
}

export async function agentReply(ctx: AgentContext, history: ChatMessage[]): Promise<string> {
  const fallback = localReply(ctx, history);
  if (bedrockConfigured()) {
    try {
      return await bedrockAgentReply(ctx, history);
    } catch {
      return fallback;
    }
  }
  return fallback;
}
