"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  code: string;
  lang?: string;
  filename?: string;
}

export function CodeBlock({ code, lang, filename }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <div className="group relative rounded-xl border border-border/60 bg-muted/40 overflow-hidden">
      {(filename || lang) && (
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-4 py-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            {filename && <span>{filename}</span>}
            {lang && !filename && (
              <span className="uppercase tracking-wider">{lang}</span>
            )}
          </div>
          <button
            onClick={copy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]",
              "text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors",
            )}
          >
            <Icon
              icon={copied ? "solar:check-read-bold-duotone" : "solar:copy-bold-duotone"}
              width={14}
              height={14}
            />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
      {!filename && !lang && (
        <button
          onClick={copy}
          className={cn(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            "inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px]",
            "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon
            icon={copied ? "solar:check-read-linear" : "solar:copy-linear"}
            width={12}
            height={12}
          />
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
