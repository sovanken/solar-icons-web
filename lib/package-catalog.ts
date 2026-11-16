/// The icons the published solar_iconkit package actually ships, read from
/// the generated Dart file at the release tag that pub.dev reports as latest.
///
/// Iconify can be ahead of the package: upstream adds icons, and they only
/// reach Flutter users at the next package release. Anything the MCP server
/// hands an AI as Dart code is checked against this list, so it never
/// suggests a `SolarIcons.x` constant that does not compile.

const PUB_API = "https://pub.dev/api/packages/solar_iconkit";
const RAW =
  "https://raw.githubusercontent.com/sovanken/solar_iconkit/v{version}/lib/src/solar_iconkit_data.g.dart";
const REVALIDATE_SECONDS = 6 * 60 * 60;

export interface PackageCatalog {
  /// Latest version on pub.dev, e.g. "2.1.0".
  version: string;
  /// Current icon name → its Dart constant, e.g. "home-2" → "home2".
  constantOf: Map<string, string>;
  /// Retired name → current name, kept as @Deprecated constants.
  renamedTo: Map<string, string>;
}

// `/// Solar icon `name`.` or `/// Solar icon `old`, renamed to `new`.`,
// then (optionally an @Deprecated annotation, then) the constant itself.
const ENTRY =
  /\/\/\/ Solar icon `([^`]+)`(?:, renamed to `([^`]+)`)?\.\n(?:[^\n]*\n){0,3}?\s*static const String (\w+) =\s*'([^']+)';/g;

let cached: { at: number; catalog: PackageCatalog } | null = null;

export async function loadPackageCatalog(): Promise<PackageCatalog> {
  if (cached && Date.now() - cached.at < REVALIDATE_SECONDS * 1000) {
    return cached.catalog;
  }
  const meta = await fetch(PUB_API, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!meta.ok) throw new Error(`pub.dev returned HTTP ${meta.status}`);
  const version: string = (await meta.json()).latest.version;

  const src = await fetch(RAW.replace("{version}", version), {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!src.ok) throw new Error(`GitHub returned HTTP ${src.status}`);
  const text = (await src.text()).replace(/\r\n/g, "\n");

  const constantOf = new Map<string, string>();
  const renamedTo = new Map<string, string>();
  for (const m of text.matchAll(ENTRY)) {
    const [, name, newName, ident] = m;
    if (newName) renamedTo.set(name, newName);
    else if (!constantOf.has(name)) constantOf.set(name, ident);
  }
  if (constantOf.size === 0) {
    throw new Error("Could not read any icons from the package source");
  }

  const catalog = { version, constantOf, renamedTo };
  cached = { at: Date.now(), catalog };
  return catalog;
}
