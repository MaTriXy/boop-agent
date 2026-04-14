import { query } from "./_generated/server";

export const realtimeMetrics = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db.query("memoryRecords").collect();
    const active = memories.filter((m) => m.lifecycle === "active");
    const runningAgents = await ctx.db
      .query("executionAgents")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .collect();

    return {
      shortTermCount: active.filter((m) => m.tier === "short").length,
      longTermCount: active.filter((m) => m.tier === "long").length,
      permanentCount: active.filter((m) => m.tier === "permanent").length,
      archivedCount: memories.filter((m) => m.lifecycle === "archived").length,
      runningAgents: runningAgents.length,
    };
  },
});
