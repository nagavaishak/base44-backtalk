// Mock store for Backtalk. Everything persisted to localStorage.

const TAKES_KEY = "backtalk.takes";
const PROFILE_KEY = "backtalk.profile";
const SIDEBAR_KEY = "backtalk.sidebar";

export const TICKERS = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "COIN", name: "Coinbase" },
  { ticker: "HOOD", name: "Robinhood" },
  { ticker: "SPY", name: "S&P 500 ETF" },
  { ticker: "QQQ", name: "Nasdaq 100 ETF" },
  { ticker: "GLD", name: "Gold ETF" },
  { ticker: "JPM", name: "JPMorgan" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "META", name: "Meta" },
  { ticker: "AMD", name: "AMD" },
  { ticker: "NFLX", name: "Netflix" },
  { ticker: "DIS", name: "Disney" },
  { ticker: "BA", name: "Boeing" },
  { ticker: "XOM", name: "Exxon" },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "UNH", name: "UnitedHealth" },
  { ticker: "LLY", name: "Eli Lilly" },
  { ticker: "NVO", name: "Novo Nordisk" },
  { ticker: "PFE", name: "Pfizer" },
  { ticker: "V", name: "Visa" },
  { ticker: "MA", name: "Mastercard" },
  { ticker: "BAC", name: "Bank of America" },
  { ticker: "WFC", name: "Wells Fargo" },
  { ticker: "GS", name: "Goldman Sachs" },
  { ticker: "COST", name: "Costco" },
  { ticker: "WMT", name: "Walmart" },
  { ticker: "HD", name: "Home Depot" },
  { ticker: "NKE", name: "Nike" },
  { ticker: "SBUX", name: "Starbucks" },
  { ticker: "MCD", name: "McDonald's" },
  { ticker: "KO", name: "Coca-Cola" },
  { ticker: "PEP", name: "PepsiCo" },
  { ticker: "TSM", name: "TSMC" },
  { ticker: "AVGO", name: "Broadcom" },
  { ticker: "INTC", name: "Intel" },
  { ticker: "ORCL", name: "Oracle" },
  { ticker: "CRM", name: "Salesforce" },
  { ticker: "ADBE", name: "Adobe" },
  { ticker: "PLTR", name: "Palantir" },
  { ticker: "SHOP", name: "Shopify" },
  { ticker: "SQ", name: "Block" },
  { ticker: "UBER", name: "Uber" },
  { ticker: "ABNB", name: "Airbnb" },
  { ticker: "DKNG", name: "DraftKings" },
  { ticker: "TLT", name: "Long Treasury ETF" },
  { ticker: "SHY", name: "Short Treasury ETF" },
  { ticker: "VTI", name: "Total Market ETF" },
  { ticker: "VOO", name: "S&P 500 ETF" },
  { ticker: "XLK", name: "Tech Sector ETF" },
  { ticker: "XLF", name: "Financials ETF" },
  { ticker: "XLE", name: "Energy ETF" },
  { ticker: "XLV", name: "Healthcare ETF" },
  { ticker: "XLY", name: "Consumer ETF" },
  { ticker: "BITO", name: "Bitcoin Futures ETF" },
  { ticker: "URA", name: "Uranium ETF" },
  { ticker: "CCJ", name: "Cameco" },
];

export const EXAMPLE_BELIEFS = [
  "I don't have an idea, interview me",
  "GLP-1s reshape food and healthcare",
  "A weaker dollar: I want real assets",
  "Nuclear answers baseload demand",
];

export const MORE_EXAMPLES = [
  "Stablecoins become the rails for global payments",
  "AI inference moves to the edge",
  "The housing shortage stays structural",
  "Defense spending stays elevated for a decade",
];

// ---------- Supertake seed (demo data) ----------
const ROCKET_ID = "tk_rocket";
const STABLE_ID = "tk_stable";
const DRAFT_ID = "tk_draft_nuclear";
const SEED_FLAG_KEY = "supertake.seeded";

const ROCKET_IDEA = "A bet that launch cadence keeps climbing from here, expressed through the supply chain rather than the launchers themselves. Suppliers of engines, propulsion components, specialty metals, structures, avionics and test gear get paid whether SpaceX, Rocket Lab, Blue Origin or anyone else wins share, so rising launch volume lifts the whole basket without picking a winner. The posture is structural: this plays out over years as launch rates compound, so the basket is broad across four layers with a couple of large, steady aerospace names as ballast and a modest cash reserve.";

const ROCKET_PLAYBOOK = [
  "Rebalances with spare cash when a position drifts more than 5% from its planned size.",
  "Looks closer when any single position moves more than 5% in a day.",
  "Flags the whole take if it moves more than 3% in a day.",
  "Trims any position that grows past 25% of the take.",
  "This is a years-long bet on launch volume, so hold through price swings and act only when the supply chain story itself changes.",
  "Judge each supplier by whether launch and space orders keep showing up in its backlog, not by how its stock moved this week.",
  "Bad news at one launcher, SpaceX, Rocket Lab or Blue Origin, doesn't break the take; the basket is built so suppliers get paid whoever wins.",
  "Keep the four layers represented: propulsion, structures and materials, avionics and test gear, and the two ballast holdings. Don't let gains concentrate the take into one layer.",
  "If HON or PH stops acting as ballast and starts driving the swings, flag it rather than trading around it.",
  "Trim anything past 25% of the take and put the proceeds back across the layer that's lagged.",
];

const ROCKET_BUCKETS = [
  { name: "Avionics and test gear", color: "#8B5CF6", tickers: ["TDG", "HEI", "TDY", "CW", "ATRO", "MRCY"], weight: 30.7 },
  { name: "Structures and materials", color: "#3B82F6", tickers: ["KRMN", "HWM", "LHX", "TXT"], weight: 29.6 },
  { name: "Propulsion", color: "#EF4444", tickers: ["RKLB", "SPCE", "ASTS", "MAXR", "IRDM"], weight: 19.7 },
  { name: "Ballast", color: "#10B981", tickers: ["HON", "PH"], weight: 10.0 },
];

const STABLE_BUCKETS = [
  { name: "Issuers", color: "#8B5CF6", tickers: ["CRCL"], weight: 18.0 },
  { name: "Exchanges and wallets", color: "#3B82F6", tickers: ["COIN", "HOOD"], weight: 16.0 },
  { name: "Card networks", color: "#EF4444", tickers: ["V", "MA"], weight: 16.0 },
  { name: "Banks and issuers", color: "#F59E0B", tickers: ["JPM", "BAC", "SQ"], weight: 14.0 },
  { name: "Payments fintech", color: "#10B981", tickers: ["PYPL", "MELI", "DLO", "NU"], weight: 14.0 },
  { name: "Broad market", color: "#6B7280", tickers: ["SPY", "QQQ"], weight: 12.0 },
];

function scaleSeries(arr, target) {
  const last = arr[arr.length - 1];
  if (!last) return arr.map(() => Number((target * 0.5).toFixed(2)));
  const k = target / last;
  return arr.map((v) => Number((v * k).toFixed(2)));
}

function seedTakeRocket() {
  const chart = buildChartData(ROCKET_ID);
  chart["5Y"] = {
    values: scaleSeries(chart["5Y"].values, 58.44),
    benchmark: scaleSeries(chart["5Y"].benchmark, 27.04),
    labels: chart["5Y"].labels,
  };
  const positions = ROCKET_BUCKETS.flatMap((b) => b.tickers).map((ticker) => ({ ticker }));
  return {
    id: ROCKET_ID,
    title: "Rocket Supply Chain",
    belief: "Space tech is just gonna increase from here on and everything related to space technology",
    summary: ROCKET_IDEA,
    funded: true,
    value: 100.0,
    todayChange: 0.0,
    return1y: 58.44,
    beat: 31.4,
    onTrack: true,
    statusLabel: "Opens at the bell",
    statusTone: "neutral",
    positions,
    buckets: ROCKET_BUCKETS,
    cash: 10,
    plan: {
      idea: ROCKET_IDEA,
      quote: "Space tech is just goona increase from here on and everything related to space technology",
      quoteBy: "You, when this started",
      playbook: ROCKET_PLAYBOOK,
      whenSellsOut: "A position is sold only if the whole take breaks: launch cadence stops climbing and the supply chain stops getting paid for growth. Otherwise the user removes a holding from the take's page.",
      whenTrims: "Trim any holding that grows past 25% of the take through gains alone.",
      whenAdds: "Add on weakness when a supplier drops more than 15% while its order book and the launch-cadence story are still intact.",
    },
    rules: { entry: "Buy the basket at the next market open, spread across the four layers.", exit: "Trim any position past 25%, or if the launch-cadence story breaks.", rebalance: "Rebalance quarterly, or when a layer drifts more than 5% from target." },
    chart,
    defaultPeriod: "5Y",
    activity: [
      { time: "Oct 5", tone: "green", icon: "up", text: "Autopilot ON for \u201CRocket Supply Chain\u201D, Supertake now trades within your guardrails without asking." },
      { time: "Oct 5", tone: "green", icon: "public", text: "\u201CRocket Supply Chain\u201D is public now. Anyone with the link can see it: supertake.com/t/HqqK7jkg7Fw. Percent-only, never dollars. Unpublish anytime from Sharing." },
      { time: "Oct 5", tone: "green", icon: "up", text: "Activated \u201CRocket Supply Chain\u201D with $100.00. Practice money." },
      { time: "Oct 5", tone: "green", icon: "up", text: "Created \u201CRocket Supply Chain\u201D. Draft." },
    ],
    public: true,
    createdDate: Date.now() - 2 * 86400000,
  };
}

function seedTakeStable() {
  const chart = buildChartData(STABLE_ID);
  const positions = STABLE_BUCKETS.flatMap((b) => b.tickers).map((ticker) => ({ ticker }));
  return {
    id: STABLE_ID,
    title: "Stablecoin Full Stack",
    belief: "Stablecoins become the rails for global payments",
    summary: "A bet that stablecoins become the default rails for moving dollars online, expressed across the issuers, networks and banks that carry them.",
    funded: true,
    value: 100.83,
    todayChange: 2.84,
    return1y: -0.2,
    beat: 0,
    onTrack: false,
    statusLabel: "Watching closely",
    statusTone: "amber",
    positions,
    buckets: STABLE_BUCKETS,
    cash: 10,
    plan: {
      idea: "A bet that stablecoins become the default rails for moving dollars online, expressed across the issuers, networks and banks that carry them.",
      quote: "Stablecoins are just a faster ACH.",
      quoteBy: "You, when this started",
      playbook: [
        "Rebalance quarterly, or when a layer drifts more than 5% from target.",
        "Trim any position past 25% of the take.",
        "Flag the take if Circle specifically loses a key banking partner.",
      ],
      whenSellsOut: "Sell only if stablecoin regulation collapses the issuer economics, not on price.",
      whenTrims: "Trim any holding that grows past 25% of the take through gains alone.",
      whenAdds: "Add on weakness when a name drops more than 15% while adoption keeps climbing.",
    },
    rules: { entry: "Buy the basket at the next market open.", exit: "Trim past 25%.", rebalance: "Rebalance quarterly." },
    chart,
    defaultPeriod: "1M",
    activity: [
      { time: "Oct 5", tone: "tan", icon: "watch", text: "\u201CStablecoin Full Stack\u201D moved to watching closely. Everything moved in your favor today, but a billion-dollar coalition just launched a rival stablecoin aimed straight at Circle, which is your biggest single bet." },
      { time: "Oct 5", tone: "tan", icon: "watch", text: "Watch list updated: +Open USD (OUSD). The weekly review keeps the news watch aligned with what the take depends on. Now watching: Tether, USDC, PYUSD, Global Dollar (USDG), GENIUS Act stablecoin regulation, SEC, Paxos, Open USD (OUSD)." },
      { time: "Oct 5", tone: "tan", icon: "up", text: "Bought 14 positions \u00B7 $90.03 total. Stablecoin Full Stack." },
    ],
    public: true,
    createdDate: Date.now() - 2 * 86400000,
  };
}

function seedTakeDraft() {
  const chart = buildChartData(DRAFT_ID);
  const positions = ["CCJ", "URA", "XLE", "XOM", "JPM", "GS", "BAC", "WFC", "TLT", "VTI"].map((ticker) => ({ ticker }));
  return {
    id: DRAFT_ID,
    title: "Nuclear Baseload",
    belief: "Nuclear answers baseload demand",
    summary: "A bet that nuclear returns as baseload for AI and grid demand, expressed through uranium miners, producers and the banks that finance builds.",
    funded: false,
    value: 0,
    todayChange: 0,
    return1y: 0,
    beat: 0,
    onTrack: true,
    statusLabel: "Draft",
    statusTone: "neutral",
    positions,
    buckets: [
      { name: "Uranium miners", color: "#8B5CF6", tickers: ["CCJ", "URA"], weight: 30 },
      { name: "Energy producers", color: "#3B82F6", tickers: ["XLE", "XOM"], weight: 25 },
      { name: "Project financiers", color: "#EF4444", tickers: ["JPM", "GS", "BAC", "WFC"], weight: 25 },
      { name: "Bond hedge", color: "#10B981", tickers: ["TLT", "VTI"], weight: 10 },
    ],
    cash: 10,
    plan: {
      idea: "A bet that nuclear returns as baseload for AI and grid demand, expressed through uranium miners, producers and the banks that finance builds.",
      quote: "Nuclear answers baseload demand",
      quoteBy: "You, when this started",
      playbook: [
        "Rebalance quarterly, or when a layer drifts more than 5% from target.",
        "Trim any position past 25% of the take.",
        "Hold through permit delays; act only if the baseload story itself changes.",
      ],
      whenSellsOut: "Sell only if the baseload thesis breaks, not on price.",
      whenTrims: "Trim any holding past 25% of the take through gains alone.",
      whenAdds: "Add on weakness when a miner drops more than 15% while order books stay intact.",
    },
    rules: { entry: "Buy the basket at the next market open.", exit: "Trim past 25%.", rebalance: "Rebalance quarterly." },
    chart,
    defaultPeriod: "1Y",
    activity: [
      { time: "Oct 6", tone: "green", icon: "up", text: "Saved as an unfunded draft." },
      { time: "Oct 6", tone: "green", icon: "up", text: "Created \u201CNuclear Baseload\u201D." },
    ],
    public: false,
    createdDate: Date.now() - 1 * 86400000,
  };
}

export const SEED_LEADERBOARD = [
  { id: "lb_1", title: "Discovery Economy Toolmakers", author: "Matt", mode: "Practice", publicFor: "24 days", ret: 26.7, forks: 36, icon: "bag" },
  { id: "lb_2", title: "AI Cyber Defense Consolidation", author: "Michael Mignano", mode: "Real", publicFor: "35 days", ret: 16.7, forks: 10, icon: "door" },
  { id: "lb_3", title: "Watts and Wafers", author: "Anish", mode: "Practice", publicFor: "21 days", ret: 11.9, forks: 4, icon: "sun" },
  { id: "lb_4", title: "Rebel Alliance, No Crypto", author: "Faraz Fatemi", mode: "Practice", publicFor: "26 days", ret: 11.4, icon: "grid" },
  { id: "lb_5", title: "Identity Is the New Perimeter", author: "Michael Mignano", mode: "Real", publicFor: "34 days", ret: 11.3, icon: "fingerprint" },
  { id: "lb_6", title: "Medicine 2045", author: "Fred Wilson", mode: "Real", publicFor: "33 days", ret: 11.3, forks: 11, icon: "stethoscope" },
  { id: "lb_7", title: "Medicine 2045", author: "Michael Mignano", mode: "Real", publicFor: "33 days", ret: 11.0, forks: 3, icon: "stethoscope" },
  { id: "lb_8", title: "Onshoring Silicon", author: "Anish", mode: "Practice", publicFor: "18 days", ret: 9.8, icon: "chip" },
  { id: "lb_9", title: "Grid Hardening", author: "Lena Ortiz", mode: "Real", publicFor: "29 days", ret: 8.6, icon: "bolt" },
  { id: "lb_10", title: "Protein Frontier", author: "Priya Rao", mode: "Practice", publicFor: "22 days", ret: 7.9, icon: "flask" },
];

export const SEED_CHATS = [
  { id: "ch_1", title: "Rocket Supply Chain", preview: "Space tech is just goona increase from\u2026" },
  { id: "ch_2", title: "Stablecoin Full Stack", preview: "Why did you trim Circle today?" },
  { id: "ch_3", title: "Nuclear Baseload", preview: "Is uranium too crowded here?" },
];

export const SEED_FEED = [
  { id: "f_1", author: "Albert Sebastian", avatar: "AS", action: "published", title: "Robotaxi Majority Bet", tickers: ["UBER", "TSLA", "GOOGL"], more: 16, status: "Opens at the bell", time: "27m" },
  { id: "f_2", author: "Leandro", avatar: "LE", action: "published their first take", title: "Longer Lives, Powered by AI", tickers: ["LLY", "NVDA", "TMO"], more: 14, status: "Opens at the bell", time: "2h" },
];

export const SEED_ACTIVITY = [
  ...seedTakeRocket().activity,
  ...seedTakeStable().activity,
];

export function getActivity() {
  return SEED_ACTIVITY;
}
export function getChats() {
  return SEED_CHATS;
}
export function getFollowFeed() {
  return SEED_FEED;
}

export function getPracticeSummary() {
  const funded = getTakes().filter((t) => t.funded);
  const value = funded.reduce((s, t) => s + (t.value || 0), 0);
  const todayChange = funded.reduce((s, t) => s + (t.todayChange || 0), 0);
  return { value, todayChange };
}

export function simpleBuckets(positions) {
  return [{ name: "Holdings", color: "#1F6F4A", tickers: positions.map((p) => p.ticker), weight: 100 }];
}

export function planFromRules(belief, summary, rules) {
  return {
    idea: summary || belief,
    quote: belief,
    quoteBy: "You, when this started",
    playbook: [rules.entry, rules.exit, rules.rebalance].filter(Boolean),
    whenSellsOut: rules.exit || "",
    whenTrims: "Trim any holding that grows past 25% of the take through gains alone.",
    whenAdds: "Add on weakness when a name drops more than 15% while the thesis is intact.",
  };
}

function ensureSeed() {
  if (read(SEED_FLAG_KEY, false)) return;
  write(SEED_FLAG_KEY, true);
  saveTakes([seedTakeRocket(), seedTakeStable(), seedTakeDraft()]);
}

const DEFAULT_PROFILE = {
  displayName: "Nags",
  handle: "nagavaishak",
  avatar: "N",
  bio: "Betting on supply chains, not stock pickers.",
  following: 1,
};

// ---------- persistence helpers ----------
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getProfile() {
  const p = read(PROFILE_KEY, DEFAULT_PROFILE);
  if (!p.handle || !p.displayName) return { ...DEFAULT_PROFILE, ...p };
  return p;
}
export function saveProfile(p) {
  write(PROFILE_KEY, p);
}

export function getSidebarOpen() {
  return read(SIDEBAR_KEY, true);
}
export function saveSidebarOpen(open) {
  write(SIDEBAR_KEY, open);
}

export function getTakes() {
  ensureSeed();
  return read(TAKES_KEY, []);
}
export function saveTakes(takes) {
  write(TAKES_KEY, takes);
}
export function getTake(id) {
  return getTakes().find((t) => t.id === id) || null;
}
export function upsertTake(take) {
  const takes = getTakes();
  const idx = takes.findIndex((t) => t.id === take.id);
  if (idx >= 0) takes[idx] = take;
  else takes.unshift(take);
  saveTakes(takes);
  return take;
}
export function deleteTakeById(id) {
  saveTakes(getTakes().filter((t) => t.id !== id));
}
export function duplicateTake(id) {
  const t = getTake(id);
  if (!t) return null;
  const copy = { ...t, id: uid(), title: t.title + " (copy)", createdDate: Date.now() };
  return upsertTake(copy);
}

export function uid() {
  return "tk_" + Math.random().toString(36).slice(2, 9);
}

// ---------- mock data generation ----------
function seeded(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// generate a price series as cumulative percent return
function series(seed, points, drift, vol) {
  const rnd = seeded(seed);
  const out = [0];
  let v = 0;
  for (let i = 1; i < points; i++) {
    const step = drift + (rnd() - 0.5) * vol * 2;
    v += step;
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

const PERIODS = {
  "1W": { points: 7, drift: 0.18, vol: 0.7, label: "d" },
  "1M": { points: 30, drift: 0.1, vol: 0.9, label: "d" },
  "3M": { points: 64, drift: 0.08, vol: 1.1, label: "w" },
  "1Y": { points: 52, drift: 0.06, vol: 1.4, label: "m" },
  "5Y": { points: 60, drift: 0.05, vol: 1.8, label: "q" },
};

export const PERIOD_KEYS = ["1W", "1M", "3M", "1Y", "5Y"];

function dateLabels(periodKey, count) {
  const cfg = PERIODS[periodKey];
  const labels = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    if (cfg.label === "d") d.setDate(now.getDate() - (count - 1 - i));
    else if (cfg.label === "w") d.setDate(now.getDate() - (count - 1 - i) * 7);
    else if (cfg.label === "m") d.setMonth(now.getMonth() - (count - 1 - i));
    else d.setMonth(now.getMonth() - (count - 1 - i) * 3);
    labels.push(d);
  }
  return labels;
}

export function fmtDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildChartData(seed) {
  const data = {};
  for (const key of PERIOD_KEYS) {
    const cfg = PERIODS[key];
    const base = series(seed + key, cfg.points, cfg.drift, cfg.vol);
    const bench = series(seed + key + "b", cfg.points, cfg.drift * 0.6, cfg.vol * 0.7);
    const labels = dateLabels(key, cfg.points);
    data[key] = { values: base, benchmark: bench, labels };
  }
  return data;
}

// build a take from belief + answers
export function buildTake(belief, answers, options = {}) {
  const id = uid();
  const seed = id + belief;
  const cfg = beliefConfig(belief);
  const title = cfg.title;
  const summary = makeSummary(belief, title, answers);
  const positions = makePositions(belief, answers);
  const chart = buildChartData(seed);
  const ret1y = chart["1Y"].values[chart["1Y"].values.length - 1];
  const bench1y = chart["1Y"].benchmark[chart["1Y"].benchmark.length - 1];
  const beat = Number((ret1y - bench1y).toFixed(2));
  const today = Number((Math.abs(seeded(seed + "today")() * 1.2 - 0.4)).toFixed(2));
  const todaySign = seeded(seed + "sign")() > 0.4 ? 1 : -1;
  const todayChange = Number((today * todaySign).toFixed(2));
  const onTrack = ret1y >= 0;
  const horizon = lastAnswer(answers, "q2").toLowerCase();
  const defaultPeriod = horizon.includes("week") ? "1M" : horizon.includes("month") ? "3M" : "1Y";
  const funded = options.funded !== false;
  return {
    id,
    title,
    belief,
    summary,
    positions,
    value: funded ? 100 : 0,
    todayChange: funded ? todayChange : 0,
    return1y: ret1y,
    beat,
    onTrack,
    onTrackNote: onTrack
      ? "Holding steady within your guardrails."
      : "A little choppy lately, but still inside your guardrails.",
    chart,
    defaultPeriod,
    funded,
    rules: strategyRules(belief, answers),
    createdDate: Date.now(),
    activity: defaultActivity(title, funded),
    buckets: simpleBuckets(positions),
    plan: planFromRules(belief, summary, strategyRules(belief, answers)),
    statusLabel: onTrack ? "On track" : "Watching closely",
    statusTone: onTrack ? "green" : "amber",
    public: true,
  };
}

function defaultActivity(title, funded) {
  const now = new Date();
  const t = (mins) => {
    const d = new Date(now.getTime() - mins * 60000);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };
  if (funded) {
    return [
      { time: t(2), label: `Autopilot ON: trades within your guardrails without asking` },
      { time: t(6), label: `Activated with $100.00 Practice money` },
      { time: t(9), label: `Created '${title}'` },
    ];
  }
  return [
    { time: t(2), label: `Saved as an unfunded draft` },
    { time: t(6), label: `Created '${title}'` },
  ];
}

function makeTitle(belief, answers) {
  const b = belief.toLowerCase();
  if (b.includes("glp") || b.includes("food")) return "GLP-1 Full Stack";
  if (b.includes("dollar") || b.includes("real asset")) return "Real Assets Basket";
  if (b.includes("nuclear")) return "Nuclear Baseload";
  if (b.includes("stablecoin")) return "Stablecoin Full Stack";
  if (b.includes("ai") || b.includes("inference")) return "AI Inference Edge";
  if (b.includes("housing")) return "Housing Shortage";
  if (b.includes("defense")) return "Defense Decade";
  if (b.includes("interview") || !belief.trim()) return "Your First Take";
  // fallback: title-case first few words
  const words = belief.split(" ").slice(0, 3).join(" ");
  return words.replace(/\b\w/g, (c) => c.toUpperCase());
}

function makeSummary(belief, title, answers) {
  return `This take puts ${title} into a sample basket of stocks and ETFs and tracks it in Practice money. It buys at the start of the window and holds through to today, using sample prices — so you can see how the idea might play out without risking a cent.`;
}

function makePositions(belief, answers) {
  const cfg = beliefConfig(belief);
  const layer = pickLayer(cfg, answers);
  const tickers = dedupe([...layer.tickers, ...cfg.conviction, ...cfg.hedge]);
  return tickers.map((ticker) => ({ ticker, weight: Number((100 / tickers.length).toFixed(1)) }));
}

// ---------- belief configs (sample) ----------
export function beliefConfig(belief) {
  const b = (belief || "").toLowerCase();
  const dropped = [
    { ticker: "TSLA", reason: "Too crowded — momentum already priced in." },
    { ticker: "PLTR", reason: "Dilution risk; still too early to size." },
    { ticker: "DKNG", reason: "Regulatory overhang, speculative for this basket." },
  ];
  const rules = [
    "Trim any pick past 25%.",
    "Keep cash on hand for rebalances.",
    "Rebalance quarterly.",
  ];
  const configs = [
    {
      test: (x) => x.includes("nuclear"),
      title: "Nuclear Baseload",
      layers: [
        { label: "Uranium miners", tickers: ["CCJ", "URA"] },
        { label: "Energy producers", tickers: ["XLE", "XOM"] },
        { label: "Broad market", tickers: ["VTI", "SPY"] },
        { label: "Project financiers", tickers: ["JPM", "GS"] },
        { label: "Regional banks", tickers: ["BAC", "WFC"] },
        { label: "Bond hedge", tickers: ["TLT", "SHY"] },
      ],
      conviction: ["JPM", "GS", "BAC"],
      hedge: ["TLT", "VTI"],
    },
    {
      test: (x) => x.includes("glp") || x.includes("food") || x.includes("health"),
      title: "GLP-1 Full Stack",
      layers: [
        { label: "Drug makers", tickers: ["LLY", "NVO"] },
        { label: "Healthcare ETFs", tickers: ["XLV", "VTI"] },
        { label: "Food & beverage", tickers: ["KO", "PEP"] },
        { label: "Providers", tickers: ["UNH", "JNJ"] },
        { label: "Consumer staples", tickers: ["WMT", "COST"] },
        { label: "Broad market", tickers: ["SPY", "QQQ"] },
      ],
      conviction: ["UNH", "JNJ", "KO"],
      hedge: ["SPY", "VOO"],
    },
    {
      test: (x) => x.includes("dollar") || x.includes("real asset"),
      title: "Real Assets Basket",
      layers: [
        { label: "Gold & metals", tickers: ["GLD", "XLE"] },
        { label: "Energy", tickers: ["XOM", "XLE"] },
        { label: "Uranium", tickers: ["CCJ", "URA"] },
        { label: "Long bonds", tickers: ["TLT", "SHY"] },
        { label: "Broad market", tickers: ["VTI", "VOO"] },
        { label: "Consumer staples", tickers: ["COST", "WMT"] },
      ],
      conviction: ["CCJ", "URA", "TLT"],
      hedge: ["VTI", "VOO"],
    },
    {
      test: (x) => x.includes("stablecoin") || x.includes("payment"),
      title: "Stablecoin Full Stack",
      layers: [
        { label: "Crypto exchanges", tickers: ["COIN", "HOOD"] },
        { label: "Card networks", tickers: ["V", "MA"] },
        { label: "Banks", tickers: ["JPM", "BAC"] },
        { label: "Payments fintech", tickers: ["SQ", "HOOD"] },
        { label: "Broad market", tickers: ["SPY", "QQQ"] },
        { label: "Consumer", tickers: ["WMT", "COST"] },
      ],
      conviction: ["V", "MA", "SQ"],
      hedge: ["SPY", "QQQ"],
    },
    {
      test: (x) => x.includes("ai") || x.includes("inference"),
      title: "AI Inference Edge",
      layers: [
        { label: "Chip makers", tickers: ["NVDA", "AMD"] },
        { label: "Silicon", tickers: ["AVGO", "TSM"] },
        { label: "Hyperscalers", tickers: ["MSFT", "GOOGL"] },
        { label: "Software", tickers: ["ORCL", "CRM"] },
        { label: "Broad tech", tickers: ["QQQ", "SPY"] },
        { label: "Legacy chips", tickers: ["INTC", "META"] },
      ],
      conviction: ["MSFT", "GOOGL", "META"],
      hedge: ["SPY", "QQQ"],
    },
    {
      test: (x) => x.includes("housing"),
      title: "Housing Shortage",
      layers: [
        { label: "Home improvement", tickers: ["HD", "COST"] },
        { label: "Retail", tickers: ["WMT", "COST"] },
        { label: "Broad market", tickers: ["VTI", "SPY"] },
        { label: "Consumer", tickers: ["NKE", "SBUX"] },
        { label: "Bonds", tickers: ["TLT", "SHY"] },
        { label: "Banks", tickers: ["JPM", "BAC"] },
      ],
      conviction: ["JPM", "BAC", "WMT"],
      hedge: ["VTI", "SPY"],
    },
    {
      test: (x) => x.includes("defense"),
      title: "Defense Decade",
      layers: [
        { label: "Aerospace", tickers: ["BA", "XOM"] },
        { label: "Industrials", tickers: ["XOM", "HD"] },
        { label: "Banks", tickers: ["JPM", "GS"] },
        { label: "Broad market", tickers: ["VTI", "SPY"] },
        { label: "Bonds", tickers: ["TLT", "SHY"] },
        { label: "Energy", tickers: ["XLE", "XOM"] },
      ],
      conviction: ["JPM", "GS", "BAC"],
      hedge: ["VTI", "SPY"],
    },
  ];
  const found = configs.find((c) => c.test(b));
  if (found) return { ...found, dropped, rules };
  const title =
    belief && belief.trim() && !b.includes("interview") ? makeTitle(belief, {}) : "Your First Take";
  return {
    title,
    layers: [
      { label: "Tech leaders", tickers: ["AAPL", "MSFT"] },
      { label: "Mega cap", tickers: ["GOOGL", "AMZN"] },
      { label: "Broad market", tickers: ["SPY", "QQQ"] },
      { label: "AI & chips", tickers: ["NVDA", "AMD"] },
      { label: "Financials", tickers: ["JPM", "V"] },
      { label: "Bonds & gold", tickers: ["GLD", "TLT"] },
    ],
    conviction: ["NVDA", "AMZN", "META"],
    hedge: ["SPY", "QQQ"],
    dropped,
    rules,
  };
}

function lastAnswer(answers, id) {
  const arr = answers && answers[id];
  return arr && arr.length ? arr[arr.length - 1] : "";
}
function pickLayer(cfg, answers) {
  const chosen = lastAnswer(answers, "q3");
  return cfg.layers.find((l) => l.label === chosen) || cfg.layers[0];
}
function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const t of list) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

// ---------- interview questions ----------
// returns array of 3 questions; each has id, text, options (3 chips), and an altText for "different angle"
export function buildInterview(belief) {
  const cfg = beliefConfig(belief);
  const beliefShort = shorten(belief);
  const riskOpts = ["Keep it steady", "A bit of swing", "High conviction"];
  const riskAlt = "How much bounce can you stomach before you'd want to step away?";
  const horizonOpts = ["A few weeks", "A few months", "Years"];
  const horizonAlt = "When would you first check whether this idea is working?";
  return [
    {
      id: "q1",
      text: `First — how much risk feels right for "${beliefShort}"?`,
      options: riskOpts,
      alt: riskAlt,
    },
    {
      id: "q2",
      text: "How long do you want to hold this before you judge it?",
      options: horizonOpts,
      alt: horizonAlt,
    },
    {
      id: "q3",
      text: "Which layer do you want to own?",
      options: cfg.layers.slice(0, 3).map((l) => l.label),
      alt: "Which layer do you want to own?",
      setPool: cfg.layers.map((l) => l.label),
      isSet: true,
    },
  ];
}

function shorten(s) {
  if (!s) return "your idea";
  if (s.length <= 48) return s;
  return s.slice(0, 45) + "…";
}

// ---------- build screen strategy (sample) ----------
export function buildStrategy(belief, answers = {}) {
  const cfg = beliefConfig(belief);
  const layer = pickLayer(cfg, answers);
  const risk = lastAnswer(answers, "q1").toLowerCase();
  const cashW = risk.includes("steady") ? 10 : risk.includes("conviction") ? 2 : 5;
  const convW = 30;
  const hedgeW = 15;
  const coreW = 100 - convW - hedgeW - cashW;
  const selected = dedupe([...layer.tickers, ...cfg.conviction, ...cfg.hedge]);
  const buckets = [
    { name: layer.label, weight: coreW, items: layer.tickers },
    { name: "Conviction", weight: convW, items: cfg.conviction },
    { name: "Hedge", weight: hedgeW, items: cfg.hedge },
  ];
  return {
    title: cfg.title,
    checked: 16,
    selected,
    dropped: cfg.dropped,
    buckets,
    cash: cashW,
    rules: cfg.rules,
  };
}

export function strategyRules(belief, answers = {}) {
  const risk = lastAnswer(answers, "q1").toLowerCase();
  const horizon = lastAnswer(answers, "q2").toLowerCase();
  const exitThreshold = risk.includes("steady") ? 15 : risk.includes("conviction") ? 35 : 25;
  const cadence = horizon.includes("week")
    ? "monthly"
    : horizon.includes("month")
    ? "quarterly"
    : "annually";
  return {
    entry: "Buy the basket at the next market open, spread evenly across the selected names.",
    exit: `Trim any name that falls ${exitThreshold}% below its entry price, or if the belief breaks — we'll flag it.`,
    rebalance: `Rebalance back to target weights ${cadence}, or when any name drifts past ${exitThreshold}%.`,
  };
}

// leaderboard: public takes, ranked by return
export function getLeaderboard() {
  return [...SEED_LEADERBOARD].sort((a, b) => b.ret - a.ret);
}

function seedLeaderboard() {
  const names = [
    "Mia Chen", "Dev Patel", "Lena Ortiz", "Theo Park", "Noor Aziz",
    "Jack Reilly", "Priya Rao", "Ben Foster", "Yuki Tan", "Ava Lind",
  ];
  const titles = [
    "Defense Decade", "AI Inference Edge", "Real Assets Basket",
    "Housing Shortage", "Stablecoin Full Stack", "Nuclear Baseload",
    "GLP-1 Full Stack", "Energy Squeeze", "Cloud Compounders", "Rates Normal",
  ];
  return names.map((n, i) => {
    const handle = n.split(" ")[0].toLowerCase();
    const ret = Number((18 - i * 1.7 + (Math.sin(i) * 1.4)).toFixed(2));
    return {
      id: "lb_" + i,
      title: titles[i],
      author: n,
      handle,
      return1y: ret,
      public: true,
      positions: Array.from({ length: 14 }, (_, k) => ({ ticker: "SPY" })),
    };
  });
}