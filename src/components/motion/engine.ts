import { gsap } from "gsap";

/**
 * Eye-comfort motion: slow ease-outs, short travel, no bounce or tilt.
 * Shared by the page choreography and by components that animate on change.
 */
export const GENTLE = {
  dur: 1.15,
  y: 14,
  x: 12,
  stagger: 0.1,
  scale: 0.985,
  count: 2,
  flip: 0.6,
  breathe: 0.9,
  ease: "power2.out",
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
    tl.fromTo(
      el,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: GENTLE.dur * 1.6,
        ease: "power2.inOut",
        clearProps: "strokeDasharray,strokeDashoffset",
      },
      i * 0.15,
    );
  });
  return tl;
}

/** One slow ambient loop per screen; it pauses while off-screen. */
export function breathe(target: Target, delay = 0) {
  const el = nodes(target)[0];
  if (!el) return null;
  return gsap.to(el, {
    opacity: GENTLE.breathe,
    duration: 3,
    delay,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause",
    },
  });
}

/** Flip-clock digits fold in whenever their value changes. Returns a cleanup. */
export function flipOnChange(target: Target) {
  const observers = nodes(target).map((el) => {
    const observer = new MutationObserver(() => {
      gsap.fromTo(
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
    return observer;
  });
  return () => observers.forEach((o) => o.disconnect());
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
