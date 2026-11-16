/**
 * Check lib/icon-meanings.ts against the live Solar catalog.
 *
 * Fails (exit 1) when a whole-icon entry names an icon that does not exist:
 * the MCP server would then describe, and an AI would then use, a name that
 * renders nothing. Reports, without failing, name words that match no icon
 * and how many icons end up with no meaning at all — the to-do list for the
 * next sync.
 *
 *   node --experimental-strip-types scripts/check-meanings.mjs
 *
 * Network-dependent, like check-categories.
 */
import {
  ICON_MEANINGS,
  WORD_MEANINGS,
  meaningsOf,
} from "../lib/icon-meanings.ts";

const resp = await fetch("https://api.iconify.design/collection?prefix=solar");
if (!resp.ok) {
  console.error(`Iconify API returned HTTP ${resp.status}`);
  process.exit(2);
}
const data = await resp.json();

const bases = new Set();
for (const names of Object.values(data.categories ?? {})) {
  for (const n of names) if (n.endsWith("-linear")) bases.add(n.slice(0, -7));
}
if (bases.size === 0) {
  console.error("Iconify returned no icons; refusing to compare.");
  process.exit(2);
}

const missing = Object.keys(ICON_MEANINGS).filter((b) => !bases.has(b));
const words = new Set([...bases].flatMap((b) => b.split("-")));
const unusedWords = Object.keys(WORD_MEANINGS).filter((w) => !words.has(w));
const bare = [...bases].filter((b) => meaningsOf(b).length === 0).sort();

console.log(
  `check-meanings: ${bases.size} icons, ` +
    `${bases.size - bare.length} with meanings ` +
    `(${Math.round((100 * (bases.size - bare.length)) / bases.size)}%).`,
);
if (unusedWords.length) {
  console.log(`  words matching no icon (harmless): ${unusedWords.join(", ")}`);
}
if (bare.length) {
  console.log(`  ${bare.length} icons have no meaning yet: ${bare.join(", ")}`);
}
if (missing.length) {
  console.error(
    `  ICON_MEANINGS names ${missing.length} icon(s) Solar does not have: ` +
      missing.join(", "),
  );
  process.exit(1);
}
