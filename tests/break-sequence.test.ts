import { afterEach, beforeEach, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({
  states: [] as unknown[],
  refs: [] as { current: unknown }[],
  effects: [] as { deps: unknown[]; cleanup?: () => void }[],
  pending: [] as (() => void)[],
  callbacks: [] as { callback: unknown; deps: unknown[] }[],
  stateIndex: 0, refIndex: 0, effectIndex: 0, callbackIndex: 0,
}));
vi.mock("react", () => ({
  useState: (initial: unknown) => {
    const index = harness.stateIndex++;
    if (!(index in harness.states)) harness.states[index] = initial;
    return [harness.states[index], (next: unknown) => {
      harness.states[index] = typeof next === "function" ? next(harness.states[index]) : next;
    }];
  },
  useRef: (initial: unknown) => {
    const index = harness.refIndex++;
    return harness.refs[index] ??= { current: initial };
  },
  useCallback: (callback: unknown, deps: unknown[]) => {
    const index = harness.callbackIndex++;
    const previous = harness.callbacks[index];
    if (previous && deps.length === previous.deps.length && deps.every((dep, i) => Object.is(dep, previous.deps[i]))) return previous.callback;
    harness.callbacks[index] = { callback, deps };
    return callback;
  },
  useEffect: (effect: () => (() => void) | undefined, deps: unknown[]) => {
    const index = harness.effectIndex++;
    const previous = harness.effects[index];
    if (previous && deps.every((dep, i) => Object.is(dep, previous.deps[i]))) return;
    harness.pending.push(() => {
      previous?.cleanup?.();
      harness.effects[index] = { deps, cleanup: effect() };
    });
  },
}));
vi.mock("@/lib/preview", async () => import("../src/lib/preview"));
import { useBreakSequence } from "../src/hooks/useBreakSequence";

let intersection: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void;
let visibility: () => void;
let preferenceChange: () => void;
const removeVisibility = vi.fn();
const removePreference = vi.fn();
const disconnect = vi.fn();
let hidden = false;
let reduced = false;
function resetIndices() {
  harness.stateIndex = harness.refIndex = harness.effectIndex = harness.callbackIndex = 0;
}
function mount(ref: { current: Element | null }) {
  ref.current = {} as Element;
}
function Render() {
  resetIndices();
  const result = useBreakSequence<Element>();
  mount(result.ref);
  harness.pending.splice(0).forEach((effect) => effect());
  return result;
}
function view(ratio: number) {
  intersection([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]);
  return Render();
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  hidden = reduced = false;
  harness.states = []; harness.refs = []; harness.effects = []; harness.pending = []; harness.callbacks = [];
  removeVisibility.mockClear(); removePreference.mockClear(); disconnect.mockClear();
  vi.stubGlobal("window", { matchMedia: () => ({ get matches() { return reduced; }, addEventListener: (_: string, callback: () => void) => { preferenceChange = callback; }, removeEventListener: removePreference }) });
  vi.stubGlobal("document", {
    get visibilityState() { return hidden ? "hidden" : "visible"; },
    addEventListener: (_: string, callback: () => void) => { visibility = callback; },
    removeEventListener: removeVisibility,
  });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof intersection) { intersection = callback; }
    observe() {}
    disconnect() { disconnect(); }
  });
});
function unmount() {
  harness.effects.forEach((effect) => effect.cleanup?.());
  harness.effects = [];
}
afterEach(() => {
  unmount();
  expect(vi.getTimerCount()).toBe(0);
  vi.useRealTimers(); vi.unstubAllGlobals();
});
it("requires 40% intersection and a visible tab to autoplay once", () => {
  Render();
  expect(view(0.39).phase.kind).toBe("work");
  hidden = true;
  expect(view(0.4).phase.kind).toBe("work");
  hidden = false; visibility();
  expect(Render().phase.kind).toBe("headsUp");
  Render().toggle();
  expect(view(0).phase.kind).toBe("work");
  expect(view(1).phase.kind).toBe("work");
});
it("suspends the hidden-tab timer and preserves the heads-up handoff deadline", () => {
  Render(); view(1);
  hidden = true; visibility(); Render();
  expect(vi.getTimerCount()).toBe(0);
  vi.setSystemTime(14_000);
  hidden = false; visibility(); Render();
  expect(Render().phase).toEqual({ kind: "break", left: 9 });
  vi.advanceTimersByTime(9_000);
  expect(Render().phase.kind).toBe("done");
  expect(vi.getTimerCount()).toBe(0);
});
it("catches up directly to done after a long absence", () => {
  Render(); view(1); view(0);
  vi.setSystemTime(60_000);
  view(1);
  expect(Render().phase.kind).toBe("done");
});
it("allows a user-started reduced-motion break without autoplay", () => {
  reduced = true;
  Render();
  expect(view(1).phase.kind).toBe("work");
  Render().toggle(); Render();
  expect(Render().phase).toEqual({ kind: "break", left: 20 });
  vi.advanceTimersByTime(20_000);
  expect(Render().phase.kind).toBe("done");
});

it("keeps toggle identity stable while phase and visibility change", () => {
  const toggle = Render().toggle;
  expect(view(1).toggle).toBe(toggle);
  vi.advanceTimersByTime(3_000);
  expect(Render().toggle).toBe(toggle);
  expect(view(0).toggle).toBe(toggle);
  toggle();
  expect(Render().phase.kind).toBe("work");
  expect(Render().toggle).toBe(toggle);
});
it("disconnects the observer, removes exact listeners, and clears the timer on unmount", () => {
  Render(); view(1);
  expect(vi.getTimerCount()).toBe(1);
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(removeVisibility).toHaveBeenCalledExactlyOnceWith("visibilitychange", visibility);
  expect(removePreference).toHaveBeenCalledExactlyOnceWith("change", preferenceChange);
  expect(vi.getTimerCount()).toBe(0);
});
it("reacts to motion preference changes without restarting a consumed autoplay", () => {
  reduced = true;
  Render();
  expect(view(1).phase.kind).toBe("work");
  reduced = false; preferenceChange();
  expect(Render().phase.kind).toBe("headsUp");
  reduced = true; preferenceChange();
  Render();
  vi.advanceTimersByTime(3_000);
  expect(Render().phase).toEqual({ kind: "break", left: 20 });
  Render().toggle();
  expect(Render().phase.kind).toBe("work");
  reduced = false; preferenceChange();
  expect(Render().phase.kind).toBe("work");
});
