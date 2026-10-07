"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Decorative looping countdown for the product mock-ups. Ticks once a second,
 * only while `active` and while the element is on screen, so off-screen demos
 * cost nothing.
 */
export function useCountdown<T extends Element>(
  start: number,
  cycle: number,
  active = true,
): [number, RefObject<T | null>] {
  const [seconds, setSeconds] = useState(start);
  const [visible, setVisible] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !visible) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : cycle)), 1000);
    return () => clearInterval(id);
  }, [active, visible, cycle]);

  return [seconds, ref];
}
