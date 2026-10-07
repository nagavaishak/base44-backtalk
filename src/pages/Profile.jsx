import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocal } from "@/lib/useLocal";
import { getTakes, getProfile } from "@/lib/store";

function SegmentAvatar({ size = 72 }) {
  const colors = ["#C7B98E", "#7C8A9A", "#B5AFA4", "#C9A86A"];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M20 0 A20 20 0 0 1 40 20 L20 20 Z" fill={colors[0]} />
      <path d="M40 20 A20 20 0 0 1 20 40 L20 20 Z" fill={colors[1]} />
      <path d="M20 40 A20 20 0 0 1 0 20 L20 20 Z" fill={colors[2]} />
      <path d="M0 20 A20 20 0 0 1 20 0 L20 20 Z" fill={colors[3]} />
    </svg>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-[640px]">
      <div className="flex items-center gap-4"><div className="bt-skel w-[72px] h-[72px] rounded-full" /><div><div className="bt-skel h-7 w-40" /><div className="bt-skel h-4 w-28 mt-2" /></div></div>
      <div className="bt-skel h-px w-full mt-6" />
      <div className="bt-skel h-4 w-40 mt-5" />
      <div className="mt-4 flex flex-col gap-3">{[0,1].map(i=><div key={i} className="bt-card p-4"><div className="bt-skel h-4 w-48" /><div className="bt-skel h-3 w-32 mt-3" /></div>)}</div>
    </div>
  );
}

export default function Profile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(false);
  const { loading, data, error, retry } = useLocal(() => {
    const me = getProfile();
    const isOwn = me.handle === handle;
    const takes = getTakes().filter((t) => t.public && t.funded);
    return { me, isOwn, takes };
  });

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="text-[13px] text-muted">Couldn't load. <button className="text-stgreen underline" onClick={retry}>Retry</button></div>;

  const { me, isOwn, takes } = data;
  const best = takes.length ? Math.min(...takes.map((t) => t.return1y || 0)) : 0;

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center gap-4">
        <SegmentAvatar size={72} />
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-[28px] font-semibold bt-track-tighter text-ink leading-none">{me.displayName}</h1>
          <div className="text-[13.5px] text-muted mt-1.5">@{me.handle}</div>
          {me.bio && <p className="text-[13px] text-ink/75 mt-2 leading-relaxed">{me.bio}</p>}
        </div>
        {isOwn ? (
          <button
            onClick={() => navigate("/settings")}
            className="px-4 h-9 rounded-full border border-line text-[13px] text-ink hover:bg-cream transition"
          >
            Edit profile
          </button>
        ) : (
          <button
            onClick={() => setFollowing((v) => !v)}
            className={`px-4 h-9 rounded-full text-[13px] font-medium transition ${
              following ? "border border-line text-ink hover:bg-cream" : "bg-stgreen text-white hover:brightness-110"
            }`}
          >
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-line flex items-center gap-6 text-[13px] text-muted">
        <span><span className="text-ink font-medium">{me.following || 0}</span> following</span>
        <span><span className={`font-medium ${best < 0 ? "text-loss" : "text-stgreen"}`}>{best >= 0 ? "+" : ""}{best.toFixed(1)}%</span> best</span>
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="bt-caps text-muted">{takes.length} published takes</h2>
        <span className="text-[12px] text-muted">Return since start</span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {takes.length === 0 && <div className="text-[13px] text-muted">No published takes yet.</div>}
        {takes.map((t) => {
          const preview = t.positions.slice(0, 3).map((p) => p.ticker);
          const more = t.positions.length - 3;
          const opens = t.statusLabel === "Opens at the bell";
          const ret = t.return1y || 0;
          return (
            <button
              key={t.id}
              onClick={() => navigate(`/takes/${t.id}`)}
              className="bt-card p-4 flex items-center gap-4 hover:bg-cream/60 transition text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium text-ink">{t.title}</div>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-muted">
                  <span>{preview.join(" · ")}{more > 0 ? ` +${more}` : ""}</span>
                  <span className="inline-flex items-center px-2 h-5 rounded-full bg-ink/[0.04] text-[10.5px] text-ink/70">Practice</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {opens ? (
                  <div className="text-[13px] text-muted">Opens at the bell</div>
                ) : (
                  <>
                    <div className={`text-[14px] font-semibold tabular-nums ${ret >= 0 ? "text-stgreen" : "text-loss"}`}>
                      {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                    </div>
                    <div className="text-[11.5px] text-muted">since Oct 5</div>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-center text-[11.5px] text-muted leading-relaxed">
        Past performance is not indicative of future results. Practice results are simulated; no money was invested. <button className="underline">Report a profile</button>
      </p>
    </div>
  );
}