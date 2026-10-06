import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Chart from "@/components/Chart";
import { getTake, upsertTake } from "@/lib/store";

const PILLS = [10, 25, 50];

export default function DraftTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [take] = useState(() => getTake(id));
  const [period, setPeriod] = useState(take?.defaultPeriod || "1Y");
  const [vsMarket, setVsMarket] = useState(false);
  const [stage, setStage] = useState("review"); // review | amount | confirm
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");

  if (!take) {
    return (
      <div className="max-w-[560px]">
        <p className="text-[15px] bt-ink/55">This draft could not be found.</p>
        <button onClick={() => navigate("/drafts")} className="mt-4 text-[14px] bt-green underline">
          Back to drafts
        </button>
      </div>
    );
  }

  const rules = take.rules || { entry: "", exit: "", rebalance: "" };
  const effectiveAmount = custom ? Math.max(0, Math.min(100, Number(custom) || 0)) : amount;
  const canContinue = effectiveAmount > 0 && effectiveAmount <= 100;

  const confirm = () => {
    const amt = effectiveAmount;
    const ret = take.chart["1W"].values.at(-1) || 0;
    const pnl = Number((amt * ret / 100).toFixed(2));
    const currentValue = Number((amt + pnl).toFixed(2));
    const updated = {
      ...take,
      funded: true,
      investedAmount: amt,
      value: currentValue,
      pnl,
      todayChange: ret,
      entryDate: Date.now(),
    };
    upsertTake(updated);
    navigate(`/takes/${take.id}`, { replace: true });
  };

  if (stage === "amount") {
    return (
      <div className="max-w-[560px]">
        <button
          onClick={() => setStage("review")}
          className="flex items-center gap-1.5 text-[13px] bt-ink/45 hover:bt-ink transition mb-4"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="px-2 h-6 inline-flex items-center rounded-full bt-cream bg-[#F4F4EF] text-[11px] bt-ink/60">
          Practice mode
        </span>
        <h1 className="mt-3 font-heading text-[28px] sm:text-[32px] leading-[1.1] bt-track-tighter bt-ink">
          Invest in practice mode
        </h1>
        <p className="mt-2 text-[14px] bt-ink/60 leading-relaxed">Practice balance · $100.00</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {PILLS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              className={`px-4 h-10 rounded-full text-[14px] transition ${
                !custom && amount === p
                  ? "bg-black/[0.07] bt-ink font-medium"
                  : "bt-cream bg-[#F4F4EF] bt-ink/80 hover:brightness-[0.985]"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bt-hairline bg-white">
          <span className="text-[14px] bt-ink/45">$</span>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="Custom amount"
            className="flex-1 bg-transparent outline-none text-[14px] bt-ink placeholder:text-[#0A0A0A]/35 py-2"
          />
        </div>

        <p className="mt-4 text-[13px] bt-ink/55 leading-relaxed">
          You're putting <span className="bt-ink font-medium">${effectiveAmount.toFixed(2)}</span> of practice money into "{take.title}".
        </p>

        <button
          disabled={!canContinue}
          onClick={() => setStage("confirm")}
          className={`mt-5 w-full h-12 rounded-full text-white text-[15px] font-medium transition ${
            canContinue ? "bt-bg-green hover:brightness-110" : "bt-disabled bg-[#D9DAD4] text-[#0A0A0A]/45"
          }`}
        >
          Continue
        </button>
      </div>
    );
  }

  if (stage === "confirm") {
    return (
      <div className="max-w-[560px]">
        <button
          onClick={() => setStage("amount")}
          className="flex items-center gap-1.5 text-[13px] bt-ink/45 hover:bt-ink transition mb-4"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="font-heading text-[28px] sm:text-[32px] leading-[1.1] bt-track-tighter bt-ink">Confirm</h1>
        <p className="mt-3 text-[15px] bt-ink/75 leading-relaxed">
          Put ${effectiveAmount.toFixed(2)} of practice money into "{take.title}"?
        </p>
        <p className="mt-2 text-[12.5px] bt-ink/45 leading-relaxed">
          This is practice money — no real funds, no risk. You can close the position anytime.
        </p>
        <button
          onClick={confirm}
          className="mt-6 w-full h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
        >
          Confirm
        </button>
        <button
          onClick={() => setStage("amount")}
          className="mt-2 w-full h-11 rounded-full bt-hairline text-[14px] bt-ink/70 hover:bg-black/[0.03] transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[640px]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] bt-ink/45 hover:bt-ink transition mb-4"
      >
        <ArrowLeft size={14} /> Back
      </button>
      <span className="px-2 h-6 inline-flex items-center rounded-full bt-cream bg-[#F4F4EF] text-[11px] bt-ink/60">
        Practice mode · draft
      </span>
      <h1 className="mt-3 font-heading text-[28px] sm:text-[32px] leading-[1.1] bt-track-tighter bt-ink">
        {take.title}
      </h1>
      <p className="mt-2 text-[14px] bt-ink/60 leading-relaxed">"{take.belief}"</p>

      <div className="mt-5 p-5 rounded-[20px] bt-hairline bg-white">
        <Chart
          take={take}
          period={period}
          onPeriod={setPeriod}
          vsMarket={vsMarket}
          onVsMarket={() => setVsMarket((v) => !v)}
        />
      </div>
      <p className="mt-2 text-[11.5px] bt-ink/35 leading-relaxed">
        Sample prices — a preview of how this basket might track. Not a predictor of future results.
      </p>

      <div className="mt-6 p-5 rounded-[20px] bt-hairline bg-white">
        <div className="text-[12px] bt-ink/45 mb-3">Strategy rules</div>
        <div className="flex flex-col gap-3.5">
          {[
            { k: "Entry", v: rules.entry },
            { k: "Exit", v: rules.exit },
            { k: "Rebalance", v: rules.rebalance },
          ].map((r) => (
            <div key={r.k}>
              <div className="text-[13px] font-medium bt-ink">{r.k}</div>
              <div className="text-[13px] bt-ink/60 leading-relaxed mt-0.5">{r.v}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStage("amount")}
        className="mt-6 w-full h-12 rounded-full bt-bg-green text-white text-[15px] font-medium hover:brightness-110 transition"
      >
        Invest in practice mode
      </button>
    </div>
  );
}