"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./download.module.css";

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
    <div className={styles.mobile}>
      <p>
        <b>EyePause is a Mac app.</b> You&apos;re on a phone or tablet. Send yourself the link and
        download it on your Mac.
      </p>
      <button type="button" className={styles.ghostBtn} onClick={copyLink}>
        {copy === "copied" ? "Link copied" : "Copy link"}
      </button>
      <span className="visually-hidden" role="status">
        {copy === "copied" ? "Link copied to clipboard" : copy === "failed" ? "Couldn't copy. Use your browser's share menu instead." : ""}
      </span>
      {copy === "failed" && (
        <p className={styles.hint} aria-hidden="true">
          Couldn&apos;t copy. Use your browser&apos;s share menu instead.
        </p>
      )}
    </div>
  );
}
