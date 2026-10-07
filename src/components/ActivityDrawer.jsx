import React, { useEffect } from "react";
import { X, ArrowUp, Globe, Eye } from "lucide-react";
import { getActivity } from "@/lib/store";

export default function ActivityDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const events = getActivity();
  const iconFor = (e) => (e.icon === "public" ? Globe : e.icon === "watch" ? Eye : ArrowUp);
  const bg = (e) => (e.tone === "tan" ? "#C9A86A" : "#1F6F4A");

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/30 bt-fade ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 h-full w-[384px] max-w-[92vw] bg-cream border-l border-line bt-slide"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-5 border-b border-line" style={{ height: 56 }}>
          <h2 className="font-heading text-[20px] font-semibold bt-track-tight text-ink">Activity</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-ink/5 transition"
            aria-label="Close"
          >
            <X size={16} className="text-ink" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-2" style={{ height: "calc(100% - 56px)" }}>
          {events.length === 0 && (
            <div className="py-10 text-center text-[13px] text-muted">No activity yet.</div>
          )}
          {events.map((e, i) => {
            const Icon = iconFor(e);
            return (
              <div key={i} className="flex items-start gap-3 py-3.5 border-b border-line last:border-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ background: bg(e) }}
                >
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] text-ink leading-snug">{e.text}</div>
                  <div className="text-[11.5px] text-muted mt-1">{e.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}