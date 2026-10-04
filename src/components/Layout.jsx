import React, { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Mascot from "./Mascot";
import { getProfile, getSidebarOpen, saveSidebarOpen } from "@/lib/store";

export default function Layout({ children }) {
  const [open, setOpen] = useState(() => (typeof window !== "undefined" ? getSidebarOpen() : true));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(getProfile());
  const location = useLocation();

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    saveSidebarOpen(open);
  }, [open]);

  // close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    if (window.innerWidth < 768) setMobileOpen((v) => !v);
    else setOpen((v) => !v);
  };

  return (
    <div className="min-h-screen bg-white bt-ink">
      <TopBar onToggleSidebar={toggle} profile={profile} />

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className="hidden md:block bt-slide shrink-0"
          style={{
            width: 232,
            marginLeft: open ? 0 : -232,
          }}
        >
          <div className="sticky" style={{ top: 46, height: "calc(100vh - 46px)" }}>
            <Sidebar open={open} onClose={() => {}} profile={profile} />
            <SidebarFooter profile={profile} />
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/30 bt-fade"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 h-full bt-slide"
              style={{ width: 232, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
            >
              <div className="h-full flex flex-col bt-cream bg-[#F4F4EF]">
                <Sidebar open onClose={() => setMobileOpen(false)} profile={profile} />
                <SidebarFooter profile={profile} />
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <div className="mx-auto w-full max-w-[680px] px-4 sm:px-6 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarFooter({ profile }) {
  return (
    <div className="px-3 pb-4">
      <div className="flex items-center gap-2.5 px-2 py-2 rounded-full">
        <div className="w-8 h-8 rounded-full bg-[#0E4B32] text-white flex items-center justify-center text-[12px] font-semibold">
          {profile.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-medium bt-ink truncate">{profile.displayName}</div>
          <div className="text-[12px] bt-ink/45 truncate">@{profile.handle}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 px-2 text-[11px] bt-ink/40">
        <Mascot size={14} />
        <span>Practice</span>
      </div>
    </div>
  );
}