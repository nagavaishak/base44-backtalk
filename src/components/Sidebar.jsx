import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, FileText, MessageSquare, Home as HomeIcon, LineChart, Trophy, Settings as SettingsIcon,
} from "lucide-react";
import Mascot from "./Mascot";

function NavItem({ icon: Icon, label, to, active, onClick }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        if (onClick) onClick();
        navigate(to);
      }}
      className={`w-full flex items-center gap-3 px-3 h-9 rounded-full text-[14px] transition-colors ${
        active ? "bg-black/[0.06] bt-ink font-medium" : "bt-ink/70 hover:bg-black/[0.04]"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar({ open, onClose, profile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p || (p !== "/" && location.pathname.startsWith(p));

  const go = (to) => {
    onClose && onClose();
    navigate(to);
  };

  return (
    <div className="flex flex-col h-full bt-cream bg-[#F4F4EF]">
      <div className="px-3 pt-3">
        <button
          onClick={() => go("/takes/new")}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-full bt-disabled bg-[#D9DAD4] text-[#0A0A0A]/55 text-[13px] font-medium hover:brightness-[0.98] transition"
        >
          <Plus size={15} strokeWidth={2.2} />
          New take
        </button>
      </div>

      <nav className="px-2 pt-4 flex flex-col gap-0.5">
        <NavItem icon={FileText} label="Drafts" to="/drafts" active={isActive("/drafts")} onClick={onClose} />
        <NavItem icon={MessageSquare} label="Chats" to="/chats" active={isActive("/chats")} onClick={onClose} />
      </nav>

      <div className="mx-4 my-3 bt-hairline border-t border-black/10" />

      <nav className="px-2 flex flex-col gap-0.5">
        <NavItem icon={HomeIcon} label="Home" to="/" active={location.pathname === "/"} onClick={onClose} />
        <NavItem icon={LineChart} label="Takes" to="/takes" active={isActive("/takes")} onClick={onClose} />
        <NavItem icon={Trophy} label="Leaderboard" to="/leaderboard" active={isActive("/leaderboard")} onClick={onClose} />
        <NavItem icon={SettingsIcon} label="Settings" to="/settings" active={isActive("/settings")} onClick={onClose} />
      </nav>

      <div className="flex-1" />

    </div>
  );
}