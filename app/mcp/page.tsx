import Link from "next/link";
import { Icon } from "@iconify/react";
import { CodeBlock } from "@/components/code-block";
import { ThemeToggle } from "@/components/theme-toggle";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://solar-icons-web.vercel.app";
const ENDPOINT = `${SITE_URL}/api/mcp`;

export const metadata = {
  title: "MCP — use Solar icons with AI",
  description:
    "Connect Claude, Cursor, VS Code and other AI coding tools to the Solar icon finder, so they pick real, fitting icons and write SolarIcon code that compiles.",
};

const EXAMPLE = `find_icon { "query": "delete account" }

1. user-cross
   category: Users
   means: delete account, remove user, block user, user, profile, account
   flutter: SolarIcon(SolarIcons.userCross, style: SolarIconStyle.linear)
   styles: linear, outline, broken, bold, line-duotone, bold-duotone
   svg: https://api.iconify.design/solar/user-cross-linear.svg
   similar: user-cross-rounded

2. user ...
3. paper-bin ...`;

export default function McpPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 border-b border-border/60 bg-background/70 backdrop-blur-xl z-30">
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
              <div className="text-[10px] text-muted-foreground">MCP</div>
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
              href="/mcp"
              className="rounded-md px-3 py-1.5 text-foreground bg-muted font-medium"
            >
              MCP
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Docs
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Icon icon="solar:magic-wand-bold-duotone" className="h-4 w-4 text-orange-500" />
            Model Context Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Let your AI pick the right Solar icon
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Solar names describe drawings, not purposes: search is{" "}
            <code>magnifier</code>, save is <code>diskette</code>, settings
            sliders are <code>tuning</code>. AI coding tools that guess names
            get them wrong. Connect them to this MCP server and they look icons
            up by meaning instead, and get <code>SolarIcon</code> code checked
            against the latest <code>solar_iconkit</code> release on pub.dev.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Free, read-only, no account or API key. It only reads the public
            Solar catalog; nothing you send is stored.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Server URL</h2>
          <CodeBlock code={ENDPOINT} lang="url" />
          <p className="text-sm text-muted-foreground">
            Streamable HTTP transport. Add it to your tool as a remote MCP
            server:
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Setup</h2>

          <div className="space-y-2">
            <h3 className="font-semibold">Claude Code</h3>
            <CodeBlock
              lang="bash"
              code={`claude mcp add --transport http solar-icons ${ENDPOINT}`}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Claude (desktop and claude.ai)</h3>
            <p className="text-sm text-muted-foreground">
              Settings → Connectors → Add custom connector, then paste the
              server URL above.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Cursor</h3>
            <CodeBlock
              lang="json"
              filename=".cursor/mcp.json"
              code={`{
  "mcpServers": {
    "solar-icons": {
      "url": "${ENDPOINT}"
    }
  }
}`}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">VS Code (GitHub Copilot)</h3>
            <CodeBlock
              lang="json"
              filename=".vscode/mcp.json"
              code={`{
  "servers": {
    "solar-icons": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Tools that only support stdio</h3>
            <p className="text-sm text-muted-foreground">
              Bridge to the remote server with <code>mcp-remote</code>:
            </p>
            <CodeBlock
              lang="json"
              code={`{
  "mcpServers": {
    "solar-icons": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${ENDPOINT}"]
    }
  }
}`}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Tools</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <code className="font-semibold">find_icon</code> — the best
              icons for a purpose, e.g. &ldquo;delete account&rdquo;,
              &ldquo;more options menu&rdquo;, &ldquo;dark mode&rdquo;. Each
              result has its meaning, Flutter code, available styles, similar
              variants and an SVG link.
            </li>
            <li>
              <code className="font-semibold">get_icon</code> — checks a name
              (<code>home-2</code>, <code>solar:home-2-bold</code> or the Dart
              constant <code>home2</code>). Renamed icons point to their new
              name; unknown names get the closest real ones.
            </li>
            <li>
              <code className="font-semibold">list_icons</code> — Solar&apos;s
              categories, or every icon in one category.
            </li>
          </ul>
          <CodeBlock lang="text" code={EXAMPLE} />
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Try it</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once connected, ask your assistant in plain words, for example:{" "}
            <em>
              &ldquo;Add a delete-account button to the settings screen using
              Solar icons.&rdquo;
            </em>{" "}
            It calls <code>find_icon</code>, picks <code>user-cross</code>, and
            writes{" "}
            <code>SolarIcon(SolarIcons.userCross, style: SolarIconStyle.linear)</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            Icons Solar has published but <code>solar_iconkit</code> does not
            ship yet are marked as such, so the assistant does not write code
            that fails to compile.
          </p>
        </section>
      </main>
    </div>
  );
}
