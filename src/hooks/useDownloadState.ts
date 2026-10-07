"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DownloadState = "idle" | "starting" | "started";

/**
 * Browsers expose no download progress to the page, so "starting" is a short
 * acknowledgement after the click, then "started" reveals install steps.
 */
export function useDownloadState(startingMs = 1100) {
  const [state, setState] = useState<DownloadState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const begin = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setState("starting");
    timer.current = setTimeout(() => setState("started"), startingMs);
  }, [startingMs]);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setState("idle");
  }, []);

  return { state, begin, reset };
}
