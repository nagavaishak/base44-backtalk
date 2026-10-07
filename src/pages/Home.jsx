import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sparkline from "@/components/Sparkline";
import AskBar from "@/components/AskBar";
import { useLocal } from "@/lib/useLocal";
import { getTakes, getPracticeSummary, getFollowFeed, getProfile } from "@/lib/store";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function combine(takes) {
  if (!takes.length) return [0, 0];
  const len = Math.max(...takes.map((t) => t.chart["1M"].values.length));
  const out = new Array(len).fill(0);
  takes.forEach((t) => t.chart["1M"].values.forEach((v, i) => { out[i] = (out[i] || 0) + v; }));
  return out.map((v) => Number(v.toFixed(2)));
}
function intraday() {
  return [0, 0.4, 0.2, 0.6, 0.5, 0.8, 0.7, 1.0].map((v) => Number((v * 0.3).toFixed(2)));
}

function HomeSkeleton() {
  return (
    <div className="max-w-[640px]">
      <div className="bt-card p-5">
        <div className="bt-skel h-3 w-32" />
        <div className="bt-skel h-10 w-44 mt-3" />
        <div className="bt-skel h-3 w-28 mt-3" />
        <div className="bt-skel h-14 w-full mt-4" />
      </div>
      <div className="mt-8 bt-skel h-4 w-24" />
      <div className="bt-skel h-6 w-20 mt-3" />
      <div className="mt-4 bt-card p-4"><div className="bt-skel h-3 w-40" /><div className="bt-skel h-4 w-64 mt-3" /></div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [range, setRange] = useState("1D");
  const { loading, data, error, retry } = useLocal(() => {
    const takes = getTakes().filter((t) => t.funded);
    const summary = getPracticeSummary();
    const feed = getFollowFeed();
    const profile = getProfile();
    const series = range === "1D" ? intraday() : combine(takes);
    return { takes, summary, feed, profile, series };
  }, [range]);

  if (loading) return <HomeSkeleton />;
  if (error) return (
    <div className="text-[13px] text-muted">Couldn't load. <button className="text-stgreen underline" onClick={retry}>Retry</button></div>
  );

  const { summary, feed, profile, series } = data;
  const up = summary.todayChange >= 0;

  return (
    <div className="max-w-[640px] pb-2">
      <div className="bt-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[12px] text-muted">{greeting()}, {profile.displayName.toLowerCase()}.</div>
            <div className="text-[11px] text-muted mt-0.5">Practice money</div>
            <div className="font-heading text-[40px] font-medium bt-track-tighter text-ink mt-1 tabular-nums leading-none">
              ${summary.value.toFixed(2)}
            </div>
            <div className={`text-[13px] font-medium mt-2 tabular-nums ${up ? "text-stgreen" : "text-loss"}`}>
              {up ? "▲" : "▼"} ${Math.abs(summary.todayChange).toFixed(2)} today
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex gap-1">
              {["1D", "1W"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 h-7 rounded-full text-[12px] transition ${range === r ? "text-ink font-medium" : "text-muted hover:text-ink"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <Sparkline values={series} positive={up} width={180} height={56} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bt-caps text-muted">On Supertake</div>
        <h2 className="font-heading text-[26px] font-semibold bt-track-tight text-ink mt-1">Today</h2>
        <p className="text-[13.5px] text-muted mt-1">What people are building, forking and reading.</p>

        <div className="mt-4 flex flex-col gap-3">
          {feed.length === 0 && <div className="text-[13px] text-muted">Nothing new yet today.</div>}
          {feed.map((f) => (
            <div key={f.id} className="bt-card p-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-ink/[0.06] text-ink flex items-center justify-center text-[12px] font-semibold">
                  {f.avatar}
                </div>
                <div className="text-[12.5px] text-muted min-w-0">
                  <span className="text-ink font-medium">{f.author}</span> {f.action}
                </div>
                <div className="ml-auto text-[11.5px] text-muted shrink-0">{f.time}</div>
              </div>
              <div className="mt-2.5 font-heading text-[18px] font-medium bt-track-tight text-ink">{f.title}</div>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap text-[12px] text-muted">
                <span>{f.tickers.join(" · ")} +{f.more}</span>
                <span>·</span>
                <span>{f.status}</span>
              </div>
              <button
                onClick={() => navigate("/takes/new")}
                className="mt-3 px-3.5 h-8 rounded-full border border-line text-[12.5px] text-ink hover:bg-cream transition"
              >
                Fork
              </button>
            </div>
          ))}
        </div>
      </div>

      <AskBar />
    </div>
  );
}