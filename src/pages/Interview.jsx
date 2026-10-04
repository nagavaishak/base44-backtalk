import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowUp, RotateCw } from "lucide-react";
import Mascot from "@/components/Mascot";
import { buildInterview, buildTake, upsertTake, TICKERS } from "@/lib/store";

function useStream(text, done, speed = 22) {
  const [out, setOut] = useState("");
  const [streaming, setStreaming] = useState(true);
  useEffect(() => {
    setOut("");
    setStreaming(true);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setStreaming(false);
        done && done();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return [out, streaming];
}

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const belief = location.state?.belief || "I don't have an idea, interview me";

  const questions = useRef(buildInterview(belief)).current;
  const [step, setStep] = useState(0); // 0..2 questions, 3 = build offer
  const [angle, setAngle] = useState(0); // different angle counter per question
  const [answers, setAnswers] = useState({});
  const [thinking, setThinking] = useState(true);
  const [tickerOffset, setTickerOffset] = useState(0);

  const q = questions[Math.min(step, 2)];
  const qText = angle % 2 === 0 ? q.text : q.alt;

  const [streamed, streaming] = useStream(qText, () => setThinking(false));

  // when question changes, show thinking briefly then stream
  useEffect(() => {
    setThinking(true);
    setAngle(0);
    if (q.isTicker) setTickerOffset(0);
  }, [step]);

  const choose = (val) => {
    setAnswers((a) => ({ ...a, [q.id]: [...(a[q.id] || []), val] }));
    if (step < 2) setStep((s) => s + 1);
    else setStep(3);
  };

  const differentAngle = () => {
    if (q.isTicker) {
      setTickerOffset((o) => o + 3);
    } else {
      setAngle((a) => a + 1);
      setThinking(true);
    }
  };

  const build = () => {
    const take = buildTake(belief, answers);
    upsertTake(take);
    navigate(`/takes/${take.id}`, { replace: true });
  };

  const skipToBuild = () => setStep(3);

  // ticker options for Q3
  const tickerOptions = q.isTicker
    ? q.tickerPool.slice(tickerOffset % q.tickerPool.length).concat(q.tickerPool.slice(0, tickerOffset % q.tickerPool.length)).slice(0, 3)
    : q.options;

  if (step === 3) {
    return (
      <div className="max-w-[520px]">
        <div className="flex items-center gap-2 mb-4">
          <Mascot size={22} />
          <span className="text-[13px] bt-ink/55">I've got enough to build your take.</span>
        </div>
        <h2 className="font-heading text-[30px] leading-tight bt-track-tighter bt-ink">Ready to build it?</h2>
        <p className="mt-3 text-[15px] bt-ink/55 leading-relaxed">
          I'll put together a basket of stocks and ETFs that fits your belief, fund it with $100 of Practice money, and start tracking it.
        </p>
        <button
          onClick={build}
          className="mt-6 px-5 h-11 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
        >
          Build my take
        </button>
        <button
          onClick={() => setStep(2)}
          className="mt-3 block text-[13px] bt-ink/45 hover:bt-ink transition"
        >
          back to the last question
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[560px]">
      <div className="flex items-center gap-2.5 mb-5">
        <Mascot size={26} thinking={thinking} />
        <span className="text-[12px] bt-ink/45">
          {thinking ? "thinking…" : `question ${step + 1} of 3`}
        </span>
      </div>

      <div className="min-h-[64px]">
        <p className="font-heading text-[26px] sm:text-[30px] leading-[1.15] bt-track-tight bt-ink">
          {streamed}
          {streaming && <span className="inline-block w-[2px] h-[22px] align-[-2px] ml-0.5 bg-[#0A0A0A]/30 animate-pulse" />}
        </p>
      </div>

      {!thinking && (
        <div className="mt-7 bt-fade">
          <div className="flex flex-wrap gap-2">
            {tickerOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className="px-3.5 h-10 rounded-full bt-cream bg-[#F4F4EF] text-[14px] bt-ink/80 hover:brightness-[0.985] transition"
              >
                {q.isTicker ? (
                  <span>
                    <span className="font-semibold">{opt}</span>
                    <span className="bt-ink/40 ml-1.5">{TICKERS.find((t) => t.ticker === opt)?.name || ""}</span>
                  </span>
                ) : (
                  opt
                )}
              </button>
            ))}
          </div>

          <button
            onClick={differentAngle}
            className="mt-4 flex items-center gap-1.5 text-[13px] bt-ink/45 hover:bt-ink transition"
          >
            <RotateCw size={13} />
            {q.isTicker ? "show a different set" : "different angle"}
          </button>

          <button
            onClick={skipToBuild}
            className="mt-5 block text-[13px] bt-ink/45 hover:bt-ink underline-offset-2 hover:underline transition"
          >
            I have a thesis — skip to the build
          </button>
        </div>
      )}
    </div>
  );
}