import { NextRequest, NextResponse } from "next/server";
import { agentReply } from "@/lib/agent";
import type { AgentContext, ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      messages?: unknown;
      context?: unknown;
    };

    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ ok: false, error: "Messages array is required." }, { status: 400 });
    }

    if (body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { ok: false, error: `Messages count must be between 1 and ${MAX_MESSAGES}.` },
        { status: 400 }
      );
    }

    for (const msg of body.messages) {
      if (!msg || typeof msg !== "object") {
        return NextResponse.json({ ok: false, error: "Invalid message format." }, { status: 400 });
      }
      const role = (msg as Record<string, unknown>).role;
      const content = (msg as Record<string, unknown>).content;

      if (role !== "user" && role !== "assistant") {
        return NextResponse.json({ ok: false, error: "Invalid message role." }, { status: 400 });
      }
      if (typeof content !== "string" || content.length > MAX_MESSAGE_LENGTH) {
        return NextResponse.json(
          { ok: false, error: `Message content must be a string up to ${MAX_MESSAGE_LENGTH} characters.` },
          { status: 400 }
        );
      }
    }

    if (!body.context || typeof body.context !== "object") {
      return NextResponse.json({ ok: false, error: "Valid context is required." }, { status: 400 });
    }

    const messages = body.messages as ChatMessage[];
    const context = body.context as AgentContext;

    if (!context.bill || !Array.isArray(context.flags)) {
      return NextResponse.json({ ok: false, error: "Invalid context structure." }, { status: 400 });
    }

    const reply = await agentReply(context, messages);
    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
