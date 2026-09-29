import Link from "next/link";
import { Icon } from "@iconify/react";
import { CodeBlock } from "@/components/code-block";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocsToc, type TocItem } from "@/components/docs-toc";

export const metadata = {
  title: "Docs — Solar Iconkit for Flutter",
  description:
    "Complete documentation for solar_iconkit — installation, widget API reference, style guide, recipes, performance notes, accessibility, testing, and troubleshooting.",
};

const DOCS_SCROLL_ID = "docs-main";

const TOC: TocItem[] = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "quickstart", label: "Quick start" },
  { id: "widget-api", label: "Widget API" },
  { id: "styles", label: "Styles" },
  { id: "default-style", label: "Default style" },
  { id: "recipes", label: "Recipes" },
  { id: "in-buttons", label: "  Buttons", parent: "recipes" },
  { id: "in-lists", label: "  Lists", parent: "recipes" },
  { id: "in-appbar", label: "  App bars", parent: "recipes" },
  { id: "in-forms", label: "  Text fields", parent: "recipes" },
  { id: "in-navbars", label: "  Nav bars", parent: "recipes" },
  { id: "coloring", label: "  Coloring", parent: "recipes" },
  { id: "with-icontheme", label: "  IconTheme", parent: "recipes" },
  { id: "shadows", label: "  Shadows", parent: "recipes" },
  { id: "blend-modes", label: "  Blend modes", parent: "recipes" },
  { id: "animation", label: "  Animation", parent: "recipes" },
  { id: "custom-effects", label: "Custom effects" },
  { id: "fx-gradient", label: "  Gradient sheen", parent: "custom-effects" },
  { id: "fx-tile", label: "  App-icon tile", parent: "custom-effects" },
  { id: "fx-glow", label: "  Colored glow", parent: "custom-effects" },
  { id: "fx-neon", label: "  Neon", parent: "custom-effects" },
  { id: "fx-glass", label: "  Frosted glass", parent: "custom-effects" },
  { id: "fx-outline-glow", label: "  Outline glow", parent: "custom-effects" },
  { id: "naming", label: "Icon naming" },
  { id: "categories", label: "Categories" },
  { id: "accessibility", label: "Accessibility" },
  { id: "rtl", label: "RTL and text direction" },
  { id: "performance", label: "Performance" },
  { id: "bundle-size", label: "Bundle size" },
  { id: "testing", label: "Testing" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "versioning", label: "Versioning" },
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
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* TOC */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 overflow-y-auto">
          <DocsToc items={TOC} scrollRootId={DOCS_SCROLL_ID} />
        </aside>

        <main
          id={DOCS_SCROLL_ID}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12 space-y-16">
            {/* Introduction ------------------------------------------- */}
            <Section id="introduction" title="Introduction">
              <Hero />
              <p>
                <strong>Solar Iconkit</strong> is a Flutter package that bundles
                the entire Solar icon set by 480 Design —{" "}
                <strong>1,451 icons across 6 native styles</strong> (8,718 SVG
                files) — behind a single, type-safe{" "}
                <code>SolarIcon</code> widget. MIT-licensed, works offline, no
                setup beyond adding the dependency. Preview every icon on the{" "}
                <Link
                  href="/"
                  className="text-primary underline underline-offset-2"
                >
                  browser
                </Link>
                .
              </p>
              <FeatureGrid />
            </Section>

            {/* Installation ------------------------------------------- */}
            <Section id="installation" title="Installation">
              <p>
                Add to <code>pubspec.yaml</code>:
              </p>
              <CodeBlock
                filename="pubspec.yaml"
                lang="yaml"
                code={`dependencies:
  solar_iconkit: ^2.0.0`}
              />
              <p>Or use the CLI:</p>
              <CodeBlock
                filename="Terminal"
                lang="bash"
                code={`flutter pub add solar_iconkit
# or
flutter pub get`}
              />
              <p>Import wherever icons are needed:</p>
              <CodeBlock
                lang="dart"
                code={`import 'package:solar_iconkit/solar_iconkit.dart';`}
              />
              <Callout icon="solar:info-circle-bold-duotone" tone="info">
                <strong>Requirements</strong> — Flutter ≥ 3.27, Dart ^3.6. Runs
                on Android, iOS, macOS, Windows, Linux, and Web.
              </Callout>
              <p>
                Consumers don&apos;t need to declare any assets in their own
                pubspec — the package bundles the SVGs and Flutter resolves
                them via the <code>packages/</code> scheme automatically. You
                also don&apos;t need to add <code>flutter_svg</code> directly;
                it&apos;s pulled in transitively.
              </p>
            </Section>

            {/* Quick start ------------------------------------------- */}
            <Section id="quickstart" title="Quick start">
              <p>The three most common shapes:</p>
              <CodeBlock
                filename="main.dart"
                lang="dart"
                code={`import 'package:flutter/material.dart';
import 'package:solar_iconkit/solar_iconkit.dart';

// Minimum — default linear style, size from IconTheme (24 px fallback).
SolarIcon(SolarIcons.home2)

// Explicit style and size.
SolarIcon(
  SolarIcons.heart,
  style: SolarIconStyle.bold,
  size: 32,
)

// Fully-specified — every parameter that matters.
SolarIcon(
  SolarIcons.rocket,
  style: SolarIconStyle.boldDuotone,
  size: 48,
  color: Theme.of(context).colorScheme.primary,
  opacity: 0.9,
  semanticLabel: 'Launch',
)`}
              />
              <p>
                No <code>init()</code> call, no font loading, no asset path to
                remember, no <code>flutter_svg</code> import required from
                consumer code.
              </p>
            </Section>

            {/* Widget API -------------------------------------------- */}
            <Section id="widget-api" title="Widget API">
              <p>
                <code>SolarIcon</code> is a <code>const</code>-constructible,
                immutable <code>StatelessWidget</code>. Every parameter is
                optional except the required positional <code>name</code>.
              </p>
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Parameter</th>
                    <th className="text-left py-2 pr-4 font-semibold">Type</th>
                    <th className="text-left py-2 font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <ParamRow name="name" type="String" def="required" />
                  <ParamRow name="style" type="SolarIconStyle?" def="SolarIconTheme → linear" />
                  <ParamRow name="size" type="double?" def="IconTheme → 24" />
                  <ParamRow name="color" type="Color?" def="IconTheme → black87" />
                  <ParamRow name="opacity" type="double" def="1.0" />
                  <ParamRow name="semanticLabel" type="String?" def="null" />
                  <ParamRow name="textDirection" type="TextDirection?" def="Directionality.of" />
                  <ParamRow name="matchTextDirection" type="bool" def="false" />
                  <ParamRow name="fit" type="BoxFit" def="BoxFit.contain" />
                  <ParamRow name="alignment" type="AlignmentGeometry" def="Alignment.center" />
                  <ParamRow name="blendMode" type="BlendMode" def="BlendMode.srcIn" />
                  <ParamRow name="shadows" type="List<Shadow>?" def="null" />
                  <ParamRow name="key" type="Key?" def="null" />
                </tbody>
              </table>

              <Sub id="widget-api-resolution" title="How style, color and size resolve">
                <p>
                  Matches Flutter&apos;s built-in <code>Icon</code> widget
                  resolution order:
                </p>
                <ol className="list-decimal ml-5 space-y-1 text-sm">
                  <li>
                    If passed explicitly on the widget, use that value.
                  </li>
                  <li>
                    Otherwise read the enclosing theme —{" "}
                    <code>IconTheme.of(context)</code> for size, color and
                    opacity;{" "}
                    <a
                      href="#default-style"
                      className="text-primary underline underline-offset-2"
                    >
                      <code>SolarIconTheme.of(context)</code>
                    </a>{" "}
                    for style.
                  </li>
                  <li>
                    Fall back to defaults (24 px,{" "}
                    <code>Color(0xDD000000)</code>,{" "}
                    <code>SolarIconStyle.linear</code>).
                  </li>
                </ol>
                <p>
                  Opacity is <em>multiplied</em> across both sources: widget{" "}
                  <code>opacity: 0.5</code> combined with{" "}
                  <code>IconTheme.opacity: 0.8</code> gives an effective alpha
                  of 0.4.
                </p>
              </Sub>

              <Sub id="widget-api-const" title="Const-constructibility">
                <p>
                  <code>SolarIcon</code>&apos;s constructor is <code>const</code>.
                  Instances used in const contexts are cached by the Flutter
                  framework and never trigger unnecessary rebuilds.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`class HomeButton extends StatelessWidget {
  const HomeButton({super.key});

  @override
  Widget build(BuildContext context) {
    // \`const\` here means Flutter reuses the same widget instance
    // across every rebuild — zero allocation cost.
    return const SolarIcon(SolarIcons.home2);
  }
}`}
                />
              </Sub>

              <Sub id="widget-api-statics" title="Static helpers">
                <ul className="text-sm space-y-1">
                  <li>
                    <code>SolarIcon.assetPath(name, style)</code> — returns the
                    raw asset path. Useful for <code>precachePicture</code> or
                    building your own <code>SvgAssetLoader</code>.
                  </li>
                  <li>
                    <code>SolarIcon.packageName</code> — the string{" "}
                    <code>&apos;solar_iconkit&apos;</code>. Useful when passing
                    to <code>SvgAssetLoader</code> directly.
                  </li>
                </ul>
              </Sub>

              <Sub id="widget-api-validation" title="Debug validation (new in 1.0.2)">
                <p>
                  In debug and profile builds, <code>SolarIcon</code> throws a
                  clear <code>FlutterError</code> when constructed with a name
                  that isn&apos;t in the Solar catalog. The assertion is
                  stripped from release builds so there is zero production
                  cost.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`// Debug: throws FlutterError with a stack trace pointing here.
// Release: renders a blank square (same as pre-1.0.2 behaviour).
SolarIcon('totally-typoed-name')`}
                />
                <p>
                  Prefer the <code>SolarIcons.xxx</code> constants — the Dart
                  analyzer catches typos at compile time, before you ever hit
                  the runtime assertion.
                </p>
              </Sub>
            </Section>

            {/* Styles ------------------------------------------------- */}
            <Section id="styles" title="Styles">
              <p>
                Six native styles per icon. Each has a distinct visual character
                and pairs with specific UI roles.
              </p>
              <StylesTable />
              <Callout icon="solar:lightbulb-bold-duotone" tone="tip">
                <strong>Recommendation.</strong> Use <code>linear</code> for
                chrome, promote to <code>bold</code> for active or selected
                states, and reserve <code>boldDuotone</code> for feature
                moments and hero areas.
              </Callout>
            </Section>

            {/* Default style ----------------------------------------- */}
            <Section id="default-style" title="Default style">
              <p>
                <code>SolarIcon</code> already inherits size, color and
                opacity from the ambient <code>IconTheme</code>. Style was the
                one property you could not set once for a subtree, so an app
                with a house style had to repeat <code>style:</code> at every
                call site. <code>SolarIconTheme</code> closes that gap.
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIconTheme(
  style: SolarIconStyle.boldDuotone,
  child: MyApp(),
)`}
              />
              <p>
                An explicit <code>style:</code> always wins, and nesting works
                the way <code>IconTheme</code> does — the nearest ancestor
                applies:
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIconTheme(
  style: SolarIconStyle.linear,
  child: Column(
    children: [
      SolarIcon(SolarIcons.home2),                             // linear
      SolarIcon(SolarIcons.home2, style: SolarIconStyle.bold), // bold
      SolarIconTheme(
        style: SolarIconStyle.broken,
        child: SolarIcon(SolarIcons.home2),                    // broken
      ),
    ],
  ),
)`}
              />
              <p>
                To read the active style yourself,{" "}
                <code>SolarIconTheme.of(context)</code> falls back to{" "}
                <code>SolarIconStyle.linear</code> when there is no enclosing
                theme. <code>maybeOf</code> returns null instead, for when you
                need to tell &ldquo;no theme&rdquo; apart from &ldquo;a theme
                that happens to be linear&rdquo;.
              </p>
              <Callout icon="solar:info-circle-bold-duotone" tone="info">
                New in <strong>2.0.0</strong>. The widget&apos;s{" "}
                <code>style</code> field became nullable to make this work,
                which is the release&apos;s only breaking change — code that
                always passed <code>style:</code> is unaffected.
              </Callout>
            </Section>

            {/* Recipes ------------------------------------------------ */}
            <Section id="recipes" title="Recipes">
              <p>
                Common Flutter patterns using <code>SolarIcon</code>. Copy
                any snippet and adapt.
              </p>

              <Sub id="in-buttons" title="Buttons">
                <p>Icon-only:</p>
                <CodeBlock
                  lang="dart"
                  code={`IconButton(
  onPressed: onDelete,
  icon: SolarIcon(SolarIcons.trashBinTrash),
  tooltip: 'Delete',
)`}
                />
                <p>Leading icon on a filled button:</p>
                <CodeBlock
                  lang="dart"
                  code={`FilledButton.icon(
  onPressed: onDownload,
  icon: SolarIcon(
    SolarIcons.download,
    size: 18,
    color: Colors.white,
  ),
  label: const Text('Download'),
)`}
                />
                <p>Segmented button:</p>
                <CodeBlock
                  lang="dart"
                  code={`SegmentedButton<int>(
  segments: [
    ButtonSegment(
      value: 0,
      icon: SolarIcon(SolarIcons.listCheck, size: 16),
      label: const Text('List'),
    ),
    ButtonSegment(
      value: 1,
      icon: SolarIcon(SolarIcons.widget5, size: 16),
      label: const Text('Grid'),
    ),
  ],
  selected: {selectedView},
  onSelectionChanged: (s) => setState(() => selectedView = s.first),
)`}
                />
              </Sub>

              <Sub id="in-lists" title="Lists and tiles">
                <CodeBlock
                  lang="dart"
                  code={`ListTile(
  leading: SolarIcon(
    SolarIcons.folder,
    style: SolarIconStyle.boldDuotone,
    color: Colors.amber,
  ),
  title: const Text('Documents'),
  subtitle: const Text('12 files'),
  trailing: SolarIcon(SolarIcons.altArrowRight, size: 18),
  onTap: () {},
)`}
                />
                <p>Inside a drawer with a leading style set:</p>
                <CodeBlock
                  lang="dart"
                  code={`IconTheme(
  data: const IconThemeData(size: 22),
  child: Drawer(
    child: ListView(
      children: const [
        DrawerHeader(child: Text('Menu')),
        ListTile(leading: SolarIcon(SolarIcons.home2), title: Text('Home')),
        ListTile(leading: SolarIcon(SolarIcons.settings), title: Text('Settings')),
        ListTile(leading: SolarIcon(SolarIcons.logout), title: Text('Sign out')),
      ],
    ),
  ),
)`}
                />
              </Sub>

              <Sub id="in-appbar" title="App bars">
                <CodeBlock
                  lang="dart"
                  code={`AppBar(
  leading: IconButton(
    icon: const SolarIcon(SolarIcons.hamburgerMenu),
    onPressed: () => Scaffold.of(context).openDrawer(),
  ),
  title: const Text('Solar'),
  actions: [
    IconButton(
      icon: const SolarIcon(SolarIcons.bell),
      onPressed: () {},
    ),
    IconButton(
      icon: const SolarIcon(SolarIcons.settings),
      onPressed: () {},
    ),
  ],
)`}
                />
                <p>A tab bar with icon-only tabs:</p>
                <CodeBlock
                  lang="dart"
                  code={`TabBar(
  tabs: const [
    Tab(icon: SolarIcon(SolarIcons.gallery)),
    Tab(icon: SolarIcon(SolarIcons.videoLibrary)),
    Tab(icon: SolarIcon(SolarIcons.musicLibrary2)),
  ],
)`}
                />
              </Sub>

              <Sub id="in-forms" title="Text fields">
                <CodeBlock
                  lang="dart"
                  code={`TextField(
  decoration: InputDecoration(
    prefixIcon: Padding(
      padding: const EdgeInsets.all(12),
      child: SolarIcon(SolarIcons.magnifier, size: 18),
    ),
    suffixIcon: IconButton(
      icon: const SolarIcon(SolarIcons.closeCircle, size: 18),
      onPressed: _clear,
    ),
    hintText: 'Search...',
    border: const OutlineInputBorder(),
  ),
)`}
                />
                <p>
                  <code>prefixIcon</code> / <code>suffixIcon</code> use a fixed
                  size internally; wrap in <code>Padding</code> or set{" "}
                  <code>prefixIconConstraints</code> if you need custom sizing.
                </p>
              </Sub>

              <Sub id="in-navbars" title="Navigation bars">
                <CodeBlock
                  lang="dart"
                  code={`NavigationBar(
  selectedIndex: _index,
  onDestinationSelected: (i) => setState(() => _index = i),
  destinations: const [
    NavigationDestination(
      icon: SolarIcon(SolarIcons.home2),
      selectedIcon: SolarIcon(SolarIcons.home2, style: SolarIconStyle.bold),
      label: 'Home',
    ),
    NavigationDestination(
      icon: SolarIcon(SolarIcons.magnifier),
      selectedIcon: SolarIcon(SolarIcons.magnifier, style: SolarIconStyle.bold),
      label: 'Search',
    ),
    NavigationDestination(
      icon: SolarIcon(SolarIcons.user),
      selectedIcon: SolarIcon(SolarIcons.user, style: SolarIconStyle.bold),
      label: 'Profile',
    ),
  ],
)`}
                />
                <p>
                  Swap <code>style</code> between{" "}
                  <code>SolarIconStyle.linear</code> (idle) and{" "}
                  <code>SolarIconStyle.bold</code> (selected) for a subtle,
                  weight-based selection indicator that&apos;s standard in
                  modern nav bars.
                </p>
              </Sub>

              <Sub id="coloring" title="Coloring">
                <p>Four progressively integrated approaches:</p>
                <CodeBlock
                  lang="dart"
                  code={`// 1. Explicit color.
SolarIcon(SolarIcons.heart, color: Colors.red)

// 2. Inherited from an ambient IconTheme (matches Flutter's Icon widget).
IconTheme(
  data: const IconThemeData(color: Colors.blueAccent),
  child: SolarIcon(SolarIcons.star),
)

// 3. Theme-driven — recolors on brightness / theme changes.
SolarIcon(
  SolarIcons.settings,
  color: Theme.of(context).colorScheme.primary,
)

// 4. Duotone with color-preserved accent — the 50% opacity accent
// remains translucent while the base takes your color.
SolarIcon(
  SolarIcons.rocket,
  style: SolarIconStyle.boldDuotone,
  color: Colors.deepPurple,
)`}
                />
              </Sub>

              <Sub id="with-icontheme" title="IconTheme scoping">
                <p>
                  <code>SolarIcon</code> reads{" "}
                  <code>IconTheme.of(context)</code> when the widget doesn&apos;t
                  set <code>size</code>, <code>color</code>, or{" "}
                  <code>opacity</code> explicitly. Wrap a subtree to theme
                  every <code>SolarIcon</code> inside it at once:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`IconTheme(
  data: const IconThemeData(color: Colors.indigo, size: 20),
  child: Row(children: const [
    SolarIcon(SolarIcons.home2),   // picks up indigo + size 20
    SolarIcon(SolarIcons.heart),   // same
  ]),
)`}
                />
                <p>
                  Under <code>MaterialApp</code>,{" "}
                  <code>IconTheme.of(context)</code> returns{" "}
                  <code>Theme.of(context).iconTheme</code>. Setting{" "}
                  <code>iconTheme</code> on <code>ThemeData</code> themes every{" "}
                  <code>SolarIcon</code> in the entire app:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`MaterialApp(
  theme: ThemeData(
    iconTheme: const IconThemeData(
      color: Colors.black87,
      size: 24,
      opacity: 0.9,
    ),
  ),
  home: const MyApp(),
)`}
                />
              </Sub>

              <Sub id="shadows" title="Drop shadows">
                <p>
                  Mirroring the <code>shadows</code> parameter on Flutter&apos;s
                  built-in <code>Icon</code> widget: pass a{" "}
                  <code>List&lt;Shadow&gt;</code> to paint blurred, offset copies
                  of the icon behind the main render.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`SolarIcon(
  SolarIcons.heart,
  style: SolarIconStyle.bold,
  color: Colors.red,
  shadows: const [
    Shadow(
      color: Colors.black26,
      blurRadius: 6,
      offset: Offset(0, 2),
    ),
  ],
)`}
                />
                <p>
                  Cheap for one or two shadows. Avoid long shadow lists in
                  scrolling contexts — each shadow is rendered as a separate
                  filtered pass.
                </p>
              </Sub>

              <Sub id="blend-modes" title="Blend modes">
                <p>
                  Defaults to <code>BlendMode.srcIn</code> — the standard
                  &quot;recolor an icon&quot; behaviour that replaces the icon&apos;s
                  color while preserving alpha.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`// Default — flat color replacement.
SolarIcon(SolarIcons.rocket, color: Colors.blue)

// Multiply — icon interacts with the background instead of
// replacing pixels. Great over textured / gradient backgrounds.
SolarIcon(
  SolarIcons.rocket,
  color: Colors.blue,
  blendMode: BlendMode.multiply,
)

// Dst — keep the SVG's native colors, ignore the color argument.
SolarIcon(
  SolarIcons.rocket,
  blendMode: BlendMode.dst,
)`}
                />
              </Sub>

              <Sub id="animation" title="Animated transitions">
                <p>Cross-fade between styles:</p>
                <CodeBlock
                  lang="dart"
                  code={`AnimatedSwitcher(
  duration: const Duration(milliseconds: 200),
  child: SolarIcon(
    SolarIcons.heart,
    key: ValueKey(_liked ? 'bold' : 'linear'),
    style: _liked ? SolarIconStyle.bold : SolarIconStyle.linear,
    color: _liked ? Colors.red : null,
  ),
)`}
                />
                <p>Animate size with a tween:</p>
                <CodeBlock
                  lang="dart"
                  code={`TweenAnimationBuilder<double>(
  tween: Tween(begin: 24, end: _big ? 48 : 24),
  duration: const Duration(milliseconds: 250),
  curve: Curves.easeOutCubic,
  builder: (context, size, _) =>
      SolarIcon(SolarIcons.home2, size: size),
)`}
                />
              </Sub>
            </Section>

            {/* Custom effects --------------------------------------- */}
            <Section id="custom-effects" title="Custom effects">
              <p>
                <code>SolarIcon</code> composes cleanly with Flutter&apos;s
                paint pipeline. Combine it with <code>ShaderMask</code>,{" "}
                <code>Container</code> decorations, <code>BackdropFilter</code>,
                and the built-in <code>shadows</code> parameter to build
                app-icon-grade visual effects — no external libraries required.
              </p>
              <p>
                Every effect below is a self-contained widget. Copy the code,
                swap the icon, tune the colors.
              </p>

              <EffectDemo
                id="fx-gradient"
                title="Gradient sheen"
                description="Paint the icon with a linear gradient using a ShaderMask. The gradient replaces the icon's color while preserving alpha — the two-tone effect from duotone styles stays intact."
                preview={
                  <TilePreview
                    background="linear-gradient(135deg, #FDBA74 0%, #EC4899 100%)"
                    icon="solar:heart-bold-duotone"
                  />
                }
                code={`ShaderMask(
  shaderCallback: (bounds) => const LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFDBA74), Color(0xFFEC4899)],
  ).createShader(bounds),
  blendMode: BlendMode.srcIn,
  child: const SolarIcon(
    SolarIcons.heart,
    style: SolarIconStyle.boldDuotone,
    size: 56,
    color: Colors.white, // required for ShaderMask srcIn
  ),
)`}
              />

              <EffectDemo
                id="fx-tile"
                title="App-icon tile"
                description="A vibrant rounded tile with a matching-color glow shadow. This is the pattern used by native app icons on iOS and Android — great for feature cards and home-screen-style grids."
                preview={
                  <TilePreview
                    background="linear-gradient(135deg, #F97316 0%, #EA580C 100%)"
                    icon="solar:rocket-bold-duotone"
                    shadow="0 14px 32px -6px rgba(249, 115, 22, 0.5)"
                    rounded
                  />
                }
                code={`Container(
  width: 72,
  height: 72,
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(22),
    gradient: const LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [Color(0xFFF97316), Color(0xFFEA580C)],
    ),
    boxShadow: [
      BoxShadow(
        color: const Color(0xFFF97316).withValues(alpha: 0.5),
        blurRadius: 32,
        spreadRadius: 2,
        offset: const Offset(0, 14),
      ),
    ],
  ),
  child: const Center(
    child: SolarIcon(
      SolarIcons.rocket,
      style: SolarIconStyle.boldDuotone,
      size: 36,
      color: Colors.white,
    ),
  ),
)`}
              />

              <EffectDemo
                id="fx-glow"
                title="Colored glow"
                description="A single soft drop shadow in the icon's own color makes it feel lit-from-within. Pair with SolarIconStyle.boldDuotone for maximum impact."
                preview={
                  <PlainIconPreview
                    icon="solar:star-bold-duotone"
                    color="#FACC15"
                    glow="#FACC15"
                    glowBlur={20}
                  />
                }
                code={`const SolarIcon(
  SolarIcons.star,
  style: SolarIconStyle.boldDuotone,
  size: 56,
  color: Color(0xFFFACC15),
  shadows: [
    Shadow(
      color: Color(0x80FACC15),
      blurRadius: 24,
      offset: Offset(0, 6),
    ),
  ],
)`}
              />

              <EffectDemo
                id="fx-neon"
                title="Neon"
                description="Stack multiple shadows of increasing blur radius to create a bright neon halo. Best against a dark background where the color bleed is visible."
                preview={
                  <PlainIconPreview
                    icon="solar:star-bold"
                    color="#ffffff"
                    background="#0a0a0a"
                    neon="#22D3EE"
                  />
                }
                code={`const SolarIcon(
  SolarIcons.star,
  style: SolarIconStyle.bold,
  size: 56,
  color: Colors.white,
  shadows: [
    Shadow(color: Color(0xFF22D3EE), blurRadius: 6),
    Shadow(color: Color(0xFF22D3EE), blurRadius: 16),
    Shadow(color: Color(0xFF22D3EE), blurRadius: 32),
  ],
)`}
              />

              <EffectDemo
                id="fx-glass"
                title="Frosted glass"
                description="A translucent white icon on a colored gradient with a subtle border. Emulates the iOS 'glass' effect popular in 2024 design systems."
                preview={
                  <TilePreview
                    background="linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)"
                    icon="solar:magic-wand-3-bold-duotone"
                    frosted
                    rounded
                  />
                }
                code={`Container(
  width: 72,
  height: 72,
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(22),
    gradient: const LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        Color(0xFF6366F1),
        Color(0xFF8B5CF6),
        Color(0xFFEC4899),
      ],
    ),
  ),
  child: ClipRRect(
    borderRadius: BorderRadius.circular(22),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.15),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.3),
            width: 1,
          ),
          borderRadius: BorderRadius.circular(22),
        ),
        child: const Center(
          child: SolarIcon(
            SolarIcons.magicStick3,
            style: SolarIconStyle.boldDuotone,
            size: 36,
            color: Colors.white,
          ),
        ),
      ),
    ),
  ),
)`}
              />

              <EffectDemo
                id="fx-outline-glow"
                title="Outline glow (dual layer)"
                description="Layer a bold-duotone icon over a semi-transparent Bold variant to fake a soft outer stroke. Cheap trick, striking result."
                preview={
                  <PlainIconPreview
                    icon="solar:heart-bold-duotone"
                    color="#FB7185"
                    glow="#FB7185"
                    glowBlur={12}
                  />
                }
                code={`Stack(
  alignment: Alignment.center,
  children: [
    // Faux outline — a larger, low-alpha bold icon behind.
    SolarIcon(
      SolarIcons.heart,
      style: SolarIconStyle.bold,
      size: 60,
      color: const Color(0xFFFB7185).withValues(alpha: 0.25),
    ),
    // Main icon on top.
    const SolarIcon(
      SolarIcons.heart,
      style: SolarIconStyle.boldDuotone,
      size: 48,
      color: Color(0xFFFB7185),
    ),
  ],
)`}
              />

              <Callout icon="solar:lightbulb-bold-duotone" tone="tip">
                <strong>All effects work in const contexts</strong> when their
                arguments are compile-time constants. Wrapper widgets
                (<code>ShaderMask</code>, <code>Container</code>,{" "}
                <code>Stack</code>) are non-const, but the <code>SolarIcon</code>{" "}
                inside stays <code>const</code> — Flutter still avoids
                unnecessary rebuilds.
              </Callout>
            </Section>

            {/* Naming ------------------------------------------------ */}
            <Section id="naming" title="Icon naming">
              <p>
                Solar names use <strong>kebab-case</strong> (e.g.{" "}
                <code>alt-arrow-down</code>, <code>home-2</code>). The Flutter
                package converts them to <strong>camelCase</strong> Dart
                identifiers on <code>SolarIcons</code>.
              </p>
              <table className="w-full border-collapse text-[13px] mt-4">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold">Input</th>
                    <th className="text-left py-2 pr-4 font-semibold">Dart identifier</th>
                    <th className="text-left py-2 font-semibold">Rule</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <NamingRow input="home" out="home" rule="plain identifier" />
                  <NamingRow input="home-2" out="home2" rule="kebab → camelCase" />
                  <NamingRow input="alt-arrow-down" out="altArrowDown" rule="multi-word camelCase" />
                  <NamingRow input="4k" out="i4k" rule="leading digit prefixed with 'i'" />
                  <NamingRow input="case" out="caseIcon" rule="Dart reserved word → suffix 'Icon'" />
                  <NamingRow input="duplicate" out="duplicate2" rule="collision → numeric suffix" />
                </tbody>
              </table>
              <p>
                Iconify identifiers used at runtime follow the pattern{" "}
                <code>solar:&lt;name&gt;-&lt;style&gt;</code>:
              </p>
              <CodeBlock
                lang="text"
                code={`solar:home-2-linear         → Linear style
solar:home-2-outline        → Outline style
solar:home-2-broken         → Broken stroke
solar:home-2-bold           → Bold filled
solar:home-2-line-duotone   → Line duotone
solar:home-2-bold-duotone   → Bold duotone`}
              />
              <Sub id="naming-retired" title="Retired names">
                <p>
                  Solar renames icons upstream from time to time. Old names
                  keep working: each becomes a <code>@Deprecated</code>{" "}
                  constant whose value is the <em>new</em> name, so existing
                  code compiles and renders identically while your IDE points
                  at the replacement.
                </p>
                <CodeBlock
                  lang="dart"
                  code={`SolarIcons.magnifer;  // deprecated, == 'magnifier'
SolarIcons.magnifier; // current

// Raw strings are resolved too, at runtime:
SolarIcons.legacyAliases['sidebar']; // 'panel-text-right'
SolarIcon.resolveName('chat-dots');  // 'chat-square-dots'`}
                />
                <p>
                  <code>SolarIcons.legacyAliases</code> holds all{" "}
                  <strong>68</strong> retired names. Nothing is ever removed
                  from it, so a name that worked in any past release still
                  works.
                </p>
              </Sub>
              <Callout icon="solar:info-circle-bold-duotone" tone="info">
                Every constant on the <code>SolarIcons</code> class carries a
                Dartdoc comment (<code>Solar icon &quot;X&quot;.</code>) so
                autocomplete / hover in your IDE reveals the source name.
              </Callout>
            </Section>

            {/* Categories -------------------------------------------- */}
            <Section id="categories" title="Categories">
              <p>
                Solar groups its icons into 37 categories, and the package
                ships that grouping so you can build a picker without
                hard-coding a list or calling an API at runtime.
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIcons.categories.keys.length;        // 37
SolarIcons.categories['Weather']!.length; // 36

SolarIcons.categoryOf('home-2');          // 'UI'
SolarIcons.categoryOf('bell');            // 'Notifications'
SolarIcons.categoryOf('not-an-icon');     // null`}
              />
              <p>
                <code>categoryOf</code> resolves deprecated names first, so a
                retired name still reports the category of the icon it now
                points at. Every name across all 37 lists is the same set as{" "}
                <code>SolarIcons.all</code>.
              </p>
              <Callout icon="solar:danger-triangle-bold-duotone" tone="warn">
                Reading <code>categories</code> or <code>all</code> means your
                icon names are built at runtime, which the{" "}
                <a
                  href="#bundle-size"
                  className="text-primary underline underline-offset-2"
                >
                  subset tool
                </a>{" "}
                cannot trace. It stops rather than shipping blank squares.
              </Callout>
            </Section>

            {/* Accessibility ----------------------------------------- */}
            <Section id="accessibility" title="Accessibility">
              <p>
                Screen readers treat unlabeled decorative icons as skippable.
                Provide a <code>semanticLabel</code> on any icon that carries
                meaning without a visible text label:
              </p>
              <CodeBlock
                lang="dart"
                code={`IconButton(
  onPressed: _delete,
  icon: SolarIcon(
    SolarIcons.trashBinTrash,
    semanticLabel: 'Delete this item',
  ),
)`}
              />
              <p>
                Do <strong>not</strong> set <code>semanticLabel</code> on icons
                that sit next to visible descriptive text — the label would be
                announced twice by the screen reader.
              </p>
              <p>
                When <code>semanticLabel</code> is null, <code>SolarIcon</code>{" "}
                automatically wraps the rendered SVG in{" "}
                <code>ExcludeSemantics</code>. Decorative icons produce zero
                announcements. This is the correct default for the majority of
                icons in a UI.
              </p>
            </Section>

            {/* RTL / i18n -------------------------------------------- */}
            <Section id="rtl" title="RTL and text direction">
              <p>
                Directional icons (arrows, chevrons, forward, back) should
                mirror horizontally under right-to-left locales. Set{" "}
                <code>matchTextDirection: true</code>:
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIcon(
  SolarIcons.altArrowRight,
  matchTextDirection: true,
)`}
              />
              <p>
                <code>SolarIcon</code> reads{" "}
                <code>Directionality.of(context)</code> to determine current
                direction. Pass <code>textDirection</code> to override for a
                specific instance:
              </p>
              <CodeBlock
                lang="dart"
                code={`SolarIcon(
  SolarIcons.altArrowRight,
  matchTextDirection: true,
  textDirection: TextDirection.rtl, // force flip regardless of context
)`}
              />
              <p>
                Non-directional icons (settings, heart, home) never mirror —
                leave <code>matchTextDirection</code> at its default{" "}
                <code>false</code>.
              </p>
            </Section>

            {/* Performance ------------------------------------------- */}
            <Section id="performance" title="Performance">
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Const-constructible.</strong> Reuse instances in{" "}
                  <code>const</code> contexts to skip allocation. Rebuilds are
                  cheap because <code>SvgPicture.asset</code> caches its
                  decoded picture per icon path.
                </li>
                <li>
                  <strong>Strict layout box.</strong> A{" "}
                  <code>SizedBox.square</code> wrapper enforces the requested
                  size — icons never overflow or shrink a parent unexpectedly.
                </li>
                <li>
                  <strong>Per-icon decode cost.</strong>{" "}
                  <code>flutter_svg</code> parses each SVG and rasterises to a
                  cached <code>Picture</code> the first time it renders —
                  typically well under 1 ms. Subsequent instances of the same
                  icon reuse the cached picture.
                </li>
                <li>
                  <strong>Startup cost is zero.</strong> SVG files are read
                  only when the corresponding widget first mounts. Package
                  assets are bundled but not decoded eagerly.
                </li>
                <li>
                  <strong>Semantic hygiene.</strong> Decorative icons wrap in{" "}
                  <code>ExcludeSemantics</code> automatically — screen readers
                  do not receive noise from every icon on screen.
                </li>
              </ul>
              <Sub id="performance-precache" title="Precaching in long lists">
                <p>
                  As new cards appear on-screen, each unique icon decodes once.
                  In a long list, that first frame can jank. Precache visible
                  icons up-front:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`Future<void> precacheSolarIcons(
  BuildContext context,
  List<String> names,
  SolarIconStyle style,
) async {
  for (final name in names) {
    await precachePicture(
      SvgAssetLoader(
        'assets/icons/\${style.folderName}/\$name.svg',
        packageName: 'solar_iconkit',
      ),
      context,
    );
  }
}`}
                />
                <p>
                  Call from an <code>initState</code> or route-enter callback
                  for icons visible in the first screen.
                </p>
              </Sub>
            </Section>

            {/* Bundle size ------------------------------------------- */}
            <Section id="bundle-size" title="Bundle size">
              <p>
                The full asset bundle is <strong>~6.5 MB of raw SVG bytes</strong>{" "}
                across all six styles (8,718 individually-minified files).
                Compressed on the pub.dev archive: about 18 MB including the
                example app, tests, and screenshots.
              </p>
              <p>
                Flutter&apos;s tree-shaker doesn&apos;t remove unreferenced
                assets because <code>SolarIcon</code> resolves paths at runtime
                — so the whole set ships by default.
              </p>
              <Sub id="bundle-size-subset" title="Shipping only what you use">
                <p>
                  The package ships a subset tool. It scans your Dart sources
                  for <code>SolarIcons.&lt;name&gt;</code> and{" "}
                  <code>SolarIcon(&apos;&lt;name&gt;&apos;)</code> references,
                  copies just those SVGs into your app, and prints the two
                  lines of setup it needs:
                </p>
                <CodeBlock
                  filename="Terminal"
                  lang="bash"
                  code={`dart run solar_iconkit:subset --styles linear,bold`}
                />
                <p>Options:</p>
                <CodeBlock
                  lang="bash"
                  code={`--styles <list>  linear, outline, broken, bold, lineDuotone, boldDuotone
                 Default: all six.
--scan <dirs>    Directories to scan for usage. Default: lib
--out <dir>      Where to write the subset. Default: assets/solar
--all            Include every icon, skipping the usage scan.`}
                />
                <p>
                  Point the package at the copied assets once, during startup:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`SolarIcon.assetBasePath = 'assets/solar';
SolarIcon.assetPackage = null; // the assets are yours now, not the package's`}
                />
                <Callout icon="solar:danger-triangle-bold-duotone" tone="warn">
                  <strong>It refuses to run</strong> if it finds{" "}
                  <code>SolarIcons.all</code>, <code>.categories</code> or{" "}
                  <code>.legacyAliases</code> in your sources. Those build icon
                  names at runtime, so a scan cannot see which icons you need,
                  and a subset would ship blank squares to production. Use{" "}
                  <code>--all</code> if that is deliberate.
                </Callout>
              </Sub>
            </Section>

            {/* Testing ----------------------------------------------- */}
            <Section id="testing" title="Testing">
              <p>Basic widget test:</p>
              <CodeBlock
                lang="dart"
                code={`import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:solar_iconkit/solar_iconkit.dart';

void main() {
  testWidgets('SolarIcon renders with expected props', (tester) async {
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(
        body: SolarIcon(
          SolarIcons.heart,
          style: SolarIconStyle.bold,
          size: 48,
        ),
      ),
    ));

    final widget = tester.widget<SolarIcon>(find.byType(SolarIcon));
    expect(widget.name, 'heart');
    expect(widget.style, SolarIconStyle.bold);
    expect(widget.size, 48);
  });
}`}
              />
              <p>
                Golden tests are supported out of the box — the widget produces
                deterministic output for any (name, style, size, color)
                combination.
              </p>
              <CodeBlock
                lang="dart"
                code={`testWidgets('boldDuotone home-2 golden', (tester) async {
  await tester.pumpWidget(const MaterialApp(
    home: Center(
      child: SolarIcon(
        SolarIcons.home2,
        style: SolarIconStyle.boldDuotone,
        size: 96,
      ),
    ),
  ));
  await tester.pumpAndSettle();
  await expectLater(
    find.byType(SolarIcon),
    matchesGoldenFile('goldens/home-2-boldDuotone.png'),
  );
});`}
              />
              <p>
                Regenerate goldens with{" "}
                <code>flutter test --update-goldens</code>. Lock to a single
                platform (usually Linux) for cross-platform test consistency —
                font and SVG rasterization can vary subtly between OSes.
              </p>
              <Sub id="testing-upgrading" title="Upgrading tests from 1.x">
                <p>
                  <code>style</code> is nullable as of 2.0.0, so it reads back
                  as <code>null</code> when the call site did not pass one —
                  where 1.x reported <code>SolarIconStyle.linear</code>. Assert
                  on what actually renders instead:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`// 1.x — now fails, style is null when unset.
expect(widget.style, SolarIconStyle.linear);

// 2.x — assert the resolved style.
expect(widget.style ?? SolarIconTheme.of(context), SolarIconStyle.linear);`}
                />
                <p>
                  If a test points the package at a{" "}
                  <a
                    href="#bundle-size"
                    className="text-primary underline underline-offset-2"
                  >
                    subset
                  </a>
                  , restore the defaults afterwards so the override cannot leak
                  into the next test:
                </p>
                <CodeBlock
                  lang="dart"
                  code={`tearDown(SolarIcon.useBundledAssets);`}
                />
              </Sub>
            </Section>

            {/* Troubleshooting -------------------------------------- */}
            <Section id="troubleshooting" title="Troubleshooting">
              <FAQ
                q="The icon renders as an empty space."
                a={
                  <>
                    Check the icon name spelling. Since 1.0.2, unknown names
                    throw a <code>FlutterError</code> in debug builds — if you
                    see nothing at all, you might be running a release build
                    (assertions stripped) or the name might be off by one
                    character. Prefer the <code>SolarIcons.&lt;name&gt;</code>{" "}
                    constants so the analyzer catches typos.
                  </>
                }
              />
              <FAQ
                q="&quot;Unable to load asset: assets/icons/linear/xxx.svg&quot; at runtime."
                a="The base name exists in one style but not another (extremely rare upstream). Confirm the file exists under packages/solar_iconkit/assets/icons/{style}/. If genuinely missing, open an issue on GitHub."
              />
              <FAQ
                q="&quot;A value of type 'List<dynamic>' can't be assigned to 'List<String>'.&quot;"
                a={
                  <>
                    The Dart analyzer sometimes infers <code>SolarIcons.all</code>{" "}
                    as <code>List&lt;dynamic&gt;</code> right after the
                    generated file is loaded. Force-refresh with{" "}
                    <code>flutter clean &amp;&amp; flutter pub get</code>, then
                    restart the Dart analysis server in your IDE (VS Code:{" "}
                    <em>Dart: Restart Analysis Server</em>).
                  </>
                }
              />
              <FAQ
                q="Icons look pixelated."
                a="SVGs do not pixelate. If you observe blurriness, check for parent widgets applying non-integer Transform.scale or FilterQuality.none."
              />
              <FAQ
                q="Icon color doesn't update on theme change."
                a={
                  <>
                    Verify you&apos;re passing a color from{" "}
                    <code>Theme.of(context)</code> (a rebuild-tracked source),
                    not a captured constant. <code>SolarIcon</code> rebuilds
                    when its <code>color</code> prop changes; the surrounding
                    widget must also rebuild when the theme changes.
                  </>
                }
              />
              <FAQ
                q="flutter_svg version conflict with another package."
                a={
                  <>
                    <code>solar_iconkit</code> pins{" "}
                    <code>flutter_svg: ^2.0.10</code>. If a peer package pins a
                    lower version, run <code>flutter pub upgrade flutter_svg</code>.
                    If two packages pin incompatible ranges, use{" "}
                    <code>dependency_overrides</code> to force a single version.
                  </>
                }
              />
            </Section>

            {/* Versioning ------------------------------------------- */}
            <Section id="versioning" title="Versioning">
              <p>
                <code>solar_iconkit</code> follows{" "}
                <a
                  href="https://semver.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Semantic Versioning 2.0.0
                </a>
                . The current release is <strong>2.0.0</strong>.
              </p>
              <ul className="text-sm space-y-1 mt-2 ml-5 list-disc">
                <li>
                  <strong>Patch bumps</strong> — bug fixes, doc updates, and
                  non-breaking internal improvements.
                </li>
                <li>
                  <strong>Minor bumps</strong> — new optional widget
                  parameters, new icons pulled from Solar upstream. An upstream
                  rename keeps the old name as a deprecated constant that
                  resolves to the new one, so it is never breaking.
                </li>
                <li>
                  <strong>Major bumps</strong> — breaking API changes. 2.0.0
                  made the widget&apos;s <code>style</code> field nullable so{" "}
                  <code>SolarIconTheme</code> could supply a default; it also
                  added categories and the subset tool, and Solar redrew eight
                  icons under the same name.
                </li>
              </ul>
              <p className="mt-3">
                Pin <code>^2.0.0</code> to receive every 2.x update. Code that
                works on 2.0.0 will keep working on 2.99.9.
              </p>
            </Section>

            {/* Credits ---------------------------------------------- */}
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
                  <strong>Flutter package</strong> — Published on{" "}
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
                  by <span className="text-foreground">sovanken</span> · for
                  the Flutter community
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

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

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
            1,451 icons · 6 styles · MIT · Flutter ≥ 3.27
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
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] font-semibold hover:bg-muted transition-colors"
        >
          <Icon icon="solar:widget-5-bold-duotone" width={14} height={14} />
          Browse icons
        </Link>
      </div>
    </div>
  );
}

function FeatureGrid() {
  const items = [
    {
      icon: "solar:widget-5-bold-duotone",
      title: "1,451 icons",
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

function NamingRow({
  input,
  out,
  rule,
}: {
  input: string;
  out: string;
  rule: string;
}) {
  return (
    <tr className="border-b border-border/40">
      <td className="py-2 pr-4 font-mono text-[12px] text-foreground">{input}</td>
      <td className="py-2 pr-4 font-mono text-[12px] text-foreground">{out}</td>
      <td className="py-2 text-[12px]">{rule}</td>
    </tr>
  );
}

function Callout({
  icon,
  tone,
  children,
}: {
  icon: string;
  tone: "info" | "tip" | "warn";
  children: React.ReactNode;
}) {
  const toneClass = {
    info: "border-blue-500/20 bg-blue-500/5 text-blue-500",
    tip: "border-orange-500/20 bg-orange-500/5 text-orange-500",
    warn: "border-red-500/20 bg-red-500/5 text-red-500",
  }[tone];
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-sm text-foreground/90 my-2 flex items-start gap-2.5",
        toneClass,
      )}
    >
      <Icon icon={icon} width={18} height={18} className="shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function StylesTable() {
  const styles = [
    {
      id: "linear",
      label: "Linear",
      dart: "SolarIconStyle.linear",
      desc: "Thin 1.5 px hairline stroke — default, works everywhere. Use for chrome, tab bars, form field decorations.",
    },
    {
      id: "outline",
      label: "Outline",
      dart: "SolarIconStyle.outline",
      desc: "Filled shape with evenodd cutouts. Slightly heavier than Linear at the same size.",
    },
    {
      id: "broken",
      label: "Broken",
      dart: "SolarIconStyle.broken",
      desc: "1.5 px stroke with intentional gaps. Playful, friendly — great for empty states and illustrations.",
    },
    {
      id: "bold",
      label: "Bold",
      dart: "SolarIconStyle.bold",
      desc: "Fully filled solid shape. High contrast, strong presence. Use for active/selected states.",
    },
    {
      id: "line-duotone",
      label: "Line Duo",
      dart: "SolarIconStyle.lineDuotone",
      desc: "Linear stroke plus a 50% opacity accent layer. Adds depth without going fully solid.",
    },
    {
      id: "bold-duotone",
      label: "Bold Duo",
      dart: "SolarIconStyle.boldDuotone",
      desc: "Bold fill plus a 50% opacity accent. Feels illustrative — use for hero areas and onboarding.",
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

/// A visual + code pair for one custom effect. Left half is a rendered
/// approximation of the effect (via CSS since we're on the web); right half
/// is the exact Flutter code that produces the effect in a real app.
function EffectDemo({
  id,
  title,
  description,
  preview,
  code,
}: {
  id: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  code: string;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-2xl border border-border/60 bg-card overflow-hidden mt-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
        {/* Preview */}
        <div className="grid place-items-center bg-gradient-to-br from-muted/30 to-muted/60 p-8 min-h-[180px] border-b sm:border-b-0 sm:border-r border-border/60">
          {preview}
        </div>
        {/* Details */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <h3 className="text-base font-semibold">
              <a
                href={`#${id}`}
                className="group inline-flex items-center gap-2"
              >
                {title}
                <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                  #
                </span>
              </a>
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <CodeBlock lang="dart" code={code} />
        </div>
      </div>
    </div>
  );
}

/// CSS-based preview of an "icon on a colored tile" effect. Approximates
/// what the Flutter code renders — not pixel-perfect, but visually close.
function TilePreview({
  background,
  icon,
  shadow,
  rounded,
  frosted,
}: {
  background: string;
  icon: string;
  shadow?: string;
  rounded?: boolean;
  frosted?: boolean;
}) {
  const style: React.CSSProperties = {
    background,
    boxShadow: shadow ?? undefined,
    borderRadius: rounded ? 22 : 14,
  };
  return (
    <div
      className="relative grid h-[88px] w-[88px] place-items-center overflow-hidden"
      style={style}
    >
      {frosted && (
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: rounded ? 22 : 14,
          }}
        />
      )}
      <Icon
        icon={icon}
        width={40}
        height={40}
        className="relative text-white"
      />
    </div>
  );
}

/// CSS-based preview of a bare icon with optional glow / neon effects.
function PlainIconPreview({
  icon,
  color,
  background,
  glow,
  glowBlur = 20,
  neon,
}: {
  icon: string;
  color: string;
  background?: string;
  glow?: string;
  glowBlur?: number;
  neon?: string;
}) {
  const filters: string[] = [];
  if (glow) filters.push(`drop-shadow(0 4px ${glowBlur}px ${glow}80)`);
  if (neon) {
    filters.push(`drop-shadow(0 0 6px ${neon})`);
    filters.push(`drop-shadow(0 0 16px ${neon})`);
    filters.push(`drop-shadow(0 0 32px ${neon})`);
  }
  return (
    <div
      className="grid h-[88px] w-[88px] place-items-center rounded-xl"
      style={background ? { background } : undefined}
    >
      <Icon
        icon={icon}
        width={56}
        height={56}
        style={{
          color,
          filter: filters.length ? filters.join(" ") : undefined,
        }}
      />
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border/60 bg-card overflow-hidden">
      <summary className="cursor-pointer list-none px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors">
        <Icon
          icon="solar:alt-arrow-right-linear"
          width={14}
          height={14}
          className="shrink-0 transition-transform group-open:rotate-90"
        />
        <span className="text-sm font-semibold flex-1">{q}</span>
      </summary>
      <div className="px-4 pb-4 pt-1 pl-11 text-[13.5px] text-foreground/85 leading-relaxed">
        {a}
      </div>
    </details>
  );
}
