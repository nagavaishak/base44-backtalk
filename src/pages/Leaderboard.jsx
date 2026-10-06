import React from "react";
import { useNavigate } from "react-router-dom";
import { GitFork } from "lucide-react";
import { getLeaderboard } from "@/lib/store";

export default function Leaderboard() {
  const navigate = useNavigate();
  const rows = getLeaderboard();

  return (
    <div className="max-w-[640px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] bt-track-tighter bt-ink">Leaderboard</h1>
      <p className="mt-2 text-[13px] bt-ink/45">Public takes, ranked by 1Y return.</p>

      <div className="mt-6 flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className="flex items-center gap-3 p-3.5 rounded-[16px] bt-hairline bg-white hover:bg-black/[0.015] transition"
          >
            <button
              onClick={() => (r.belief != null ? navigate(`/takes/${r.id}`) : undefined)}
              className="flex items-center gap-4 flex-1 min-w-0 text-left"
            >
              <span className="w-6 text-center text-[14px] font-semibold bt-ink/40">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-medium bt-ink truncate">{r.title}</div>
                <div className="text-[12px] bt-ink/45 mt-0.5 truncate">@{r.handle || "you"}</div>
              </div>
              <span className={`text-[14px] font-semibold w-16 text-right ${r.return1y >= 0 ? "bt-pos" : "bt-neg"}`}>
                {(r.return1y >= 0 ? "+" : "") + r.return1y.toFixed(2) + "%"}
              </span>
            </button>
            <button
              onClick={() => navigate(`/takes/${r.id}/fork`)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/[0.04] transition shrink-0"
              aria-label="Fork"
            >
              <GitFork size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}