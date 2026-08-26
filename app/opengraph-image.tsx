import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Solar Iconkit — 1,269 Flutter icons across 6 native styles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static grid of icons to show as visual bait on the OG card.
// These are Iconify identifiers rendered as inline SVG via api.iconify.design.
const SHOWCASE_ICONS = [
  "home-2",
  "heart",
  "user",
  "settings",
  "chart",
  "rocket",
  "camera",
  "bell",
  "gift",
  "star",
];

export default async function OpenGraphImage() {
  // Pre-fetch each icon's SVG as a data URL so it can be embedded directly in
  // the OG image (Next.js OG doesn't fetch external images at render time).
  const iconSvgs = await Promise.all(
    SHOWCASE_ICONS.map(async (name) => {
      try {
        const res = await fetch(
          `https://api.iconify.design/solar/${name}-bold-duotone.svg?color=%23F97316`,
        );
        if (!res.ok) return null;
        const svg = await res.text();
        return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
      } catch {
        return null;
      }
    }),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #262626 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern in the background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Top row: sun icon + brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#F97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            {/* Sun emoji stand-in for the logo */}
            ☀
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
              Solar Iconkit
            </div>
            <div style={{ fontSize: 20, color: "#a3a3a3", marginTop: 4 }}>
              MIT licensed · Flutter ≥ 3.27
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          <div style={{ display: "flex" }}>1,269 icons.</div>
          <div style={{ display: "flex" }}>6 native styles. One widget.</div>
        </div>

        {/* Icon showcase row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 44,
            flexWrap: "wrap",
          }}
        >
          {iconSvgs.map((svg, i) =>
            svg ? (
              <div
                key={i}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svg} width={44} height={44} alt="" />
              </div>
            ) : (
              <div key={i} style={{ width: 72, height: 72, display: "flex" }} />
            ),
          )}
        </div>

        {/* Bottom row: URL and footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "auto",
            fontSize: 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 999,
                background: "#F97316",
                color: "#0a0a0a",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              pub.dev/packages/solar_iconkit
            </div>
          </div>
          <div style={{ color: "#a3a3a3" }}>solar-icons-web.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
