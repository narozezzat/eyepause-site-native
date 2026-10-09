"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { BREAK_SECONDS, nextPhase, startPhase, type BreakPhase } from "@/lib/preview";

type Sequence = { phase: BreakPhase; deadline: number };
const WORK: Sequence = { phase: { kind: "work" }, deadline: 0 };
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Wall-clock preview; only visible viewers tick, and autoplay respects motion. */
export function useBreakSequence<T extends Element>(): {
  phase: BreakPhase;
  ref: RefObject<T | null>;
  toggle: () => void;
} {
  const [sequence, setSequence] = useState<Sequence>(WORK);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const autoplayed = useRef(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    let inView = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const tabIsVisible = document.visibilityState === "visible";
      setTabVisible(tabIsVisible);
      if (inView && tabIsVisible && !motion.matches && !autoplayed.current) {
        autoplayed.current = true;
        setSequence(startPhase("headsUp", Date.now()));
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      setVisible(inView);
      sync();
    }, { threshold: 0.4 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const running = sequence.phase.kind === "headsUp" || sequence.phase.kind === "break";
  useEffect(() => {
    if (!running || !visible || !tabVisible) return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      setSequence((current) => {
        const phase = nextPhase(current.phase, now, current.deadline);
        if (phase === current.phase) return current;
        const deadline = current.phase.kind === "headsUp" && phase.kind === "break"
          ? current.deadline + BREAK_SECONDS * 1000
          : current.deadline;
        return { phase, deadline };
      });
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [running, visible, tabVisible]);

  const toggle = useCallback(() => {
    autoplayed.current = true;
    const next = startPhase(reduceMotion() ? "break" : "headsUp", Date.now());
    setSequence((current) => current.phase.kind === "work" || current.phase.kind === "done" ? next : WORK);
  }, []);

  return { phase: sequence.phase, ref, toggle };
}
