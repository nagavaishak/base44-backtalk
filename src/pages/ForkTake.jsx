import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Mascot from "@/components/Mascot";
import { getTake, getLeaderboard, getProfile } from "@/lib/store";

export default function ForkTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = getProfile();
  const take = getTake(id) || getLeaderboard().find((r) => r.id === id);
  const handle = take?.handle || profile.handle;
  const title = take?.title || "this take";

  const [change, setChange] = useState("");
  const [notes, setNotes] = useState([]);
  const [done, setDone] = useState(false);

  const addChange = () => {
    if (!change.trim()) return;
    setNotes((n) => [...n, change.trim()]);
    setChange("");
  };

  return (
    <div className="max-w-[560px] pb-28">
      <span className="text-[12px] bt-ink/45">Fork</span>
      <h1 className="mt-2 font-heading text-[30px] sm:text-[34px] leading-[1.05] bt-track-tighter bt-ink">
        You're forking <span className="bt-green">@{handle}</span>'s take
      </h1>
      <p className="mt-2 text-[14px] bt-ink/55">{title}</p>

      <div className="mt-6 p-5 rounded-[20px] bt-hairline bg-white">
        <div className="text-[12px] bt-ink/45 mb-3">What would you change?</div>
        {notes.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bt-bg-green shrink-0" />
                <div className="text-[13.5px] bt-ink/75 leading-snug">{n}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-full bt-hairline bg-white">
          <Mascot size={26} />
          <input
            value={change}
            onChange={(e) => setChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addChange()}
            placeholder="change something first…"
            className="flex-1 bg-transparent outline-none text-[14px] bt-ink placeholder:text-[#0A0A0A]/35 py-2"
          />
          <button
            onClick={addChange}
            disabled={!change.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              change.trim() ? "bt-bg-green text-white" : "bg-[#D9DAD4] text-[#0A0A0A]/45"
            }`}
            aria-label="Add change"
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {done ? (
        <div className="mt-4 p-4 rounded-[16px] bt-cream bg-[#F4F4EF] text-[13px] bt-ink/65 leading-relaxed">
          Fork created (mock). Your version starts as a copy of @{handle}'s take with your changes queued.
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 h-11 rounded-full bt-hairline text-[14px] bt-ink/70 hover:bg-black/[0.03] transition"
          >
            Cancel
          </button>
          <button
            onClick={() => setDone(true)}
            className="flex-1 h-11 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
          >
            Create my fork
          </button>
        </div>
      )}

      <p className="mt-3 text-[11.5px] bt-ink/35 leading-relaxed">
        Forking copies the basket into your own Practice take. The original stays untouched.
      </p>
    </div>
  );
}