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
    <section className="glass-card flex min-h-[480px] flex-col rounded-3xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 p-4 bg-slate-950/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 font-display text-base font-black text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)]">
          F
        </div>
        <div>
          <div className="font-bold text-slate-100">Fin AI</div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" aria-hidden="true" />
            {busy ? "Thinking…" : "Billing Concierge"}
          </div>
        </div>
      </div>

      <div role="log" aria-live="polite" aria-label="Chat transcript" className="flex-1 space-y-3.5 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-xs bg-emerald-500 font-medium text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "rounded-bl-xs border border-white/10 bg-slate-950/90 text-slate-200"
              }`}
            >
              {renderMarkdown(m.content)}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-xs border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-400">
              <span className="animate-pulse font-mono">Analyzing context…</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-4 bg-slate-950/60">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => send(s)}
              className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-mono text-[11px] text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-300 disabled:opacity-50"
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
            className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 outline-none transition focus:border-emerald-500/60"
          />
          <button
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="glow-emerald rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
