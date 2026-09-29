// Category -> leading icon map. Extracted so both the sidebar and the icon
// preloader can share the same list (preloader warms the cache in one batch).
//
// Keys must match the category names the Iconify API returns verbatim; an
// unmatched key silently degrades to FALLBACK_CATEGORY_ICON, so a rename
// upstream looks like a design choice rather than a bug. Solar shortened
// 16 of these (e.g. "Essentional, UI" -> "UI") and every one of them showed
// a plain folder for weeks. `npm run check:categories` now catches that.

export const CATEGORY_ICONS: Record<string, string> = {
  "Arrows": "solar:arrow-right-bold-duotone",
  "Arrows Action": "solar:refresh-bold-duotone",
  "Astronomy": "solar:planet-bold-duotone",
  "Building": "solar:buildings-2-bold-duotone",
  "Business": "solar:chart-bold-duotone",
  "Call": "solar:phone-bold-duotone",
  "Devices": "solar:cpu-bold-duotone",
  "Faces": "solar:emoji-funny-square-bold-duotone",
  "Files": "solar:file-bold-duotone",
  "Folders": "solar:folder-bold-duotone",
  "Food": "solar:cup-hot-bold-duotone",
  "Hands": "solar:hand-shake-bold-duotone",
  "Home": "solar:sofa-2-bold-duotone",
  "IT": "solar:code-bold-duotone",
  "Like": "solar:heart-bold-duotone",
  "List": "solar:list-bold-duotone",
  "Map": "solar:map-point-bold-duotone",
  "Medicine": "solar:pill-bold-duotone",
  "Messages": "solar:chat-round-bold-duotone",
  "Money": "solar:wallet-money-bold-duotone",
  "Nature": "solar:leaf-bold-duotone",
  "Notes": "solar:notebook-bold-duotone",
  "Notifications": "solar:bell-bold-duotone",
  "Parts": "solar:bus-bold-duotone",
  "School": "solar:square-academic-cap-bold-duotone",
  "Search": "solar:magnifier-bold-duotone",
  "Security": "solar:shield-check-bold-duotone",
  "Settings": "solar:settings-bold-duotone",
  "Shopping": "solar:cart-3-bold-duotone",
  "Sports": "solar:basketball-bold-duotone",
  "Text Formatting": "solar:text-square-2-bold-duotone",
  "Time": "solar:clock-circle-bold-duotone",
  "Tools": "solar:palette-bold-duotone",
  "UI": "solar:home-2-bold-duotone",
  "Users": "solar:users-group-two-rounded-bold-duotone",
  "Video": "solar:play-circle-bold-duotone",
  "Weather": "solar:sun-2-bold-duotone",
};

export const FALLBACK_CATEGORY_ICON = "solar:folder-bold-duotone";
