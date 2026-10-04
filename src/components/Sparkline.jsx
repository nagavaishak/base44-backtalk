import React, { useMemo, useRef, useState, useEffect } from "react";

export default function Sparkline({ values, positive = true, width = 96, height = 28 }) {
  if (!values || values.length < 2) return null;
  const pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xTo = (i) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const yTo = (v) => pad + (1 - (v - min) / range) * (height - pad * 2);
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${xTo(i).toFixed(1)},${yTo(v).toFixed(1)}`).join(" ");
  const color = positive ? "#0E8A4B" : "#D14343";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}