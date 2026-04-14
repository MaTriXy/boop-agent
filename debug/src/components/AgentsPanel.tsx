import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

const STATUS_COLORS: Record<string, string> = {
  spawned: "bg-sky-500/20 text-sky-400",
  running: "bg-sky-500/20 text-sky-400 live-dot",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-rose-500/20 text-rose-400",
  cancelled: "bg-amber-500/20 text-amber-400",
};

export function AgentsPanel({ isDark }: { isDark: boolean }) {
  const agents = useQuery(api.agents.list, { limit: 50 });
  const [selected, setSelected] = useState<string | null>(null);
  const logs = useQuery(
    api.agents.getLogs,
    selected ? { agentId: selected, limit: 500 } : "skip",
  );

  const card = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white border-slate-200";
  const row = isDark
    ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
    : "bg-slate-50 border-slate-200 hover:border-slate-300";
  const heading = isDark ? "text-slate-500" : "text-slate-500";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="grid grid-cols-[minmax(340px,1fr)_2fr] gap-4">
      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${heading}`}>
          Recent agents
        </h2>
        {!agents ? (
          <Empty isDark={isDark}>Loading…</Empty>
        ) : agents.length === 0 ? (
          <Empty isDark={isDark}>No agents spawned yet.</Empty>
        ) : (
          <div className="space-y-2">
            {agents.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a.agentId)}
                className={`block w-full text-left border rounded-lg p-3 transition ${row} ${
                  selected === a.agentId ? "!border-sky-500/60" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-[10px] mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded uppercase font-bold ${STATUS_COLORS[a.status] ?? ""}`}
                  >
                    {a.status}
                  </span>
                  <span className={muted + " mono"}>{a.name}</span>
                  <span className={`${muted} ml-auto mono`}>
                    {new Date(a.startedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className={`text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {a.task}
                </div>
                <div className={`text-[10px] mono mt-1 ${muted}`}>
                  tok {a.inputTokens}/{a.outputTokens}
                  {a.mcpServers.length > 0 && " · " + a.mcpServers.join(", ")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${heading}`}>
          Logs {selected && <code className="text-[10px] ml-1 mono">{selected}</code>}
        </h2>
        {!selected ? (
          <Empty isDark={isDark}>Pick an agent on the left.</Empty>
        ) : !logs ? (
          <Empty isDark={isDark}>Loading…</Empty>
        ) : logs.length === 0 ? (
          <Empty isDark={isDark}>No logs for this agent.</Empty>
        ) : (
          <div className="space-y-2">
            {logs.map((l) => (
              <div key={l._id} className={`border rounded-lg p-3 ${row}`}>
                <div className="flex items-center gap-2 text-[10px] mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded mono ${
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {l.logType}
                  </span>
                  {l.toolName && (
                    <span className={muted + " mono"}>{l.toolName}</span>
                  )}
                  <span className={`${muted} ml-auto mono`}>
                    {new Date(l.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`text-xs whitespace-pre-wrap break-all ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  {l.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className={`py-6 text-center text-sm ${isDark ? "text-slate-600" : "text-slate-400"}`}>
      {children}
    </div>
  );
}
