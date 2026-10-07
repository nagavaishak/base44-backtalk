import React, { useMemo, useRef, useState, useEffect } from "react";
import { PERIOD_KEYS } from "@/lib/store";

function niceTicks(min, max, count = 5) {
  const range = (max - min) || 1;
  const step0 = range / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const start = Math.floor(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + 0.5 * step; v += step) ticks.push(Number(v.toFixed(2)));
  return ticks;
}

export default function Chart({ take, period, onPeriod, vsMarket, onVsMarket }) {
  const data = take.chart[period];
  const values = data.values;
  const benchmark = data.benchmark;
  const labels = data.labels;
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState(null);
  const [pathLen, setPathLen] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const padL = 44, padR = 14, padT = 16, padB = 28;
  const h = 240;
  const plotW = Math.max(10, width - padL - padR);
  const plotH = h - padT - padB;

  const all = [...values, ...benchmark];
  const rawMin = Math.min(...all);
  const rawMax = Math.max(...all);
  const ticks = useMemo(() => niceTicks(rawMin, rawMax, 5), [rawMin, rawMax]);
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const yToPx = (v) => padT + ((yMax - v) / (yMax - yMin || 1)) * plotH;
  const xToPx = (i) => padL + (values.length <= 1 ? 0 : (i / (values.length - 1)) * plotW);

  const linePath = useMemo(
    () => values.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" "),
    [values, width, yMin, yMax]
  );
  const benchPath = useMemo(
    () => benchmark.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" "),
    [benchmark, width, yMin, yMax]
  );
  const areaPath = useMemo(() => {
    const top = values.map((v, i) => `${i === 0 ? "M" : "L"}${xToPx(i).toFixed(1)},${yToPx(v).toFixed(1)}`).join(" ");
    return `${top} L${xToPx(values.length - 1).toFixed(1)},${yToPx(yMin).toFixed(1)} L${xToPx(0).toFixed(1)},${yToPx(yMin).toFixed(1)} Z`;
  }, [values, width, yMin, yMax]);

  // draw-in animation
  useEffect(() => {
    setPathLen(null);
    const id = requestAnimationFrame(() => {
      if (lineRef.current && typeof lineRef.current.getTotalLength === "function") {
        setPathLen(lineRef.current.getTotalLength());
      }
    });
    return () => cancelAnimationFrame(id);
  }, [linePath]);

  const last = values[values.length - 1];
  const benchLast = benchmark[benchmark.length - 1];
  const isNeg = last < 0;
  const lineColor = isNeg ? "#B3412E" : "#22C55E";
  const gradId = "btGrad" + (isNeg ? "Neg" : "Pos");
  const gradStop = isNeg ? "rgba(179,65,46,0.14)" : "rgba(34,197,94,0.14)";
  const gradStop0 = isNeg ? "rgba(179,65,46,0.02)" : "rgba(34,197,94,0.02)";
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
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div className={`font-heading text-[30px] font-medium bt-track-tighter tabular-nums ${isNeg ? "text-loss" : "text-stgreen"}`}>
            {fmtPct(last)}
          </div>
          <span
            className="inline-block mt-1.5 px-2.5 h-6 leading-6 rounded-full text-[12px] font-medium"
            style={{
              color: beat >= 0 ? "#1F6F4A" : "#B3412E",
              background: beat >= 0 ? "#E8F5E9" : "#FBE9E7",
            }}
          >
            {beat >= 0 ? "beating" : "trailing"} the market by {Math.abs(beat).toFixed(1)} points
          </span>
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

          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} y1={yToPx(t)} x2={width - padR} y2={yToPx(t)} stroke="#E8E4DA" strokeWidth={1} />
              <text x={padL - 8} y={yToPx(t) + 3} textAnchor="end" fontSize={10} fill="#7A766B">
                {t >= 0 ? "+" : ""}
                {t}%
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradId})`} />

          <path d={benchPath} fill="none" stroke="rgba(26,26,23,0.3)" strokeWidth={1} strokeDasharray="3 3" />

          <path
            ref={lineRef}
            d={linePath}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={pathLen ? "bt-draw" : ""}
            style={pathLen ? { "--bt-len": pathLen } : undefined}
          />

          {hover && (
            <g>
              <line x1={hover.x} y1={padT} x2={hover.x} y2={padT + plotH} stroke="rgba(26,26,23,0.12)" strokeWidth={1} />
              <circle cx={hover.x} cy={hover.y} r={3.5} fill={lineColor} stroke="#fff" strokeWidth={1.5} />
            </g>
          )}

          {labels.map((d, i) => {
            const step = Math.ceil(labels.length / 6);
            if (i % step !== 0 && i !== labels.length - 1) return null;
            return (
              <text key={i} x={xToPx(i)} y={h - 8} textAnchor="middle" fontSize={10} fill="#7A766B">
                {new Date(d).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
              </text>
            );
          })}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 px-2.5 py-1.5 rounded-lg text-[11px] text-white"
            style={{
              background: "#1A1A17",
              left: Math.min(Math.max(hover.x - 40, 4), width - 88),
              top: Math.max(hover.y - 44, 4),
            }}
          >
            <div className="opacity-60">
              {new Date(labels[hover.i]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="font-semibold tabular-nums">{fmtPct(values[hover.i])}</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1">
        {PERIOD_KEYS.map((p) => (
          <button
            key={p}
            onClick={() => onPeriod(p)}
            className={`px-2.5 h-8 rounded-full text-[13px] transition-colors ${
              period === p ? "text-ink font-medium" : "text-muted hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={onVsMarket}
          className={`ml-1 px-2.5 h-8 rounded-full text-[13px] transition-colors ${
            vsMarket ? "text-ink font-medium" : "text-muted hover:text-ink"
          }`}
        >
          vs. the market
        </button>
      </div>
    </div>
  );
}