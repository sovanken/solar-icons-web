/**
 * Fail if the category-to-icon map no longer matches the categories the
 * Iconify API returns for Solar, or if a second copy of it exists.
 *
 * An unmatched key is invisible: the sidebar falls back to a plain folder
 * icon, which looks like a design choice. Solar shortened 16 category names
 * (e.g. "Essentional, UI" -> "UI", "Home, Furniture" -> "Home") and those
 * 16 rows showed a folder for weeks before anyone noticed.
 *
 * Network-dependent, so this is a scheduled check rather than part of the
 * blocking CI run: upstream renaming a category should open an issue, not
 * break an unrelated pull request.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const PREFIX = "solar";
const BASE_SUFFIX = "-bold-duotone";
// Forward slashes: this string is printed, and joined paths are
// compared with endsWith() against normalised ones below.
const SHARED = "lib/categories.ts";

const resp = await fetch(
  `https://api.iconify.design/collection?prefix=${PREFIX}`,
);
if (!resp.ok) {
  console.error(`Iconify API returned HTTP ${resp.status}`);
  process.exit(2);
}
const data = await resp.json();

const apiCategories = new Set();
for (const [cat, names] of Object.entries(data.categories ?? {})) {
  if (names.some((n) => n.endsWith(BASE_SUFFIX))) apiCategories.add(cat);
}
if (apiCategories.size === 0) {
  console.error("Iconify returned no categories; refusing to compare.");
  process.exit(2);
}

const src = readFileSync(SHARED, "utf8");
const mapped = new Set(
  [...src.matchAll(/^\s*"([^"]+)":\s*"solar:[^"]+",$/gm)].map((m) => m[1]),
);

const unmapped = [...apiCategories].filter((c) => !mapped.has(c)).sort();
const stale = [...mapped].filter((c) => !apiCategories.has(c)).sort();

if (unmapped.length || stale.length) {
  console.error(`\n${SHARED} is out of sync with the Iconify API.\n`);
  if (unmapped.length) {
    console.error(
      `  Categories with no icon (render as a folder): ${unmapped.length}`,
    );
    for (const c of unmapped) console.error(`    ${c}`);
  }
  if (stale.length) {
    console.error(`\n  Keys matching no category (dead entries): ${stale.length}`);
    for (const c of stale) console.error(`    ${c}`);
  }
  console.error("");
  process.exit(1);
}

/**
 * A second copy of the map is worse than none: it drifts silently. MobileNav
 * carried its own and kept showing folders on phones after the shared map was
 * corrected. Anything holding a pile of category-to-icon pairs outside the
 * shared module is that mistake again.
 */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(full)) out.push(full);
  }
  return out;
}

const rivals = [];
for (const dir of ["app", "components", "lib"]) {
  let files;
  try {
    files = walk(dir);
  } catch {
    continue;
  }
  for (const file of files) {
    const rel = relative(".", file).split(sep).join("/");
    if (rel === SHARED) continue;
    const pairs = readFileSync(file, "utf8").match(
      /^\s*"?[A-Z][\w &,]*"?:\s*"solar:[a-z0-9-]+",$/gm,
    );
    if (pairs && pairs.length >= 10) {
      rivals.push({ file: rel, n: pairs.length });
    }
  }
}

if (rivals.length) {
  console.error("\nA second category-to-icon map exists. Import the shared");
  console.error(`CATEGORY_ICONS from ${SHARED} instead.\n`);
  for (const r of rivals) console.error(`  ${r.file} (${r.n} entries)`);
  console.error("");
  process.exit(1);
}

console.log(
  `check-categories: ${mapped.size} keys, all matching a live Iconify ` +
    `category; no rival copies of the map.`,
);
