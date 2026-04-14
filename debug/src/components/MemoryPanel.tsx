import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

type Tier = "short" | "long" | "permanent";

const TIER_COLOR: Record<Tier, string> = {
  short: "text-amber-400",
  long: "text-sky-400",
  permanent: "text-emerald-400",
};

export function MemoryPanel({ isDark }: { isDark: boolean }) {
  const [tier, setTier] = useState<Tier | "all">("all");
  const counts = useQuery(api.memoryRecords.countsByTier, {});
  const memories = useQuery(api.memoryRecords.list, {
    tier: tier === "all" ? undefined : tier,
    lifecycle: "active",
    limit: 150,
  });

  const card = isDark
    ? "bg-slate-900/40 border-slate-800"
    : "bg-white border-slate-200";
  const row = isDark
    ? "bg-slate-900/50 border-slate-800"
    : "bg-slate-50 border-slate-200";
  const muted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className="space-y-4">
      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${muted}`}>
          Memory tiers
        </h2>
        <div className="grid grid-cols-5 gap-2">
          <Stat label="Short" value={counts?.short ?? 0} tint={TIER_COLOR.short} isDark={isDark} />
          <Stat label="Long" value={counts?.long ?? 0} tint={TIER_COLOR.long} isDark={isDark} />
          <Stat label="Permanent" value={counts?.permanent ?? 0} tint={TIER_COLOR.permanent} isDark={isDark} />
          <Stat label="Archived" value={counts?.archived ?? 0} isDark={isDark} />
          <Stat label="Pruned" value={counts?.pruned ?? 0} isDark={isDark} />
        </div>
      </div>

      <div className={`rounded-lg border p-4 ${card}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-xs uppercase tracking-wider ${muted}`}>
            Active memories
          </h2>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier | "all")}
            className={`text-xs px-2 py-1 rounded border ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <option value="all">All tiers</option>
            <option value="short">Short</option>
            <option value="long">Long</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        {!memories ? (
          <div className={`py-6 text-center text-sm ${muted}`}>Loading…</div>
        ) : memories.length === 0 ? (
          <div className={`py-6 text-center text-sm ${muted}`}>
            No memories yet. Text the agent a fact about you and watch it appear.
          </div>
        ) : (
          <div className="space-y-2">
            {memories.map((m) => (
              <div key={m._id} className={`border rounded-lg p-3 ${row}`}>
                <div className="flex items-center gap-2 text-[10px] mb-1 mono">
                  <span
                    className={`px-1.5 py-0.5 rounded bg-slate-800/50 ${TIER_COLOR[m.tier as Tier] ?? ""}`}
                  >
                    {m.tier}
                  </span>
                  <span className={muted}>{m.segment}</span>
                  <span className={muted}>i={m.importance.toFixed(2)}</span>
                  <span className={muted}>×{m.accessCount}</span>
                  <span className={`${muted} ml-auto`}>
                    {new Date(m.lastAccessedAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`text-sm ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  {m.content}
                </div>
                <code className={`text-[10px] ${muted}`}>{m.memoryId}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tint,
  isDark,
}: {
  label: string;
  value: number;
  tint?: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        {label}
      </div>
      <div
        className={`text-2xl font-semibold mono mt-1 ${tint ?? (isDark ? "text-slate-200" : "text-slate-800")}`}
      >
        {value}
      </div>
    </div>
  );
}
