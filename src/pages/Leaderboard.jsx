import React, { useState } from "react";
import {
  ShoppingBag, DoorOpen, Sun, LayoutGrid, Fingerprint, Stethoscope, Cpu, Zap, FlaskConical, GitFork,
} from "lucide-react";
import { useLocal } from "@/lib/useLocal";
import { getLeaderboard } from "@/lib/store";

const ICONS = {
  bag: ShoppingBag, door: DoorOpen, sun: Sun, grid: LayoutGrid, fingerprint: Fingerprint,
  stethoscope: Stethoscope, chip: Cpu, bolt: Zap, flask: FlaskConical,
};

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function LeaderboardSkeleton() {
  return (
    <div className="max-w-[760px]">
      <div className="bt-skel h-9 w-44" />
      <div className="bt-skel h-4 w-72 mt-3" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bt-skel h-12 w-full" />)}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [tab, setTab] = useState("takes");
  const [filter, setFilter] = useState("30d");
  const { loading, data, error, retry } = useLocal(() => getLeaderboard());

  if (loading) return <LeaderboardSkeleton />;
  if (error) return <div className="text-[13px] text-muted">Couldn't load. <button className="text-stgreen underline" onClick={retry}>Retry</button></div>;

  const rows = data;
  const people = [];
  rows.forEach((r) => {
    const p = people.find((x) => x.author === r.author);
    if (p) p.ret = Math.max(p.ret, r.ret);
    else people.push({ author: r.author, ret: r.ret });
  });
  people.sort((a, b) => b.ret - a.ret);

  return (
    <div className="max-w-[760px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] font-semibold bt-track-tighter text-ink">Leaderboard</h1>
      <p className="mt-2 text-[13px] text-muted">The last 30 days, or the whole record for takes public less than 30 days.</p>

      <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-4 text-[14px]">
          <button
            onClick={() => setTab("takes")}
            className={`pb-1 ${tab === "takes" ? "text-ink font-medium border-b-2 border-ink" : "text-muted hover:text-ink"}`}
          >
            Takes
          </button>
          <button
            onClick={() => setTab("people")}
            className={`pb-1 ${tab === "people" ? "text-ink font-medium border-b-2 border-ink" : "text-muted hover:text-ink"}`}
          >
            People
          </button>
        </div>
        <div className="flex gap-1 text-[13px]">
          {["Today", "7d", "30d", "All"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 h-8 rounded-full transition ${filter === f ? "text-ink font-medium" : "text-muted hover:text-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {tab === "takes" ? (
        <div className="mt-6">
          {/* header */}
          <div className="hidden sm:grid grid-cols-[28px_1fr_90px_110px_90px] gap-3 px-2 pb-2 bt-caps text-muted">
            <span>#</span><span>Take</span><span>Mode</span><span>Public for</span><span className="text-right">Return</span>
          </div>
          <div className="flex flex-col">
            {rows.map((r, i) => {
              const Icon = ICONS[r.icon] || LayoutGrid;
              return (
                <div key={r.id} className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[28px_1fr_90px_110px_90px] gap-3 items-center px-2 py-3.5 border-b border-line">
                  <span className="text-[13px] text-muted tabular-nums">{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-ink/[0.05] flex items-center justify-center text-ink shrink-0">
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-ink truncate">{r.title}</div>
                      <div className="text-[12px] text-muted truncate flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-ink/[0.08] flex items-center justify-center text-[8px] font-semibold text-ink">{initials(r.author)}</span>
                        {r.author}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="inline-flex items-center px-2 h-6 rounded-full bg-ink/[0.04] text-[11.5px] text-ink/75">{r.mode}</span>
                  </div>
                  <div className="hidden sm:block text-[12.5px] text-muted">{r.publicFor}</div>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold text-stgreen tabular-nums">+{r.ret.toFixed(1)}%</div>
                    {r.forks != null && <div className="text-[11px] text-muted">{r.forks} forks</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col">
          {people.map((p, i) => (
            <div key={p.author} className="grid grid-cols-[28px_1fr_90px] gap-3 items-center px-2 py-3.5 border-b border-line">
              <span className="text-[13px] text-muted tabular-nums">{i + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-full bg-ink/[0.06] flex items-center justify-center text-[11px] font-semibold text-ink">{initials(p.author)}</span>
                <span className="text-[14px] font-medium text-ink truncate">{p.author}</span>
              </div>
              <div className="text-right text-[14px] font-semibold text-stgreen tabular-nums">+{p.ret.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-[11.5px] text-muted leading-relaxed">
        Past performance is not indicative of future results. Practice results are simulated; no money was invested.
      </p>
    </div>
  );
}