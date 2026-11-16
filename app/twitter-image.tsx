// Twitter card visual is identical to the OG image — delegate rendering
// to the same generator to keep a single source of truth for the design.
import OpenGraphImage from "./opengraph-image";

export const runtime = "edge";
export const alt = "Solar Iconkit — 1,576 Flutter icons across 6 native styles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return OpenGraphImage();
}
