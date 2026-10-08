"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

function LinkIcon({ copied }: { copied: boolean }) {
  return (
    <svg
      className="size-4 flex-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {copied ? (
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      ) : (
        <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
      )}
    </svg>
  );
}

/** Copies this page's URL so a phone visitor can open it on their Mac. "Copied" shows for 2s. */
export function CopyLink() {
  const [copy, setCopy] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copyLink() {
    if (timer.current) clearTimeout(timer.current);
    let next: CopyState = "copied";
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
    } catch {
      next = "failed";
    }
    setCopy(next);
    timer.current = setTimeout(() => setCopy("idle"), next === "failed" ? 4000 : 2000);
  }

  return (
    <div>
      <Button variant="secondary" size="lg" fullWidth className="sm:w-auto" icon={<LinkIcon copied={copy === "copied"} />} onClick={copyLink}>
        {copy === "copied" ? "Copied" : "Copy link"}
      </Button>
      <p className="mt-2 min-h-5 text-caption text-fg-subtle" aria-live="polite">
        {copy === "copied" && "Link copied. Paste it on your Mac."}
        {copy === "failed" && "Couldn’t copy. Use your browser’s share menu instead."}
      </p>
    </div>
  );
}
