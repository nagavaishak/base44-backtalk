import React from "react";
import { useNavigate } from "react-router-dom";
import Sparkline from "@/components/Sparkline";
import { getTakes } from "@/lib/store";

export default function Takes() {
  const navigate = useNavigate();
  const takes = getTakes();

  return (
    <div className="max-w-[640px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] bt-track-tighter bt-ink">Takes</h1>
      <div className="mt-6 flex flex-col gap-2.5">
        {takes.length === 0 && (
          <div className="p-6 rounded-[20px] bt-hairline text-[14px] bt-ink/50">
            No takes yet.
          </div>
        )}
        {takes.map((t) => {
          const last = t.chart["1M"].values.at(-1);
          return (
            <button
              key={t.id}
              onClick={() => navigate(`/takes/${t.id}`)}
              className="flex items-center gap-4 p-4 rounded-[18px] bt-hairline bg-white hover:bg-black/[0.015] transition text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium bt-ink truncate">{t.title}</div>
                <div className="text-[12.5px] bt-ink/45 mt-0.5">${t.value.toFixed(2)} · {t.positions.length} positions</div>
              </div>
              <Sparkline values={t.chart["1M"].values} positive={last >= 0} />
              <span className={`text-[14px] font-semibold w-16 text-right ${last >= 0 ? "bt-pos" : "bt-neg"}`}>
                {(last >= 0 ? "+" : "") + last.toFixed(2) + "%"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}