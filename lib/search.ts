/// Small, dependency-free fuzzy search for the Solar icon catalog.
///
/// Design goals:
///   1. Fast enough for 1,231 icons filtered on every keystroke.
///   2. Typo-tolerant: "srach" should still find "search".
///   3. Alias-aware: "car" also matches "transport", "bus", "wheel".
///   4. Zero dependencies (no fuse.js — the alias table plus a light
///      substring/subsequence match is enough for this catalog size).

/// Keyword aliases — search terms → icon-name substrings they should match.
/// Curated for common cases where users type a natural word that isn't in
/// the Solar naming convention.
const ALIASES: Record<string, string[]> = {
  // People / accounts
  person: ["user"],
  people: ["users", "user"],
  account: ["user"],
  profile: ["user"],
  avatar: ["user"],
  // Money / finance
  cash: ["money", "dollar", "banknote", "wallet"],
  finance: ["money", "dollar", "wallet", "card"],
  bank: ["money", "banknote", "wallet"],
  pay: ["card", "wallet", "money"],
  wallet: ["wallet", "money"],
  // Transport
  car: ["transport", "bus", "wheel"],
  vehicle: ["bus", "transport"],
  bike: ["bicycling"],
  bicycle: ["bicycling"],
  // Communication
  chat: ["chat", "message", "conversation"],
  msg: ["message", "chat"],
  call: ["phone"],
  mail: ["letter", "envelope"],
  email: ["letter", "envelope"],
  inbox: ["letter", "envelope", "inbox"],
  // Files / docs
  doc: ["document", "file", "notebook"],
  document: ["document", "file"],
  file: ["file", "document"],
  folder: ["folder", "archive"],
  // Shopping
  shop: ["cart", "bag", "shop"],
  ecommerce: ["cart", "bag"],
  buy: ["cart", "bag"],
  // Interface / UI
  menu: ["hamburger-menu", "menu"],
  hamburger: ["hamburger-menu"],
  close: ["close", "cross"],
  cross: ["close-circle", "close-square"],
  x: ["close"],
  check: ["check-circle", "check-square"],
  tick: ["check"],
  ok: ["check"],
  // Media
  play: ["play"],
  pause: ["pause"],
  music: ["music", "playlist"],
  video: ["videocamera", "camera"],
  photo: ["camera", "gallery"],
  image: ["gallery", "camera"],
  // Nature / weather
  weather: ["cloud", "sun", "rain", "snowflake"],
  sun: ["sun"],
  moon: ["moon"],
  star: ["star"],
  // Health / medical
  health: ["heart", "medical", "pill", "hospital"],
  medical: ["pill", "hospital", "medical"],
  medicine: ["pill", "medical"],
  // Alerts / status
  warning: ["danger", "warning"],
  alert: ["bell", "danger"],
  error: ["danger", "close"],
  info: ["info-circle"],
  question: ["question"],
  help: ["question"],
  // Tools / dev
  code: ["code"],
  bug: ["bug"],
  gear: ["settings", "tuning"],
  config: ["settings", "tuning"],
  cog: ["settings", "tuning"],
  wrench: ["tuning"],
  // Time
  clock: ["clock", "time"],
  time: ["clock"],
  calendar: ["calendar"],
  date: ["calendar"],
  // Location
  map: ["map"],
  location: ["map-point", "map"],
  gps: ["map-point"],
  pin: ["map-point"],
  // Sharing / social
  share: ["share", "export"],
  send: ["export", "share"],
  upload: ["upload"],
  download: ["download"],
  // Security
  lock: ["lock"],
  unlock: ["lock-unlock"],
  key: ["key"],
  security: ["shield", "lock"],
  shield: ["shield"],
  // Emojis / faces
  smile: ["emoji", "smile"],
  happy: ["emoji"],
  emoji: ["emoji"],
  face: ["emoji"],
};

/// True if `s` contains all characters of `q` in order (subsequence match).
/// Handles typos where a character is skipped: "srch" matches "search".
function subsequenceMatch(s: string, q: string): boolean {
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    while (si < s.length && s[si] !== q[qi]) si++;
    if (si >= s.length) return false;
    si++;
  }
  return true;
}

/// Score an icon name against a query. Higher = better match.
///   3 = exact substring match at start
///   2 = exact substring match anywhere
///   1 = alias match, then subsequence match
///   0 = no match
function scoreMatch(iconName: string, query: string): number {
  const name = iconName.toLowerCase();
  const q = query.toLowerCase();

  if (name.startsWith(q)) return 3;
  if (name.includes(q)) return 2;

  const aliasTargets = ALIASES[q];
  if (aliasTargets) {
    for (const target of aliasTargets) {
      if (name.includes(target)) return 1;
    }
  }

  if (q.length >= 3 && subsequenceMatch(name, q)) return 1;

  return 0;
}

/// Filter and rank icons by relevance. Empty query returns the full list
/// unchanged (preserves category order).
export function fuzzyFilter<T extends { base: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const q = query.trim();
  if (!q) return items.slice();

  const scored: { item: T; score: number }[] = [];
  for (const item of items) {
    const score = scoreMatch(item.base, q);
    if (score > 0) scored.push({ item, score });
  }

  // Higher score first; within the same score, preserve original order.
  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ item }) => item);
}
