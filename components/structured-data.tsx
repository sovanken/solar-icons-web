// JSON-LD structured data for search engines. Renders inside <head>.
// Uses the schema.org SoftwareApplication + WebSite vocabularies so
// Google, Bing, and social crawlers can display richer results.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://solar-icons-web.vercel.app";

export function StructuredData() {
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Solar Iconkit",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Android, iOS, macOS, Windows, Linux, Web",
    description:
      "A Flutter package that bundles the entire Solar icon set — 1,269 icons across 6 native styles behind a single type-safe SolarIcon widget. MIT-licensed, works offline.",
    url: SITE_URL,
    downloadUrl: "https://pub.dev/packages/solar_iconkit",
    softwareVersion: "1.2.0",
    author: {
      "@type": "Person",
      name: "sovanken",
      url: "https://pub.dev/publishers",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: undefined,
    license: "https://opensource.org/licenses/MIT",
    keywords:
      "flutter, dart, icons, svg, iconography, solar icons, flutter package",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Solar Iconkit — Icon Browser",
    url: SITE_URL,
    description:
      "Interactive browser for the Solar icon set. Search 1,269 icons across 6 native styles and copy Flutter widget code.",
    publisher: {
      "@type": "Person",
      name: "sovanken",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD is safe to inject via dangerouslySetInnerHTML — it's not
        // executed as script, just parsed as data by crawlers.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}
