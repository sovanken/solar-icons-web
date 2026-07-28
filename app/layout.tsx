import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solar Iconkit — Icon Browser",
  description:
    "Interactive browser for the Solar icon set. Filter 1,231 icons across 6 native styles and copy or download them as SVG, PNG, JPG, WebP, JSX, Vue, Flutter widget code, and more. Companion to the solar_iconkit Flutter package.",
  keywords: [
    "solar iconkit",
    "solar icons",
    "flutter icons",
    "svg icons",
    "iconography",
    "iconify",
  ],
  authors: [{ name: "sovankentech" }],
  openGraph: {
    title: "Solar Iconkit — Icon Browser",
    description:
      "Interactive browser for 1,231 Solar icons across 6 native styles.",
    type: "website",
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
