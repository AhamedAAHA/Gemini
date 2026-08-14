import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import type { Bill, Flag } from "./types";
import { bedrockConfigured } from "./bedrock";

const MODEL = process.env.BILLSCOPE_SEMANTIC_MODEL ?? "anthropic.claude-3-5-haiku-20241022-v1:0";

export async function runSemanticPass(bill: Bill): Promise<Flag[]> {
  if (!bedrockConfigured()) return [];
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION ?? "us-east-1" });
  const prompt = [
    "You are a medical-billing auditor. Analyze this JSON medical bill for SEMANTIC billing errors that a simple rules engine cannot catch.",
    "Examples: an emergency-room facility fee charged while the patient was admitted (should be inpatient), duplicate facility+professional charges for the same service, unbundled supplies that should be included, charges for services on dates the patient wasn't seen, obvious mismatches between the description and what a real service costs.",
    "Return a JSON array only. Each element: {\"title\": string, \"type\": \"semantic\", \"severity\": \"low|medium|high\", \"explanation\": string, \"evidence\": [string], \"overcharge\": number, \"itemLines\": [number]}. Return [] if nothing is confidently wrong.",
    "",
    "BILL:",
    JSON.stringify(bill),
  ].join("\n");

  try {
    const resp = await client.send(
      new ConverseCommand({
        modelId: MODEL,
        system: [{ text: "Return only valid JSON. No markdown." }],
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 1500, temperature: 0 },
      })
    );
    const text =
      (resp.output?.message?.content as Array<{ text?: string }> | undefined)
        ?.map((c) => c.text ?? "")
        .join("") ?? "";
    const parsed = JSON.parse(text.replace(/```(?:json)?/gi, "").trim());
    if (!Array.isArray(parsed)) return [];
    return (parsed as Array<Record<string, unknown>>)
      .filter((f) => f && typeof f.title === "string" && typeof f.overcharge === "number" && f.overcharge > 0)
      .map((f, i) => ({
        id: `sem-${i}`,
        type: "semantic" as const,
        severity: (["low", "medium", "high"].includes(String(f.severity)) ? f.severity : "medium") as Flag["severity"],
        title: f.title as string,
        explanation: (f.explanation as string) ?? "",
        evidence: Array.isArray(f.evidence) ? (f.evidence as string[]) : [],
        overcharge: f.overcharge as number,
        itemLines: Array.isArray(f.itemLines) ? (f.itemLines as number[]) : [],
      }));
  } catch {
    return [];
  }
}
