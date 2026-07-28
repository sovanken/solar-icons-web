# Solar Icons — Web Preview

An interactive browser for the [Solar icon set](https://iconify.design/collections/solar). Filter 1,231 icons across 6 native styles, preview at any size, and copy or download them in the format you need — SVG, PNG, JPG, WebP, ZIP, React JSX, Vue SFC, Flutter widget code, base64 data URI, CSS background, HTML, and more.

Companion to the [`solar_iconkit`](https://pub.dev/packages/solar_iconkit) Flutter package.

- **Flutter package**: <https://pub.dev/packages/solar_iconkit>
- **Icon set on Iconify**: <https://iconify.design/collections/solar>

## Features

- Solar's **6 native styles** shown live in every chip: `linear`, `outline`, `broken`, `bold`, `line-duotone`, `bold-duotone`
- **Sidebar with all 37 categories** (Arrows, Business, Design, etc.), each with a bold-duotone leading icon that matches its meaning
- **Live search** across all 1,231 icons
- **Ctrl/Cmd+K command palette** for keyboard-first navigation
- **Segmented size picker** with visual scale dots (20 / 24 / 32 / 48 / 64 / 80)
- **Icon detail dialog** with:
  - Style column (vertical list showing each style's preview)
  - Large hero preview on a grid background
  - **Copy** tab — 11 formats (SVG, JSX, Vue, Flutter short/full, HTML, Data URI, Base64, CSS background, Iconify tag, name)
  - **Download** tab — SVG, PNG (9 sizes), JPG, WebP, and a ZIP bundle
  - **Source** tab — raw SVG markup
- **Light / dark theme** with system preference sync
- **Independent scroll containers** — sidebar and grid scroll separately

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** with **shadcn/ui** components
- **Iconify React** (`@iconify/react`) for icon rendering
- **JSZip** for the multi-size PNG bundle downloads
- **cmdk** for the command palette
- **next-themes** + **sonner** for theming and toasts

Icon data is fetched from the [Iconify API](https://api.iconify.design/) — no assets are bundled with this app. All conversion and download generation happens client-side (canvas-based rasterization for PNG/JPG/WebP).

## Getting started

```bash
git clone https://github.com/sovankentech/solar-icons-web.git
cd solar-icons-web
npm install
npm run dev
```

Open <http://localhost:3000>.

**Requirements:** Node.js 20+ (Next.js 16 requires it).

## Scripts

```bash
npm run dev       # start dev server on :3000
npm run build     # production build
npm run start     # start production server
npm run lint      # run eslint
```

## Deployment

The app is a standard Next.js 16 App Router project — deploy anywhere that supports Node.js runtimes. Recommended:

- **Vercel** — one-click deploy from the repo, zero config
- **Netlify** — with the Next.js runtime plugin
- **Docker** — build with `next build` and serve with `next start` in a Node 20+ container

## Project layout

```
solar-icons-web/
├── app/
│   ├── layout.tsx           Root layout + providers
│   ├── page.tsx             Loads the app shell
│   └── globals.css          Tailwind + custom CSS vars
├── components/
│   ├── app-shell.tsx        Fetches Solar collection, wires layout
│   ├── site-header.tsx      Title, search, theme toggle, Cmd+K
│   ├── style-bar.tsx        Style / size segmented controls
│   ├── sidebar.tsx          37 categories with bold-duotone leading icons
│   ├── icon-grid.tsx        Virtualised-friendly card grid
│   ├── icon-card.tsx        Single icon tile
│   ├── icon-dialog.tsx      Detail modal (style column + copy/download tabs)
│   ├── command-menu.tsx     Cmd+K search palette
│   ├── theme-toggle.tsx     Light/dark switch
│   ├── providers.tsx        ThemeProvider + Toaster + Tooltip + Store
│   └── ui/                  shadcn primitives (button, dialog, tabs, etc.)
├── lib/
│   ├── libraries.ts         Solar library + style definitions
│   ├── iconify.ts           Collection + SVG fetching helpers
│   ├── converters.ts        SVG → PNG/JPG/WebP/JSX/Vue/Flutter/base64/etc.
│   ├── store.tsx            Global state (view style, size, filter, theme)
│   ├── styles.ts            Size presets
│   └── utils.ts             cn() helper
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## License

MIT — free for personal and commercial use. Icons redistributed via the Iconify API are the Solar icon set by 480 Design, MIT licensed.
