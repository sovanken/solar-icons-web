# Solar Iconkit — Web

[![Live site](https://img.shields.io/badge/live-solar--icons--web.vercel.app-000000?logo=vercel&logoColor=white)](https://solar-icons-web.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Support](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/sovanken)

An interactive icon browser for the [Solar icon set](https://solar-icons-web.vercel.app) — **1,269 icons across 6 native styles**. Preview any icon at any size, switch styles instantly, and copy the exact Flutter widget code you need.

Companion to the [`solar_iconkit`](https://pub.dev/packages/solar_iconkit) Flutter package on pub.dev.

- **Live site**: <https://solar-icons-web.vercel.app>
- **Flutter package**: <https://pub.dev/packages/solar_iconkit>
- **Support**: <https://ko-fi.com/sovanken>

---

## Highlights

- **1,269 icons · 6 native styles** — linear, outline, broken, bold, line-duotone, bold-duotone. Every style shown live in the top bar as a segmented chip control.
- **37 categories** with hand-picked bold-duotone leading icons in the sidebar (mobile: a slide-in drawer).
- **Search that reads like a person types it** — an always-visible box filters the grid in place (press `/` to focus it from anywhere), plus a **⌘K / Ctrl+K palette** over the whole catalog. Both share one ranker:
  - multi-word: `arrow right` finds `arrow-right`
  - synonym-aware: `search` → `magnifier`, `delete` → `trash-bin`, `save` → `diskette`, `wifi` → `wi-fi`
  - typo-tolerant, including swapped letters: `magnifer` and `arrow rihgt` still land
  - a search is shareable — the query syncs to `?q=` in the URL
- **Icon detail dialog** — large hero preview on a grid, per-style preview column, and:
  - **Copy**: SVG, Flutter widget (short), Flutter widget (full API), Iconify tag, icon name
  - **Download**: SVG, PNG (multiple sizes), JPG, WebP, and a ZIP bundle
- **Preview in context** strip — see the icon inside a button, list tile, tag, and empty state so you know how it lands in a real UI.
- **Docs page** at `/docs` — Flutter installation, widget API reference, style guide, and naming rules.
- **Responsive** — mobile-first layout with a dedicated style drawer and centered brand.
- **Light / dark theme** with system preference sync (`next-themes`).
- **PWA-ready** — installable web manifest, custom favicon, and offline-friendly caching.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · TypeScript · Tailwind CSS 4 |
| Components | shadcn/ui built on Base UI primitives |
| Icons | `@iconify/react` (Iconify API, cached in browser) |
| Search | `cmdk` command palette |
| State | Context-based store in `lib/store.tsx` |
| Downloads | `jszip` for multi-size PNG bundles, client-side `<canvas>` rasterisation for PNG / JPG / WebP |
| Theming | `next-themes` (light / dark / system) |
| Toasts | `sonner` |
| Animations | `motion` + CSS keyframes |

Icon data is fetched from the public [Iconify API](https://api.iconify.design). Category, style, and header icons are batch-preloaded on first render so the UI never pops in one icon at a time.

---

## Getting started

Requires **Node.js 20+** (Next.js 16 baseline).

```bash
git clone https://github.com/sovanken/solar-icons-web.git
cd solar-icons-web
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

```bash
npm run dev      # dev server on :3000 (Turbopack)
npm run build    # production build
npm run start    # start production server
npm run lint     # run eslint
```

### Environment

Optional — set only if deploying under a custom domain.

```bash
NEXT_PUBLIC_SITE_URL=https://solar-icons-web.vercel.app
```

An `.env.example` is included at the repo root.

---

## Deployment

This is a standard Next.js 16 App Router project. The production deployment lives on Vercel:

- **Live URL**: <https://solar-icons-web.vercel.app>
- **Hosting**: Vercel (Hobby tier), auto-deploy on push to `main`

### Deploy to Vercel

```
1. Import github.com/sovanken/solar-icons-web on vercel.com/new
2. Framework preset: Next.js (auto-detected)
3. Build command: next build
4. Output directory: .next
5. Deploy
```

No environment variables are required for the default deployment.

### Self-host with Docker

```bash
docker build -t solar-icons-web .
docker run -p 3000:3000 solar-icons-web
```

(No Dockerfile ships in the repo yet — a minimal Node 20-alpine + `next start` image is sufficient.)

---

## Security

The site ships with a strict Content Security Policy, HSTS (with preload), COOP, CORP, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin` — all set in `next.config.ts`. Static SVGs are cached for 1 year with `immutable`. No secrets, API keys, or backend endpoints exist in the repo.

The site does not track users. The only external network request is to the Iconify API for icon data.

---

## Project layout

```
solar-icons-web/
├── app/
│   ├── layout.tsx          Root layout · metadata · viewport
│   ├── page.tsx            Home — loads the app shell
│   ├── globals.css         Tailwind + CSS variables
│   ├── icon.svg            Favicon (bold-duotone sun on orange)
│   ├── manifest.ts         PWA manifest
│   ├── robots.ts           robots.txt route
│   ├── sitemap.ts          sitemap.xml route
│   ├── not-found.tsx       404 page
│   ├── error.tsx           Global error boundary
│   └── docs/
│       └── page.tsx        Flutter package documentation
├── components/
│   ├── app-shell.tsx       Fetches Solar collection, wires layout
│   ├── site-header.tsx     Brand · style chips · Docs · search · theme
│   ├── sidebar.tsx         37-category desktop nav
│   ├── style-drawer.tsx    Mobile style picker (Sheet)
│   ├── mobile-nav.tsx      Mobile category drawer
│   ├── icon-grid.tsx       Responsive icon card grid
│   ├── icon-card.tsx       Single icon tile
│   ├── icon-dialog.tsx     Detail modal (copy / download / preview)
│   ├── command-menu.tsx    ⌘K search palette
│   ├── code-block.tsx      Reusable code block with copy button
│   ├── theme-toggle.tsx    Light / dark switch
│   ├── skeleton-grid.tsx   Loading placeholder
│   ├── style-bar.tsx       (legacy — style selector, retained for parity)
│   ├── icon-preload.tsx    Warms the Iconify cache on first render
│   ├── providers.tsx       Theme · tooltip · store · toaster
│   └── ui/                 shadcn primitives (button, dialog, tabs, sheet …)
├── lib/
│   ├── libraries.ts        Solar prefix + 6-style definitions
│   ├── categories.ts       37-category → bold-duotone icon map
│   ├── iconify.ts          Collection + SVG fetch helpers
│   ├── converters.ts       SVG → PNG / JPG / WebP / Flutter code
│   ├── styles.ts           Size preset table
│   ├── store.tsx           Global state (view style, filter, selected)
│   └── utils.ts            cn() helper
├── package.json
├── tsconfig.json
├── next.config.ts          Security headers · CSP · cache rules
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Contributing

Issues and pull requests are welcome. The site is intentionally simple — no backend, no database, no user accounts — so most changes are UI polish or new icon-conversion formats.

If you're using Solar Iconkit in a project and want to say thanks, [buy me a coffee](https://ko-fi.com/sovanken). Every one helps keep the icon browser and the Flutter package updated.

---

## Related

- **Flutter package**: [`solar_iconkit` on pub.dev](https://pub.dev/packages/solar_iconkit)
- **Icon set (upstream)**: Solar by 480 Design (MIT)
- **Icon data provider**: [Iconify](https://iconify.design)

---

## License

MIT © sovanken. The Solar icon set is © 480 Design, redistributed via the Iconify API under the MIT License.
