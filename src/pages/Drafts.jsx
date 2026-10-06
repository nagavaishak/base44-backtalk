import React from "react";
import { useNavigate } from "react-router-dom";
import { getTakes } from "@/lib/store";

export default function Drafts() {
  const navigate = useNavigate();
  const drafts = getTakes().filter((t) => t.funded === false);

  return (
    <div className="max-w-[640px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] bt-track-tighter bt-ink">Drafts</h1>
      <p className="mt-2 text-[13px] bt-ink/45">Takes you've built but not yet invested in.</p>

      {drafts.length === 0 ? (
        <div className="mt-6 p-5 rounded-[20px] bt-hairline bg-white text-[13.5px] bt-ink/55">
          No drafts yet. Builds from the interview will show up here.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-1.5">
          {drafts.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/takes/${t.id}/draft`)}
              className="flex items-center gap-4 p-3.5 rounded-[16px] bt-hairline bg-white hover:bg-black/[0.015] transition text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-medium bt-ink truncate">{t.title}</div>
                <div className="text-[12px] bt-ink/45 mt-0.5 truncate">"{t.belief}"</div>
                <div className="text-[12px] bt-ink/40 mt-1">
                  {t.positions.length} positions · practice mode
                </div>
              </div>
              <span className="text-[13px] bt-green shrink-0">Review</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}