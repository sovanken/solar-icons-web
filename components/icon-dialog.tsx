"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STYLES, STYLE_MAP, PREFIX } from "@/lib/libraries";
import { fetchIconSvg } from "@/lib/iconify";
import { useStore } from "@/lib/store";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PNG_SIZES,
  downloadBlob,
  downloadPngZip,
  downloadString,
  svgToFlutter,
  svgToFlutterFull,
  svgToJpgBlob,
  svgToPngBlob,
  svgToWebpBlob,
} from "@/lib/converters";

type CopyKind = "flutter" | "flutter-full" | "name";

const COPY_OPTIONS: { id: CopyKind; label: string; icon: string; desc: string }[] = [
  { id: "flutter", label: "Flutter", icon: "solar:programming-bold-duotone", desc: "SolarIcon widget (short)" },
  { id: "flutter-full", label: "Flutter (full)", icon: "solar:medal-star-bold-duotone", desc: "SolarIcon with size + color" },
  { id: "name", label: "Icon Name", icon: "solar:tag-bold-duotone", desc: "Iconify identifier" },
];

export function IconDialog() {
  const { viewStyle, size, selected, setSelected } = useStore();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const onClose = () => setSelected(null);
  const [variant, setVariant] = useState<string>(viewStyle);
  // Keyed by icon + global style: opening a different icon, or changing the
  // global style while open, snaps the preview back to that style.
  const resetKey = `${selected?.base ?? ""}|${viewStyle}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setVariant(viewStyle);
  }
  // The fetched SVG is stored with the name it belongs to, so "still
  // loading" is derived by comparison instead of tracked as its own flag.
  const [loaded, setLoaded] = useState<{ name: string; svg: string } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  // Which copy button just fired — used for the green-flash micro-interaction.
  // Cleared after 1.4s so the checkmark returns to the normal icon.
  const [justCopied, setJustCopied] = useState<CopyKind | null>(null);

  const activeStyle = STYLE_MAP[variant];
  const suffix = activeStyle?.suffix ?? "";
  const iconName = selected ? `${PREFIX}:${selected.base}${suffix}` : "";
  const fileBase = selected ? `${selected.base}${suffix}` : "icon";

  useEffect(() => {
    if (!selected || !activeStyle) return;
    let cancelled = false;
    fetchIconSvg(iconName)
      .then((text) => {
        if (!cancelled) setLoaded({ name: iconName, svg: text });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ name: iconName, svg: "" });
      });
    return () => {
      cancelled = true;
    };
  }, [selected, iconName, activeStyle]);

  // Empty until the fetch for *this* name lands, so switching style or icon
  // cannot briefly show the previous icon's source.
  const svgSource = loaded?.name === iconName ? loaded.svg : "";

  const copyPayloads = useMemo<Record<CopyKind, string>>(() => {
    if (!svgSource || !selected) return {} as Record<CopyKind, string>;
    return {
      flutter: svgToFlutter(selected.base, variant),
      "flutter-full": svgToFlutterFull(selected.base, variant, size, "#6366F1"),
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
      // Trigger the green-flash micro-interaction on the button.
      setJustCopied(kind);
      setTimeout(() => setJustCopied((current) => (current === kind ? null : current)), 1400);
    } catch {
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

  const ready = svgSource !== "";

  return (
    <Dialog open={!!selected} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        // Transparent outer shell — the visible dialog lives in the inner
        // wrapper below. This lets the floating close button extend past
        // the dialog's visible edge without being clipped by overflow-hidden.
        className="sm:max-w-3xl w-[95vw] max-h-[92vh] p-0 gap-0 bg-transparent border-0 shadow-none ring-0 rounded-none flex flex-col"
      >
        {/* Actual visible dialog surface — carries all the styling that
            used to be on DialogContent. overflow-hidden clips the inner
            scroll region without affecting the floating close button. */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10 min-h-0 flex-1">
          <div className="border-b border-border p-3 sm:p-6 pb-2.5 sm:pb-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-mono text-xs sm:text-sm truncate pr-2">
                {iconName}
              </DialogTitle>
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
            <button
              type="button"
              onClick={() => toggleFavorite(selected.base)}
              aria-label={
                isFavorite(selected.base)
                  ? "Remove from starred"
                  : "Add to starred"
              }
              className={cn(
                "shrink-0 grid h-9 w-9 place-items-center rounded-lg border transition-all",
                isFavorite(selected.base)
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                  : "border-border text-muted-foreground hover:text-amber-500 hover:border-amber-500/40 hover:bg-amber-500/5",
              )}
            >
              <Icon
                icon={
                  isFavorite(selected.base)
                    ? "solar:star-bold"
                    : "solar:star-linear"
                }
                className="h-4 w-4"
              />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0 min-w-0">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <div className="flex flex-row sm:flex-col gap-1.5 shrink-0 overflow-x-auto sm:overflow-visible">
              {STYLES.map((s) => {
                const active = variant === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setVariant(s.id)}
                    title={s.label}
                    className={cn(
                      "grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-lg border transition-all",
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
              className="flex-1 grid place-items-center rounded-2xl border border-border bg-muted/30 min-h-[150px] sm:min-h-[300px] relative overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklab, currentColor 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, currentColor 4%, transparent) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <Icon
                icon={iconName}
                className="relative h-24 w-24 sm:h-44 sm:w-44"
              />
            </div>
          </div>

          <UsageStrip iconName={iconName} />

          <Tabs defaultValue="copy" className="mt-4 sm:mt-5">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="copy">Copy</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>

            <TabsContent value="copy" className="mt-3 sm:mt-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {COPY_OPTIONS.map((opt) => {
                  const flashing = justCopied === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => doCopy(opt.id)}
                      disabled={!ready}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        flashing
                          ? "border-green-500/70 bg-green-500/10 ring-1 ring-green-500/30"
                          : "border-border bg-muted/30 hover:border-foreground/40 hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={
                            flashing
                              ? "solar:check-circle-bold-duotone"
                              : opt.icon
                          }
                          className={cn(
                            "h-5 w-5 transition-colors",
                            flashing
                              ? "text-green-500"
                              : "text-foreground/80",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium transition-colors",
                            flashing && "text-green-600 dark:text-green-400",
                          )}
                        >
                          {flashing ? "Copied!" : opt.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
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
                {ready ? svgSource : "Loading…"}
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
        </div>

        {/* Floating close button — positioned to straddle the dialog's
            top-right corner (50% inside, 50% outside). Achievable because
            the outer DialogContent has no overflow-hidden. */}
        <DialogClose
          render={
            <button
              aria-label="Close"
              className={cn(
                "absolute -top-5 -right-5 z-30 grid h-10 w-10 place-items-center rounded-full",
                "border border-border bg-background/95 text-muted-foreground backdrop-blur shadow-md",
                "hover:text-foreground hover:border-foreground/50 hover:bg-muted",
                "active:scale-95 transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </button>
          }
        />
      </DialogContent>
    </Dialog>
  );
}

function UsageStrip({ iconName }: { iconName: string }) {
  return (
    <div className="mt-3 sm:mt-4">
      <div className="mb-1.5 sm:mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Preview in context
      </div>
      {/* One scrollable row on mobile — as a 2x2 grid this was the tallest
          block in the dialog. Reverts to a 4-up grid from sm. */}
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
        {/* Menu item — like a dropdown option */}
        <div className="w-[150px] shrink-0 snap-start rounded-xl border border-border bg-card p-2.5 sm:w-auto sm:p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          <div className="flex items-center gap-2.5">
            <Icon icon={iconName} width={18} height={18} className="text-foreground/80" />
            <span className="text-[13px]">Edit</span>
          </div>
        </div>

        {/* Sidebar item — active/highlighted */}
        <div className="w-[150px] shrink-0 snap-start rounded-xl border border-border bg-card p-2.5 sm:w-auto sm:p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Sidebar
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-muted px-2 py-1.5 -mx-1">
            <Icon icon={iconName} width={18} height={18} className="text-foreground" />
            <span className="text-[13px] font-medium">Dashboard</span>
          </div>
        </div>

        {/* Filled button */}
        <div className="w-[150px] shrink-0 snap-start rounded-xl border border-border bg-card p-2.5 sm:w-auto sm:p-3">
          <div className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Button
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5">
            <Icon icon={iconName} width={16} height={16} style={{ color: "currentColor" }} />
            <span className="text-[12px] font-semibold">Continue</span>
          </div>
        </div>

        {/* Icon-only toolbar tile */}
        <div className="w-[150px] shrink-0 snap-start rounded-xl border border-border bg-card p-2.5 sm:w-auto sm:p-3">
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
        "relative inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all whitespace-nowrap min-h-[34px] overflow-hidden",
        primary
          ? // Rainbow-gradient CTA — the pill lights up on hover and lifts
            // slightly. Matches the reference's colorful primary download button.
            "border-transparent text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-px active:translate-y-0 " +
            "bg-[linear-gradient(120deg,#F97316_0%,#EC4899_40%,#8B5CF6_75%,#22D3EE_100%)] bg-[length:200%_200%] " +
            "[transition:background-position_600ms_ease,transform_150ms_ease] hover:bg-[position:100%_100%]"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 hover:bg-muted",
        (disabled || busy) && "opacity-50 cursor-not-allowed",
      )}
    >
      {busy && <Icon icon="solar:refresh-linear" className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
