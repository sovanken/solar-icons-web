import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://solar-iconkit-web.vercel.app";

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
    default: "Solar Iconkit — Icon Browser",
    template: "%s · Solar Iconkit",
  },
  description:
    "Interactive browser for the Solar icon set. Filter 1,231 icons across 6 native styles and copy Flutter widget code, SVG, PNG, JPG, and WebP. Companion to the solar_iconkit Flutter package.",
  keywords: [
    "solar iconkit",
    "solar icons",
    "flutter icons",
    "flutter package",
    "svg icons",
    "iconography",
    "iconify",
    "duotone icons",
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
    title: "Solar Iconkit — Icon Browser",
    description:
      "1,231 Solar icons across 6 native styles. Copy Flutter widget code, SVG, PNG, JPG, WebP.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Iconkit — Icon Browser",
    description:
      "1,231 Solar icons across 6 native styles. Companion to the solar_iconkit Flutter package.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
