import JSZip from "jszip";

const REACT_ATTR_MAP: [string, string][] = [
  ["fill-rule", "fillRule"],
  ["clip-rule", "clipRule"],
  ["stroke-width", "strokeWidth"],
  ["stroke-linecap", "strokeLinecap"],
  ["stroke-linejoin", "strokeLinejoin"],
  ["stroke-miterlimit", "strokeMiterlimit"],
  ["stroke-dasharray", "strokeDasharray"],
  ["stroke-dashoffset", "strokeDashoffset"],
  ["stroke-opacity", "strokeOpacity"],
  ["fill-opacity", "fillOpacity"],
  ["stop-color", "stopColor"],
  ["stop-opacity", "stopOpacity"],
  ["xmlns:xlink", "xmlnsXlink"],
  ["xlink:href", "xlinkHref"],
  ["clip-path", "clipPath"],
  ["text-anchor", "textAnchor"],
  ["font-family", "fontFamily"],
  ["font-size", "fontSize"],
  ["font-weight", "fontWeight"],
  ["class", "className"],
];

function toCamelAttrs(svg: string): string {
  let out = svg;
  for (const [from, to] of REACT_ATTR_MAP) {
    out = out.replace(new RegExp(`\\b${from}=`, "g"), `${to}=`);
  }
  return out;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export function svgToJsx(svg: string, baseName: string): string {
  const name = "Icon" + toPascalCase(baseName);
  const jsxSvg = toCamelAttrs(svg).replace(
    /<svg([^>]*)>/,
    "<svg$1 {...props}>",
  );
  return `import * as React from "react";

export function ${name}(props: React.SVGProps<SVGSVGElement>) {
  return (
    ${jsxSvg}
  );
}
`;
}

// Dart reserved words + built-in identifiers + contextual keywords.
// Must stay in sync with `DART_RESERVED` in the solar_iconkit Flutter package's
// tools/fetch_icons.py generator so identifiers match the .g.dart file.
const DART_RESERVED = new Set([
  "assert", "break", "case", "catch", "class", "const", "continue",
  "default", "do", "else", "enum", "extends", "false", "final", "finally",
  "for", "if", "in", "is", "new", "null", "rethrow", "return", "super",
  "switch", "this", "throw", "true", "try", "var", "void", "while", "with",
  "abstract", "as", "covariant", "deferred", "dynamic", "export",
  "extension", "external", "factory", "function", "get", "implements",
  "import", "interface", "late", "library", "mixin", "operator", "part",
  "required", "set", "sealed", "static", "typedef",
  "async", "await", "hide", "of", "on", "show", "sync", "when", "yield",
  "base",
]);

export function toDartIdentifier(baseName: string): string {
  const parts = baseName.split(/[-_]+/).filter(Boolean);
  if (parts.length === 0) return "unnamed";
  const head = parts[0].toLowerCase();
  const tail = parts
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
  let ident = head + tail;
  if (/^[0-9]/.test(ident)) ident = "i" + ident;
  if (DART_RESERVED.has(ident)) ident = ident + "Icon";
  return ident;
}

export const STYLE_ID_TO_DART_ENUM: Record<string, string> = {
  linear: "linear",
  outline: "outline",
  broken: "broken",
  bold: "bold",
  "line-duotone": "lineDuotone",
  "bold-duotone": "boldDuotone",
};

export function svgToFlutter(baseName: string, styleId: string): string {
  const ident = toDartIdentifier(baseName);
  const dartStyle = STYLE_ID_TO_DART_ENUM[styleId] ?? styleId;
  return `SolarIcon(SolarIcons.${ident}, style: SolarIconStyle.${dartStyle})`;
}

export function svgToFlutterFull(baseName: string, styleId: string, size: number, colorHex: string): string {
  const ident = toDartIdentifier(baseName);
  const dartStyle = STYLE_ID_TO_DART_ENUM[styleId] ?? styleId;
  const hex = colorHex.replace("#", "").toUpperCase();
  const dartColor = `Color(0xFF${hex})`;
  return `SolarIcon(
  SolarIcons.${ident},
  style: SolarIconStyle.${dartStyle},
  size: ${size},
  color: const ${dartColor},
)`;
}

export function svgToVue(svg: string, baseName: string): string {
  const name = toPascalCase(baseName);
  return `<template>
  ${svg}
</template>

<script setup lang="ts">
// ${name} — Solar icon
defineOptions({ name: "${name}" });
</script>
`;
}

function encodeUnicodeBase64(str: string): string {
  // Handle multibyte characters safely
  return btoa(unescape(encodeURIComponent(str)));
}

export function svgToBase64(svg: string): string {
  return encodeUnicodeBase64(svg);
}

export function svgToDataUri(svg: string, base64 = true): string {
  if (base64) return `data:image/svg+xml;base64,${encodeUnicodeBase64(svg)}`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function svgToCssBackground(svg: string): string {
  return `background-image: url("${svgToDataUri(svg, true)}");
background-repeat: no-repeat;
background-position: center;
background-size: contain;`;
}

export function svgToHtml(svg: string, baseName: string): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>${baseName}</title></head>
<body>
  ${svg}
</body>
</html>`;
}

export async function svgToPngBlob(svg: string, size: number): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("failed to load svg image"));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob returned null"));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function svgToJpgBlob(svg: string, size: number): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("failed to load svg image"));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("canvas.toBlob returned null"));
        },
        "image/jpeg",
        0.92,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function svgToWebpBlob(svg: string, size: number): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("failed to load svg image"));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("canvas.toBlob returned null"));
        },
        "image/webp",
        0.92,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadString(text: string, filename: string, mime: string): void {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export const PNG_SIZES = [16, 24, 32, 48, 64, 128, 256, 512, 1024] as const;

export async function downloadPngZip(svg: string, baseName: string, sizes = PNG_SIZES): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(baseName) ?? zip;
  folder.file(`${baseName}.svg`, svg);
  for (const size of sizes) {
    const blob = await svgToPngBlob(svg, size);
    folder.file(`${baseName}-${size}.png`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadBlob(zipBlob, `${baseName}.zip`);
}
