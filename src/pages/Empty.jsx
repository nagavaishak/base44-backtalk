import React from "react";

export default function Empty({ title, note }) {
  return (
    <div className="max-w-[520px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] bt-track-tighter bt-ink">{title}</h1>
      <p className="mt-3 text-[14px] bt-ink/50">{note}</p>
    </div>
  );
}