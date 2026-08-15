"use client";

import { useState } from "react";
import type { AgentContext, ChatMessage } from "@/lib/types";
import { renderMarkdown } from "@/app/components/ChatMarkdown";

const SUGGESTIONS = [
  "what's wrong with my bill?",
  "how much can I save?",
  "why is this so high?",
  "draft the dispute letter",
  "what do I say on the phone?",
];

export default function AgentChat({ context }: { context: AgentContext }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm Fin, your billing concierge. I found ${context.flags.length} issue${
        context.flags.length === 1 ? "" : "s"
      } on this bill worth about $${context.totalRecoverable.toFixed(0)}. Ask me anything about it.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.ok ? data.reply : `Sorry — ${data.error ?? "something went wrong"}.` },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Couldn't reach Fin. Try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex min-h-96 flex-col rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex items-center gap-2 border-b border-slate-800 p-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-black text-slate-950">
          F
        </div>
        <div>
          <div className="font-semibold">Fin</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {busy ? "thinking…" : "online — AI concierge"}
          </div>
        </div>
      </div>

      <div role="log" aria-live="polite" aria-label="Chat transcript" className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-emerald-500 text-slate-950"
                  : "rounded-bl-sm border border-slate-800 bg-slate-950 text-slate-200"
              }`}
            >
              {renderMarkdown(m.content)}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-500">
              <span className="animate-pulse">…</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => send(s)}
              className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-emerald-500/50 hover:text-emerald-300 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask Fin about your bill…"
            aria-label="Message Fin"
            className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-emerald-500/60"
          />
          <button
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
