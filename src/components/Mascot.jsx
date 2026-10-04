import React from "react";

export default function Mascot({ size = 28, thinking = false, className = "" }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="btMascot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#246648" />
            <stop offset="50%" stopColor="#246648" />
            <stop offset="50.01%" stopColor="#0F3024" />
            <stop offset="100%" stopColor="#0F3024" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#btMascot)" />
        <circle cx="15" cy="17.5" r="2.1" fill="#FFFFFF" />
        <circle cx="25" cy="17.5" r="2.1" fill="#FFFFFF" />
      </svg>
      {thinking && (
        <svg
          className="absolute inset-0 bt-fade"
          viewBox="0 0 40 40"
          width={size}
          height={size}
          style={{ animation: "btSpin 1.1s linear infinite" }}
        >
          <circle cx="20" cy="20" r="19" fill="none" stroke="#0E4B32" strokeWidth="1.5" strokeDasharray="40 80" strokeLinecap="round" opacity="0.5" />
        </svg>
      )}
      <style>{`@keyframes btSpin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}