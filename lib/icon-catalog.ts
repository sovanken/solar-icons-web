/// Server-side view of the live Solar catalog, for the MCP server.
///
/// The browser fetches the collection itself (lib/iconify.ts); this module
/// keeps the extra facts an AI needs to use an icon correctly — which styles
/// exist for each icon and which old names were renamed — and caches the
/// upstream response so tool calls do not each hit Iconify.
import { STYLES } from "./libraries";

const API = "https://api.iconify.design";
/// Iconify updates Solar every few weeks; six hours keeps new icons prompt
/// without refetching a 300 KB document on every tool call.
const REVALIDATE_SECONDS = 6 * 60 * 60;

/// Longest suffix first, so `-line-duotone` is stripped before `-linear`
/// could mismatch and `-bold-duotone` before `-bold`.
const SUFFIXES = STYLES.map((s) => ({ id: s.id, suffix: s.suffix })).sort(
  (a, b) => b.suffix.length - a.suffix.length,
);

function splitStyle(full: string): { base: string; style: string } | null {
  for (const { id, suffix } of SUFFIXES) {
    if (full.endsWith(suffix)) {
      return { base: full.slice(0, -suffix.length), style: id };
    }
  }
  return null;
}

export interface Catalog {
  /// Base name → its Solar category.
  categoryOf: Map<string, string>;
  /// Base name → the style ids it is drawn in, in STYLES order.
  stylesOf: Map<string, string[]>;
  /// Category → base names, sorted.
  byCategory: Map<string, string[]>;
  /// Retired base name → its current base name.
  renamedTo: Map<string, string>;
}

let cached: { at: number; catalog: Catalog } | null = null;

export async function loadCatalog(): Promise<Catalog> {
  if (cached && Date.now() - cached.at < REVALIDATE_SECONDS * 1000) {
    return cached.catalog;
  }
  const resp = await fetch(`${API}/collection?prefix=solar`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!resp.ok) throw new Error(`Iconify returned HTTP ${resp.status}`);
  const data = (await resp.json()) as {
    categories?: Record<string, string[]>;
    aliases?: Record<string, string>;
  };

  const categoryOf = new Map<string, string>();
  const styleSets = new Map<string, Set<string>>();
  for (const [category, names] of Object.entries(data.categories ?? {})) {
    for (const full of names) {
      const parts = splitStyle(full);
      if (!parts) continue;
      if (!categoryOf.has(parts.base)) categoryOf.set(parts.base, category);
      let set = styleSets.get(parts.base);
      if (!set) styleSets.set(parts.base, (set = new Set()));
      set.add(parts.style);
    }
  }
  if (categoryOf.size === 0) throw new Error("Iconify returned no icons");

  const stylesOf = new Map<string, string[]>();
  for (const [base, set] of styleSets) {
    stylesOf.set(
      base,
      STYLES.map((s) => s.id).filter((id) => set.has(id)),
    );
  }

  const byCategory = new Map<string, string[]>();
  for (const [base, category] of categoryOf) {
    const list = byCategory.get(category);
    if (list) list.push(base);
    else byCategory.set(category, [base]);
  }
  for (const list of byCategory.values()) list.sort();

  // Iconify records renames as per-style aliases; collapse them to base names
  // and keep only those that land on an icon that still exists.
  const renamedTo = new Map<string, string>();
  for (const [alias, parent] of Object.entries(data.aliases ?? {})) {
    const from = splitStyle(alias);
    const to = splitStyle(parent);
    if (!from || !to || from.base === to.base) continue;
    if (categoryOf.has(from.base)) continue;
    if (categoryOf.has(to.base)) renamedTo.set(from.base, to.base);
  }

  const catalog = { categoryOf, stylesOf, byCategory, renamedTo };
  cached = { at: Date.now(), catalog };
  return catalog;
}
