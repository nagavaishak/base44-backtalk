import React, { useMemo, useRef, useState, useEffect } from "react";
import { PERIOD_KEYS } from "@/lib/store";

const Y_TICKS = [14, 12, 7, 2, -3];

export default function Chart({ take, period, onPeriod, vsMarket, onVsMarket }) {
  const data = take.chart[period];
  const values = data.values;
  const benchmark = data.benchmark;
  const labels = data.labels;
  const containerRef = useRef(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState(null); // {x, y, i}

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const padL = 44;
  const padR = 14;
  const padT = 16;
  const padB = 26;
  const h = 220;
  const plotW = Math.max(10, width - padL - padR);
  const plotH = h - padT - padB;

  const yMin = -3;
  const yMax = 14;
  const yToPx = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;
  const xToPx = (i) => padL + (values.length <= 1 ? 0 : (i / (values.length - 1)) * plotW);

  const linePath = useMemo(
    () => values.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" "),
    [values, width]
  );
  const benchPath = useMemo(
    () => benchmark.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" "),
    [benchmark, width]
  );
  const areaPath = useMemo(() => {
    const top = values.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" ");
    return `${top} L${xToPx(values.length - 1).toFixed(1)},${yToPx(yMin).toFixed(1)} L${xToPx(0).toFixed(1)},${yToPx(yMin).toFixed(1)} Z`;
  }, [values, width]);

  const last = values[values.length - 1];
  const benchLast = benchmark[benchmark.length - 1];
  const isNeg = last < 0;
  const lineColor = isNeg ? "#D14343" : "#0E8A4B";
  const gradId = "btGrad" + (isNeg ? "Neg" : "Pos");
  const gradStop = isNeg ? "rgba(209,67,67,0.16)" : "rgba(14,138,75,0.16)";
  const gradStop0 = isNeg ? "rgba(209,67,67,0.04)" : "rgba(14,138,75,0.04)";
  const beat = Number((last - benchLast).toFixed(2));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const i = Math.round(((x - padL) / plotW) * (values.length - 1));
    const ci = Math.max(0, Math.min(values.length - 1, i));
    setHover({ x: xToPx(ci), y: yToPx(values[ci]), i: ci });
  };
  const onLeave = () => setHover(null);

  const fmtPct = (v) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%";

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <div className={`text-[28px] font-heading font-medium bt-track-tighter ${isNeg ? "bt-neg" : "bt-pos"}`}>
            {fmtPct(last)}
          </div>
          {!vsMarket && (
            <span
              className={`inline-block mt-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${
                beat >= 0 ? "bt-bg-pos text-white" : "bt-bg-neg text-white"
              }`}
            >
              {beat >= 0 ? "beating" : "trailing"} the market by {Math.abs(beat).toFixed(1)} points
            </span>
          )}
        </div>
      </div>

      <div ref={containerRef} className="relative w-full select-none">
        <svg
          width={width}
          height={h}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onTouchStart={(e) => {
            const t = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const x = t.clientX - rect.left;
            const i = Math.max(0, Math.min(values.length - 1, Math.round(((x - padL) / plotW) * (values.length - 1))));
            setHover({ x: xToPx(i), y: yToPx(values[i]), i });
          }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradStop} />
              <stop offset="100%" stopColor={gradStop0} />
            </linearGradient>
          </defs>

          {/* y grid + ticks */}
          {Y_TICKS.map((t) => (
            <g key={t}>
              <line x1={padL} y1={yToPx(t)} x2={width - padR} y2={yToPx(t)} stroke="rgba(10,10,10,0.06)" strokeWidth={1} />
              <text x={padL - 8} y={yToPx(t) + 3} textAnchor="end" fontSize={10} fill="rgba(10,10,10,0.4)">
                {t >= 0 ? "+" : ""}
                {t}%
              </text>
            </g>
          ))}

          {/* area fill */}
          <path d={areaPath} fill={`url(#${gradId})`} />

          {/* benchmark dashed */}
          <path d={benchPath} fill="none" stroke="rgba(10,10,10,0.28)" strokeWidth={1} strokeDasharray="3 3" />

          {/* main line */}
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* hover dot + vertical */}
          {hover && (
            <g>
              <line x1={hover.x} y1={padT} x2={hover.x} y2={padT + plotH} stroke="rgba(10,10,10,0.12)" strokeWidth={1} />
              <circle cx={hover.x} cy={hover.y} r={3.5} fill={lineColor} stroke="#fff" strokeWidth={1.5} />
            </g>
          )}

          {/* x labels (sparse) */}
          {labels.map((d, i) => {
            const step = Math.ceil(labels.length / 5);
            if (i % step !== 0 && i !== labels.length - 1) return null;
            return (
              <text key={i} x={xToPx(i)} y={h - 6} textAnchor="middle" fontSize={10} fill="rgba(10,10,10,0.4)">
                {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            );
          })}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-lg text-[11px] text-white"
            style={{
              background: "#0A0A0A",
              left: Math.min(Math.max(hover.x - 40, 4), width - 88),
              top: Math.max(hover.y - 44, 4),
            }}
          >
            <div className="opacity-60">
              {labels[hover.i].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="font-semibold">{fmtPct(values[hover.i])}</div>
          </div>
        )}
      </div>

      {/* period pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {PERIOD_KEYS.map((p) => (
          <button
            key={p}
            onClick={() => onPeriod(p)}
            className={`px-3 h-8 rounded-full text-[13px] transition-colors ${
              period === p ? "bg-black/[0.07] bt-ink font-medium" : "bt-ink/55 hover:bg-black/[0.04]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={onVsMarket}
          className={`px-3 h-8 rounded-full text-[13px] transition-colors ${
            vsMarket ? "bg-black/[0.07] bt-ink font-medium" : "bt-ink/55 hover:bg-black/[0.04]"
          }`}
        >
          vs. the market
        </button>
      </div>
    </div>
  );
}