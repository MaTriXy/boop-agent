import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

const STATUS: Record<string, string> = {
  running: "bg-sky-500/20 text-sky-400 live-dot",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-rose-500/20 text-rose-400",
};

export function AutomationsPanel({ isDark }: { isDark: boolean }) {
  const automations = useQuery(api.automations.list, {});
  const [selected, setSelected] = useState<string | null>(null);
  const runs = useQuery(
    api.automations.recentRuns,
    selected ? { automationId: selected, limit: 25 } : "skip",
  );

  const card = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white border-slate-200";
  const row = isDark
    ? "bg-slate-900/50 border-slate-800 hover:border-slate-700"
    : "bg-slate-50 border-slate-200 hover:border-slate-300";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="grid grid-cols-[minmax(360px,1fr)_2fr] gap-4">
      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${muted}`}>
          Automations
        </h2>
        {!automations ? (
          <div className={`py-6 text-center text-sm ${muted}`}>Loading…</div>
        ) : automations.length === 0 ? (
          <div className={`py-6 text-center text-sm ${muted}`}>
            None yet. Text the agent: <em>"every morning at 8, summarize my calendar"</em>.
          </div>
        ) : (
          <div className="space-y-2">
            {automations.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a.automationId)}
                className={`block w-full text-left border rounded-lg p-3 transition ${row} ${
                  !a.enabled ? "opacity-50" : ""
                } ${selected === a.automationId ? "!border-sky-500/60" : ""}`}
              >
                <div className="flex items-center gap-2 text-[10px] mono mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      a.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {a.enabled ? "enabled" : "paused"}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>{a.name}</span>
                  <span className={muted}>{a.schedule}</span>
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {a.task}
                </div>
                <div className={`text-[10px] mono mt-1 ${muted}`}>
                  {a.integrations.join(", ") || "no integrations"}
                  {a.nextRunAt && ` · next: ${new Date(a.nextRunAt).toLocaleString()}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${muted}`}>
          Recent runs{" "}
          {selected && <code className="text-[10px] ml-1 mono">{selected}</code>}
        </h2>
        {!selected ? (
          <div className={`py-6 text-center text-sm ${muted}`}>
            Pick an automation.
          </div>
        ) : !runs ? (
          <div className={`py-6 text-center text-sm ${muted}`}>Loading…</div>
        ) : runs.length === 0 ? (
          <div className={`py-6 text-center text-sm ${muted}`}>No runs yet.</div>
        ) : (
          <div className="space-y-2">
            {runs.map((r) => (
              <div key={r._id} className={`border rounded-lg p-3 ${row}`}>
                <div className="flex items-center gap-2 text-[10px] mono mb-1">
                  <span className={`px-1.5 py-0.5 rounded ${STATUS[r.status] ?? ""}`}>
                    {r.status}
                  </span>
                  <span className={`${muted} ml-auto`}>
                    {new Date(r.startedAt).toLocaleString()}
                  </span>
                </div>
                {r.result && (
                  <div
                    className={`text-xs whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {r.result}
                  </div>
                )}
                {r.error && (
                  <div className="text-xs text-rose-400">{r.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
