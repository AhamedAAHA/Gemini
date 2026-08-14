import { NextResponse } from "next/server";
import { SAMPLE_BILLS } from "@/lib/samples";

export async function GET() {
  const meta = SAMPLE_BILLS.map(({ id, name, type, blurb }) => ({ id, name, type, blurb }));
  return NextResponse.json({ ok: true, samples: meta });
}
