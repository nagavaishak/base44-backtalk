import React from "react";
import { Menu, Bell } from "lucide-react";
import { getPracticeSummary } from "@/lib/store";

export default function TopBar({ onToggleSidebar, onOpenActivity }) {
  const s = getPracticeSummary();
  const up = s.todayChange >= 0;

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 bg-cream/90 backdrop-blur-sm border-b border-line"
      style={{ height: 52 }}
    >
      <button
        onClick={onToggleSidebar}
        className="md:hidden flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-ink/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={18} className="text-ink" />
      </button>
      <div className="flex items-center gap-3 text-[12.5px]">
        <span className="text-muted">Practice</span>
        <span className="text-ink font-semibold tabular-nums">${s.value.toFixed(2)}</span>
        <span className={`hidden sm:inline font-medium tabular-nums ${up ? "text-stgreen" : "text-loss"}`}>
          {up ? "▲" : "▼"} ${Math.abs(s.todayChange).toFixed(2)} today
        </span>
        <button
          onClick={onOpenActivity}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-ink/5 transition-colors"
          aria-label="Activity"
        >
          <Bell size={16} className="text-ink" />
        </button>
      </div>
    </header>
  );
}