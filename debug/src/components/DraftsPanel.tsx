import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

const STATUS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 live-dot",
  sent: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-rose-500/20 text-rose-400",
  expired: "bg-slate-500/20 text-slate-400",
};

export function DraftsPanel({ isDark }: { isDark: boolean }) {
  const drafts = useQuery(api.drafts.recent, { limit: 100 });

  const card = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white border-slate-200";
  const row = isDark
    ? "bg-slate-900/50 border-slate-800"
    : "bg-slate-50 border-slate-200";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className={`rounded-lg border p-4 ${card}`}>
      <h2 className={`text-xs uppercase tracking-wider mb-3 ${muted}`}>
        Drafts
      </h2>
      {!drafts ? (
        <div className={`py-6 text-center text-sm ${muted}`}>Loading…</div>
      ) : drafts.length === 0 ? (
        <div className={`py-6 text-center text-sm ${muted}`}>
          No drafts. When an agent stages an external action (email, event, Slack), it shows up here.
        </div>
      ) : (
        <div className="space-y-2">
          {drafts.map((d) => (
            <div key={d._id} className={`border rounded-lg p-3 ${row}`}>
              <div className="flex items-center gap-2 text-[10px] mono mb-1">
                <span className={`px-1.5 py-0.5 rounded ${STATUS[d.status] ?? ""}`}>
                  {d.status}
                </span>
                <span className={muted}>{d.kind}</span>
                <span className={muted}>{d.conversationId}</span>
                <span className={`${muted} ml-auto`}>
                  {new Date(d.createdAt).toLocaleString()}
                </span>
              </div>
              <div
                className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                {d.summary}
              </div>
              <details className="mt-1">
                <summary
                  className={`text-[10px] cursor-pointer ${muted}`}
                >
                  payload
                </summary>
                <pre
                  className={`text-[11px] mono whitespace-pre-wrap mt-1 p-2 rounded ${
                    isDark ? "bg-slate-950/60 text-slate-400" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(d.payload), null, 2);
                    } catch {
                      return d.payload;
                    }
                  })()}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
