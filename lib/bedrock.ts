import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message,
  type ContentBlock,
} from "@aws-sdk/client-bedrock-runtime";
import type { AgentContext } from "./types";
import { draftAppealLetter, callScript, deadlineFor, fmtDate } from "./letters";
import { getReference } from "./reference-data";

const CHEAP_MODEL = process.env.BILLSCOPE_CHEAP_MODEL ?? "amazon.nova-micro-v1:0";
const STRONG_MODEL = process.env.BILLSCOPE_STRONG_MODEL ?? "anthropic.claude-3-5-haiku-20241022-v1:0";

type Msg = { role: "user" | "assistant"; content: string };

let client: BedrockRuntimeClient | null = null;
let configured: boolean | null = null;

export function bedrockConfigured(): boolean {
  if (configured !== null) return configured;
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    configured = false;
    return false;
  }
  try {
    client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });
    configured = true;
  } catch {
    configured = false;
  }
  return configured;
}

function systemPrompt(ctx: AgentContext): string {
  const flags = ctx.flags
    .map((f) => `- [${f.type}] ${f.title} (~$${f.overcharge.toFixed(0)} disputed)`)
    .join("\n");
  return [
    "You are Fin, BillScope's billing concierge. You help people understand and dispute medical bills.",
    "Be concise and warm. Cite actual line items and amounts from the bill. Never invent codes or laws.",
    "",
    "CONTEXT — the bill currently being analyzed:",
    `Provider: ${ctx.bill.providerName ?? "unknown"}`,
    `Total billed: $${ctx.bill.totalBilled.toFixed(2)}`,
    `Patient responsibility: $${(ctx.bill.patientDue ?? 0).toFixed(2)}`,
    `Estimated recoverable via dispute: $${ctx.totalRecoverable.toFixed(2)}`,
    "",
    "Issues detected:",
    flags || "- none detected",
  ].join("\n");
}

function extractText(msg: Message): string {
  const blocks = msg.content ?? [];
  return blocks
    .map((b) => ("text" in b ? (b as { text?: string }).text ?? "" : ""))
    .join("")
    .trim();
}

export async function bedrockAgentReply(ctx: AgentContext, history: Msg[]): Promise<string> {
  if (!bedrockConfigured() || !client) throw new Error("Bedrock not configured");

  const messages: Message[] = history.map((m) => ({
    role: m.role,
    content: [{ text: m.content }] as ContentBlock[],
  }));

  const resp = await client.send(
    new ConverseCommand({
      modelId: STRONG_MODEL,
      messages,
      system: [{ text: systemPrompt(ctx) }],
      inferenceConfig: { maxTokens: 1024, temperature: 0.3 },
    })
  );
  const msg = resp.output?.message;
  return (msg ? extractText(msg) : "") || "I couldn't find an answer for that yet — could you rephrase?";
}
