import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp, Copy, Edit, RefreshCw, Trash2, Settings as SettingsIcon, Layers, Newspaper, Lightbulb, Link2 } from "lucide-react";
import Chart from "@/components/Chart";
import Mascot from "@/components/Mascot";
import { getTake, deleteTakeById, duplicateTake, upsertTake, getProfile } from "@/lib/store";

export default function TakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [take, setTake] = useState(() => getTake(id));
  const [period, setPeriod] = useState("1Y");
  const [vsMarket, setVsMarket] = useState(false);
  const [tab, setTab] = useState("feed"); // feed | idea | news
  const [comingSoon, setComingSoon] = useState(false);
  const [ask, setAsk] = useState("");
  const [copied, setCopied] = useState(false);
  const profile = getProfile();

  if (!take) {
    return (
      <div className="max-w-[560px]">
        <p className="text-[15px] bt-ink/55">This take could not be found.</p>
        <button onClick={() => navigate("/takes")} className="mt-4 text-[14px] bt-green underline">Back to takes</button>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard?.writeText(`backtalk.app/${profile.handle}/${take.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const onMakeReal = () => {
    setComingSoon(true);
    setTimeout(() => setComingSoon(false), 2200);
  };

  const onDelete = () => {
    deleteTakeById(take.id);
    navigate("/takes", { replace: true });
  };
  const onDuplicate = () => {
    const copy = duplicateTake(take.id);
    if (copy) navigate(`/takes/${copy.id}`);
  };
  const onEditSummary = () => {
    const next = window.prompt("Edit your public summary", take.summary);
    if (next != null) {
      const updated = { ...take, summary: next };
      upsertTake(updated);
      setTake(updated);
    }
  };

  const fmtPct = (v) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%";

  return (
    <div className="max-w-[640px] pb-28">
      {/* header row */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[12px] bt-ink/45">Practice</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onMakeReal}
            className="px-3.5 h-8 rounded-full bt-bg-green text-white text-[13px] font-medium hover:brightness-110 transition"
          >
            Make it real
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center w-8 h-8 rounded-full bt-hairline hover:bg-black/[0.03] transition"
            aria-label="Settings"
          >
            <SettingsIcon size={15} />
          </button>
        </div>
      </div>

      {comingSoon && (
        <div className="mb-4 px-3 py-2 rounded-full bt-hairline text-[12px] bt-ink/55 inline-block bt-fade">
          Coming soon
        </div>
      )}

      <h1 className="font-heading text-[32px] sm:text-[38px] leading-[1.05] bt-track-tighter bt-ink">{take.title}</h1>
      <button
        onClick={copyLink}
        className="mt-2 flex items-center gap-1.5 text-[12.5px] bt-ink/45 hover:bt-ink transition"
      >
        <Link2 size={12} />
        {copied ? "copied" : `backtalk.app/${profile.handle}/${take.id}`}
      </button>

      <div className="mt-5 flex items-end gap-3">
        <span className="font-heading text-[40px] leading-none bt-track-tighter bt-ink">${take.value.toFixed(2)}</span>
        <span className={`text-[14px] font-medium mb-1 ${take.todayChange >= 0 ? "bt-pos" : "bt-neg"}`}>
          {fmtPct(take.todayChange)} today
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bt-bg-pos text-white text-[12px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-white" /> On track
        </span>
        <span className="text-[13px] bt-ink/55">{take.onTrackNote}</span>
        <button className="text-[13px] bt-green hover:underline">Check now</button>
      </div>

      {/* chart */}
      <div className="mt-6 p-5 rounded-[20px] bt-hairline bg-white">
        <Chart
          take={take}
          period={period}
          onPeriod={setPeriod}
          vsMarket={vsMarket}
          onVsMarket={() => setVsMarket((v) => !v)}
        />
      </div>

      <p className="mt-3 text-[11.5px] bt-ink/35 leading-relaxed">
        Simulates buying this basket at the start of this window and holding through to today, using historical prices and the current target weights. Past performance is not a predictor of future results.
      </p>

      {/* pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setTab("feed")}
          className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-[13px] transition ${
            tab === "feed" ? "bg-black/[0.07] bt-ink font-medium" : "bt-ink/55 hover:bg-black/[0.04]"
          }`}
        >
          <Layers size={13} /> {take.positions.length} positions
        </button>
        <button
          onClick={() => setTab("news")}
          className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-[13px] transition ${
            tab === "news" ? "bg-black/[0.07] bt-ink font-medium" : "bt-ink/55 hover:bg-black/[0.04]"
          }`}
        >
          <Newspaper size={13} /> News
        </button>
        <button
          onClick={() => setTab("idea")}
          className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-[13px] transition ${
            tab === "idea" ? "bg-black/[0.07] bt-ink font-medium" : "bt-ink/55 hover:bg-black/[0.04]"
          }`}
        >
          <Lightbulb size={13} /> The idea
        </button>
      </div>

      <div className="mt-5">
        {tab === "feed" && <Feed take={take} />}
        {tab === "idea" && (
          <IdeaPanel
            take={take}
            profile={profile}
            onEdit={onEditSummary}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        )}
        {tab === "news" && (
          <div className="text-[13px] bt-ink/45 py-6">No news yet for this take.</div>
        )}
      </div>

      {/* sticky ask input */}
      <div className="sticky bottom-0 z-30 -mx-4 sm:-mx-6 mt-6 px-4 sm:px-6 pb-4 pt-3 bg-gradient-to-t from-white via-white to-transparent">
        <div className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full bt-hairline bg-white">
          <Mascot size={26} />
          <input
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ask.trim()) {
                setAsk("");
              }
            }}
            placeholder="Ask about this take…"
            className="flex-1 bg-transparent outline-none text-[14px] bt-ink placeholder:text-[#0A0A0A]/35 py-2"
          />
          <button
            disabled={!ask.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              ask.trim() ? "bt-bg-green text-white" : "bt-disabled bg-[#D9DAD4] text-[#0A0A0A]/45"
            }`}
            aria-label="Send"
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Feed({ take }) {
  return (
    <div>
      <div className="text-[12px] bt-ink/45 mb-3">Today</div>
      <div className="flex flex-col gap-2.5">
        {take.activity.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-[16px] bt-hairline bg-white">
            <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#0E4B32]" />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] bt-ink/80 leading-snug">{a.label}</div>
              <div className="text-[11.5px] bt-ink/40 mt-0.5">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdeaPanel({ take, profile, onEdit, onDelete, onDuplicate }) {
  const [copied, setCopied] = useState(false);
  const copyProfile = () => {
    navigator.clipboard?.writeText(`backtalk.app/${profile.handle}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="p-5 rounded-[20px] bt-hairline bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold bt-ink/70">The idea · public summary</h3>
          <button onClick={onEdit} className="flex items-center gap-1 text-[12.5px] bt-ink/55 hover:bt-ink transition">
            <Edit size={12} /> Edit
          </button>
        </div>
        <p className="text-[14.5px] bt-ink/75 leading-relaxed">{take.summary}</p>
      </div>

      <div className="p-5 rounded-[20px] bt-hairline bg-white">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold bt-ink/70">Public illustration</span>
          <button className="flex items-center gap-1.5 text-[12.5px] bt-ink/55 hover:bt-ink transition">
            <RefreshCw size={12} /> Regenerate
          </button>
        </div>
        <div className="mt-3 h-32 rounded-[14px] bt-cream bg-[#F4F4EF] flex items-center justify-center">
          <Mascot size={40} />
        </div>
      </div>

      <div className="p-5 rounded-[20px] bt-hairline bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] bt-ink/45">Your public profile</div>
            <div className="text-[14px] bt-ink font-medium mt-0.5">backtalk.app/{profile.handle}</div>
          </div>
          <button onClick={copyProfile} className="flex items-center gap-1.5 text-[12.5px] bt-ink/55 hover:bt-ink transition">
            <Copy size={13} /> {copied ? "copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-[16px] bt-cream bg-[#F4F4EF] text-[12.5px] bt-ink/55 leading-relaxed">
        Your first orders are queued for the next market open. Automation unlocks once they fill.
      </div>

      <div className="flex items-center justify-between pt-1">
        <button className="text-[13px] bt-ink/55 hover:bt-ink transition">Manage</button>
        <div className="flex items-center gap-2">
          <button onClick={onDuplicate} className="px-3.5 h-9 rounded-full bt-hairline text-[13px] bt-ink/70 hover:bg-black/[0.03] transition">
            Duplicate
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3.5 h-9 rounded-full text-[13px] text-white bt-bg-neg hover:brightness-110 transition"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}