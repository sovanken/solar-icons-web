/**
 * Fail if a component in components/ is defined but never imported.
 *
 * This repo has produced three of these: the grid search `filter` had no UI,
 * MobileNav was complete but never mounted (leaving phones with no category
 * navigation at all), and StyleBar duplicated the header chips. Each one
 * looked finished in the source and did nothing in the browser, which is
 * exactly the failure a build cannot catch — dead code compiles fine.
 *
 * Files under components/ui/ are shadcn primitives and are exempt: they are
 * vendored as a set, so an unused one is expected rather than a defect.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "lib"];
/**
 * Deliberately retained despite being unmounted. Keep this list short and
 * say why — an entry here is a promise that the code is kept on purpose.
 *
 * Empty on purpose: StyleBar was the only entry and it was deleted rather
 * than kept, since the header chips it duplicated are the live control.
 */
const RETAINED = {};

const ALLOWED = new Set([
  ...Object.keys(RETAINED),
  ...(process.env.ALLOW_UNMOUNTED ?? "").split(",").map((s) => s.trim()).filter(Boolean),
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(full)) out.push(full);
  }
  return out;
}

const allSources = SOURCE_DIRS.flatMap((d) => {
  try { return walk(join(ROOT, d)); } catch { return []; }
});

// Every name imported anywhere, from `import { A, B } from "..."`.
const imported = new Set();
for (const file of allSources) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (name) imported.add(name);
    }
  }
}

const components = allSources.filter(
  (f) => f.includes(join("components", "")) && !f.includes(join("components", "ui")),
);

const dead = [];
for (const file of components) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/export\s+function\s+([A-Z]\w*)/g)) {
    const name = m[1];
    if (!imported.has(name) && !ALLOWED.has(name)) {
      dead.push({ name, file: relative(ROOT, file).split(sep).join("/") });
    }
  }
}

if (dead.length) {
  console.error(`\nUnmounted components (defined but never imported): ${dead.length}\n`);
  for (const d of dead) console.error(`  ${d.name.padEnd(20)} ${d.file}`);
  console.error(
    "\nEither render it, delete it, or add the name to ALLOW_UNMOUNTED " +
    "if it is intentionally retained.\n",
  );
  process.exit(1);
}
console.log(`check-unmounted: ${components.length} component files, all imported somewhere.`);
