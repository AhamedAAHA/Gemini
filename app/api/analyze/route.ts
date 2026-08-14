import { NextRequest, NextResponse } from "next/server";
import { analyzeBill } from "@/lib/analyze";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      text?: string;
      fileName?: string;
      sampleId?: string;
    };
    const result = await analyzeBill(body);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
