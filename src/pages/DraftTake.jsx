import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link2, Leaf } from "lucide-react";
import Chart from "@/components/Chart";
import Holdings from "@/components/Holdings";
import PlanCard from "@/components/PlanCard";
import { getTake, upsertTake } from "@/lib/store";

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[11px] text-muted mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Toggle({ options, value, onChange }) {
  return (
    <div className="flex p-0.5 rounded-2xl border border-line bg-cream" style={{ height: 40 }}>
      {options.map((o) => (
        <button
          key={o.k}
          onClick={() => onChange && onChange(o.k)}
          className={`flex-1 rounded-xl text-[12.5px] transition ${
            value === o.k ? "bg-white text-ink font-medium" : "text-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function DraftTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [take] = useState(() => getTake(id));
  const [period, setPeriod] = useState(take?.defaultPeriod || "1Y");
  const [vsMarket, setVsMarket] = useState(false);
  const [amount, setAmount] = useState("100");
  const [visibility, setVisibility] = useState("everyone");
  const [copied, setCopied] = useState(false);

  if (!take) {
    return (
      <div className="max-w-[560px]">
        <p className="text-[15px] text-muted">This draft could not be found.</p>
        <button onClick={() => navigate("/drafts")} className="mt-4 text-[14px] text-stgreen underline">Back to drafts</button>
      </div>
    );
  }

  const activate = () => {
    const updated = { ...take, funded: true, value: Number(amount) || 100, public: visibility === "everyone" };
    upsertTake(updated);
    navigate(`/takes/${take.id}`, { replace: true });
  };
  const copyLink = () => {
    navigator.clipboard?.writeText(`supertake.com/t/${take.id.slice(3)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="max-w-[680px] pb-2">
      <div className="text-[12px] text-muted">Draft</div>
      <h1 className="mt-1 font-heading text-[32px] sm:text-[38px] font-semibold bt-track-tighter text-ink leading-[1.05]">{take.title}</h1>
      <p className="mt-2 text-[14px] text-muted leading-relaxed">{take.summary}</p>
      <button onClick={copyLink} className="mt-3 flex items-center gap-1.5 text-[12.5px] text-muted hover:text-ink transition">
        <Link2 size={12} /> {copied ? "copied" : "Private draft — Share it with a link →"}
      </button>

      <div className="mt-6 bt-card p-5">
        <h2 className="font-heading text-[20px] font-semibold bt-track-tight text-ink">Invest in this take</h2>
        <p className="mt-1 text-[13px] text-muted">
          Supertake buys these {take.positions.length} picks with practice money at real prices. No brokerage, no risk.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="How much">
            <div className="flex items-center gap-2 px-3 rounded-2xl border border-line" style={{ height: 40 }}>
              <span className="text-[15px] text-muted">$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                className="flex-1 bg-transparent outline-none text-[15px] text-ink"
              />
            </div>
          </Field>
          <Field label="Fund it with">
            <Toggle options={[{ k: "real", label: "Real money" }, { k: "practice", label: "Practice money" }]} value="practice" />
          </Field>
          <Field label="Who can see it">
            <Toggle
              options={[{ k: "everyone", label: "Everyone" }, { k: "justme", label: "Just me" }]}
              value={visibility}
              onChange={setVisibility}
            />
          </Field>
        </div>
        <button className="mt-4 flex items-center gap-2 text-[13px] text-muted hover:text-ink transition">
          <Leaf size={14} /> Connect a brokerage →
        </button>
        <button
          onClick={activate}
          className="mt-4 w-full h-12 rounded-full bg-stgreen text-white text-[15px] font-medium hover:brightness-110 transition"
        >
          Activate with practice money
        </button>
        <p className="mt-2.5 text-[12px] text-muted">Practice fills are instant: real prices, nothing leaves your account.</p>
      </div>

      <div className="mt-6 bt-card p-5">
        <Chart take={take} period={period} onPeriod={setPeriod} vsMarket={vsMarket} onVsMarket={() => setVsMarket((v) => !v)} />
      </div>
      <p className="mt-3 text-[11.5px] text-muted leading-relaxed">
        Sample prices — a preview of how this basket might track. Not a predictor of future results.
      </p>

      <div className="mt-8"><Holdings take={take} /></div>
      <div className="mt-5"><PlanCard take={take} /></div>
    </div>
  );
}