import React from "react";
import { simpleBuckets } from "@/lib/store";

export default function Holdings({ take }) {
  const buckets = take.buckets || simpleBuckets(take.positions);
  const cash = take.cash || 0;
  const segments = [...buckets.map((b) => ({ color: b.color, w: b.weight }))];
  if (cash) segments.push({ color: "#D1D5DB", w: cash });

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-[20px] font-semibold bt-track-tight text-ink">What you'd own</h2>
        <span className="text-[12px] text-muted text-right">
          {take.positions.length} positions · {buckets.length} buckets{cash ? ` · ${cash}% cash` : ""}
        </span>
      </div>
      <div className="mt-3 flex h-2.5 rounded-full overflow-hidden">
        {segments.map((s, i) => (
          <div key={i} style={{ width: s.w + "%", background: s.color }} />
        ))}
      </div>
      <div className="mt-2 flex flex-col">
        {buckets.map((b, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-line">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.color }} />
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] text-ink">{b.name}</div>
              <div className="text-[11.5px] text-muted truncate">{b.tickers.join(", ")}</div>
            </div>
            <span className="text-[13px] text-muted tabular-nums shrink-0">{b.weight}%</span>
          </div>
        ))}
        {cash > 0 && (
          <div className="flex items-center gap-3 py-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#D1D5DB" }} />
            <span className="flex-1 text-[13.5px] text-ink">Cash</span>
            <span className="text-[13px] text-muted tabular-nums">{cash}%</span>
          </div>
        )}
      </div>
    </div>
  );
}