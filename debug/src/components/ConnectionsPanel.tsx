import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

interface Provider {
  name: string;
  configured: boolean;
  scopes: string[];
  redirectUri: string;
}

export function ConnectionsPanel({ isDark }: { isDark: boolean }) {
  const connections = useQuery(api.connections.list, {});
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetch("/api/oauth/providers")
      .then((r) => r.json())
      .then(setProviders)
      .catch(() => setProviders([]));
  }, []);

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
          Connect a provider
        </h2>
        {providers.length === 0 ? (
          <div className={`py-6 text-center text-sm ${muted}`}>
            Loading providers…
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {providers.map((p) => (
              <div key={p.name} className={`border rounded-lg p-3 ${row}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded mono ${
                      p.configured
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {p.configured ? "configured" : "not configured"}
                  </span>
                  <span
                    className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {p.name}
                  </span>
                </div>
                <code
                  className={`text-[10px] block break-all ${muted}`}
                >
                  {p.redirectUri}
                </code>
                {p.configured ? (
                  <a
                    href={`/api/oauth/${p.name}/start`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs px-3 py-1.5 rounded bg-sky-600 text-white hover:bg-sky-500 transition"
                  >
                    Connect {p.name}
                  </a>
                ) : (
                  <span className={`text-xs ${muted} mt-2 block`}>
                    Add CLIENT_ID + CLIENT_SECRET to .env.local, restart.
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-lg border p-4 ${card}`}>
        <h2 className={`text-xs uppercase tracking-wider mb-3 ${muted}`}>
          Active connections
        </h2>
        {!connections ? (
          <div className={`py-6 text-center text-sm ${muted}`}>Loading…</div>
        ) : connections.length === 0 ? (
          <div className={`py-6 text-center text-sm ${muted}`}>
            No OAuth connections yet.
          </div>
        ) : (
          <div className="space-y-2">
            {connections.map((c) => (
              <div key={c._id} className={`border rounded-lg p-3 ${row}`}>
                <div className="flex items-center gap-2 text-[10px] mono">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      c.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-slate-700"}>
                    {c.service}
                  </span>
                  {c.accountLabel && <span className={muted}>{c.accountLabel}</span>}
                  <span className={`${muted} ml-auto`}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <code className={`text-[10px] mono block mt-1 ${muted}`}>
                  {c.connectionId}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
