import React, { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function AskBar() {
  const [v, setV] = useState("");
  const chips = ["How's my money doing?", "Why did you trade yesterday?", "Start a new take"];
  return (
    <div className="sticky bottom-0 z-20 -mx-5 sm:-mx-8 mt-10 px-5 sm:px-8 pb-5 pt-4 bg-gradient-to-t from-cream via-cream to-transparent">
      <div className="flex items-center gap-2 pl-4 pr-1.5 rounded-full border border-line bg-white" style={{ height: 48 }}>
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) setV(""); }}
          placeholder="Ask Supertake anything…"
          className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-muted py-2"
        />
        <button
          disabled={!v.trim()}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
            v.trim() ? "bg-stgreen text-white" : "bg-line text-muted"
          }`}
          aria-label="Send"
        >
          <ArrowUp size={16} strokeWidth={2.4} />
        </button>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => setV(c)}
            className="px-3 h-7 rounded-full border border-line bg-white text-[12px] text-muted hover:text-ink transition"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}