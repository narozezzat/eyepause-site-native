import type { gsap as GSAP } from "gsap";
import { CustomEase } from "gsap/CustomEase";

/**
 * The site's motion language, in seconds for GSAP. Mirrored as CSS custom
 * properties in globals.css (`--dur-*`, `--ease-*`); tests keep them in step.
 */
export const MOTION = {
  /** Hover, press, focus. */
  micro: 0.18,
  /** State changes and indicator slides. */
  ui: 0.36,
  /** Scroll reveals and line masks. */
  section: 0.75,
  /** Ambient breathing: in, then out. */
  breatheIn: 4,
  breatheOut: 6,
  /** Arrivals. */
  settle: "settle",
  /** State swaps. */
  release: "release",
  /** Ambient loops. */
  breath: "sine.inOut",
} as const;

/** Registers the named eases once; safe to call again. */
export function registerEases(gsap: typeof GSAP) {
  gsap.registerPlugin(CustomEase);
  if (!CustomEase.get(MOTION.settle)) CustomEase.create(MOTION.settle, "0.22,1,0.36,1");
  if (!CustomEase.get(MOTION.release)) CustomEase.create(MOTION.release, "0.65,0,0.35,1");
}
