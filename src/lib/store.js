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

const DEFAULT_PROFILE = {
  displayName: "Sam Avery",
  handle: "sam",
  avatar: "SA",
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
export function buildTake(belief, answers) {
  const id = uid();
  const seed = id + belief;
  const title = makeTitle(belief, answers);
  const summary = makeSummary(belief, title, answers);
  const positions = makePositions(belief, answers);
  const chart = buildChartData(seed);
  // overall return based on 1Y window last point
  const ret1y = chart["1Y"].values[chart["1Y"].values.length - 1];
  const bench1y = chart["1Y"].benchmark[chart["1Y"].benchmark.length - 1];
  const beat = Number((ret1y - bench1y).toFixed(2));
  const today = Number((Math.abs(seeded(seed + "today")() * 1.2 - 0.4)).toFixed(2));
  const todaySign = seeded(seed + "sign")() > 0.4 ? 1 : -1;
  const todayChange = Number((today * todaySign).toFixed(2));
  const onTrack = ret1y >= 0;
  return {
    id,
    title,
    belief,
    summary,
    positions,
    value: 100,
    todayChange,
    return1y: ret1y,
    beat,
    onTrack,
    onTrackNote: onTrack
      ? "Holding steady within your guardrails."
      : "A little choppy lately, but still inside your guardrails.",
    chart,
    createdDate: Date.now(),
    activity: defaultActivity(title),
    public: true,
  };
}

function defaultActivity(title) {
  const now = new Date();
  const t = (mins) => {
    const d = new Date(now.getTime() - mins * 60000);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };
  return [
    { time: t(2), label: `Autopilot ON: trades within your guardrails without asking` },
    { time: t(6), label: `Activated with $100.00 Practice money` },
    { time: t(9), label: `Created '${title}' Practice money` },
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
  return `This take puts ${title} into a simple basket of stocks and ETFs and tracks it in Practice money. It buys at the start of the window and holds through to today, so you can see how the idea played out without risking a cent.`;
}

function makePositions(belief, answers) {
  const b = belief.toLowerCase();
  let pool;
  if (b.includes("glp") || b.includes("food") || b.includes("health"))
    pool = ["LLY", "NVO", "UNH", "JNJ", "PFE", "KO", "PEP", "MCD", "WMT", "COST", "XLV", "SPY", "QQQ", "VOO"];
  else if (b.includes("dollar") || b.includes("real asset"))
    pool = ["GLD", "XLE", "XOM", "CCJ", "URA", "TLT", "VTI", "VOO", "COST", "WMT", "JPM", "SPY", "QQQ", "GLD"];
  else if (b.includes("nuclear"))
    pool = ["CCJ", "URA", "XLE", "EXM", "JPM", "SPY", "QQQ", "VOO", "BAC", "GS", "TLT", "VTI", "XLF", "CCJ"];
  else if (b.includes("stablecoin") || b.includes("payment"))
    pool = ["COIN", "HOOD", "JPM", "V", "MA", "BAC", "SQ", "SPY", "QQQ", "VTI", "WMT", "COST", "GS", "COIN"];
  else if (b.includes("ai"))
    pool = ["NVDA", "AMD", "AVGO", "MSFT", "GOOGL", "META", "PLTR", "ORCL", "CRM", "SPY", "QQQ", "INTC", "TSM", "AVGO"];
  else
    pool = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "SPY", "QQQ", "VOO", "JPM", "V", "COST", "GLD", "JNJ"];
  // dedupe + 14
  const seen = new Set();
  const out = [];
  for (const t of pool) {
    if (!seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
    if (out.length === 14) break;
  }
  while (out.length < 14) out.push(pool[out.length % pool.length]);
  return out.slice(0, 14).map((ticker) => ({ ticker, weight: Number((100 / 14).toFixed(1)) }));
}

// ---------- interview questions ----------
// returns array of 3 questions; each has id, text, options (3 chips), and an altText for "different angle"
export function buildInterview(belief) {
  const b = (belief || "").toLowerCase();
  const riskOpts = ["Keep it steady", "A bit of swing", "High conviction"];
  const riskAlt = "How much bounce can you stomach before you'd want to step away?";
  const horizonOpts = ["A few weeks", "A few months", "Years"];
  const horizonAlt = "When would you first check whether this idea is working?";

  // Q3 ticker suggestions based on belief
  let tickerPool;
  if (b.includes("glp") || b.includes("food") || b.includes("health"))
    tickerPool = ["LLY", "NVO", "UNH", "JNJ", "PFE", "KO", "PEP", "MCD", "WMT", "COST", "XLV", "VOO"];
  else if (b.includes("dollar") || b.includes("real asset"))
    tickerPool = ["GLD", "XLE", "XOM", "CCJ", "URA", "TLT", "VTI", "VOO", "COST", "JPM", "SPY", "QQQ"];
  else if (b.includes("nuclear"))
    tickerPool = ["CCJ", "URA", "XLE", "JPM", "SPY", "QQQ", "VOO", "BAC", "GS", "TLT", "VTI", "XLF"];
  else if (b.includes("stablecoin") || b.includes("payment"))
    tickerPool = ["COIN", "HOOD", "JPM", "V", "MA", "BAC", "SQ", "SPY", "QQQ", "VTI", "WMT", "COST"];
  else if (b.includes("ai"))
    tickerPool = ["NVDA", "AMD", "AVGO", "MSFT", "GOOGL", "META", "PLTR", "ORCL", "CRM", "QQQ", "INTC", "TSM"];
  else tickerPool = ["AAPL", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "SPY", "QQQ", "VOO", "JPM", "V", "COST"];

  return [
    {
      id: "q1",
      text: `First — how much risk feels right for "${shorten(belief)}"?`,
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
      text: "Want to lean on any of these while we build it?",
      options: tickerPool.slice(0, 3),
      alt: "Show me a different set",
      tickerPool,
      isTicker: true,
    },
  ];
}

function shorten(s) {
  if (!s) return "your idea";
  if (s.length <= 48) return s;
  return s.slice(0, 45) + "…";
}

// leaderboard: public takes, ranked by return
export function getLeaderboard() {
  const mine = getTakes();
  const demo = seedLeaderboard();
  const all = [...mine, ...demo].sort((a, b) => b.return1y - a.return1y);
  return all;
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