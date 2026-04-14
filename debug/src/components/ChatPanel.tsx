import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

const CONVERSATION_ID = "debug:local";

export function ChatPanel({ isDark }: { isDark: boolean }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messages = useQuery(api.messages.recent, {
    conversationId: CONVERSATION_ID,
    limit: 50,
  });
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages?.length]);

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: CONVERSATION_ID, content: input }),
      });
      setInput("");
    } finally {
      setSending(false);
    }
  }

  const card = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white border-slate-200";

  return (
    <div
      className={`flex flex-col h-full rounded-lg border ${card}`}
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <div
        ref={listRef}
        className="flex-1 overflow-auto debug-scroll p-4 space-y-2"
      >
        {!messages || messages.length === 0 ? (
          <div
            className={`text-center py-8 text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            No messages yet. Say hi.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[80%] ${m.role === "user" ? "ml-auto" : ""}`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-sky-600 text-white"
                    : isDark
                      ? "bg-slate-800 text-slate-100"
                      : "bg-slate-100 text-slate-800"
                }`}
              >
                {m.content}
              </div>
              <div
                className={`text-[10px] mt-1 mono ${
                  isDark ? "text-slate-600" : "text-slate-400"
                } ${m.role === "user" ? "text-right" : ""}`}
              >
                {m.role} · {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        className={`border-t p-3 flex gap-2 ${
          isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-200"
        }`}
      >
        <input
          className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none ${
            isDark
              ? "bg-slate-800 text-slate-100 placeholder-slate-500 focus:bg-slate-700/80"
              : "bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white border border-slate-200"
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Text your agent…"
          disabled={sending}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="px-4 py-2 rounded-lg text-sm bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {sending ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
