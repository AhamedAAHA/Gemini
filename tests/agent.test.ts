import { describe, expect, it } from "vitest";
import { agentReply } from "../lib/agent";
import { analyzeBillSync } from "../lib/analyze";
import type { AgentContext, ChatMessage } from "../lib/types";

function makeContext(): AgentContext {
  const result = analyzeBillSync({ sampleId: "sample-mri" });
  return {
    bill: result.bill,
    flags: result.flags,
    totalRecoverable: result.totalRecoverable,
  };
}

function ask(text: string): ChatMessage[] {
  return [{ role: "user", content: text }];
}

describe("local concierge replies", () => {
  it("summarizes what's wrong with the bill", async () => {
    const reply = await agentReply(makeContext(), ask("what's wrong with my bill?"));
    expect(reply).toMatch(/issues?/i);
  });

  it("drafts the dispute letter on request", async () => {
    const reply = await agentReply(makeContext(), ask("draft the dispute letter"));
    expect(reply).toMatch(/Subject:/i);
  });

  it("provides a call script", async () => {
    const reply = await agentReply(makeContext(), ask("what do I say on the phone?"));
    expect(reply).toMatch(/CALL SCRIPT/i);
  });

  it("explains the biggest issue", async () => {
    const reply = await agentReply(makeContext(), ask("why is this so high?"));
    expect(reply).toMatch(/biggest problem/i);
  });
});
