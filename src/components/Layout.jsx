import React, { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import ActivityDrawer from "./ActivityDrawer";
import { getProfile, getSidebarOpen, saveSidebarOpen } from "@/lib/store";

export default function Layout() {
  const [open, setOpen] = useState(() => (typeof window !== "undefined" ? getSidebarOpen() : true));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [profile, setProfile] = useState(getProfile());
  const location = useLocation();

  useEffect(() => { setProfile(getProfile()); }, []);
  useEffect(() => { saveSidebarOpen(open); }, [open]);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setMobileOpen(false); setActivityOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => { if (window.innerWidth < 768) setMobileOpen((v) => !v); else setOpen((v) => !v); };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="flex">
        <aside className="hidden md:block shrink-0 bt-slide" style={{ width: 248, marginLeft: open ? 0 : -248 }}>
          <div className="sticky top-0 h-screen overflow-y-auto border-r border-line bg-white">
            <Sidebar onClose={() => {}} profile={profile} />
          </div>
        </aside>

        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30 bt-fade" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-[264px] bt-slide" style={{ transform: "translateX(0)" }}>
              <div className="h-full overflow-y-auto border-r border-line bg-white">
                <Sidebar onClose={() => setMobileOpen(false)} profile={profile} />
              </div>
            </aside>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <TopBar onToggleSidebar={toggle} onOpenActivity={() => setActivityOpen(true)} />
          <main className="mx-auto w-full max-w-[720px] px-5 sm:px-8 py-7 sm:py-9">
            <Outlet />
          </main>
        </div>
      </div>
      <ActivityDrawer open={activityOpen} onClose={() => setActivityOpen(false)} />
    </div>
  );
}