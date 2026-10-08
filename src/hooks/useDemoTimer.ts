"use client";

import { useSyncExternalStore } from "react";
import { remainingSeconds } from "@/lib/preview";

export type DemoTimerState = {
  left: number;
  paused: boolean;
  skipped: boolean;
};

export type GlideOptions = { duration?: number; delay?: number; ease?: string };
type Glide = (
  from: number,
  to: number,
  paint: (left: number) => void,
  done: () => void,
  options: GlideOptions,
) => void;

/**
 * A shared, wall-clock demo of the menu bar timer. Every view of it (menu bar,
 * popover ring and readout) reads one store, so they always agree. It ticks at 1 Hz
 * only while someone is watching, the tab is visible and motion is allowed.
 */
export function createDemoTimer(start: number, cycle: number) {
  const initial: DemoTimerState = {
    left: start,
    paused: false,
    skipped: false,
  };
  let state = initial;
  let deadline = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let gliding = false;
  let glideId = 0;
  let glide: Glide | null = null;
  const listeners = new Set<() => void>();
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)");

  const set = (next: Partial<DemoTimerState>) => {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  };

  const stop = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };

  // Wake just after each whole second so the readout never skips a number.
  const schedule = () => {
    timeout = setTimeout(tick, ((deadline - Date.now()) % 1000) + 20);
  };

  function tick() {
    let left = remainingSeconds(deadline, Date.now());
    if (left === 0) {
      left = cycle;
      deadline = Date.now() + cycle * 1000;
    }
    if (left !== state.left) set({ left });
    schedule();
  }

  function sync() {
    const run =
      listeners.size > 0 &&
      !state.paused &&
      !gliding &&
      document.visibilityState === "visible" &&
      !reduce().matches;
    if (run && timeout === undefined) {
      deadline = Date.now() + state.left * 1000;
      schedule();
    } else if (!run) stop();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    if (listeners.size === 1) {
      document.addEventListener("visibilitychange", sync);
      reduce().addEventListener("change", sync);
    }
    sync();
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        document.removeEventListener("visibilitychange", sync);
        reduce().removeEventListener("change", sync);
      }
      sync();
    };
  }

  /** Hand the readout to an animation, e.g. the intro counting down to the start time. */
  function animate(from: number, to: number, options: GlideOptions = {}) {
    stop();
    if (!glide) {
      glideId++;
      gliding = false;
      set({ left: to });
      sync();
      return;
    }
    gliding = true;
    const id = ++glideId;
    glide(
      from,
      to,
      (left) => {
        if (id === glideId && left !== state.left) set({ left });
      },
      () => {
        // A newer glide (a Skip during the intro) owns the readout now.
        if (id !== glideId) return;
        gliding = false;
        set({ left: to });
        sync();
      },
      options,
    );
  }

  return {
    subscribe,
    get: () => state,
    getServer: () => initial,
    start,
    cycle,
    animate,
    setGlide: (fn: Glide | null) => {
      glide = fn;
    },
    togglePause() {
      set({ paused: !state.paused });
      sync();
    },
    skip() {
      set({ paused: false, skipped: true });
      animate(state.left, cycle);
    },
  };
}

export type DemoTimer = ReturnType<typeof createDemoTimer>;

export function useDemoTimer(timer: DemoTimer): DemoTimerState {
  return useSyncExternalStore(timer.subscribe, timer.get, timer.getServer);
}

/** The product shot's timer: 18:42 left of a 20 minute cycle. */
export const heroTimer = createDemoTimer(18 * 60 + 42, 20 * 60);
