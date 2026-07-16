"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";

type Usage = {
  window5h?: { tokens: number; messages: number };
  window7d?: { tokens: number; messages: number };
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return `${n}`;
}

export function AnalyticsUsagePanel() {
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => setUsage(null));
  }, []);

  const rows = [
    { label: "Last 5 hours", data: usage?.window5h },
    { label: "Last 7 days", data: usage?.window7d },
  ];

  return (
    <section className="mt-10 rounded-2xl border border-border bg-surface/40 p-5">
      <div className="flex items-center gap-2">
        <Gauge className="size-4 text-brand" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Usage telemetry</h2>
      </div>
      <p className="mt-2 text-sm text-muted">
        Reads local Claude Code usage logs when available. Provider API usage for
        OpenAI, Gemini, Claude or OpenRouter should be added through the API gateway.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-border bg-surface/50 p-4">
            <div className="text-sm text-muted">{r.label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
              {r.data ? fmt(r.data.tokens) : "--"}
            </div>
            <div className="mt-1 text-xs text-faint">
              {r.data ? `${r.data.messages} messages` : "No local usage source found"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
