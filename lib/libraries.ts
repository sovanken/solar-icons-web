export interface StyleVariant {
  id: string;
  label: string;
  suffix: string;
}

export const PREFIX = "solar";

export const STYLES: StyleVariant[] = [
  { id: "linear", label: "Linear", suffix: "-linear" },
  { id: "outline", label: "Outline", suffix: "-outline" },
  { id: "broken", label: "Broken", suffix: "-broken" },
  { id: "bold", label: "Bold", suffix: "-bold" },
  { id: "line-duotone", label: "Line Duo", suffix: "-line-duotone" },
  { id: "bold-duotone", label: "Bold Duo", suffix: "-bold-duotone" },
];

export const BASE_STYLE_ID = "linear";
export const BASE_SUFFIX = "-linear";

export const STYLE_MAP: Record<string, StyleVariant> = Object.fromEntries(
  STYLES.map((s) => [s.id, s]),
);
