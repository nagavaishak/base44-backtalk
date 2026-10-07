import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Home as HomeIcon, LineChart, Trophy, Settings as SettingsIcon, ChevronRight, MessageSquare,
} from "lucide-react";
import { getTakes, getChats } from "@/lib/store";

function NavItem({ icon: Icon, label, to, active, onClick }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => { onClick && onClick(); navigate(to); }}
      className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-full text-[13.5px] transition-colors ${
        active ? "bg-ink/[0.06] text-ink font-medium" : "text-muted hover:bg-ink/[0.04] hover:text-ink"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} /> <span>{label}</span>
    </button>
  );
}

function Section({ label, children }) {
  return (
    <div className="px-3">
      <div className="bt-caps text-muted px-2 mb-1.5">{label}</div>
      {children}
    </div>
  );
}

export default function Sidebar({ onClose, profile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p || (p !== "/" && location.pathname.startsWith(p));
  const takes = getTakes();
  const funded = takes.filter((t) => t.funded);
  const drafts = takes.filter((t) => !t.funded);
  const chats = getChats();
  const go = (to) => { onClose && onClose(); navigate(to); };
  const fmt = (v) => (v >= 0 ? "+" : "-") + "$" + Math.abs(v).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 pt-5 pb-3">
        <div className="font-heading text-[19px] font-semibold bt-track-tight text-ink leading-none">Supertake</div>
        <div className="text-[11px] text-muted mt-1">Free beta</div>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={() => go("/takes/new")}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-full border border-line bg-white text-[13px] font-medium text-ink hover:bg-cream transition"
        >
          <Plus size={15} strokeWidth={2.2} /> New take
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 flex flex-col gap-4">
        <Section label="Takes">
          {funded.length === 0 && <div className="px-2 py-1 text-[12.5px] text-muted">No takes yet.</div>}
          {funded.map((t) => (
            <button
              key={t.id}
              onClick={() => go(`/takes/${t.id}`)}
              className={`w-full flex items-center justify-between gap-2 px-2 h-9 rounded-full text-left transition ${
                isActive(`/takes/${t.id}`) ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]"
              }`}
            >
              <span className="text-[13px] text-ink truncate">{t.title}</span>
              <span className={`text-[11.5px] shrink-0 tabular-nums ${t.todayChange >= 0 ? "text-stgreen" : "text-loss"}`}>
                {fmt(t.todayChange)}
              </span>
            </button>
          ))}
        </Section>

        {drafts.length > 0 && (
          <Section label="Drafts">
            {drafts.map((t) => (
              <button
                key={t.id}
                onClick={() => go(`/takes/${t.id}/draft`)}
                className={`w-full flex items-center gap-2 px-2 h-9 rounded-full text-left transition ${
                  location.pathname === `/takes/${t.id}/draft` ? "bg-ink/[0.06]" : "hover:bg-ink/[0.04]"
                }`}
              >
                <span className="text-[13px] text-ink truncate">{t.title}</span>
              </button>
            ))}
          </Section>
        )}

        <Section label="Chats">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => go("/chats")}
              className="w-full flex items-start gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-ink/[0.04] transition"
            >
              <MessageSquare size={13} className="text-muted mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-[12.5px] text-ink truncate">{c.title}</div>
                <div className="text-[11px] text-muted truncate">{c.preview}</div>
              </div>
            </button>
          ))}
        </Section>
      </div>

      <div className="px-3 pt-2 pb-1 border-t border-line">
        <nav className="flex flex-col gap-0.5 py-2">
          <NavItem icon={HomeIcon} label="Home" to="/" active={location.pathname === "/"} onClick={onClose} />
          <NavItem icon={LineChart} label="Takes" to="/takes" active={isActive("/takes")} onClick={onClose} />
          <NavItem icon={Trophy} label="Leaderboard" to="/leaderboard" active={isActive("/leaderboard")} onClick={onClose} />
          <NavItem icon={SettingsIcon} label="Settings" to="/settings" active={isActive("/settings")} onClick={onClose} />
        </nav>
      </div>

      <button
        onClick={() => go(`/u/${profile.handle}`)}
        className="mx-3 mb-3 flex items-center gap-2.5 px-2 py-2 rounded-full hover:bg-ink/[0.04] transition text-left"
      >
        <div className="w-8 h-8 rounded-full bg-stgreen text-white flex items-center justify-center text-[12px] font-semibold">
          {profile.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-ink truncate">{profile.displayName}</div>
          <div className="text-[11.5px] text-muted truncate">@{profile.handle}</div>
        </div>
        <ChevronRight size={14} className="text-muted" />
      </button>

      <div className="px-5 pb-4 text-[10.5px] text-muted leading-relaxed">
        © 2026 Supertake, Inc. · Terms · Privacy
      </div>
    </div>
  );
}