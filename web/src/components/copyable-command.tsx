"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// Single-line monospace command + copy-to-clipboard. The wrapper is deliberately
// shrink-safe so long commands cannot widen cards or push neighboring columns.
export function CopyableCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Non-secure context or permission denied: the visible command remains.
    }
  }

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-lg border border-border bg-surface py-1.5 pl-3 pr-1.5 text-muted shadow-sm",
        className,
      )}
    >
      <code className="doc-code min-w-0 flex-1 truncate whitespace-nowrap" title={`$ ${command}`}>
        <span className="text-faint">$</span> {command}
      </code>
      <span
        aria-hidden="true"
        className={cn(
          "hidden shrink-0 text-xs font-medium text-brand transition-opacity duration-200 lg:inline-block",
          copied ? "opacity-100" : "opacity-0",
        )}
      >
        Copied
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy command"}
        title={copied ? "Copied" : "Copy"}
        className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {copied ? (
          <CheckIcon className="size-4 text-brand" aria-hidden="true" />
        ) : (
          <CopyIcon className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
