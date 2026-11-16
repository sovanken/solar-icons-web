import { PREFIX, BASE_SUFFIX } from "./libraries";

export interface IconData {
  body: string;
  width?: number;
  height?: number;
}

export interface CollectionData {
  categories: Record<string, string[]>;
  order: string[];
  total: number;
}

const API = "https://api.iconify.design";

export async function fetchCollection(): Promise<CollectionData> {
  const resp = await fetch(`${API}/collection?prefix=${PREFIX}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  const cats: Record<string, string[]> = {};
  const order: string[] = [];
  for (const [cat, names] of Object.entries<string[]>(data.categories ?? {})) {
    const bases = names
      .filter((n) => n.endsWith(BASE_SUFFIX))
      .map((n) => n.slice(0, -BASE_SUFFIX.length))
      .sort();
    if (bases.length) {
      cats[cat] = bases;
      order.push(cat);
    }
  }
  const total = Object.values(cats).reduce((a, b) => a + b.length, 0);
  return { categories: cats, order, total };
}

/// `fullName` is an Iconify id such as "solar:home-2-linear". The API serves
/// it at /solar/home-2-linear.svg; the /solar:home-2-linear.svg form 404s.
export async function fetchIconSvg(fullName: string): Promise<string> {
  const [prefix, name] = fullName.split(":");
  if (!prefix || !name) throw new Error(`Not an Iconify id: ${fullName}`);
  const resp = await fetch(
    `${API}/${encodeURIComponent(prefix)}/${encodeURIComponent(name)}.svg`,
  );
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}
