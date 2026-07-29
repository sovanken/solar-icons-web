import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/providers";
import { StructuredData } from "@/components/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://solar-icons-web.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Solar Iconkit — 1,231 Flutter icons in 6 native styles",
    template: "%s · Solar Iconkit",
  },
  description:
    "Interactive browser for the Solar icon set. 1,231 icons across 6 native styles (linear, outline, broken, bold, line-duotone, bold-duotone). Preview any icon, copy Flutter widget code, or download as SVG, PNG, JPG, WebP. Companion to the solar_iconkit Flutter package on pub.dev.",
  keywords: [
    "solar iconkit",
    "solar icons",
    "flutter icons",
    "flutter icon package",
    "flutter svg icons",
    "flutter icon library",
    "dart icons",
    "svg icons",
    "iconography",
    "iconify",
    "duotone icons",
    "material icons alternative",
    "480 design",
    "open source icons",
    "free icons",
  ],
  authors: [{ name: "sovankentech", url: "https://pub.dev/publishers" }],
  creator: "sovankentech",
  publisher: "sovankentech",
  applicationName: "Solar Iconkit",
  category: "developer tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Solar Iconkit",
    title: "Solar Iconkit — 1,231 Flutter icons in 6 native styles",
    description:
      "1,231 Solar icons across 6 native styles. Copy Flutter widget code, download as SVG, PNG, JPG, WebP. MIT-licensed, works offline.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Iconkit — Flutter icon library",
    description:
      "1,231 icons across 6 native styles, behind a single type-safe SolarIcon widget. On pub.dev now.",
    creator: "@sovankentech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    // Signals to sharing tools this is a software product page
    "og:type": "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <StructuredData />
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
