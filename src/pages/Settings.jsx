import React, { useState } from "react";
import { getProfile, saveProfile } from "@/lib/store";

export default function Settings() {
  const [profile, setProfile] = useState(getProfile());
  const [saved, setSaved] = useState(false);

  const update = (field, val) => setProfile((p) => ({ ...p, [field]: val }));

  const save = () => {
    const p = { ...profile, avatar: (profile.displayName || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U" };
    saveProfile(p);
    setProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="max-w-[520px]">
      <h1 className="font-heading text-[30px] sm:text-[34px] bt-track-tighter bt-ink">Settings</h1>

      <div className="mt-6 p-5 rounded-[20px] bt-hairline bg-white flex flex-col gap-4">
        <div>
          <label className="text-[12px] bt-ink/45">Display name</label>
          <input
            value={profile.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            className="mt-1 w-full px-3 h-10 rounded-xl bt-hairline outline-none text-[14px] focus:ring-1 focus:ring-[#0E4B32]"
          />
        </div>
        <div>
          <label className="text-[12px] bt-ink/45">Handle</label>
          <div className="mt-1 flex items-center pl-3 h-10 rounded-xl bt-hairline">
            <span className="text-[14px] bt-ink/40">backtalk.app/</span>
            <input
              value={profile.handle}
              onChange={(e) => update("handle", e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
              className="flex-1 bg-transparent outline-none text-[14px] bt-ink px-1"
            />
          </div>
        </div>
        <button
          onClick={save}
          className="self-start px-4 h-10 rounded-full bt-bg-green text-white text-[14px] font-medium hover:brightness-110 transition"
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <p className="mt-4 text-[12px] bt-ink/40">
        Practice mode · $100.00 demo balance · zero risk.
      </p>
    </div>
  );
}