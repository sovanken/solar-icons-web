// MCP server: lets AI coding tools (Claude, Cursor, VS Code, ...) pick the
// right Solar icon for a purpose and get code that compiles against the
// published solar_iconkit package. Stateless and read-only.
//
// Connect with the URL https://solar-icons-web.vercel.app/api/mcp — see the
// /mcp page for per-client setup.
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { STYLES } from "@/lib/libraries";
import { loadCatalog, type Catalog } from "@/lib/icon-catalog";
import { findIcons } from "@/lib/icon-finder";
import { meaningsOf } from "@/lib/icon-meanings";
import { STYLE_ID_TO_DART_ENUM } from "@/lib/converters";
import { loadPackageCatalog, type PackageCatalog } from "@/lib/package-catalog";

const STYLE_IDS = STYLES.map((s) => s.id) as [string, ...string[]];
const StyleSchema = z
  .enum(STYLE_IDS)
  .optional()
  .describe(
    "Icon style. Default linear. Use one style consistently; bold or bold-duotone suit a selected/active state.",
  );

const INSTRUCTIONS = `Solar icon finder for the solar_iconkit Flutter package (1,500+ icons, 6 styles).

Use find_icon whenever you need an icon for a purpose ("delete", "dark mode toggle", "add to cart"); use get_icon to check a name you already have. Only use icon names these tools return: Solar names describe drawings (search is "magnifier", save is "diskette", settings sliders are "tuning"), so guessed names are usually wrong.

Flutter usage: SolarIcon(SolarIcons.<constant>, style: SolarIconStyle.<style>). Dependency: solar_iconkit from pub.dev. The tools give the exact constant and say when an icon is not in the published package yet.

Styles: linear, outline, broken, bold, line-duotone, bold-duotone (Dart enum: lineDuotone, boldDuotone). Keep one style across an interface; a common pattern is linear for idle and bold for the selected tab or active state.`;

function svgUrl(base: string, style: string): string {
  const suffix = STYLES.find((s) => s.id === style)?.suffix ?? "-linear";
  return `https://api.iconify.design/solar/${base}${suffix}.svg`;
}

function dartCode(
  base: string,
  style: string,
  pkg: PackageCatalog | null,
): string | null {
  const constant = pkg?.constantOf.get(base);
  if (!constant) return null;
  return `SolarIcon(SolarIcons.${constant}, style: SolarIconStyle.${STYLE_ID_TO_DART_ENUM[style] ?? style})`;
}

/// Style to show for an icon: the requested one when the icon is drawn in
/// it, otherwise its first available style (and say so).
function pickStyle(
  base: string,
  wanted: string,
  cat: Catalog,
): { style: string; note?: string } {
  const styles = cat.stylesOf.get(base) ?? [];
  if (styles.includes(wanted) || styles.length === 0) return { style: wanted };
  return {
    style: styles[0],
    note: `not drawn in ${wanted}; showing ${styles[0]}`,
  };
}

function describe(
  base: string,
  wanted: string,
  cat: Catalog,
  pkg: PackageCatalog | null,
): string[] {
  const { style, note } = pickStyle(base, wanted, cat);
  const lines: string[] = [];
  const meanings = meaningsOf(base);
  lines.push(`category: ${cat.categoryOf.get(base) ?? "none"}`);
  if (meanings.length) lines.push(`means: ${meanings.slice(0, 8).join(", ")}`);
  const code = dartCode(base, style, pkg);
  if (code) lines.push(`flutter: ${code}`);
  else if (pkg) {
    lines.push(
      `flutter: not in solar_iconkit ${pkg.version} yet (new upstream). Use it once the next package release ships, or pick another icon.`,
    );
  }
  if (note) lines.push(`style: ${note}`);
  lines.push(`styles: ${(cat.stylesOf.get(base) ?? []).join(", ")}`);
  lines.push(`svg: ${svgUrl(base, style)}`);
  return lines;
}

async function loadBoth(): Promise<{
  cat: Catalog;
  pkg: PackageCatalog | null;
  warning?: string;
}> {
  const [cat, pkg] = await Promise.allSettled([
    loadCatalog(),
    loadPackageCatalog(),
  ]);
  if (cat.status === "rejected") throw cat.reason;
  if (pkg.status === "rejected") {
    return {
      cat: cat.value,
      pkg: null,
      warning:
        "Could not read the published solar_iconkit package just now, so Flutter constants are omitted. Names below are valid Solar icons.",
    };
  }
  return { cat: cat.value, pkg: pkg.value };
}

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "find_icon",
      {
        title: "Find a Solar icon",
        description:
          "Find the best Solar icons for a purpose or UI element, e.g. 'delete account', 'more options menu', 'dark mode', 'upload file'. Returns ranked icons with their meaning, Flutter code for solar_iconkit, available styles and an SVG preview link. Use this instead of guessing icon names.",
        inputSchema: z.object({
          query: z
            .string()
            .min(1)
            .describe("What the icon is for, in plain words."),
          style: StyleSchema,
          limit: z
            .number()
            .int()
            .min(1)
            .max(10)
            .optional()
            .describe("How many distinct icons to return. Default 5."),
        }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ query, style, limit }) => {
        const { cat, pkg, warning } = await loadBoth();
        const wanted = style ?? "linear";
        const families = findIcons(query, cat.categoryOf, limit ?? 5);
        if (!families.length) {
          return text(
            `No Solar icon matches "${query}". Try a simpler word for the action or object (e.g. "delete" rather than "remove permanently"), or call list_icons to browse categories.`,
          );
        }
        const out: string[] = [];
        if (warning) out.push(`Note: ${warning}`, "");
        out.push(`Solar icons for "${query}", best first:`, "");
        families.forEach((fam, i) => {
          out.push(`${i + 1}. ${fam.primary.base}`);
          for (const line of describe(fam.primary.base, wanted, cat, pkg)) {
            out.push(`   ${line}`);
          }
          if (fam.variants.length) {
            out.push(`   similar: ${fam.variants.join(", ")}`);
          }
          out.push("");
        });
        if (pkg) {
          out.push(`Package: solar_iconkit ${pkg.version} (pub.dev).`);
        }
        return text(out.join("\n"));
      },
    );

    server.registerTool(
      "get_icon",
      {
        title: "Look up a Solar icon",
        description:
          "Check a Solar icon name and get its details: whether it exists, its current name if it was renamed, meaning, category, Flutter code, styles and SVG link. Accepts names like 'home-2', 'solar:home-2-linear' or a Dart constant like 'home2'.",
        inputSchema: z.object({
          name: z.string().min(1).describe("Icon name to look up."),
          style: StyleSchema,
        }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ name, style }) => {
        const { cat, pkg, warning } = await loadBoth();
        let base = name.trim().toLowerCase().replace(/^solar:/, "");
        // A full Iconify name carries its style: "home-2-bold-duotone".
        let styleInName: string | undefined;
        for (const s of [...STYLES].sort((a, b) => b.suffix.length - a.suffix.length)) {
          if (base.endsWith(s.suffix) && cat.categoryOf.has(base.slice(0, -s.suffix.length))) {
            base = base.slice(0, -s.suffix.length);
            styleInName = s.id;
            break;
          }
        }
        const wanted = style ?? styleInName ?? "linear";
        // A Dart constant such as "home2" or "trashBinTrash".
        if (!cat.categoryOf.has(base) && pkg) {
          for (const [iconName, constant] of pkg.constantOf) {
            if (constant.toLowerCase() === name.trim().toLowerCase()) {
              base = iconName;
              break;
            }
          }
        }

        const out: string[] = [];
        if (warning) out.push(`Note: ${warning}`, "");
        const renamed = cat.renamedTo.get(base) ?? pkg?.renamedTo.get(base);
        if (!cat.categoryOf.has(base) && renamed) {
          out.push(
            `"${base}" was renamed to "${renamed}" upstream. Use the new name; the old Dart constant is deprecated.`,
            "",
          );
          base = renamed;
        }
        if (!cat.categoryOf.has(base)) {
          const guesses = findIcons(base.replace(/-/g, " "), cat.categoryOf, 5)
            .map((f) => f.primary.base);
          return text(
            `"${name}" is not a Solar icon.` +
              (guesses.length ? ` Closest names: ${guesses.join(", ")}.` : "") +
              ` Use find_icon to search by purpose.`,
          );
        }
        out.push(base);
        for (const line of describe(base, wanted, cat, pkg)) out.push(`  ${line}`);
        return text(out.join("\n"));
      },
    );

    server.registerTool(
      "list_icons",
      {
        title: "Browse Solar icons by category",
        description:
          "Without a category: list Solar's categories with icon counts. With a category (e.g. 'Arrows', 'Messages'): list every icon name in it.",
        inputSchema: z.object({
          category: z
            .string()
            .optional()
            .describe("Category name, case-insensitive."),
        }),
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async ({ category }) => {
        const cat = await loadCatalog();
        if (!category) {
          const rows = [...cat.byCategory.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([c, list]) => `${c} (${list.length})`);
          return text(
            `${cat.categoryOf.size} Solar icons in ${rows.length} categories:\n${rows.join("\n")}`,
          );
        }
        const key = [...cat.byCategory.keys()].find(
          (c) => c.toLowerCase() === category.trim().toLowerCase(),
        );
        if (!key) {
          return text(
            `No category "${category}". Categories: ${[...cat.byCategory.keys()].sort().join(", ")}.`,
          );
        }
        const list = cat.byCategory.get(key)!;
        return text(`${key} (${list.length} icons):\n${list.join(", ")}`);
      },
    );
  },
  {
    serverInfo: { name: "solar-icons", version: "1.0.0" },
    instructions: INSTRUCTIONS,
  },
);

export { handler as GET, handler as POST };
export const runtime = "nodejs";
