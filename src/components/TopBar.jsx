import React from "react";
import { Menu } from "lucide-react";

export default function TopBar({ onToggleSidebar, profile }) {
  return (
    <header className="bt-hairline-strong bt-cream bg-[#F4F4EF] flex items-center justify-between px-3 sm:px-4" style={{ height: 46 }}>
      <button
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} strokeWidth={2} className="bt-ink" />
      </button>
      <span className="font-heading font-medium text-[17px] bt-track-tight bt-ink select-none">backtalk.</span>
      <div className="flex items-center gap-2 text-[12px]">
        <span className="bt-ink/55">Practice</span>
        <span className="bt-ink font-semibold">$100.00</span>
        <span className="bt-ink/45 hidden sm:inline">·</span>
        <span className="bt-pos hidden sm:inline font-medium">$0.00 today</span>
      </div>
    </header>
  );
}