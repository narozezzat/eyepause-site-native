"use client";

import { useSyncExternalStore } from "react";
import { detectPlatform, type DetectedPlatform } from "@/lib/platform/detect";

interface NavigatorUAData {
  platform?: string;
}

const subscribe = () => () => {};

let cached: DetectedPlatform | undefined;

function getSnapshot(): DetectedPlatform {
  if (cached === undefined) {
    const nav = navigator as Navigator & { userAgentData?: NavigatorUAData };
    cached = detectPlatform(
      nav.userAgent,
      nav.userAgentData?.platform ?? nav.platform ?? "",
      nav.maxTouchPoints ?? 0,
    );
  }
  return cached;
}

/** Null during prerender and hydration, so server and client HTML always match. */
const getServerSnapshot = (): DetectedPlatform | null => null;

export function useDetectedPlatform(): DetectedPlatform | null {
  return useSyncExternalStore<DetectedPlatform | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
