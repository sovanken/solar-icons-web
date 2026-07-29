"use client";

import { useEffect } from "react";
import { loadIcons } from "@iconify/react";
import { CATEGORY_ICONS } from "@/lib/categories";
import { PREFIX, STYLES } from "@/lib/libraries";

const HEADER_ICONS = [
  "solar:magnifer-bold-duotone",
  "solar:sun-bold-duotone",
  "solar:moon-bold-duotone",
  "solar:widget-5-bold-duotone",
  "solar:hamburger-menu-linear",
  "solar:close-circle-linear",
  "solar:check-circle-bold-duotone",
  "solar:copy-bold-duotone",
  "solar:download-bold-duotone",
  "solar:arrow-right-up-linear",
];

const SAMPLE_ICON = "home-2";

// Warm the Iconify cache in a single API call so category icons, style chips,
// and header icons appear together rather than popping in one-by-one.
export function IconPreload() {
  useEffect(() => {
    const styleSamples = STYLES.map((s) => `${PREFIX}:${SAMPLE_ICON}${s.suffix}`);
    const categoryIcons = Object.values(CATEGORY_ICONS);
    loadIcons([...HEADER_ICONS, ...categoryIcons, ...styleSamples]);
  }, []);

  return null;
}
