"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STYLES, STYLE_MAP, PREFIX } from "@/lib/libraries";
import { fetchIconSvg } from "@/lib/iconify";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PNG_SIZES,
  downloadBlob,
  downloadPngZip,
  downloadString,
  svgToCssBackground,
  svgToFlutter,
  svgToFlutterFull,
  svgToHtml,
  svgToJpgBlob,
  svgToJsx,
  svgToPngBlob,
  svgToVue,
  svgToWebpBlob,
} from "@/lib/converters";

interface Props {
  selected: { base: string; category: string } | null;
  onClose: () => void;
}

type CopyKind =
  | "svg"
  | "jsx"
  | "vue"
  | "flutter"
  | "flutter-full"
  | "html"
  | "css-bg"
  | "iconify-tag"
  | "name";

const COPY_OPTIONS: { id: CopyKind; label: string; icon: string; desc: string }[] = [
  { id: "svg", label: "SVG", icon: "solar:code-bold-duotone", desc: "Raw SVG markup" },
  { id: "jsx", label: "React JSX", icon: "solar:atom-bold-duotone", desc: "React component .tsx" },
  { id: "vue", label: "Vue SFC", icon: "solar:layers-bold-duotone", desc: "Vue single-file component" },
  { id: "flutter", label: "Flutter", icon: "solar:programming-bold-duotone", desc: "SolarIcon widget (short)" },
  { id: "flutter-full", label: "Flutter (full)", icon: "solar:medal-star-bold-duotone", desc: "SolarIcon with size + color" },
  { id: "html", label: "HTML", icon: "solar:code-square-bold-duotone", desc: "Standalone HTML doc" },
  { id: "css-bg", label: "CSS Background", icon: "solar:paint-roller-bold-duotone", desc: "background-image CSS" },
  { id: "iconify-tag", label: "Iconify Tag", icon: "solar:widget-bold-duotone", desc: "<iconify-icon> element" },
  { id: "name", label: "Icon Name", icon: "solar:tag-bold-duotone", desc: "Iconify identifier" },
];

export function IconDialog({ selected, onClose }: Props) {
  const { viewStyle, size } = useStore();
  const [variant, setVariant] = useState<string>(viewStyle);
  const [svgSource, setSvgSource] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    setVariant(viewStyle);
  }, [selected, viewStyle]);

  const activeStyle = STYLE_MAP[variant];
  const suffix = activeStyle?.suffix ?? "";
  const iconName = selected ? `${PREFIX}:${selected.base}${suffix}` : "";
  const fileBase = selected ? `${selected.base}${suffix}` : "icon";

  useEffect(() => {
    if (!selected || !activeStyle) return;
    let cancelled = false;
    setLoading(true);
    fetchIconSvg(iconName)
      .then((text) => {
        if (!cancelled) setSvgSource(text);
      })
      .catch(() => {
        if (!cancelled) setSvgSource("");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected, iconName, activeStyle]);

  const copyPayloads = useMemo<Record<CopyKind, string>>(() => {
    if (!svgSource || !selected) return {} as Record<CopyKind, string>;
    return {
      svg: svgSource,
      jsx: svgToJsx(svgSource, selected.base),
      vue: svgToVue(svgSource, selected.base),
      flutter: svgToFlutter(selected.base, variant),
      "flutter-full": svgToFlutterFull(selected.base, variant, size, "#6366F1"),
      html: svgToHtml(svgSource, selected.base),
      "css-bg": svgToCssBackground(svgSource),
      "iconify-tag": `<iconify-icon icon="${iconName}"></iconify-icon>`,
      name: iconName,
    };
  }, [svgSource, selected, iconName, variant, size]);

  if (!selected || !activeStyle) return null;

  const doCopy = async (kind: CopyKind) => {
    const text = copyPayloads[kind];
    if (!text) {
      toast.error("SVG source not loaded yet");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied ${COPY_OPTIONS.find((o) => o.id === kind)?.label}`);
    } catch (err) {
      toast.error("Clipboard write failed");
    }
  };

  const withBusy = async (label: string, fn: () => Promise<void>) => {
    setDownloading(label);
    try {
      await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Download failed: ${msg}`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadSvg = () =>
    withBusy("svg", async () => {
      downloadString(svgSource, `${fileBase}.svg`, "image/svg+xml");
      toast.success("Downloaded SVG");
    });

  const downloadPng = (size: number) =>
    withBusy(`png-${size}`, async () => {
      const blob = await svgToPngBlob(svgSource, size);
      downloadBlob(blob, `${fileBase}-${size}.png`);
      toast.success(`Downloaded PNG ${size}px`);
    });

  const downloadJpg = (size: number) =>
    withBusy(`jpg-${size}`, async () => {
      const blob = await svgToJpgBlob(svgSource, size);
      downloadBlob(blob, `${fileBase}-${size}.jpg`);
      toast.success(`Downloaded JPG ${size}px`);
    });

  const downloadWebp = (size: number) =>
    withBusy(`webp-${size}`, async () => {
      const blob = await svgToWebpBlob(svgSource, size);
      downloadBlob(blob, `${fileBase}-${size}.webp`);
      toast.success(`Downloaded WebP ${size}px`);
    });

  const downloadZip = () =>
    withBusy("zip", async () => {
      await downloadPngZip(svgSource, fileBase);
      toast.success("Downloaded ZIP with SVG + all PNG sizes");
    });

  const ready = !!svgSource && !loading;

  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl w-[95vw] p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="border-b border-border p-6 pb-4 shrink-0">
          <DialogTitle className="font-mono text-sm truncate">{iconName}</DialogTitle>
          <DialogDescription className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="rounded-full text-[10px]">
              Solar
            </Badge>
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {selected.category}
            </Badge>
            <Badge variant="outline" className="rounded-full text-[10px]">
              {activeStyle.label}
            </Badge>
          </DialogDescription>

        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 shrink-0">
              {STYLES.map((s) => {
                const active = variant === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setVariant(s.id)}
                    title={s.label}
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-lg border transition-all",
                      active
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/40",
                    )}
                  >
                    <Icon
                      icon={`${PREFIX}:${selected.base}${s.suffix}`}
                      width={22}
                      height={22}
                      style={{ color: "currentColor" }}
                    />
                  </button>
                );
              })}
            </div>
            <div
              className="flex-1 grid place-items-center rounded-xl border border-border bg-muted/40 min-h-[280px] relative overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklab, currentColor 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, currentColor 4%, transparent) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <Icon icon={iconName} className="h-40 w-40" />
            </div>
          </div>

          <UsageStrip iconName={iconName} />

          <Tabs defaultValue="copy" className="mt-5">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="copy">Copy</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>

            <TabsContent value="copy" className="mt-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {COPY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => doCopy(opt.id)}
                    disabled={!ready}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-xl border border-border bg-muted/30 p-3 text-left transition-all",
                      "hover:border-foreground/40 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={opt.icon} className="h-5 w-5 text-foreground/80" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="download" className="mt-4">
              <div className="space-y-3.5">
                <ChipRow label="SVG" desc="Original vector" icon="solar:file-text-bold-duotone">
                  <Chip primary busy={downloading === "svg"} disabled={!ready} onClick={downloadSvg}>
                    <Icon icon="solar:download-linear" className="h-4 w-4" />
                    Download .svg
                  </Chip>
                </ChipRow>

                <ChipRow label="PNG" desc="Transparent background" icon="solar:gallery-bold-duotone">
                  {PNG_SIZES.map((size) => (
                    <Chip
                      key={size}
                      busy={downloading === `png-${size}`}
                      disabled={!ready}
                      onClick={() => downloadPng(size)}
                    >
                      {size}
                    </Chip>
                  ))}
                </ChipRow>

                <ChipRow label="JPG" desc="White background · 92% quality" icon="solar:camera-bold-duotone">
                  {PNG_SIZES.filter((s) => s >= 32).map((size) => (
                    <Chip
                      key={size}
                      busy={downloading === `jpg-${size}`}
                      disabled={!ready}
                      onClick={() => downloadJpg(size)}
                    >
                      {size}
                    </Chip>
                  ))}
                </ChipRow>

                <ChipRow label="WebP" desc="Modern web format · 92% quality" icon="solar:planet-bold-duotone">
                  {PNG_SIZES.filter((s) => s >= 32).map((size) => (
                    <Chip
                      key={size}
                      busy={downloading === `webp-${size}`}
                      disabled={!ready}
                      onClick={() => downloadWebp(size)}
                    >
                      {size}
                    </Chip>
                  ))}
                </ChipRow>

                <ChipRow label="Bundle" desc="SVG + all PNG sizes in one archive" icon="solar:box-bold-duotone">
                  <Chip primary busy={downloading === "zip"} disabled={!ready} onClick={downloadZip}>
                    <Icon icon="solar:archive-linear" className="h-4 w-4" />
                    Download .zip
                  </Chip>
                </ChipRow>
              </div>
            </TabsContent>

            <TabsContent value="source" className="mt-4">
              <pre className="max-h-64 overflow-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap break-all">
                {loading ? "Loading…" : svgSource || "—"}
              </pre>
              {ready && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Icon icon="solar:info-circle-linear" className="h-3.5 w-3.5" />
                  {svgSource.length.toLocaleString()} chars
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UsageStrip({ iconName }: { iconName: string }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Preview in context
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Menu item — like a dropdown option */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          <div className="flex items-center gap-2.5">
            <Icon icon={iconName} width={18} height={18} className="text-foreground/80" />
            <span className="text-[13px]">Edit</span>
          </div>
        </div>

        {/* Sidebar item — active/highlighted */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Sidebar
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-muted px-2 py-1.5 -mx-1">
            <Icon icon={iconName} width={18} height={18} className="text-foreground" />
            <span className="text-[13px] font-medium">Dashboard</span>
          </div>
        </div>

        {/* Filled button */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Button
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5">
            <Icon icon={iconName} width={16} height={16} style={{ color: "currentColor" }} />
            <span className="text-[12px] font-semibold">Continue</span>
          </div>
        </div>

        {/* Icon-only toolbar tile */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Toolbar
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-muted/40">
            <Icon icon={iconName} width={20} height={20} className="text-foreground/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipRow({
  label,
  desc,
  icon,
  children,
}: {
  label: string;
  desc?: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-1">
      <div className="w-32 shrink-0 flex items-start gap-2">
        {icon && (
          <Icon icon={icon} className="h-6 w-6 shrink-0 mt-0.5 text-foreground/80" />
        )}
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
          {desc && (
            <div className="text-[10px] text-muted-foreground leading-snug">{desc}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  children,
  onClick,
  disabled,
  busy,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all whitespace-nowrap min-h-[34px]",
        primary
          ? "bg-foreground text-background border-foreground hover:opacity-90 shadow-sm"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 hover:bg-muted",
        (disabled || busy) && "opacity-50 cursor-not-allowed",
      )}
    >
      {busy && <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
