import { NextRequest, NextResponse } from "next/server";
import { agentReply } from "@/lib/agent";
import type { AgentContext, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages: ChatMessage[];
      context: AgentContext;
    };
    const reply = await agentReply(body.context, body.messages);
    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
