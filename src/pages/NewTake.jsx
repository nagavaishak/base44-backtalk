import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { EXAMPLE_BELIEFS, MORE_EXAMPLES } from "@/lib/store";

export default function NewTake() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [more, setMore] = useState(false);

  const send = (val) => {
    const belief = (val ?? text).trim();
    if (!belief) return;
    navigate("/interview", { state: { belief } });
  };

  const filled = text.trim().length > 0;

  return (
    <div className="max-w-[560px]">
      <div className="text-[12px] bt-ink/45 mb-3">New take</div>
      <h1 className="font-heading text-[34px] sm:text-[40px] leading-[1.05] bt-track-tighter bt-ink">
        What do you believe?
      </h1>
      <p className="mt-3 text-[15px] bt-ink/55 leading-relaxed max-w-[480px]">
        Describe an investment idea in plain language. I'll ask a couple of questions, then build you a portfolio.
      </p>

      <div className="mt-6 flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bt-hairline bg-white">
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your belief…"
          className="flex-1 bg-transparent outline-none text-[15px] bt-ink placeholder:text-[#0A0A0A]/35 py-2"
        />
        <button
          onClick={() => send()}
          disabled={!filled}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
            filled ? "bt-bg-green text-white" : "bt-disabled bg-[#D9DAD4] text-[#0A0A0A]/45"
          }`}
          aria-label="Send"
        >
          <ArrowUp size={17} strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {EXAMPLE_BELIEFS.map((ex) => (
          <button
            key={ex}
            onClick={() => send(ex)}
            className="px-3.5 h-9 rounded-full bt-cream bg-[#F4F4EF] text-[13.5px] bt-ink/75 hover:brightness-[0.985] transition"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <button
          onClick={() => setMore((v) => !v)}
          className="text-[13px] bt-ink/45 hover:bt-ink underline-offset-2 hover:underline transition"
        >
          {more ? "fewer examples" : "more examples"}
        </button>
      </div>

      {more && (
        <div className="mt-3 flex flex-wrap gap-2 bt-fade">
          {MORE_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => send(ex)}
              className="px-3.5 h-9 rounded-full bt-cream bg-[#F4F4EF] text-[13.5px] bt-ink/75 hover:brightness-[0.985] transition"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      <p className="mt-8 text-[12px] bt-ink/35">Starts in practice mode, sample prices, zero risk.</p>
    </div>
  );
}