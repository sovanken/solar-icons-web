/// Small, dependency-free search for the Solar icon catalog.
///
/// Design goals:
///   1. Fast enough for ~1,250 icons filtered on every keystroke.
///   2. Word-aware: "arrow right" finds `arrow-right`. Solar names are
///      hyphenated, so matching the raw query against the raw name means a
///      space never matches anything.
///   3. Typo-tolerant: "magnifer" still finds `magnifier`.
///   4. Vocabulary-aware: Solar rarely names an icon the word a user reaches
///      for first — the search icon is `magnifier`, delete is `trash-bin`,
///      save is `diskette`, wifi is `wi-fi`. The alias table bridges that gap.
///   5. Zero dependencies (no fuse.js — the catalog is small enough).
///
/// Matching is AND across query words, so extra words narrow rather than
/// widen. Words that match nothing at all are dropped instead of zeroing the
/// whole query, so "search icon" still works.

/// Search vocabulary: the word a user types → the catalog words that should
/// satisfy it. Every target here is matched as a whole hyphen-delimited word
/// or word-prefix, never as a raw substring — otherwise "pen" would match
/// "o-pen-ed". All targets are verified to exist in the Solar catalog.
const ALIASES: Record<string, string[]> = {
  // People / accounts
  person: ["user"],
  people: ["users", "user"],
  account: ["user"],
  profile: ["user"],
  avatar: ["user"],
  member: ["user"],
  // Search — Solar calls it `magnifier`, so the obvious word finds nothing.
  search: ["magnifier"],
  find: ["magnifier"],
  lookup: ["magnifier"],
  magnify: ["magnifier"],
  zoom: ["magnifier-zoom-in", "magnifier-zoom-out"],
  // Delete — Solar calls it `trash-bin`.
  delete: ["trash-bin"],
  remove: ["trash-bin", "close-circle"],
  trash: ["trash-bin"],
  garbage: ["trash-bin"],
  bin: ["trash-bin"],
  // Save — Solar calls it `diskette`.
  save: ["diskette", "bookmark"],
  floppy: ["diskette"],
  disk: ["diskette"],
  // Edit — Solar calls it `pen`.
  edit: ["pen"],
  write: ["pen"],
  pencil: ["pen"],
  compose: ["pen"],
  draw: ["pen", "palette"],
  // Connectivity — Solar spells it `wi-fi`.
  wifi: ["wi-fi"],
  wlan: ["wi-fi"],
  internet: ["wi-fi", "globe"],
  network: ["wi-fi", "server"],
  // Notifications
  notification: ["bell"],
  notify: ["bell"],
  alert: ["bell", "danger"],
  // Settings
  settings: ["settings", "tuning"],
  gear: ["settings", "tuning"],
  cog: ["settings", "tuning"],
  config: ["settings", "tuning"],
  preferences: ["settings", "tuning"],
  options: ["settings", "tuning"],
  wrench: ["tuning"],
  // Session
  logout: ["logout", "exit"],
  signout: ["logout", "exit"],
  login: ["login"],
  signin: ["login"],
  // Money / finance
  cash: ["money", "dollar", "banknote", "wallet"],
  finance: ["money", "dollar", "wallet", "card"],
  bank: ["money", "banknote", "wallet"],
  pay: ["card", "wallet", "money"],
  payment: ["card", "wallet", "money"],
  currency: ["dollar", "money"],
  // Transport
  car: ["bus", "tram", "scooter"],
  vehicle: ["bus", "tram", "scooter"],
  bike: ["bicycling"],
  bicycle: ["bicycling"],
  cycling: ["bicycling"],
  // Communication
  chat: ["chat"],
  msg: ["chat"],
  message: ["chat"],
  sms: ["chat"],
  comment: ["chat"],
  call: ["phone", "call"],
  telephone: ["phone"],
  mail: ["letter", "mailbox"],
  email: ["letter", "mailbox"],
  envelope: ["letter"],
  inbox: ["letter", "mailbox"],
  // Files / docs
  doc: ["document", "file", "notebook"],
  docs: ["document", "file"],
  document: ["document", "file"],
  file: ["file", "document"],
  folder: ["folder", "archive"],
  directory: ["folder"],
  // Shopping
  shop: ["cart", "bag"],
  store: ["cart", "bag"],
  ecommerce: ["cart", "bag"],
  buy: ["cart", "bag"],
  purchase: ["cart", "bag"],
  checkout: ["cart", "bag"],
  // Interface
  menu: ["hamburger-menu", "menu-dots"],
  hamburger: ["hamburger-menu"],
  nav: ["hamburger-menu"],
  close: ["close-circle", "close-square"],
  cross: ["close-circle", "close-square"],
  cancel: ["close-circle"],
  dismiss: ["close-circle"],
  x: ["close-circle"],
  check: ["check-circle", "check-square"],
  tick: ["check-circle"],
  ok: ["check-circle"],
  done: ["check-circle"],
  success: ["check-circle"],
  confirm: ["check-circle"],
  add: ["add-circle", "add-square"],
  plus: ["add-circle", "add-square"],
  create: ["add-circle", "add-square"],
  minus: ["minus-circle", "minus-square"],
  subtract: ["minus-circle"],
  back: ["arrow-left", "alt-arrow-left"],
  previous: ["arrow-left"],
  next: ["arrow-right", "alt-arrow-right"],
  forward: ["arrow-right"],
  // Status / motion
  loading: ["refresh"],
  spinner: ["refresh"],
  reload: ["refresh"],
  sync: ["refresh"],
  // Layout
  grid: ["widget"],
  layout: ["widget", "list"],
  // Visibility
  view: ["eye"],
  visible: ["eye"],
  preview: ["eye"],
  show: ["eye"],
  hide: ["eye-closed"],
  hidden: ["eye-closed"],
  invisible: ["eye-closed"],
  // Transfer
  send: ["send", "plane"],
  import: ["upload"],
  export: ["download", "share"],
  // Media
  music: ["music", "playlist"],
  audio: ["music", "volume"],
  song: ["music"],
  video: ["videocamera", "video-frame"],
  movie: ["videocamera", "clapperboard"],
  film: ["clapperboard", "videocamera"],
  photo: ["camera", "gallery"],
  image: ["gallery", "camera"],
  picture: ["gallery", "camera"],
  mic: ["microphone"],
  voice: ["microphone"],
  speaker: ["volume"],
  mute: ["volume-cross"],
  sound: ["volume", "music"],
  // Nature / weather
  weather: ["cloud", "sun", "rain", "snowflake"],
  // Theme
  theme: ["moon", "sun"],
  dark: ["moon"],
  light: ["sun"],
  // Health
  health: ["heart", "medical", "pill", "hospital"],
  medical: ["pill", "hospital", "medical"],
  medicine: ["pill", "medical"],
  doctor: ["hospital", "medical"],
  // Alerts
  warning: ["danger"],
  error: ["danger", "close-circle"],
  problem: ["danger"],
  info: ["info-circle"],
  question: ["question"],
  help: ["question", "help"],
  faq: ["question"],
  support: ["question", "help"],
  // Dev
  code: ["code"],
  program: ["code"],
  terminal: ["code"],
  console: ["code"],
  bug: ["bug"],
  issue: ["bug"],
  debug: ["bug"],
  db: ["database", "server"],
  storage: ["database", "server"],
  hosting: ["server"],
  processor: ["cpu"],
  chip: ["cpu"],
  // Analytics
  analytics: ["graph", "chart"],
  statistics: ["graph", "chart"],
  stats: ["graph", "chart"],
  dashboard: ["graph", "chart", "widget"],
  report: ["chart", "graph"],
  // Time
  time: ["clock"],
  timer: ["clock", "stopwatch"],
  watch: ["clock"],
  date: ["calendar"],
  schedule: ["calendar"],
  event: ["calendar"],
  // Location
  location: ["map-point", "map"],
  gps: ["map-point"],
  place: ["map-point"],
  address: ["map-point"],
  navigation: ["map", "compass"],
  // Security
  secure: ["lock", "shield"],
  private: ["lock"],
  password: ["lock", "key"],
  unlock: ["unlocked"],
  security: ["shield", "lock"],
  protect: ["shield"],
  safe: ["shield", "lock"],
  // Faces
  happy: ["emoji", "smile"],
  face: ["emoji", "smile"],
  sticker: ["sticker", "emoji"],
  // Favourites — Solar uses the American spelling.
  favourite: ["favorite", "star"],
  favorite: ["favorite", "star"],
  like: ["heart"],
  love: ["heart"],
  // Misc
  hot: ["fire"],
  trending: ["fire", "graph"],
  present: ["gift"],
  label: ["tag"],
  badge: ["tag"],
  print: ["printer"],
  shutdown: ["power"],
  color: ["palette"],
  colour: ["palette"],
  paint: ["palette"],
  brush: ["palette"],
  design: ["palette"],
  resize: ["scaling", "crop"],
  barcode: ["qr-code", "scan"],
  qr: ["qr-code"],
  world: ["globe", "earth"],
  global: ["globe", "earth"],
  language: ["globe"],
  translate: ["globe"],
  charge: ["battery"],
  stack: ["layers"],
  launch: ["rocket"],
  startup: ["rocket"],
  flight: ["plane"],
  airplane: ["plane"],
  travel: ["plane", "suitcase"],
  furniture: ["sofa", "armchair"],
  coffee: ["cup", "mug"],
  tea: ["cup", "mug"],
  drink: ["cup", "mug"],
};

/// Relevance weights. Ordered so a precise hit always outranks a loose one
/// no matter how many words are involved.
const S_NAME_EXACT = 1000;
/// An alias landing on a whole icon name outranks an incidental word match:
/// "search" should surface `magnifier` before `card-search`.
const S_ALIAS_EXACT = 300;
const S_WORD_EXACT = 240;
const S_ALIAS_NAME_PREFIX = 200;
const S_NAME_PREFIX = 180;
const S_WORD_PREFIX = 140;
const S_SUBSTRING = 90;
const S_ALIAS_PHRASE = 70;
const S_ALIAS_WORD_PREFIX = 60;
const S_TYPO = 45;
const S_SUBSEQUENCE = 15;
/// Each step down an alias's target list costs a little, so the canonical
/// icon for a concept ("save" → `diskette`) beats the secondary one.
const ALIAS_RANK_STEP = 5;

/// Splits a query into lowercase words. Treats spaces, hyphens, underscores
/// and punctuation alike so "arrow right", "arrow-right" and "Arrow_Right"
/// are the same query.
export function queryWords(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/// Icon names are stable, so their word split is cached across keystrokes.
const wordCache = new Map<string, string[]>();
export function nameWords(name: string): string[] {
  let w = wordCache.get(name);
  if (!w) {
    w = name.split("-").filter(Boolean);
    wordCache.set(name, w);
  }
  return w;
}

/// True if `phrase` appears in `name` on word boundaries. Lets a multi-word
/// alias target like "wi-fi" or "trash-bin" match without also matching a
/// coincidental substring.
function containsPhrase(name: string, phrase: string): boolean {
  if (name === phrase) return true;
  if (name.startsWith(phrase + "-")) return true;
  if (name.endsWith("-" + phrase)) return true;
  return name.includes("-" + phrase + "-");
}

/// True if `s` contains all characters of `q` in order.
function subsequenceMatch(s: string, q: string): boolean {
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    while (si < s.length && s[si] !== q[qi]) si++;
    if (si >= s.length) return false;
    si++;
  }
  return true;
}

/// Bounded Damerau-Levenshtein (optimal string alignment): true when `a` and
/// `b` are within `max` edits, counting a swap of two adjacent characters as
/// one edit rather than two. Transposition is the most common real typo —
/// "rihgt" for "right" — and plain Levenshtein scores it as two, which puts
/// it out of budget for short words.
///
/// Bails out early on length difference and on rows that already exceed the
/// budget, so it stays cheap in the common non-matching case.
function withinEditDistance(a: string, b: string, max: number): boolean {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > max) return false;
  if (a === b) return true;

  // Three rolling rows: i-2, i-1 and the row being filled.
  let prev2 = new Array<number>(lb + 1).fill(0);
  let prev = new Array<number>(lb + 1);
  let curr = new Array<number>(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    const ca = a[i - 1];
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && ca === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return false;
    const spare = prev2;
    prev2 = prev;
    prev = curr;
    curr = spare;
  }
  return prev[lb] <= max;
}

/// Scores one query word against one icon. 0 means no match at all.
export function scoreWord(name: string, ws: string[], token: string): number {
  if (name === token) return S_NAME_EXACT;
  if (ws.includes(token)) return S_WORD_EXACT;
  if (name.startsWith(token)) return S_NAME_PREFIX;
  for (const w of ws) {
    if (w.startsWith(token)) return S_WORD_PREFIX;
  }
  if (name.includes(token)) return S_SUBSTRING;

  const targets = ALIASES[token];
  if (targets) {
    let best = 0;
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const penalty = i * ALIAS_RANK_STEP;
      let tier = 0;
      if (name === t) tier = S_ALIAS_EXACT;
      else if (name.startsWith(t + "-")) tier = S_ALIAS_NAME_PREFIX;
      else if (containsPhrase(name, t)) tier = S_ALIAS_PHRASE;
      else if (ws.some((w) => w.startsWith(t))) tier = S_ALIAS_WORD_PREFIX;
      if (tier > 0 && tier - penalty > best) best = tier - penalty;
    }
    if (best > 0) return best;
  }

  // Typo tolerance, per word so "arrow rihgt" still lands on `arrow-right`.
  if (token.length >= 4) {
    const budget = token.length <= 6 ? 1 : 2;
    for (const w of ws) {
      if (withinEditDistance(w, token, budget)) return S_TYPO;
    }
  }

  // Last resort. Kept to long queries — on short ones it matches most of
  // the catalog and buries the good hits.
  if (token.length >= 5 && subsequenceMatch(name, token)) return S_SUBSEQUENCE;

  return 0;
}

/// Scores an icon against every query word. Returns null when any word fails,
/// so additional words narrow the result set instead of widening it.
function scoreName(name: string, tokens: string[]): number | null {
  const ws = nameWords(name);
  let total = 0;
  for (const token of tokens) {
    const s = scoreWord(name, ws, token);
    if (s === 0) return null;
    total += s;
  }

  // Reward the whole query reading as the start of the name, so "arrow right"
  // puts `arrow-right` above `alt-arrow-right`.
  const joined = tokens.join("-");
  if (name === joined) total += 800;
  else if (name.startsWith(joined)) total += 200;

  // Prefer tighter names: every unmatched extra word costs a little, and
  // longer names lose to shorter ones at equal relevance.
  total -= Math.max(0, ws.length - tokens.length) * 6;
  total -= name.length * 0.5;

  return total;
}

/// Filter and rank icons by relevance. An empty query returns the full list
/// unchanged (preserving category order).
export function fuzzyFilter<T extends { base: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const tokens = queryWords(query);
  if (!tokens.length) return items.slice();

  const scored = rank(items, tokens);
  if (scored.length) return scored;

  // Nothing matched every word. Drop the words that match nothing anywhere —
  // filler like the "icon" in "search icon" — and rank on what is left.
  const live = tokens.filter((t) =>
    items.some((it) => scoreWord(it.base, nameWords(it.base), t) > 0),
  );
  if (!live.length || live.length === tokens.length) return [];
  return rank(items, live);
}

function rank<T extends { base: string }>(
  items: readonly T[],
  tokens: string[],
): T[] {
  const scored: { item: T; score: number; base: string }[] = [];
  for (const item of items) {
    const score = scoreName(item.base, tokens);
    if (score !== null) scored.push({ item, score, base: item.base });
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.base.length - b.base.length ||
      (a.base < b.base ? -1 : 1),
  );
  return scored.map(({ item }) => item);
}
