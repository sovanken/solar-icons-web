/// Icons added in recent solar_iconkit releases, newest release first.
///
/// The Iconify API exposes no per-icon date, so "new" cannot be derived at
/// runtime — it is recorded here when the catalog is synced. Each list is the
/// set of names that were genuinely new in that release: renames and icons
/// whose drawing merely moved to another name are excluded, since they were
/// already browsable under their old name.
///
/// When syncing a new release, prepend an entry. Names that no longer exist
/// upstream are filtered out at render time, so a stale entry degrades to
/// fewer icons rather than to broken tiles.
export interface IconRelease {
  /// Package version the icons first shipped in.
  version: string;
  /// ISO date the version was published.
  date: string;
  /// Base icon names, without a style suffix.
  icons: string[];
}

export const ICON_RELEASES: IconRelease[] = [
  {
    version: "1.2.0",
    date: "2026-08-26",
    icons: [
      "add",
      "barcode",
      "barcode-scan",
      "binoculars",
      "bot",
      "brain",
      "close",
      "exclamation-mark",
      "minus",
      "paint-brush",
      "question-mark",
      "toolbox",
      "videocamera-off",
      "webcam",
      "webcam-off",
      "wi-fi",
      "wi-fi-cog",
      "wi-fi-cross",
      "wi-fi-high",
      "wi-fi-low",
      "wi-fi-none",
      "wi-fi-off",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-08-14",
    icons: [
      "cart-4",
      "document-2",
      "forward-right",
      "list-vertical",
      "logout",
      "logout-2",
      "mirror-2",
      "notebook-2",
      "record-audio-circle",
      "star-2",
      "vanity",
    ],
  },
];

/// Every name across all recorded releases, newest first, de-duplicated.
export const NEW_ICON_NAMES: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const release of ICON_RELEASES) {
    for (const name of release.icons) {
      if (!seen.has(name)) {
        seen.add(name);
        out.push(name);
      }
    }
  }
  return out;
})();

/// Which release introduced `base`, or undefined if it predates the record.
export function releaseOf(base: string): IconRelease | undefined {
  return ICON_RELEASES.find((r) => r.icons.includes(base));
}
