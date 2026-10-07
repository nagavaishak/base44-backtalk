import React from "react";
import { useNavigate } from "react-router-dom";
import Sparkline from "@/components/Sparkline";
import AskBar from "@/components/AskBar";
import { useLocal } from "@/lib/useLocal";
import { getTakes } from "@/lib/store";

function StatusBadge({ take }) {
  const tone = take.statusTone || (take.onTrack ? "green" : "amber");
  const label = take.statusLabel || (take.onTrack ? "On track" : "Watching closely");
  const color = tone === "amber" ? "#B48228" : tone === "neutral" ? "#7A766B" : "#1F6F4A";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full bg-ink/[0.04] text-[11.5px] text-ink/75">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TakesSkeleton() {
  return (
    <div className="max-w-[640px]">
      <div className="bt-skel h-9 w-40" />
      <div className="bt-skel h-4 w-32 mt-3" />
      <div className="mt-6 flex flex-col gap-3">
        {[0, 1].map((i) => <div key={i} className="bt-card p-4"><div className="flex justify-between"><div className="bt-skel h-4 w-48" /><div className="bt-skel h-6 w-20" /></div><div className="bt-skel h-3 w-32 mt-3" /></div>)}
      </div>
    </div>
  );
}

export default function Takes() {
  const navigate = useNavigate();
  const { loading, data, error, retry } = useLocal(() => {
    const all = getTakes();
    return { active: all.filter((t) => t.funded), drafts: all.filter((t) => !t.funded) };
  });

  if (loading) return <TakesSkeleton />;
  if (error) return <div className="text-[13px] text-muted">Couldn't load. <button className="text-stgreen underline" onClick={retry}>Retry</button></div>;

  const { active, drafts } = data;

  return (
    <div className="max-w-[640px] pb-2">
      <h1 className="font-heading text-[30px] sm:text-[34px] font-semibold bt-track-tighter text-ink">Your takes</h1>
      <p className="mt-2 text-[13.5px] text-muted">{active.length} active · {drafts.length} drafts</p>

      <div className="mt-6 flex flex-col gap-3">
        {active.length === 0 && (
          <div className="bt-card p-5 text-[14px] text-muted">
            No active takes yet. <button className="text-stgreen underline" onClick={() => navigate("/takes/new")}>Start one</button>.
          </div>
        )}
        {active.map((t) => {
          const last = t.chart[t.defaultPeriod || "1M"].values.at(-1);
          const up = (t.todayChange || 0) >= 0;
          return (
            <button
              key={t.id}
              onClick={() => navigate(`/takes/${t.id}`)}
              className="bt-card p-4 flex items-center gap-4 hover:bg-cream/60 transition text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium text-ink truncate">{t.title}</div>
                <div className="text-[12px] text-muted mt-0.5">Practice · {t.positions.length} positions</div>
                <div className="mt-2"><StatusBadge take={t} /></div>
              </div>
              <Sparkline values={t.chart["1M"].values} positive={up} width={84} height={30} />
              <div className="text-right shrink-0">
                <div className="text-[16px] font-semibold text-ink tabular-nums">${t.value.toFixed(2)}</div>
                <div className={`text-[12.5px] font-medium tabular-nums ${up ? "text-stgreen" : "text-loss"}`}>
                  {up ? "+" : "-"}${Math.abs(t.todayChange || 0).toFixed(2)} today
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/takes/new")}
        className="mt-5 text-[13.5px] text-muted hover:text-ink transition"
      >
        The next one is one sentence away. <span className="text-stgreen underline">Start a take →</span>
      </button>

      <AskBar />
    </div>
  );
}