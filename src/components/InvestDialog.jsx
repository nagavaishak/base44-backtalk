import React, { useState } from "react";
import { Check, Lock, Globe } from "lucide-react";

export default function InvestDialog({ open, title, onConfirm, onClose }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("100");
  const [visibility, setVisibility] = useState("justme");

  if (!open) return null;

  const amt = Number(amount) || 0;
  const steps = ["Amount", "Fund", "Who can see it"];
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const confirm = () => onConfirm({ amount: amt, mode: "practice", visibility });
  const visLabel = visibility === "everyone" ? "everyone" : "just you";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 bt-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-[420px] bg-white rounded-t-[24px] sm:rounded-[24px] p-6 bt-slide">
        <div className="flex items-center justify-between">
          <span className="text-[12px] bt-ink/45">
            Step {step} of 3 · {steps[step - 1]}
          </span>
          <button onClick={onClose} className="text-[13px] bt-ink/45 hover:bt-ink transition">
            Cancel
          </button>
        </div>

        {step === 1 && (
          <>
            <h3 className="mt-3 font-heading text-[24px] bt-track-tighter bt-ink">How much?</h3>
            <p className="mt-1 text-[13px] bt-ink/50">Set the Practice money for this take.</p>
            <div className="mt-5 flex items-center gap-2 px-4 h-14 rounded-full bt-hairline bg-white">
              <span className="text-[20px] bt-ink/40">$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                autoFocus
                inputMode="decimal"
                className="flex-1 bg-transparent outline-none text-[20px] bt-ink"
              />
            </div>
            <div className="mt-3 flex gap-2">
              {["25", "100", "250"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="px-3 h-8 rounded-full bt-cream bg-[#F4F4EF] text-[12.5px] bt-ink/70 hover:brightness-[0.98] transition"
                >
                  ${v}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={amt <= 0}
              className={`mt-6 w-full h-12 rounded-full text-[15px] font-medium transition ${
                amt > 0
                  ? "bt-bg-green text-white hover:brightness-110"
                  : "bg-[#D9DAD4] text-[#0A0A0A]/45"
              }`}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="mt-3 font-heading text-[24px] bt-track-tighter bt-ink">Fund it</h3>
            <p className="mt-1 text-[13px] bt-ink/50">Choose how to fund this take.</p>
            <div className="mt-5 p-4 rounded-[18px] bt-cream bg-[#F4F4EF] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bt-bg-green text-white flex items-center justify-center">
                <Check size={16} />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium bt-ink">Practice money</div>
                <div className="text-[12px] bt-ink/50">${amt.toFixed(2)} · sample funds, no real money</div>
              </div>
            </div>
            <div className="mt-3 p-4 rounded-[18px] bt-hairline flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black/[0.06] flex items-center justify-center">
                <Lock size={15} />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium bt-ink">Real money</div>
                <div className="text-[12px] bt-ink/50">Coming soon</div>
              </div>
              <span className="text-[11px] bt-ink/45 px-2 h-6 inline-flex items-center rounded-full bt-cream bg-[#F4F4EF]">
                Soon
              </span>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={back}
                className="px-4 h-12 rounded-full bt-hairline text-[14px] bt-ink/70 hover:bg-black/[0.03] transition"
              >
                Back
              </button>
              <button
                onClick={next}
                className="flex-1 h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="mt-3 font-heading text-[24px] bt-track-tighter bt-ink">Who can see it?</h3>
            <p className="mt-1 text-[13px] bt-ink/50">You can change this any time.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {[
                { k: "justme", label: "Just me", desc: "Only you can see this take", Icon: Lock },
                { k: "everyone", label: "Everyone", desc: "Public on your profile & leaderboard", Icon: Globe },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => setVisibility(o.k)}
                  className={`flex items-center gap-3 p-4 rounded-[18px] transition text-left ${
                    visibility === o.k ? "bt-hairline-strong bg-white" : "bt-hairline bg-white hover:bg-black/[0.02]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      visibility === o.k ? "bt-bg-green text-white" : "bg-black/[0.06] bt-ink/60"
                    }`}
                  >
                    <o.Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium bt-ink">{o.label}</div>
                    <div className="text-[12px] bt-ink/50">{o.desc}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      visibility === o.k ? "border-[#0E4B32] bg-[#0E4B32]" : "border-black/15"
                    }`}
                  >
                    {visibility === o.k && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-[14px] bt-cream bg-[#F4F4EF] text-[12.5px] bt-ink/65 leading-relaxed">
              You'll invest <span className="bt-ink font-medium">${amt.toFixed(2)}</span> in{" "}
              <span className="bt-ink font-medium">{title}</span> using{" "}
              <span className="bt-ink font-medium">Practice money</span>, visible to{" "}
              <span className="bt-ink font-medium">{visLabel}</span>. No real money moves.
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={back}
                className="px-4 h-12 rounded-full bt-hairline text-[14px] bt-ink/70 hover:bg-black/[0.03] transition"
              >
                Back
              </button>
              <button
                onClick={confirm}
                className="flex-1 h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
              >
                Confirm invest
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}