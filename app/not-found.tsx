import Link from "next/link";
import { Icon } from "@iconify/react";

export const metadata = {
  title: "404 — Solar Iconkit",
};

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 py-24">
      <div className="max-w-md text-center">
        <Icon
          icon="solar:magnifer-bug-bold-duotone"
          className="mx-auto mb-4 h-16 w-16 text-muted-foreground/70"
        />
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. It may have moved
          or the link is out of date.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Icon icon="solar:home-2-bold-duotone" width={16} height={16} />
            Back to browser
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Icon icon="solar:document-text-bold-duotone" width={16} height={16} />
            Read docs
          </Link>
        </div>
      </div>
    </div>
  );
}
