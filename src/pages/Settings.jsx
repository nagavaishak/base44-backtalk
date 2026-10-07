import React, { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/store";

const SETTINGS_KEY = "supertake.settings";
const DEFAULT_SETTINGS = {
  email: "nags@supertake.com",
  brokerage: { robinhood: false, coinbase: false },
  neverBuy: ["TSLA", "PLTR", "DKNG"],
  social: { followOnX: true },
  emailUpdates: { weeklyReview: true, needsYou: true },
};

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
function persist(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function Card({ title, children }) {
  return (
    <div className="bt-card p-5">
      <h2 className="font-heading text-[17px] font-semibold bt-track-tight text-ink mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, children, sub }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-0">
      <div className="min-w-0">
        <div className="text-[13.5px] text-ink">{label}</div>
        {sub && <div className="text-[12px] text-muted mt-0.5">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full transition-colors shrink-0"
      style={{ width: 38, height: 22, background: on ? "#1F6F4A" : "#E8E4DA" }}
      aria-pressed={on}
    >
      <span
        className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-transform"
        style={{ left: on ? 18 : 2 }}
      />
    </button>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState(getProfile());
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1400); };

  const updateProfile = (field, val) => {
    const p = { ...profile, [field]: val };
    if (field === "displayName") p.avatar = (val || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
    setProfile(p);
    saveProfile(p);
    flash();
  };
  const updateSettings = (updater) => {
    const s = updater({ ...settings });
    setSettings(s);
    persist(s);
    flash();
  };

  return (
    <div className="max-w-[560px]">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[30px] sm:text-[34px] font-semibold bt-track-tighter text-ink">Settings</h1>
        {saved && <span className="text-[12px] text-muted bt-fade">Saved</span>}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Card title="Profile">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-muted">Name</label>
              <input
                value={profile.displayName}
                onChange={(e) => updateProfile("displayName", e.target.value)}
                className="mt-1 w-full px-3 h-10 rounded-2xl border border-line outline-none text-[14px] text-ink focus:border-stgreen"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted">Handle</label>
              <div className="mt-1 flex items-center pl-3 h-10 rounded-2xl border border-line">
                <span className="text-[14px] text-muted">supertake.com/u/</span>
                <input
                  value={profile.handle}
                  onChange={(e) => updateProfile("handle", e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
                  className="flex-1 bg-transparent outline-none text-[14px] text-ink px-1"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-muted">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => updateProfile("bio", e.target.value)}
                rows={2}
                className="mt-1 w-full px-3 py-2 rounded-2xl border border-line outline-none text-[14px] text-ink focus:border-stgreen resize-none"
              />
            </div>
          </div>
        </Card>

        <Card title="Account">
          <Row label="Email" sub={settings.email}>
            <button className="text-[12.5px] text-stgreen hover:underline">Change</button>
          </Row>
        </Card>

        <Card title="Brokerage">
          <Row label="Robinhood" sub={settings.brokerage.robinhood ? "Connected" : "Not connected"}>
            <button
              onClick={() => updateSettings((s) => ({ ...s, brokerage: { ...s.brokerage, robinhood: !s.brokerage.robinhood } }))}
              className="px-3.5 h-8 rounded-full border border-line text-[12.5px] text-ink hover:bg-cream transition"
            >
              {settings.brokerage.robinhood ? "Disconnect" : "Connect"}
            </button>
          </Row>
          <Row label="Coinbase" sub={settings.brokerage.coinbase ? "Connected" : "Not connected"}>
            <button
              onClick={() => updateSettings((s) => ({ ...s, brokerage: { ...s.brokerage, coinbase: !s.brokerage.coinbase } }))}
              className="px-3.5 h-8 rounded-full border border-line text-[12.5px] text-ink hover:bg-cream transition"
            >
              {settings.brokerage.coinbase ? "Disconnect" : "Connect"}
            </button>
          </Row>
        </Card>

        <Card title="Never buy">
          <NeverBuy
            list={settings.neverBuy}
            onRemove={(t) => updateSettings((s) => ({ ...s, neverBuy: s.neverBuy.filter((x) => x !== t) }))}
            onAdd={(t) => updateSettings((s) => ({ ...s, neverBuy: [...new Set([...s.neverBuy, t.toUpperCase()])] }))}
          />
        </Card>

        <Card title="Social">
          <Row label="Follow on X" sub="Share new takes automatically">
            <Toggle on={settings.social.followOnX} onClick={() => updateSettings((s) => ({ ...s, social: { followOnX: !s.social.followOnX } }))} />
          </Row>
        </Card>

        <Card title="Email">
          <Row label="Weekly review" sub="A Sunday recap of your takes">
            <Toggle on={settings.emailUpdates.weeklyReview} onClick={() => updateSettings((s) => ({ ...s, emailUpdates: { ...s.emailUpdates, weeklyReview: !s.emailUpdates.weeklyReview } }))} />
          </Row>
          <Row label="When a take needs you" sub="Only when something crosses a guardrail">
            <Toggle on={settings.emailUpdates.needsYou} onClick={() => updateSettings((s) => ({ ...s, emailUpdates: { ...s.emailUpdates, needsYou: !s.emailUpdates.needsYou } }))} />
          </Row>
        </Card>
      </div>

      <p className="mt-5 text-[12px] text-muted">Practice mode · demo balance · zero risk.</p>
    </div>
  );
}

function NeverBuy({ list, onRemove, onAdd }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {list.length === 0 && <span className="text-[12.5px] text-muted">No tickers excluded.</span>}
        {list.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 pl-2.5 pr-1 h-7 rounded-full bg-ink/[0.04] text-[12.5px] text-ink">
            {t}
            <button onClick={() => onRemove(t)} className="w-5 h-5 rounded-full hover:bg-ink/10 text-muted text-[14px] leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={v}
          onChange={(e) => setV(e.target.value.replace(/[^a-z0-9.]/gi, "").toUpperCase())}
          onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); } }}
          placeholder="Add a ticker…"
          className="flex-1 px-3 h-9 rounded-full border border-line outline-none text-[13px] text-ink uppercase"
        />
        <button
          onClick={() => { if (v.trim()) { onAdd(v.trim()); setV(""); } }}
          className="px-3.5 h-9 rounded-full border border-line text-[12.5px] text-ink hover:bg-cream transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}