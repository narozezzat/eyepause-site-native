import { gsap } from "gsap";
import { tiltAngles } from "@/lib/tilt";
import { MOTION } from "./tokens";

/**
 * Eye-comfort motion: settle ease-outs, short travel, no bounce.
 * Built on the motion tokens; shared by the choreography and on-change animations.
 */
export const GENTLE = {
  dur: MOTION.section,
  y: 14,
  x: 12,
  stagger: 0.09,
  scale: 0.985,
  count: 2,
  flip: MOTION.ui * 1.5,
  breathe: 0.9,
  ease: MOTION.settle,
} as const;

export type Kind = "rise" | "slide" | "slide-in" | "depth" | "pop" | "fade";
type Target =
  string | Element | null | undefined | (string | Element | null | undefined)[];

export const nodes = (target: Target): HTMLElement[] =>
  ([] as (string | Element | null | undefined)[])
    .concat(target)
    .flatMap((t) =>
      typeof t === "string"
        ? [...document.querySelectorAll<HTMLElement>(t)]
        : t
          ? [t as HTMLElement]
          : [],
    );

export function vars(kind: Kind, extra: gsap.TweenVars = {}): gsap.TweenVars {
  const v: gsap.TweenVars = {
    opacity: 0,
    duration: GENTLE.dur,
    ease: GENTLE.ease,
    // Only what was animated, so CSS hover transforms keep working afterwards.
    clearProps: "transform,opacity",
  };
  if (kind === "rise") v.y = GENTLE.y;
  if (kind === "slide") v.x = GENTLE.x;
  if (kind === "slide-in") v.x = -GENTLE.x;
  if (kind === "depth")
    Object.assign(v, {
      y: GENTLE.y * 1.3,
      scale: GENTLE.scale,
      transformOrigin: "50% 100%",
      duration: GENTLE.dur * 1.2,
    });
  if (kind === "pop")
    Object.assign(v, {
      y: -GENTLE.y * 0.35,
      scale: 0.97,
      transformOrigin: "50% 0%",
    });
  if (kind === "fade") v.duration = GENTLE.dur * 1.1;
  return Object.assign(v, extra);
}

export const trigger = (el: Target, start = "top 88%"): ScrollTrigger.Vars => ({
  trigger: nodes(el)[0],
  start,
  once: true,
});

export function reveal(
  targets: Target,
  kind: Kind = "rise",
  {
    trigger: trig,
    start,
    ...extra
  }: gsap.TweenVars & { trigger?: Target; start?: string } = {},
) {
  const els = nodes(targets);
  if (!els.length) return null;
  return gsap.from(
    els,
    vars(kind, {
      stagger: GENTLE.stagger,
      scrollTrigger: trigger(trig ?? els[0], start),
      ...extra,
    }),
  );
}

export const formatInt = (v: number) => String(Math.round(v));

/**
 * Counts the text of each target up to the number it already shows. React owns
 * that text, so only the existing text node is rewritten, and the tween stops
 * as soon as React writes a different value into it.
 */
export function count(
  targets: Target,
  {
    from = 0,
    format = formatInt,
    ...extra
  }: gsap.TweenVars & { from?: number; format?: (v: number) => string } = {},
) {
  const texts = nodes(targets)
    .map((el) => el.firstChild)
    .filter((n): n is Text => n?.nodeType === Node.TEXT_NODE);
  if (!texts.length) return gsap.timeline();
  const finals = texts.map((n) => n.nodeValue ?? "");
  const end = parseFloat(finals[0]);
  if (Number.isNaN(end)) return gsap.timeline();
  const proxy = { v: from };
  let painted = "";
  const paint = () => {
    const s = format(proxy.v);
    texts.forEach((n) => {
      if (n.nodeValue !== s) n.nodeValue = s;
    });
    painted = s;
  };
  const tween = gsap.to(proxy, {
    v: end,
    duration: GENTLE.count,
    ease: "power2.out",
    onUpdate() {
      if (painted && texts.some((n) => n.nodeValue !== painted)) {
        tween.kill();
        return;
      }
      paint();
    },
    // A reverted or killed count must never leave a half-way number behind.
    onInterrupt: () => restore(),
    ...extra,
  });
  const restore = () =>
    texts.forEach((n, i) => {
      if (n.nodeValue === painted) n.nodeValue = finals[i];
    });
  // Start from zero right away; scroll-triggered counts sit off-screen until then.
  paint();
  return tween;
}

export function grow(
  targets: Target,
  axis: "x" | "y" = "y",
  extra: gsap.TweenVars = {},
) {
  const prop =
    axis === "y"
      ? { scaleY: 0, transformOrigin: "50% 100%" }
      : { scaleX: 0, transformOrigin: "0% 50%" };
  return gsap.from(nodes(targets), {
    ...prop,
    duration: GENTLE.dur * 1.1,
    ease: "power3.out",
    stagger: GENTLE.stagger * 0.8,
    clearProps: "transform",
    ...extra,
  });
}

export function draw(targets: Target, extra: gsap.TimelineVars = {}) {
  const tl = gsap.timeline(extra);
  nodes(targets).forEach((el, i) => {
    const length =
      Math.ceil((el as unknown as SVGGeometryElement).getTotalLength?.() ?? 0) +
      1;
    // Static SVG styles consume the animated custom property. GSAP owns
    // these styles so matchMedia reversion restores fully visible glyphs.
    gsap.set(el, {
      strokeDasharray: length,
      strokeDashoffset: "var(--draw-offset, 0)",
    });
    tl.fromTo(
      el,
      { "--draw-offset": length },
      {
        "--draw-offset": 0,
        duration: GENTLE.dur * 1.6,
        ease: "power2.inOut",
        clearProps: "strokeDasharray,strokeDashoffset,--draw-offset",
      },
      i * 0.15,
    );
  });
  return tl;
}

/** One slow ambient loop per screen: 4 s in, 6 s out; paused off-screen. */
export function syncBreathing(timeline: gsap.core.Animation, paused: boolean) {
  timeline.paused(paused || !timeline.scrollTrigger?.isActive);
}

export function breathe(target: Target, delay = 0, isPaused: () => boolean = () => false) {
  const el = nodes(target)[0];
  if (!el) return null;
  const tl = gsap.timeline({
    delay,
    repeat: -1,
    paused: true,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "none none none none",
      onToggle: (self) => { if (self.animation) syncBreathing(self.animation, isPaused()); },
      onRefresh: (self) => { if (self.animation) syncBreathing(self.animation, isPaused()); },
    },
  });
  tl.to(el, { opacity: GENTLE.breathe, duration: MOTION.breatheIn, ease: MOTION.breath })
    .to(el, { opacity: 1, duration: MOTION.breatheOut, ease: MOTION.breath });
  syncBreathing(tl, isPaused());
  return tl;
}

/** Flip-clock digits fold in whenever their value changes. Returns a cleanup. */
export function flipOnChange(target: Target) {
  const cleanups = nodes(target).map((el) => {
    let active: gsap.core.Tween | undefined;
    const observer = new MutationObserver(() => {
      active?.kill();
      active = gsap.fromTo(
        el,
        { rotationX: -80, opacity: 0.35, transformPerspective: 500 },
        {
          rotationX: 0,
          opacity: 1,
          duration: GENTLE.flip,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
    });
    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      active?.kill();
      active = undefined;
      gsap.set(el, { clearProps: "transform,opacity" });
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fine-pointer perspective tilt; capability changes flatten and detach it.
 * Register inside the runtime's reduced-motion matchMedia and return its cleanup.
 */
export function tilt(
  target: Target,
  { max = { x: 3, y: 4 }, depth = 14, perspective = 1200, bounds }: {
    max?: { x: number; y: number };
    depth?: number;
    perspective?: number;
    bounds?: Target;
  } = {},
): () => void {
  const el = nodes(target)[0];
  if (!el) return () => {};
  const pointer = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const surface = nodes(bounds)[0] ?? el;
  const layers = [...el.querySelectorAll<HTMLElement>("[data-depth]")];
  let detach = () => {};
  const sync = () => {
    detach();
    detach = () => {};
    if (!pointer.matches) return;
    // Restore inline transforms too, rather than clearing a pre-existing surface.
    const originals = [el, ...layers].map((node) => ({
      node,
      transform: node.style.transform,
      transformStyle: node.style.transformStyle,
      perspective: node.style.perspective,
    }));
    if (depth) layers.forEach((layer) => gsap.set(layer, { z: Number(layer.dataset.depth) * depth }));
    gsap.set(el, { transformPerspective: perspective, transformStyle: depth ? "preserve-3d" : "flat" });
    const rx = gsap.quickTo(el, "rotationX", { duration: MOTION.ui * 1.6, ease: MOTION.settle });
    const ry = gsap.quickTo(el, "rotationY", { duration: MOTION.ui * 1.6, ease: MOTION.settle });
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const angles = tiltAngles({ x: event.clientX, y: event.clientY }, surface.getBoundingClientRect(), max);
        rx(angles.rx);
        ry(angles.ry);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      rx(0);
      ry(0);
    };
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerleave", onLeave);
    surface.addEventListener("pointercancel", onLeave);
    detach = () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerleave", onLeave);
      surface.removeEventListener("pointercancel", onLeave);
      rx.tween.kill();
      ry.tween.kill();
      gsap.set([el, ...layers], { clearProps: "transform,transformStyle,transformPerspective" });
      originals.forEach(({ node, transform, transformStyle, perspective }) => {
        node.style.transform = transform;
        node.style.transformStyle = transformStyle;
        node.style.perspective = perspective;
      });
    };
  };
  pointer.addEventListener("change", sync);
  sync();
  return () => {
    pointer.removeEventListener("change", sync);
    detach();
    detach = () => {};
  };
}

/** Scroll-scrubbed drift, with optional rotateX settling to zero. */
export function parallax(
  target: Target,
  { y = 0, rotateX = 0, trigger: trig, start = "top bottom", end = "bottom top" }: { y?: number; rotateX?: number; trigger?: Target; start?: string; end?: string },
): gsap.core.Tween | null {
  const els = nodes(target);
  if (!els.length) return null;
  return gsap.fromTo(
    els,
    { y: 0, rotationX: rotateX, transformPerspective: 1200 },
    { y, rotationX: 0, ease: "none", scrollTrigger: { trigger: nodes(trig ?? els[0])[0], start, end, scrub: true } },
  );
}

/** Masked heading rise; text remains in the DOM for assistive technology. */
export function lineReveal(target: Target, extra: gsap.TimelineVars = {}): gsap.core.Timeline {
  const tl = gsap.timeline(extra);
  nodes(target).forEach((heading) => {
    const lines = heading.querySelectorAll<HTMLElement>(".line");
    tl.fromTo(
      lines.length ? [...lines] : [heading],
      { yPercent: 100, clipPath: "inset(0 0 100% 0)" },
      { yPercent: 0, clipPath: "inset(0 0 -10% 0)", duration: MOTION.section, ease: MOTION.settle, stagger: 0.09, clearProps: "transform,clipPath" },
      0,
    );
  });
  return tl;
}

/** Animate only changed React-owned character slots; never rewrite their children. */
export function rollDigits(target: Target): () => void {
  const cleanups = nodes(target).map((el) => {
    let previous = [...el.querySelectorAll<HTMLElement>(".menu-digit")].map((slot) => slot.textContent);
    const active = new Map<HTMLElement, gsap.core.Tween>();
    const observer = new MutationObserver(() => {
      const slots = [...el.querySelectorAll<HTMLElement>(".menu-digit")];
      slots.forEach((slot, index) => {
        if (slot.textContent === previous[index]) return;
        active.get(slot)?.kill();
        active.set(slot, gsap.fromTo(slot, { yPercent: 20, opacity: 0.75 }, {
          yPercent: 0, opacity: 1, duration: MOTION.ui, ease: MOTION.settle,
          clearProps: "transform,opacity",
        }));
      });
      previous = slots.map((slot) => slot.textContent);
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    return () => {
      observer.disconnect();
      active.forEach((tween, slot) => {
        tween.kill();
        gsap.set(slot, { clearProps: "transform,opacity" });
      });
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
