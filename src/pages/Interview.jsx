import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RotateCw } from "lucide-react";
import Mascot from "@/components/Mascot";
import { buildInterview, buildTake, upsertTake } from "@/lib/store";

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
  const [step, setStep] = useState(0); // 0..2 questions, 3 = build card
  const [angle, setAngle] = useState(0);
  const [answers, setAnswers] = useState({});
  const [thinking, setThinking] = useState(true);
  const [setOffset, setSetOffset] = useState(0);
  const [typed, setTyped] = useState("");
  const [builtTake, setBuiltTake] = useState(null);

  const q = questions[Math.min(step, 2)];
  const qText = angle % 2 === 0 ? q.text : q.alt;
  const [streamed, streaming] = useStream(qText, () => setThinking(false));

  useEffect(() => {
    setThinking(true);
    setAngle(0);
    if (q.isSet) setSetOffset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const finish = (finalAnswers) => {
    const t = buildTake(belief, finalAnswers, { funded: false });
    upsertTake(t);
    setBuiltTake(t);
    setStep(3);
  };

  const choose = (val) => {
    const next = { ...answers, [q.id]: [...(answers[q.id] || []), val] };
    setAnswers(next);
    if (step < 2) setStep((s) => s + 1);
    else finish(next);
  };

  const differentAngle = () => {
    if (q.isSet) {
      setSetOffset((o) => (o + 3) % q.setPool.length);
    } else {
      setAngle((a) => a + 1);
      setThinking(true);
    }
  };

  const skipToBuild = () => finish(answers);

  const setOptions = q.isSet
    ? q.setPool
        .slice(setOffset % q.setPool.length)
        .concat(q.setPool.slice(0, setOffset % q.setPool.length))
        .slice(0, 3)
    : q.options;

  if (step === 3 && builtTake) {
    const t = builtTake;
    const sample = t.positions.slice(0, 5);
    return (
      <div className="max-w-[560px]">
        <div className="flex items-center gap-2.5 mb-5">
          <Mascot size={26} />
          <span className="text-[12px] bt-ink/45">built your take</span>
        </div>
        <p className="font-heading text-[24px] sm:text-[28px] leading-[1.15] bt-track-tight bt-ink mb-4">
          Here's a take built from your answers.
        </p>

        <div className="p-5 rounded-[20px] bt-hairline bg-white">
          <span className="px-2 h-6 inline-flex items-center rounded-full bt-cream bg-[#F4F4EF] text-[11px] bt-ink/60">
            Practice mode
          </span>
          <p className="mt-3 text-[14.5px] bt-ink/75 leading-relaxed">"{t.belief}"</p>
          <div className="mt-4">
            <div className="text-[12px] bt-ink/45 mb-2">Example positions</div>
            <div className="flex flex-wrap gap-1.5">
              {sample.map((p) => (
                <span
                  key={p.ticker}
                  className="px-2.5 h-7 inline-flex items-center rounded-full bt-cream bg-[#F4F4EF] text-[12.5px] bt-ink/80"
                >
                  {p.ticker}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate(`/takes/${t.id}/draft`)}
            className="mt-5 w-full h-11 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
          >
            Review this take
          </button>
        </div>
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
          {streaming && (
            <span className="inline-block w-[2px] h-[22px] align-[-2px] ml-0.5 bg-[#0A0A0A]/30 animate-pulse" />
          )}
        </p>
      </div>

      {!thinking && (
        <div className="mt-7 bt-fade">
          <div className="flex flex-wrap gap-2">
            {setOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className="px-3.5 h-10 rounded-full bt-cream bg-[#F4F4EF] text-[14px] bt-ink/80 hover:brightness-[0.985] transition"
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={differentAngle}
            className="mt-4 flex items-center gap-1.5 text-[13px] bt-ink/45 hover:bt-ink transition"
          >
            <RotateCw size={13} />
            {q.isSet ? "show a different set" : "different angle"}
          </button>

          <div className="mt-5 flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bt-hairline bg-white">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typed.trim()) {
                  choose(typed.trim());
                  setTyped("");
                }
              }}
              placeholder={q.isSet ? "Or type your own layer…" : "Or type your own answer…"}
              className="flex-1 bg-transparent outline-none text-[14px] bt-ink placeholder:text-[#0A0A0A]/35 py-2"
            />
          </div>

          <button
            onClick={skipToBuild}
            className="mt-2.5 block text-[12.5px] bt-ink/40 hover:bt-ink transition"
          >
            I have a thesis — skip to the build
          </button>
        </div>
      )}
    </div>
  );
}