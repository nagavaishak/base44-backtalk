import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { planFromRules } from "@/lib/store";

export default function PlanCard({ take }) {
  const [open, setOpen] = useState(true);
  const plan = take.plan || planFromRules(take.belief, take.summary, take.rules || {});

  return (
    <div className="bt-card">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-4">
        <h2 className="font-heading text-[18px] font-semibold bt-track-tight text-ink">The plan behind this</h2>
        <ChevronDown size={16} className={`text-muted transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 flex flex-col gap-5 bt-fade">
          <div>
            <h3 className="font-heading text-[15px] font-semibold text-ink">The idea</h3>
            <p className="mt-1.5 text-[13.5px] text-muted leading-relaxed">{plan.idea}</p>
          </div>
          {plan.quote && (
            <div className="pl-4 border-l-2" style={{ borderColor: "#1F6F4A" }}>
              <p className="text-[14px] text-ink italic leading-relaxed">"{plan.quote}"</p>
              <p className="text-[12px] text-muted mt-1.5">{plan.quoteBy}</p>
            </div>
          )}
          <div>
            <h3 className="font-heading text-[15px] font-semibold text-ink">The playbook</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {plan.playbook.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-stgreen mt-2 shrink-0" />
                  <span className="text-[13.5px] text-muted leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {plan.whenSellsOut && (
            <div>
              <h3 className="bt-caps text-muted">When it sells out</h3>
              <p className="mt-1.5 text-[13.5px] text-muted leading-relaxed">{plan.whenSellsOut}</p>
            </div>
          )}
          {plan.whenTrims && (
            <div>
              <h3 className="bt-caps text-muted">When it trims</h3>
              <p className="mt-1.5 text-[13.5px] text-muted leading-relaxed">{plan.whenTrims}</p>
            </div>
          )}
          {plan.whenAdds && (
            <div>
              <h3 className="bt-caps text-muted">When it adds</h3>
              <p className="mt-1.5 text-[13.5px] text-muted leading-relaxed">{plan.whenAdds}</p>
            </div>
          )}
          <button className="self-start text-[13px] text-stgreen hover:underline">Chat archive →</button>
        </div>
      )}
    </div>
  );
}