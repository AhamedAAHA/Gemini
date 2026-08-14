import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Tool,
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
    "",
    "Use the provided tools when the user asks for a dispute/appeal letter, a call script, a deadline, or a code lookup.",
  ].join("\n");
}

const TOOLS: Tool[] = [
  {
    toolSpec: {
      name: "draft_letter",
      description: "Draft a formal dispute/appeal letter for the current bill.",
      inputSchema: {
        json: {
          type: "object",
          properties: { patientName: { type: "string" } },
        },
      },
    },
  },
  {
    toolSpec: {
      name: "call_script",
      description: "Generate a phone call script for disputing charges with the provider's billing department.",
      inputSchema: { json: { type: "object", properties: {} } },
    },
  },
  {
    toolSpec: {
      name: "deadline",
      description: "Return the deadline by which the dispute should be filed.",
      inputSchema: { json: { type: "object", properties: {} } },
    },
  },
  {
    toolSpec: {
      name: "lookup_code",
      description: "Look up a CPT/HCPCS code's description and fair-market reference price.",
      inputSchema: {
        json: {
          type: "object",
          properties: { code: { type: "string" } },
          required: ["code"],
        },
      },
    },
  },
];

function executeTool(ctx: AgentContext, name: string, input: Record<string, unknown>): Record<string, unknown> {
  switch (name) {
    case "draft_letter": {
      const letter = draftAppealLetter(ctx.bill, ctx.flags, (input.patientName as string) ?? ctx.bill.patientName);
      return { subject: letter.subject, deadline: fmtDate(letter.deadline), totalDisputed: letter.totalDisputed, body: letter.body };
    }
    case "call_script":
      return { script: callScript(ctx.bill, ctx.flags) };
    case "deadline":
      return { deadline: fmtDate(deadlineFor(ctx.bill)) };
    case "lookup_code": {
      const ref = getReference(String(input.code ?? ""));
      return ref ? { code: ref.code, description: ref.description, referencePrice: ref.allowable } : { found: false };
    }
    default:
      return { ok: false };
  }
}

function extractText(msg: Message): string {
  const blocks = msg.content ?? [];
  return blocks
    .map((b) => ("text" in b ? (b as { text?: string }).text ?? "" : ""))
    .join("")
    .trim();
}

function hasToolUse(msg: Message): boolean {
  return (msg.content ?? []).some((b) => "toolUse" in b);
}

export async function bedrockAgentReply(ctx: AgentContext, history: Msg[]): Promise<string> {
  if (!bedrockConfigured() || !client) throw new Error("Bedrock not configured");

  const last = history[history.length - 1]?.content.toLowerCase() ?? "";
  const needsTools =
    /letter|appeal|dispute|script|call script|deadline|how long|when|lookup|code 9/i.test(last);
  const modelId = needsTools ? STRONG_MODEL : CHEAP_MODEL;

  const messages: Message[] = history.map((m) => ({
    role: m.role,
    content: [{ text: m.content }] as ContentBlock[],
  }));

  const base = {
    modelId,
    messages,
    system: [{ text: systemPrompt(ctx) }],
    inferenceConfig: { maxTokens: 1024, temperature: 0.3 },
    toolConfig: needsTools ? { tools: TOOLS } : undefined,
  };

  let resp = await client.send(new ConverseCommand(base));
  let msg = resp.output?.message;

  for (let i = 0; i < 3 && msg && (resp.stopReason === "tool_use" || hasToolUse(msg)); i++) {
    const results = (msg.content ?? [])
      .filter((b) => "toolUse" in b)
      .map((b) => {
        const tu = (b as { toolUse: { toolUseId?: string; name?: string; input?: Record<string, unknown> } }).toolUse;
        return {
          toolResult: {
            toolUseId: tu.toolUseId ?? "",
            content: [{ json: executeTool(ctx, tu.name ?? "", tu.input ?? {}) }],
          },
        };
      }) as ContentBlock[];

    messages.push(msg, { role: "user", content: results });
    resp = await client.send(new ConverseCommand({ ...base, messages }));
    msg = resp.output?.message;
  }

  return (msg ? extractText(msg) : "") || "I couldn't find an answer for that yet — could you rephrase?";
}
