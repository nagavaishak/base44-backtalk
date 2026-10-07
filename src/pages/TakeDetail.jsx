import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GitFork, Settings as SettingsIcon, Link2 } from "lucide-react";
import Chart from "@/components/Chart";
import AskBar from "@/components/AskBar";
import Holdings from "@/components/Holdings";
import PlanCard from "@/components/PlanCard";
import { getTake, getProfile } from "@/lib/store";

function StatusPill({ take }) {
  const tone = take.statusTone || (take.onTrack ? "green" : "amber");
  const label = take.statusLabel || (take.onTrack ? "On track" : "Watching closely");
  const bg = tone === "amber" ? "#B48228" : "#1F6F4A";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-white text-[11.5px] font-medium" style={{ background: bg }}>
      <span className="w-1.5 h-1.5 rounded-full bg-white" /> {label}
    </span>
  );
}

export default function TakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [take, setTake] = useState(() => getTake(id));
  const [period, setPeriod] = useState(take?.defaultPeriod || "1Y");
  const [vsMarket, setVsMarket] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const [copied, setCopied] = useState(false);
  const profile = getProfile();

  if (!take) {
    return (
      <div className="max-w-[560px]">
        <p className="text-[15px] text-muted">This take could not be found.</p>
        <button onClick={() => navigate("/takes")} className="mt-4 text-[14px] text-stgreen underline">Back to takes</button>
      </div>
    );
  }
  if (!take.funded) {
    navigate(`/takes/${take.id}/draft`, { replace: true });
    return null;
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(`supertake.com/t/${take.id.slice(3)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const onMakeReal = () => { setComingSoon(true); setTimeout(() => setComingSoon(false), 2200); };
  const fmtPct = (v) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%";

  return (
    <div className="max-w-[680px] pb-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted">Practice</span>
          <StatusPill take={take} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onMakeReal} className="px-3.5 h-8 rounded-full border border-line text-[13px] text-ink hover:bg-cream transition">Make it real</button>
          <button onClick={() => navigate(`/takes/${take.id}/fork`)} className="flex items-center justify-center w-8 h-8 rounded-full border border-line hover:bg-cream transition" aria-label="Fork"><GitFork size={15} className="text-ink" /></button>
          <button onClick={() => navigate("/settings")} className="flex items-center justify-center w-8 h-8 rounded-full border border-line hover:bg-cream transition" aria-label="Settings"><SettingsIcon size={15} className="text-ink" /></button>
        </div>
      </div>
      {comingSoon && <div className="mb-3 text-[12px] text-muted">Coming soon.</div>}

      <h1 className="font-heading text-[32px] sm:text-[38px] font-semibold bt-track-tighter text-ink leading-[1.05]">{take.title}</h1>
      <button onClick={copyLink} className="mt-2 flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink transition">
        <Link2 size={12} /> {copied ? "copied" : `supertake.com/t/${take.id.slice(3)}`}
      </button>

      <div className="mt-5 flex items-end gap-3">
        <span className="font-heading text-[40px] font-medium bt-track-tighter text-ink leading-none tabular-nums">${take.value.toFixed(2)}</span>
        <span className={`text-[14px] font-medium mb-1 tabular-nums ${take.todayChange >= 0 ? "text-stgreen" : "text-loss"}`}>{fmtPct(take.todayChange)} today</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-white text-[12px] font-medium" style={{ background: take.onTrack ? "#1F6F4A" : "#B48228" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white" /> {take.onTrack ? "On track" : "Watching closely"}
        </span>
        <span className="text-[13px] text-muted">{take.onTrackNote || "Holding steady within your guardrails."}</span>
      </div>

      <div className="mt-6 bt-card p-5">
        <Chart take={take} period={period} onPeriod={setPeriod} vsMarket={vsMarket} onVsMarket={() => setVsMarket((v) => !v)} />
      </div>
      <p className="mt-3 text-[11.5px] text-muted leading-relaxed">
        Simulates buying this basket at the start of the window and holding to today, using sample prices and target weights. This is a demo — not a predictor of future results.
      </p>

      <div className="mt-8"><Holdings take={take} /></div>
      <div className="mt-5"><PlanCard take={take} /></div>

      <div className="mt-8">
        <div className="bt-caps text-muted mb-3">Today</div>
        <div className="flex flex-col gap-2.5">
          {(take.activity || []).map((a, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 bt-card">
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.tone === "tan" ? "#C9A86A" : "#1F6F4A" }} />
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] text-ink leading-snug">{a.text}</div>
                <div className="text-[11.5px] text-muted mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AskBar />
    </div>
  );
}