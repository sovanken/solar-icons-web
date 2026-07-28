import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Content Security Policy — locked down to same-origin + Iconify's API.
const csp = [
  "default-src 'self'",
  // Next.js runtime needs inline + eval; Vercel scripts are same-origin.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind emits inline styles via CSS vars.
  "style-src 'self' 'unsafe-inline'",
  // SVGs and PNGs may come inline as data URIs, or from Iconify.
  "img-src 'self' data: blob: https://api.iconify.design",
  // Icon data + web components fetched from Iconify.
  "connect-src 'self' https://api.iconify.design",
  // No <object>/<embed>.
  "object-src 'none'",
  // Fonts from self + inline (data URI).
  "font-src 'self' data:",
  // Reject iframes embedding this site.
  "frame-ancestors 'none'",
  // <base> restrictions.
  "base-uri 'self'",
  // <form action=…>
  "form-action 'self'",
  // Upgrade any accidental http:// requests.
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), fullscreen=(self)",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // HSTS only in production (dev on http://localhost would break).
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Content-Security-Policy",
          value: csp,
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Skip Next's "Powered by Next.js" header — small opsec win.
  poweredByHeader: false,

  // Compression — Vercel and most hosts already gzip/brotli, but leaving on
  // helps self-hosted deployments.
  compress: true,

  // Trailing slashes off for cleaner URLs and consistent sitemap.
  trailingSlash: false,

  // React strict mode — surfaces double-invocation issues in dev.
  reactStrictMode: true,

  async headers() {
    return [
      // Apply security headers to everything.
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Long-cache the public SVGs (Next handles /_next/static itself).
      {
        source: "/(.*).svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Favicon short-cache so we can iterate.
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Turbopack config (Next 16 default builder).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
