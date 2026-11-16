/// Finds Solar icons by purpose ("delete account", "dark mode toggle") rather
/// than by name. Used by the MCP server so AI tools pick real, fitting icons.
///
/// Each query word is scored two ways and the better one counts:
///   - against the icon's name, with the site search's scorer (aliases,
///     prefixes, typo tolerance) from lib/search.ts;
///   - against the icon's meanings from lib/icon-meanings.ts.
/// Icons are ranked by how many query words they satisfy, then by score.
/// Results are grouped into families (`trash-bin-trash`,
/// `trash-bin-minimalistic`, ...) so a caller sees distinct choices with
/// their variants, not ten near-identical drawings.
import { CATEGORY_MEANINGS, VARIANT_WORDS, meaningsOf } from "./icon-meanings";
import { nameWords, queryWords, scoreWord } from "./search";

/// Words that say nothing about which icon is wanted.
const STOP_WORDS = new Set([
  "a", "an", "the", "for", "to", "of", "in", "on", "at", "by", "with", "and",
  "or", "my", "your", "our", "this", "that", "it", "is", "be", "as", "from",
  "icon", "icons", "button", "btn", "symbol", "ui", "app", "page",
  "use", "used", "using", "something", "thing", "solar",
  "flutter", "widget", "action", "item", "glyph",
]);

const MEANING_EXACT = 260;
const MEANING_PREFIX = 120;
const CATEGORY_MATCH = 40;
/// Bonus when the whole query is one of an icon's meanings: "more options",
/// "dark mode" and "sign out" are phrases, not word lists.
const PHRASE_BONUS = 500;
/// Each variant word ("minimalistic", "2", "rounded") makes a name slightly
/// less likely to be the canonical choice.
const VARIANT_PENALTY = 8;

/// Inflected forms to try for a query word: "deleting" → "delete",
/// "accounts" → "account", "uploaded" → "upload".
function forms(word: string): string[] {
  const out = [word];
  if (word.length > 5 && word.endsWith("ing")) {
    out.push(word.slice(0, -3), word.slice(0, -3) + "e");
  }
  if (word.length > 4 && word.endsWith("ed")) {
    out.push(word.slice(0, -2), word.slice(0, -1));
  }
  if (word.length > 4 && word.endsWith("es")) out.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    out.push(word.slice(0, -1));
  }
  return out;
}

interface Profile {
  base: string;
  words: string[];
  meanings: string[];
  meaningWords: Map<string, number>;
  categoryWords: Set<string>;
}

const profiles = new Map<string, Profile>();
function profileOf(base: string, category: string): Profile {
  let p = profiles.get(base);
  if (p) return p;
  const meanings = meaningsOf(base);
  const meaningWords = new Map<string, number>();
  meanings.forEach((m, i) => {
    for (const w of queryWords(m)) {
      if (!meaningWords.has(w)) meaningWords.set(w, i);
    }
  });
  const categoryWords = new Set(
    [category, ...(CATEGORY_MEANINGS[category] ?? [])].flatMap(queryWords),
  );
  p = { base, words: nameWords(base), meanings, meaningWords, categoryWords };
  profiles.set(base, p);
  return p;
}

function scoreToken(p: Profile, token: string): number {
  let best = 0;
  for (const f of forms(token)) {
    best = Math.max(best, scoreWord(p.base, p.words, f));
    const at = p.meaningWords.get(f);
    if (at !== undefined) {
      // Earlier meanings are the icon's main use.
      best = Math.max(best, MEANING_EXACT - Math.min(at, 10) * 6);
    } else if (f.length >= 4) {
      for (const w of p.meaningWords.keys()) {
        if (w.startsWith(f)) {
          best = Math.max(best, MEANING_PREFIX);
          break;
        }
      }
    }
    if (p.categoryWords.has(f)) best = Math.max(best, CATEGORY_MATCH);
  }
  return best;
}

export interface IconMatch {
  base: string;
  category: string;
  meanings: string[];
  score: number;
  /// Query words this icon satisfied.
  matched: string[];
}

export interface IconFamily {
  primary: IconMatch;
  /// Other drawings of the same idea, best first.
  variants: string[];
}

/// Family key: the name without variant words, so `trash-bin-minimalistic-2`
/// and `trash-bin-trash` both group under the idea they draw.
function familyOf(base: string): string {
  const core = base.split("-").filter((w) => !VARIANT_WORDS.has(w));
  return core.length ? core.join("-") : base;
}

export function findIcons(
  query: string,
  categoryOf: ReadonlyMap<string, string>,
  limit = 8,
): IconFamily[] {
  const all = queryWords(query);
  const tokens = all.filter((t) => !STOP_WORDS.has(t));
  const useTokens = tokens.length ? tokens : all;
  if (!useTokens.length) return [];
  const phrase = useTokens.join(" ");

  const scored: IconMatch[] = [];
  for (const [base, category] of categoryOf) {
    const p = profileOf(base, category);
    let total = 0;
    const matched: string[] = [];
    for (const t of useTokens) {
      const s = scoreToken(p, t);
      if (s > 0) {
        total += s;
        matched.push(t);
      }
    }
    if (!matched.length) continue;
    if (useTokens.length > 1 && p.meanings.includes(phrase)) total += PHRASE_BONUS;
    total -= p.words.filter((w) => VARIANT_WORDS.has(w)).length * VARIANT_PENALTY;
    total -= base.length * 0.5;
    scored.push({ base, category, meanings: p.meanings, score: total, matched });
  }

  // Satisfying more of the query beats a high score on one word: for
  // "delete account", `user-cross` should not lose to every trash can.
  scored.sort(
    (a, b) =>
      b.matched.length - a.matched.length ||
      b.score - a.score ||
      a.base.length - b.base.length ||
      (a.base < b.base ? -1 : 1),
  );

  const families = new Map<string, IconFamily>();
  for (const m of scored) {
    const key = familyOf(m.base);
    const fam = families.get(key);
    if (fam) {
      if (fam.variants.length < 5) fam.variants.push(m.base);
    } else {
      if (families.size >= limit) continue;
      families.set(key, { primary: m, variants: [] });
    }
  }
  return [...families.values()];
}
