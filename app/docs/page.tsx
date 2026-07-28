import Link from "next/link";
import { Icon } from "@iconify/react";
import { CodeBlock } from "@/components/code-block";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Docs — Solar Iconkit for Flutter",
  description:
    "How to use Solar Iconkit in your Flutter project — install, widget API, style guide, icon naming.",
};

const TOC = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "widget-api", label: "  Widget API", parent: "usage" },
  { id: "with-icontheme", label: "  With IconTheme", parent: "usage" },
  { id: "in-buttons", label: "  In buttons", parent: "usage" },
  { id: "styles", label: "Styles" },
  { id: "naming", label: "Icon naming" },
  { id: "credits", label: "Credits" },
];

export default function DocsPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Slim header */}
      <header className="shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-xl z-30">
        <div className="flex items-center gap-4 px-4 sm:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Icon
              icon="solar:sun-bold-duotone"
              width={22}
              height={22}
              className="text-orange-500"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Solar Iconkit</div>
              <div className="text-[10px] text-muted-foreground">Docs</div>
            </div>
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-1.5 text-foreground bg-muted font-medium"
            >
              Docs
            </Link>
            <a
              href="https://pub.dev/packages/solar_iconkit"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:inline-flex items-center gap-1"
            >
              pub.dev
              <Icon icon="solar:arrow-right-up-linear" width={12} height={12} />
            </a>
            <a
              href="https://github.com/sovankentech/solar_iconkit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="ml-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon icon="mdi:github" width={18} height={18} />
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* TOC */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 overflow-y-auto">
          <nav className="p-4 space-y-0.5 sticky top-0">
            <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Contents
            </div>
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-pre",
                  item.parent && "pl-6 text-[12px]",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12 space-y-16">
            {/* Introduction ------------------------------------------- */}
            <Section id="introduction" title="Introduction">
              <Hero />
              <p>
                <strong>Solar Iconkit</strong> is a Flutter package that bundles
                the entire{" "}
                <a
                  href="https://iconify.design/collections/solar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Solar icon set
                </a>{" "}
                by 480 Design — <strong>1,231 icons across 6 native styles</strong>{" "}
                (7,386 SVG variants total) — behind a single, type-safe{" "}
                <code>SolarIcon</code> widget. MIT-licensed, works offline, no
                setup beyond adding the dependency.
              </p>
              <FeatureGrid />
              <p className="text-sm text-muted-foreground">
                This site is the icon browser: use it to preview icons, pick a
                style, and copy either the Flutter widget code or the raw SVG.
                The package itself is on{" "}
                <a
                  href="https://pub.dev/packages/solar_iconkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  pub.dev
                </a>
                .
              </p>
            </Section>

            {/* Installation ------------------------------------------- */}
            <Section id="installation" title="Installation">
              <p>Add to your Flutter project&apos;s <code>pubspec.yaml</code>:</p>
              <CodeBlock
                filename="pubspec.yaml"
                lang="yaml"
                code={`dependencies:
  solar_iconkit: ^0.2.0`}
              />
              <p>Then fetch:</p>
              <CodeBlock
                filename="Terminal"
                lang="bash"
                code={`flutter pub add solar_iconkit
# or
flutter pub get`}
              />
              <p>Import wherever you need icons:</p>
              <CodeBlock
                lang="dart"
                code={`import 'package:solar_iconkit/solar_iconkit.dart';`}
              />
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="solar:info-circle-bold-duotone"
                    width={18}
                    height={18}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <div>
                    <strong>Requirements:</strong> Flutter ≥ 3.27, Dart ^3.6.
                    Runs on Android, iOS, macOS, Windows, Linux, and Web.
                  </div>
                </div>
              </div>
            </Section>

            {/* Usage -------------------------------------------------- */}
            <Section id="usage" title="Usage">
              <p>
                Every icon is a <code>SolarIcon</code> widget. Reference icons
                by their generated constant on <code>SolarIcons</code> and pick
                a style from <code>SolarIconStyle</code>.
              </p>

              <Sub id="widget-api" title="Widget API">
                <CodeBlock
                  filename="main.dart"
                  lang="dart"
                  code={`// Minimum — default linear style, size from IconTheme (24 px fallback)
SolarIcon(SolarIcons.home2)

// Explicit style and size
SolarIcon(
  SolarIcons.heart,
  style: SolarIconStyle.boldDuotone,
  size: 32,
)

// Full API — every parameter
SolarIcon(
  SolarIcons.rocket,
  style: SolarIconStyle.boldDuotone,
  size: 48,
  color: Colors.deepPurple,
  opacity: 0.9,
  semanticLabel: 'Launch',
)`}
                />
                <table className="w-full border-collapse text-[13px] mt-3">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 font-semibold">Parameter</th>
                      <th className="text-left py-2 pr-4 font-semibold">Type</th>
                      <th className="text-left py-2 font-semibold">Default</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <ParamRow name="name" type="String" def="required" />
                    <ParamRow name="style" type="SolarIconStyle" def="linear" />
                    <ParamRow name="size" type="double?" def="IconTheme → 24" />
                    <ParamRow name="color" type="Color?" def="IconTheme → black87" />
                    <ParamRow name="opacity" type="double" def="1.0" />
                    <ParamRow name="semanticLabel" type="String?" def="null" />
                    <ParamRow name="fit" type="BoxFit" def="BoxFit.contain" />
                    <ParamRow name="alignment" type="AlignmentGeometry" def="Alignment.center" />
                    <ParamRow name="matchTextDirection" type="bool" def="false" />
                  </tbody>
                </table>
              </Sub>

              <Sub id="with-icontheme" title="With IconTheme">
                <p>
                  <code>SolarIcon</code> integrates with Flutter&apos;s built-in{" "}
                  <code>IconTheme</code>. When <code>size</code> or{" "}
                  <code>color</code> aren&apos;t set on the widget, they fall back
                  to the ambient theme — matching the behaviour of Flutter&apos;s{" "}
                  <code>Icon</code> widget.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`IconTheme(
  data: IconThemeData(color: Colors.indigo, size: 20),
  child: Row(children: [
    SolarIcon(SolarIcons.home2),   // picks up indigo + size 20
    SolarIcon(SolarIcons.heart),   // same
  ]),
)

// Under MaterialApp, ThemeData.iconTheme themes every SolarIcon:
MaterialApp(
  theme: ThemeData(
    iconTheme: IconThemeData(color: Colors.black87, size: 24),
  ),
  home: MyApp(),
)`}
                />
              </Sub>

              <Sub id="in-buttons" title="In buttons and lists">
                <CodeBlock
                  lang="dart"
                  code={`// Icon-only button
IconButton(
  onPressed: onDelete,
  icon: SolarIcon(SolarIcons.trashBinTrash),
  tooltip: 'Delete',
)

// Filled button with leading icon
FilledButton.icon(
  onPressed: onDownload,
  icon: SolarIcon(SolarIcons.download, size: 18, color: Colors.white),
  label: const Text('Download'),
)

// ListTile
ListTile(
  leading: SolarIcon(
    SolarIcons.folder,
    style: SolarIconStyle.boldDuotone,
    color: Colors.amber,
  ),
  title: const Text('Documents'),
  trailing: SolarIcon(SolarIcons.altArrowRight, size: 18),
  onTap: () {},
)

// NavigationBar with distinct selected style
NavigationBar(
  destinations: [
    NavigationDestination(
      icon: SolarIcon(SolarIcons.home2),
      selectedIcon: SolarIcon(SolarIcons.home2, style: SolarIconStyle.bold),
      label: 'Home',
    ),
  ],
)`}
                />
              </Sub>
            </Section>

            {/* Styles ------------------------------------------------- */}
            <Section id="styles" title="Styles">
              <p>
                Every Solar icon comes in six distinct styles. Each has a specific
                visual character and works best in certain contexts.
              </p>
              <StylesTable />
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="solar:lightbulb-bold-duotone"
                    width={18}
                    height={18}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <div>
                    <strong>Recommendation:</strong> use <code>linear</code> for
                    chrome, promote to <code>bold</code> for active/selected
                    states, and reserve <code>boldDuotone</code> for feature
                    moments.
                  </div>
                </div>
              </div>
            </Section>

            {/* Naming ------------------------------------------------- */}
            <Section id="naming" title="Icon naming">
              <p>
                Solar icon names are kebab-case (<code>alt-arrow-down</code>,{" "}
                <code>home-2</code>). The Flutter package converts them to
                camelCase Dart identifiers. Iconify identifiers on this browser
                follow the pattern{" "}
                <code>solar:&lt;name&gt;-&lt;style&gt;</code>.
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIcons.home2           // "home-2"
SolarIcons.altArrowDown    // "alt-arrow-down"
SolarIcons.i4k             // "4k"    → leading digit gets 'i' prefix
SolarIcons.caseIcon        // "case"  → Dart reserved word gets 'Icon' suffix
SolarIcons.all             // List<String> of every icon`}
              />
              <p>Iconify identifiers used in the browser and SVG source:</p>
              <CodeBlock
                lang="text"
                code={`solar:home-2-linear         → Linear style
solar:home-2-outline        → Outline style
solar:home-2-broken         → Broken stroke
solar:home-2-bold           → Bold filled
solar:home-2-line-duotone   → Line Duotone
solar:home-2-bold-duotone   → Bold Duotone`}
              />
            </Section>

            {/* Credits ------------------------------------------------ */}
            <Section id="credits" title="Credits">
              <ul className="space-y-2">
                <li>
                  <strong>Icons</strong> — Solar icon set by{" "}
                  <a
                    href="https://www.figma.com/community/file/1166831539721848736"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    480 Design
                  </a>{" "}
                  (MIT).
                </li>
                <li>
                  <strong>Icon data</strong> — Provided by{" "}
                  <a
                    href="https://iconify.design/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Iconify
                  </a>{" "}
                  (MIT).
                </li>
                <li>
                  <strong>Flutter package</strong> — Source on{" "}
                  <a
                    href="https://github.com/sovankentech/solar_iconkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    GitHub
                  </a>{" "}
                  · published on{" "}
                  <a
                    href="https://pub.dev/packages/solar_iconkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    pub.dev
                  </a>
                  .
                </li>
                <li>
                  <strong>This browser</strong> — Next.js + Tailwind CSS +
                  shadcn/ui. Source on{" "}
                  <a
                    href="https://github.com/sovankentech/solar-icons-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    GitHub
                  </a>
                  .
                </li>
              </ul>
            </Section>

            <footer className="mt-16 border-t border-border/60 pt-6 text-[12px] text-muted-foreground">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  Made with{" "}
                  <Icon
                    icon="solar:heart-bold-duotone"
                    width={12}
                    height={12}
                    className="inline text-red-500 -mt-0.5"
                  />{" "}
                  by{" "}
                  <a
                    href="https://github.com/sovankentech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    sovankentech
                  </a>{" "}
                  · for the Flutter community
                </div>
                <div>
                  <Link href="/" className="hover:text-foreground">
                    ← Back to browser
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ----- helpers ---------------------------------------------------------- */

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">
        <a href={`#${id}`} className="group inline-flex items-center gap-2">
          {title}
          <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-lg">
            #
          </span>
        </a>
      </h2>
      <div className="space-y-4 text-[14.5px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

function Sub({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 space-y-3 mt-6">
      <h3 className="text-lg font-semibold">
        <a href={`#${id}`} className="group inline-flex items-center gap-2">
          {title}
          <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  );
}

function Hero() {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10 p-6 sm:p-8 space-y-3">
      <div className="flex items-center gap-3">
        <Icon
          icon="solar:sun-bold-duotone"
          width={40}
          height={40}
          className="text-orange-500"
        />
        <div>
          <div className="text-lg font-bold">Solar Iconkit for Flutter</div>
          <div className="text-[13px] text-muted-foreground">
            1,231 icons · 6 styles · MIT · Flutter ≥ 3.27
          </div>
        </div>
      </div>
      <p className="text-[14px] text-muted-foreground max-w-lg">
        A hand-crafted icon set covering 37 categories with six distinct visual
        styles including two duotone variants. Fully bundled offline in one
        Flutter package.
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href="https://pub.dev/packages/solar_iconkit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-[12px] font-semibold hover:opacity-90 transition-opacity"
        >
          <Icon icon="simple-icons:dart" width={14} height={14} />
          Install from pub.dev
        </a>
        <a
          href="https://github.com/sovankentech/solar_iconkit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold hover:bg-muted transition-colors"
        >
          <Icon icon="mdi:github" width={14} height={14} />
          View source
        </a>
      </div>
    </div>
  );
}

function FeatureGrid() {
  const items = [
    {
      icon: "solar:widget-5-bold-duotone",
      title: "1,231 icons",
      body: "Curated across 37 categories from arrows to weather.",
    },
    {
      icon: "solar:palette-bold-duotone",
      title: "6 native styles",
      body: "Linear, Outline, Broken, Bold, Line Duo, Bold Duo.",
    },
    {
      icon: "solar:cpu-bold-duotone",
      title: "Offline & bundled",
      body: "All SVGs ship with the package — no network at runtime.",
    },
    {
      icon: "solar:atom-bold-duotone",
      title: "IconTheme aware",
      body: "Size and color resolve from the ambient theme.",
    },
    {
      icon: "solar:hand-heart-bold-duotone",
      title: "Semantic-safe",
      body: "Decorative icons auto-wrap in ExcludeSemantics.",
    },
    {
      icon: "solar:global-bold-duotone",
      title: "All platforms",
      body: "Android, iOS, macOS, Windows, Linux, Web.",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {items.map((f) => (
        <div
          key={f.title}
          className="rounded-xl border border-border/60 bg-card p-4 flex items-start gap-3"
        >
          <Icon
            icon={f.icon}
            width={24}
            height={24}
            className="shrink-0 text-foreground/80 mt-0.5"
          />
          <div>
            <div className="text-sm font-semibold">{f.title}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">{f.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParamRow({ name, type, def }: { name: string; type: string; def: string }) {
  return (
    <tr className="border-b border-border/40">
      <td className="py-2 pr-4 font-mono text-[12px] text-foreground">{name}</td>
      <td className="py-2 pr-4 font-mono text-[12px]">{type}</td>
      <td className="py-2 font-mono text-[12px]">{def}</td>
    </tr>
  );
}

function StylesTable() {
  const styles = [
    {
      id: "linear",
      label: "Linear",
      dart: "SolarIconStyle.linear",
      desc: "Thin 1.5 px hairline stroke — default, works everywhere.",
    },
    {
      id: "outline",
      label: "Outline",
      dart: "SolarIconStyle.outline",
      desc: "Filled shape with evenodd cutouts (macOS-style outline).",
    },
    {
      id: "broken",
      label: "Broken",
      dart: "SolarIconStyle.broken",
      desc: "1.5 px stroke with intentional gaps — friendly and casual.",
    },
    {
      id: "bold",
      label: "Bold",
      dart: "SolarIconStyle.bold",
      desc: "Fully filled solid shape — high contrast, strong presence.",
    },
    {
      id: "line-duotone",
      label: "Line Duo",
      dart: "SolarIconStyle.lineDuotone",
      desc: "Linear stroke plus a 50 % opacity accent layer.",
    },
    {
      id: "bold-duotone",
      label: "Bold Duo",
      dart: "SolarIconStyle.boldDuotone",
      desc: "Bold fill plus a 50 % opacity accent — the richest style.",
    },
  ];
  return (
    <div className="grid gap-2 mt-2">
      {styles.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-muted/40 border border-border/60">
            <Icon
              icon={`solar:home-2-${s.id}`}
              width={28}
              height={28}
              style={{ color: "currentColor" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{s.label}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">
              {s.desc}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-1">
              {s.dart}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
