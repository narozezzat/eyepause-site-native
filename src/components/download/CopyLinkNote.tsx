"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { noteCard, noteColors, noteSpacing } from "./DownloadButton";

type CopyState = "idle" | "copied" | "failed";

/** Phone and tablet visitors can't install a Mac app here, so offer to carry the link over. */
export function CopyLinkNote() {
  const [copy, setCopy] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyLink() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
    timer.current = setTimeout(() => setCopy("idle"), 2500);
  }

  return (
    <div className={cn(noteCard, noteSpacing, noteColors)}>
      <p className="mb-2.5 text-fg-muted">
        <b className="text-fg">EyePause is a Mac app.</b> You&apos;re on a phone or tablet. Send yourself the link and
        download it on your Mac.
      </p>
      <button
        type="button"
        className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-border px-3.5 text-ui font-medium hover:bg-surface-2 sm:w-auto"
        onClick={copyLink}
      >
        {copy === "copied" ? "Link copied" : "Copy link"}
      </button>
      <span className="sr-only" role="status">
        {copy === "copied" ? "Link copied to clipboard" : copy === "failed" ? "Couldn't copy. Use your browser's share menu instead." : ""}
      </span>
      {copy === "failed" && (
        <p className="mt-2 font-mono text-xs leading-normal text-fg-subtle" aria-hidden="true">
          Couldn&apos;t copy. Use your browser&apos;s share menu instead.
        </p>
      )}
    </div>
  );
}
