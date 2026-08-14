import { NextRequest, NextResponse } from "next/server";
import { analyzeBill } from "@/lib/analyze";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    text?: string;
    fileName?: string;
    sampleId?: string;
  };
  const result = await analyzeBill(body);
  return NextResponse.json({ ok: true, result });
}
