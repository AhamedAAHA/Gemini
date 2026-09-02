import { NextRequest, NextResponse } from "next/server";
import { analyzeBill } from "@/lib/analyze";
import { getSample } from "@/lib/samples";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 100000; // 100KB limit

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      text?: unknown;
      fileName?: unknown;
      sampleId?: unknown;
    };

    if (body.text !== undefined && typeof body.text !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid text format" }, { status: 400 });
    }

    if (body.fileName !== undefined && typeof body.fileName !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid fileName format" }, { status: 400 });
    }

    if (body.sampleId !== undefined && typeof body.sampleId !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid sampleId format" }, { status: 400 });
    }

    const text = body.text ? (body.text as string).trim() : undefined;
    const fileName = body.fileName ? (body.fileName as string).trim().slice(0, 255) : undefined;
    const sampleId = body.sampleId ? (body.sampleId as string).trim() : undefined;

    if (text && text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { ok: false, error: `Text payload exceeds maximum limit of ${MAX_TEXT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (sampleId && !getSample(sampleId)) {
      return NextResponse.json({ ok: false, error: "Invalid sample bill ID." }, { status: 400 });
    }

    if (!text && !sampleId) {
      return NextResponse.json({ ok: false, error: "Either text or sampleId must be provided." }, { status: 400 });
    }

    const result = await analyzeBill({ text, fileName, sampleId });
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
