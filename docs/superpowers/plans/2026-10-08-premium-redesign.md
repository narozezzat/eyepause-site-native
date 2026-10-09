# EyePause Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the EyePause download site into an editorial, product-led site with a real motion system, purposeful depth and a seven-beat narrative, without changing branding, the download flow or the release logic.

**Architecture:** Evolve in place (Approach A). Tokens and component CSS stay in `src/app/globals.css`, all scroll and intro motion stays in `MotionRuntime.tsx` built from primitives in `motion/engine.ts`, and pure logic (break phases, tilt math, durations) goes in `src/lib` with vitest tests. Four phases, each ending in a full verification and an owner review.

**Tech Stack:** Next.js 16.4 (static export), React 19.3, TypeScript strict, Tailwind CSS 4.3, shadcn/ui on `radix-ui` 1.7, next-themes, GSAP 3.15 + ScrollTrigger, Lenis 1.3, lucide-react, vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-08-premium-redesign-design.md`

## Global Constraints

- **Local only.** No `git commit`, `git push`, PR or deploy until the owner explicitly approves. Each phase ends with a review stop instead of a commit.
- When the owner approves a commit, use Conventional Commits, the owner's identity only, and **no** `Co-Authored-By` trailer or tool branding (owner's global CLAUDE.md overrides the harness reminder).
- No new runtime dependencies. Instrument Serif comes from `next/font/google`. `sheet` comes from `npx shadcn@latest add sheet` and must use the existing `radix-ui` package; if the generator tries to install anything else, stop and ask.
- Tokens only: no hex, rgb or arbitrary colour values in components. Every new colour token gets values in all three theme blocks of `globals.css` (`:root`, `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`, `:root[data-theme="dark"]`).
- rem over px. px only for borders, hairlines, outlines, shadows, transforms and media queries.
- Motion durations: micro 180 ms, ui 360 ms, section 750 ms, ambient 4 s in / 6 s out; easings settle `cubic-bezier(.22,1,.36,1)`, release `cubic-bezier(.65,0,.35,1)`, breath `sine.inOut`.
- Animate only `transform`, `opacity`, `clip-path` and CSS custom properties. All GSAP motion is registered inside the existing `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` block.
- Untouched: `src/lib/releases/*`, `src/lib/platform/*`, `src/lib/theme.ts`, `src/data/release.json`, `useDownloadState`, theme provider and toggle logic.
- Anchors `#details`, `#download` and `#watch` keep their ids. New anchors: `#product`, `#habit`.
- The Watch section (`Watch.tsx` + `PromoVideo.tsx`, added after the spec) is an unnumbered interlude between the hero and the Problem beat. Its behaviour stays exactly as shipped: EN / Arabic cuts, Arabic-language browsers start on Arabic, a mid-play language switch keeps playing, and nothing loads until play (`preload="none"`). Only its styling and motion change (Tasks 3 and 9A). Never re-encode, rename or move `public/video/*`.
- Copy: existing copy is unchanged unless this plan quotes new copy. No GitHub, source or open-source links.
- Lucide icons for UI; custom SVG only for brand marks, mock-ups and the rule-strip glyphs.
- `focus({ preventScroll: true })` for every programmatic focus.
- Definition of done per task: `npm run lint && npm run typecheck && npm test && npm run build` pass with no new warnings.

## Review Focus

- **Reduced motion with JS on:** `html[data-motion]` never stays `pending`, every section renders its final state (Problem shows full glare and `00:47:12`, Experience shows the idle break screen, Product shows all rows undimmed). Pinned by the reduced-motion screenshot pass in Task 18 and the `final-state` assertions in Task 13 and Task 14.
- **320 px width:** nothing overflows sideways; the hero scene, the Problem stage, the 84 numeral and the platform picker fit. Pinned by the overflow script in Task 18, run at the end of every phase.
- **Background tab during the break preview:** returning after the deadline lands in the correct phase (never a negative or stuck clock). Pinned by the `nextPhase` catch-up tests in Task 10.
- **Keyboard and screen reader on the new nav sheet:** focus is trapped, Escape closes, focus returns to the menu button, and links scroll to their section. Pinned by the keyboard steps in Task 5.
- **Tilt on touch or coarse pointers:** no tilt listener is attached and no transform is left behind. Pinned by the `tiltAngles` clamp tests in Task 4 and the media-query guard check in Task 7.

---

## File map

| File | Responsibility | Tasks |
|---|---|---|
| `src/components/motion/tokens.ts` (new) | Motion durations and easings in seconds for GSAP | 1 |
| `tests/tokens.test.ts` (new) | Motion tokens mirror CSS; colour tokens exist in all themes | 1, 2 |
| `src/app/globals.css` | Tokens, type tier, all component CSS | 1–9, 9A, 12–17 |
| `src/app/layout.tsx` | Instrument Serif font | 2 |
| `src/lib/tilt.ts` (new) + `tests/tilt.test.ts` | Pointer → clamped rotation math | 4 |
| `src/components/motion/engine.ts` | `lineReveal`, `tilt`, `parallax`, retuned `breathe`, `rollDigits` | 4, 8 |
| `src/config/site.ts` | `sections` nav list | 5 |
| `src/components/ui/sheet.tsx` (new, shadcn) | Mobile nav sheet | 5 |
| `src/components/layout/Header.tsx`, `MobileNav.tsx` (new) | Nav, indicator, sheet | 5 |
| `src/components/sections/Hero.tsx`, `ProductShot.tsx` | Hero composition, depth layers, live details | 6–9 |
| `src/components/sections/Watch.tsx`, `PromoVideo.tsx` | Video interlude: editorial header, glass-free player chrome | 3, 9A |
| `src/lib/preview.ts` + `tests/preview.test.ts` | `BreakPhase`, `nextPhase`, labels, `formatDuration` | 10, 13 |
| `src/hooks/useBreakSequence.ts` (new) | Drives break phases on wall clock | 11 |
| `src/components/sections/BreakPreview.tsx`, `Tour.tsx` | Experience + hinge | 12 |
| `src/components/sections/Problem.tsx` (new) | Problem beat | 13 |
| `src/components/sections/ProductDetails.tsx` (new) | Product beat; replaces `Features.tsx` | 14 |
| `src/components/sections/TourScreens.tsx` | Mock screens; hooks for live states; `HeadsUpScreen` deleted | 14, 15 |
| `src/components/sections/Specs.tsx` | Insights beat | 15 |
| `src/components/sections/Download.tsx`, `download/PlatformPicker.tsx`, `download/DownloadButton.tsx` | Download visuals only | 16 |
| `src/components/layout/Footer.tsx` | Footer | 17 |
| `src/app/page.tsx` | Beat order (Hero → Watch → Problem → Tour → …) | 13, 14 |
| `src/components/motion/MotionRuntime.tsx` | All choreography | 5, 7–9, 9A, 12–16 |
| scratchpad `shot.mjs`, `overflow.mjs` | Screenshots and overflow check | 18 (used every phase) |

**Verification helper (used at every phase end).** The scratchpad holds `shot.mjs` (Playwright, cached Chromium at `~/Library/Caches/ms-playwright/chromium_headless_shell-1234/...`) and baseline shots in `scratchpad/base/`. Serve the build with `npx serve out -l 4173` (restart after each build). Task 18 Step 1 extends it to all widths and adds the overflow check; run that step first if you want the full harness from Phase 1 onward.

---

# Phase 1 — Foundations

### Task 1: Motion tokens (TS + CSS)

**Files:**
- Create: `src/components/motion/tokens.ts`
- Create: `tests/tokens.test.ts`
- Modify: `src/app/globals.css` (`@theme` block near line 46; `@layer base :root` near line 119)
- Modify: `src/components/motion/engine.ts:7-17` (`GENTLE`)

**Interfaces:**
- Produces: `MOTION = { micro: 0.18, ui: 0.36, section: 0.75, breatheIn: 4, breatheOut: 6, settle: "settle", release: "release", breath: "sine.inOut" }`, `registerEases(gsap)`; CSS vars `--dur-micro`, `--dur-ui`, `--dur-section`, `--ease-settle`, `--ease-release`.

- [x] **Step 1: Write the failing test**

```ts
// tests/tokens.test.ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MOTION } from "../src/components/motion/tokens";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const cssVar = (name: string) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();

describe("motion tokens", () => {
  it("mirror the CSS custom properties", () => {
    expect(cssVar("--dur-micro")).toBe(`${MOTION.micro * 1000}ms`);
    expect(cssVar("--dur-ui")).toBe(`${MOTION.ui * 1000}ms`);
    expect(cssVar("--dur-section")).toBe(`${MOTION.section * 1000}ms`);
    expect(cssVar("--ease-settle")).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    expect(cssVar("--ease-release")).toBe("cubic-bezier(0.65, 0, 0.35, 1)");
  });
  it("stay inside the tier ranges", () => {
    expect(MOTION.micro).toBeGreaterThanOrEqual(0.15);
    expect(MOTION.micro).toBeLessThanOrEqual(0.25);
    expect(MOTION.ui).toBeGreaterThanOrEqual(0.25);
    expect(MOTION.ui).toBeLessThanOrEqual(0.45);
    expect(MOTION.section).toBeGreaterThanOrEqual(0.5);
    expect(MOTION.section).toBeLessThanOrEqual(0.9);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/tokens.test.ts`
Expected: FAIL, `Failed to resolve import "../src/components/motion/tokens"`.

- [x] **Step 3: Write the tokens module**

```ts
// src/components/motion/tokens.ts
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
```

`CustomEase` ships inside the `gsap` package (free since 3.13); it is not a new dependency.

- [x] **Step 4: Add the CSS mirror**

In `globals.css` `@theme { … }` replace the `--ease-out` line with:

```css
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-release: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 180ms;
  --dur-ui: 360ms;
  --dur-section: 750ms;
```

Remove the duplicate `--ease-out: cubic-bezier(0.22, 1, 0.36, 1);` line inside `@layer base :root` (it is already defined in `@theme`; Tailwind emits `@theme` values on `:root`).

Append to the end of `globals.css`, after the Lenis block:

```css
/* Reduced motion: transitions become short crossfades. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 120ms !important;
    transition-property: opacity, color, background-color, border-color !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [x] **Step 5: Re-express `GENTLE` in tokens**

In `engine.ts`, import and use the tokens; values change only where the spec tiers require (reveals move from 1.15 s to the section tier). Keep every key so existing callers compile:

```ts
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
```

In `MotionRuntime.tsx`, right after `gsap.registerPlugin(ScrollTrigger);` add `registerEases(gsap);` and import it from `./tokens`.

- [ ] **Step 6: Run tests and the full check**

Run: `npx vitest run tests/tokens.test.ts` → PASS.
Run: `npm run lint && npm run typecheck && npm test && npm run build` → all pass.

- [x] **Step 7: Checkpoint (no commit)**

`git status` shows only the files above plus `docs/`. Do not commit.

---

### Task 2: Serif display, label tier, colour aliases

**Files:**
- Modify: `src/app/layout.tsx:2,9-19,45-48`
- Modify: `src/app/globals.css` (`@theme inline`, `@theme`, the three theme blocks)
- Modify: `tests/tokens.test.ts`

**Interfaces:**
- Produces: CSS `--font-display` (Tailwind `font-display`), `--text-label` (Tailwind `text-label`), `--tracking-label: 0.14em`, colour tokens `--ink`, `--paper`, `--rest`, `--rest-text`, `--strain`, `--strain-glare` with Tailwind colours `ink`, `paper`, `rest`, `rest-text`, `strain`, `strain-glare`; utility class `.label` (mono, uppercase, 0.14em).

- [x] **Step 1: Write the failing test** (append to `tests/tokens.test.ts`)

```ts
/** The body of each theme block, so a token can be checked per theme. */
function block(selector: string) {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`missing ${selector}`);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i);
  }
  throw new Error(`unclosed ${selector}`);
}

describe("colour tokens", () => {
  const light = block("@layer base {");
  const system = block(":root:not([data-theme=\"light\"])");
  const dark = block(":root[data-theme=\"dark\"]");
  const themed = ["--strain", "--strain-glare"];
  const aliases = ["--ink", "--paper", "--rest", "--rest-text"];

  it.each(themed)("%s has a value in light, system dark and dark", (name) => {
    for (const b of [light, system, dark]) expect(b).toMatch(new RegExp(`${name}:\\s*[^;]+;`));
  });
  it.each(aliases)("%s aliases an existing token", (name) => {
    expect(light).toMatch(new RegExp(`${name}:\\s*var\\(--[a-z-]+\\);`));
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/tokens.test.ts`
Expected: FAIL on `--strain has a value in light…`.

- [x] **Step 3: Add the tokens**

In `@layer base :root` (after `--accent-text`):

```css
    /* Semantic roles. Rest is the product's colour for a break; strain is the Problem beat only. */
    --ink: var(--fg);
    --paper: var(--bg);
    --rest: var(--accent);
    --rest-text: var(--accent-text);
    --strain: #8a8580;
    --strain-glare: #f3efe6;
```

In both dark blocks (`:root:not([data-theme="light"])` and `:root[data-theme="dark"]`):

```css
      --strain: #6f6a64;
      --strain-glare: #2a2824;
```

Contrast check: `--strain` is decorative only (lines and the gradient start), never body text. The Problem counter uses `--fg-muted`.

In `@theme inline` add:

```css
  --color-ink: var(--ink);
  --color-paper: var(--paper);
  --color-rest: var(--rest);
  --color-rest-text: var(--rest-text);
  --color-strain: var(--strain);
  --color-strain-glare: var(--strain-glare);
  --font-display: var(--font-serif), "Iowan Old Style", Georgia, serif;
```

In `@theme` (type scale) add:

```css
  --text-label: 0.6875rem;
  --text-label--line-height: 1.4;
  --tracking-label: 0.14em;
```

At the end of `@layer base` add the shared label and serif rules:

```css
  /* Mono label tier: eyebrows, section indices, mock-up captions. */
  .label {
    font: 500 var(--text-label) / 1.4 var(--mono);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--fg-subtle);
  }
  .serif {
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  /* Plain mono facts separated by a middle dot; replaces pill chips. */
  .facts {
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font: 500 var(--text-label) / 1.6 var(--mono);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--fg-muted);
  }
  .facts li + li::before {
    content: "·";
    margin-right: 0.75rem;
    color: var(--fg-subtle);
  }
```

- [x] **Step 4: Load the font**

In `layout.tsx`:

```tsx
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
// …
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
// …
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
```

- [ ] **Step 5: Run tests and the full check**

Run: `npm run lint && npm run typecheck && npm test && npm run build` → all pass. `out/_next/static/media` contains the Instrument Serif woff2 files.

- [x] **Step 6: Checkpoint (no commit)**

---

### Task 3: Remove glows, pills and card chrome

**Files:**
- Modify: `src/app/globals.css` (polish layer, lines ~1820–2620)
- Modify: `src/components/sections/Hero.tsx:30-41`, `Download.tsx:24-37`, `Specs.tsx:111-114`

**Interfaces:**
- Consumes: `.facts`, `.label` from Task 2.
- Produces: no gradients left on the page except the strain → rest one added in Task 12.

- [ ] **Step 1: Capture the "before" set**

Run: `npm run build && (npx serve out -l 4173 &) && node $SCRATCH/shot.mjs $SCRATCH/p1-before 375,1440` where `$SCRATCH=/private/tmp/claude-501/-Users-narozfahmy-Desktop-projects-eyepause-site-native/02b5ff1e-a18e-489e-92bb-2854853e2618/scratchpad`.

- [x] **Step 2: Delete the glow and pill rules**

Delete these whole rule blocks from the polish layer (selectors from `awk` index; confirm each before deleting):
- `.hero-intro::before` (aurora) and its `@media` overrides at ~2169.
- `.hero-cta::before`, `.hero-cta:hover::before` (light sweep) and their reduced-motion/forced-colours overrides at ~2188–2197.
- `.hero-action .assurances`, `.hero-action .assurances li`, `li + li`, `li + li::before`, `svg`, and the base `.assurances`, `.assurances li`, `.assurances svg` (1955–2016).
- `.download-panel` gradient border (2018–2033), `.download-intro::after` concentric rings (2046–2064), `.download-assurances` (2082).
- `.rule` radial background (2361–2368: keep only `border-block: 1px solid var(--border)` as the replacement body).
- `.sub-feature`, `.sub-feature::before` (2402–2418).
- `.break-screen` radial backgrounds (2431–2440: keep `background: var(--ov-bg)`).
- `.feature-band` (2497–2502), `.stats-window` radial (2527–2534), `.chart*` (2541–2570), `.privacy`, `.privacy svg` (2571–2587 and the base ones at 1086–1100).
- `.download-controls .native-download-action::before` sweep and hover (2661–2687) plus its reduced-motion entry.
- Watch (promo block, after `.promo-meta span + span::before`): delete `.promo-stage::before` (accent glow) and `.promo-play:hover` (backdrop change). In `.promo-play` delete `backdrop-filter` and `transition`, and replace the radial `background` with the flat scrim `background: color-mix(in oklab, var(--ov-bg) 30%, transparent);`. In `.promo-play-label` delete `padding`, `border-radius`, `background` and `backdrop-filter` (the pill). In `.promo-play-icon` delete `box-shadow`. Delete the `animation` line of `.promo-play-icon::after` and the `@keyframes promo-ring` block, and remove `.promo-play-icon::after` from the reduced-motion block (the ring stays as a static hairline; the hero ring owns the page's one ambient loop). In the native `.promo-window` override add `box-shadow: none;`.
- Base-layer `.eyebrow` pill styles (472) become:

```css
  .eyebrow {
    font: 500 var(--text-label) / 1.4 var(--mono);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--fg-subtle);
    margin-bottom: 1.5rem;
  }
```

- Keep `main { overflow-x: clip }` (1827); the full-bleed `.horizon` in Task 12 relies on it.

- [x] **Step 3: Markup: pills → facts**

`Hero.tsx`, replace the `ul.assurances` and drop the `Check` import:

```tsx
            <ul className="facts">
              <li>Free</li>
              <li>Always local</li>
            </ul>
```

`Download.tsx`, replace `ul.assurances.download-assurances` and drop the three icon imports:

```tsx
          <ul className="facts">
            <li>100% local</li>
            <li>No account</li>
            <li>No telemetry</li>
          </ul>
```

`Specs.tsx`, replace `.privacy` (and its `Lock` import):

```tsx
        <p className="label">Your history stays on your Mac.</p>
```

- [ ] **Step 4: Verify**

Run: `grep -n "radial-gradient\|repeating-" src/app/globals.css` → only the heatmap/scrollbar-free results remain (expected: none, or only inside `.timer-face` if used for the ring track; list any survivor and justify it in the phase report).
Run: `npm run lint && npm run typecheck && npm test && npm run build` → pass.
Screenshot 375/1440 light+dark; sections now sit on the page background; no section shows a glow.

- [x] **Step 5: Checkpoint (no commit)**

---

### Task 4: Engine primitives: tilt math, `tilt`, `parallax`, `lineReveal`, `breathe`

**Files:**
- Create: `src/lib/tilt.ts`, `tests/tilt.test.ts`
- Modify: `src/components/motion/engine.ts`

**Interfaces:**
- Produces (lib): `tiltAngles(point: {x:number;y:number}, rect: {left:number;top:number;width:number;height:number}, max: {x:number;y:number}): {rx:number; ry:number}`.
- Produces (engine): `tilt(target: Target, opts?: { max?: {x:number;y:number}; depth?: number }): () => void`, `parallax(target: Target, opts: { y?: number; rotateX?: number; trigger?: Target; start?: string; end?: string }): gsap.core.Tween | null`, `lineReveal(target: Target, extra?: gsap.TimelineVars): gsap.core.Timeline`, `breathe(target, delay?)` (same signature, new cadence).

- [x] **Step 1: Write the failing test**

```ts
// tests/tilt.test.ts
import { describe, expect, it } from "vitest";
import { tiltAngles } from "../src/lib/tilt";

const rect = { left: 100, top: 100, width: 200, height: 100 };
const max = { x: 3, y: 4 };

describe("tilt angles", () => {
  it("is flat at the centre", () => {
    expect(tiltAngles({ x: 200, y: 150 }, rect, max)).toEqual({ rx: 0, ry: 0 });
  });
  it("leans toward the pointer at the corners", () => {
    // Top-left: the top edge tips toward the viewer, the left edge comes forward.
    expect(tiltAngles({ x: 100, y: 100 }, rect, max)).toEqual({ rx: 3, ry: -4 });
    expect(tiltAngles({ x: 300, y: 200 }, rect, max)).toEqual({ rx: -3, ry: 4 });
  });
  it("clamps a pointer outside the element", () => {
    expect(tiltAngles({ x: 9999, y: -9999 }, rect, max)).toEqual({ rx: 3, ry: 4 });
  });
  it("never divides by a zero-sized rect", () => {
    expect(tiltAngles({ x: 0, y: 0 }, { left: 0, top: 0, width: 0, height: 0 }, max)).toEqual({ rx: 0, ry: 0 });
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/tilt.test.ts` → FAIL, cannot resolve `../src/lib/tilt`.

- [x] **Step 3: Implement**

```ts
// src/lib/tilt.ts
type Point = { x: number; y: number };
type Rect = { left: number; top: number; width: number; height: number };

const clamp = (v: number) => Math.min(1, Math.max(-1, v));
/** Avoids -0 so callers and tests see a plain 0. */
const round = (v: number) => Math.round(v * 100) / 100 + 0;

/**
 * Rotation for a pointer over an element: -1…1 across each axis, scaled to `max`
 * degrees. rotateX tips the top edge toward the pointer; rotateY turns toward it.
 */
export function tiltAngles(point: Point, rect: Rect, max: Point): { rx: number; ry: number } {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp(((point.x - rect.left) / rect.width) * 2 - 1);
  const ny = clamp(((point.y - rect.top) / rect.height) * 2 - 1);
  return { rx: round(-ny * max.x), ry: round(nx * max.y) };
}
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/tilt.test.ts` → PASS.

- [x] **Step 5: Engine primitives**

Append to `engine.ts` (import `tiltAngles` from `@/lib/tilt` and `MOTION` from `./tokens`):

```ts
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Pointer-driven perspective tilt. Children with `data-depth="n"` sit n × depth
 * px forward. Fine pointers only; returns a cleanup that flattens the element.
 */
export function tilt(target: Target, { max = { x: 3, y: 4 }, depth = 14 }: { max?: { x: number; y: number }; depth?: number } = {}) {
  const el = nodes(target)[0];
  if (!el || !finePointer()) return () => {};
  const layers = [...el.querySelectorAll<HTMLElement>("[data-depth]")];
  layers.forEach((l) => gsap.set(l, { z: Number(l.dataset.depth) * depth }));
  gsap.set(el, { transformPerspective: 1200, transformStyle: "preserve-3d" });
  const rx = gsap.quickTo(el, "rotationX", { duration: MOTION.ui * 1.6, ease: MOTION.settle });
  const ry = gsap.quickTo(el, "rotationY", { duration: MOTION.ui * 1.6, ease: MOTION.settle });
  let frame = 0;
  const onMove = (e: PointerEvent) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const a = tiltAngles({ x: e.clientX, y: e.clientY }, el.getBoundingClientRect(), max);
      rx(a.rx);
      ry(a.ry);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame);
    rx(0);
    ry(0);
  };
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  return () => {
    cancelAnimationFrame(frame);
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    gsap.set([el, ...layers], { clearProps: "transform,transformStyle,transformPerspective" });
  };
}

/** Scroll-scrubbed drift: translateY and an optional rotateX that settles to 0. */
export function parallax(
  target: Target,
  { y = 0, rotateX = 0, trigger: trig, start = "top bottom", end = "bottom top" }: { y?: number; rotateX?: number; trigger?: Target; start?: string; end?: string },
) {
  const els = nodes(target);
  if (!els.length) return null;
  return gsap.fromTo(
    els,
    { y: 0, rotationX: rotateX, transformPerspective: 1200 },
    { y, rotationX: 0, ease: "none", scrollTrigger: { trigger: nodes(trig ?? els[0])[0], start, end, scrub: true } },
  );
}

/**
 * Masked line rise for headings. Each `.line` child (or the element itself) rises
 * 100% inside a clip-path; the text stays in the DOM for assistive technology.
 */
export function lineReveal(target: Target, extra: gsap.TimelineVars = {}) {
  const tl = gsap.timeline(extra);
  nodes(target).forEach((heading) => {
    const lines = heading.querySelectorAll<HTMLElement>(".line");
    const parts = lines.length ? [...lines] : [heading];
    tl.fromTo(
      parts,
      { yPercent: 100, clipPath: "inset(0 0 100% 0)" },
      {
        yPercent: 0,
        clipPath: "inset(0 0 -10% 0)",
        duration: MOTION.section,
        ease: MOTION.settle,
        stagger: 0.09,
        clearProps: "transform,clipPath",
      },
      0,
    );
  });
  return tl;
}
```

Replace the body of `breathe` (keep signature and doc comment, update it to "4 s in, 6 s out"):

```ts
export function breathe(target: Target, delay = 0) {
  const el = nodes(target)[0];
  if (!el) return null;
  const tl = gsap.timeline({
    delay,
    repeat: -1,
    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
  });
  tl.to(el, { opacity: GENTLE.breathe, duration: MOTION.breatheIn, ease: MOTION.breath })
    .to(el, { opacity: 1, duration: MOTION.breatheOut, ease: MOTION.breath });
  return tl;
}
```

`.line` spans need `display: block` (added in Task 6 CSS).

- [ ] **Step 6: Full check**

Run: `npm run lint && npm run typecheck && npm test && npm run build` → pass. Existing hero ring still breathes (screenshot at 1440 after 6 s is not needed; check visually in `npm run dev`).

- [x] **Step 7: Checkpoint (no commit)**

---

### Task 5: Navigation: section links, sliding indicator, compact header, mobile sheet

**Files:**
- Modify: `src/config/site.ts` (add `sections`)
- Create: `src/components/ui/sheet.tsx` via `npx shadcn@latest add sheet`
- Create: `src/components/layout/MobileNav.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/motion/MotionRuntime.tsx`
- Modify: `src/app/globals.css` (header block ~2312; 700px block)

**Interfaces:**
- Produces: `sections` (each `{ id, index, label }`) in `src/config/site.ts`. Header links carry `data-nav="<id>"`; the indicator is `.nav-indicator` driven by CSS vars `--nav-x`, `--nav-w` (px numbers set by JS on `.nav-links`). Anchors `#product`, `#habit` are created in Tasks 14 and 15; until then the links scroll nowhere (acceptable mid-plan; the overflow/keyboard pass happens after Task 15 for them).

- [ ] **Step 1: Add the sheet primitive**

Run: `npx shadcn@latest add sheet`
Expected: creates `src/components/ui/sheet.tsx` importing `Dialog as SheetPrimitive` from `radix-ui`. Check `git diff package.json` is empty; if not, revert and stop. Adapt its classes to tokens: replace `bg-background` → `bg-bg`, `text-foreground` → `text-fg`, `border` defaults → `border-border`, overlay `bg-black/50` → `bg-[color-mix(in_srgb,var(--color-fg)_35%,transparent)]` (token-based, not a hex); keep `data-slot` and structure. Replace its slide animations with a clip-path reveal class `sheet-content` (CSS below). Add `data-lenis-prevent` to `SheetContent`.

- [x] **Step 2: Nav config**

In `src/config/site.ts`:

```ts
/** The story's beats that the header links to, in page order. */
export const sections = [
  { id: "details", index: "02", label: "The pause" },
  { id: "product", index: "04", label: "The details" },
  { id: "habit", index: "05", label: "The habit" },
] as const satisfies readonly { id: string; index: string; label: string }[];
```

- [x] **Step 3: Header**

```tsx
// src/components/layout/Header.tsx
import { ArrowDownToLine } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { sections } from "@/config/site";
import { MobileNav } from "./MobileNav";

export function Header({ home = "#main" }: { home?: string }) {
  const to = (hash: string) => (home === "#main" ? hash : `${home}${hash}`);
  return (
    <header className="header">
      <nav className="wrap nav" aria-label="Main navigation">
        <a className="brand" href={home} aria-label="EyePause home">
          <span className="logo">
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
          </span>
          EyePause
        </a>
        <div className="nav-right">
          <div className="nav-links">
            {sections.map((s) => (
              <a key={s.id} className="nav-link" data-nav={s.id} href={to(`#${s.id}`)}>
                {s.label}
              </a>
            ))}
            <span className="nav-indicator" aria-hidden="true" />
          </div>
          <ThemeToggle />
          <a className="nav-download" href={to("#download")}>
            Download
            <ArrowDownToLine aria-hidden="true" />
          </a>
          <MobileNav links={sections.map((s) => ({ href: to(`#${s.id}`), index: s.index, label: s.label }))} />
        </div>
      </nav>
    </header>
  );
}
```

- [x] **Step 4: Mobile sheet**

```tsx
// src/components/layout/MobileNav.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Under 640px the section links live in a sheet: focus trapped, Escape closes, focus returns. */
export function MobileNav({ links }: { links: { href: string; index: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="nav-menu" aria-label="Open sections menu">
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="top" className="sheet-content" aria-describedby={undefined}>
        <SheetTitle className="label">Sections</SheetTitle>
        <ul className="sheet-links">
          {links.map((l) => (
            <li key={l.href}>
              {/* Closing first lets the anchor handler scroll the page once the dialog has unlocked it. */}
              <SheetClose asChild>
                <a href={l.href}>
                  <span className="label">{l.index}</span>
                  {l.label}
                </a>
              </SheetClose>
            </li>
          ))}
        </ul>
        <SheetClose className="sheet-close" aria-label="Close sections menu">
          <X aria-hidden="true" />
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
```

Index numbers come from the beat table via `sections[].index`. If the sheet's own `SheetContent` renders a close button, pass `showCloseButton={false}` (the current shadcn template supports it) and keep the one above.

- [x] **Step 5: Indicator and compact header in MotionRuntime**

Add inside the reduced-motion block, after `choreograph()`:

```ts
      const stopNav = navIndicator();
```

and in its cleanup `stopNav();`. Define above `MotionRuntime`:

```ts
/** Slides the header underline to the beat in view. Transform-only; hidden when no beat is active. */
function navIndicator() {
  const bar = document.querySelector<HTMLElement>(".nav-links");
  if (!bar) return () => {};
  const triggers = nodes("[data-nav]").flatMap((link) => {
    const section = document.getElementById(link.dataset.nav ?? "");
    if (!section) return [];
    const activate = () => {
      bar.style.setProperty("--nav-x", `${link.offsetLeft}px`);
      bar.style.setProperty("--nav-w", `${link.offsetWidth}`);
      bar.dataset.active = link.dataset.nav;
      nodes("[data-nav]").forEach((l) =>
        l === link ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current"),
      );
    };
    return [
      ScrollTrigger.create({
        trigger: section,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => (self.isActive ? activate() : bar.dataset.active === link.dataset.nav && delete bar.dataset.active),
      }),
    ];
  });
  return () => triggers.forEach((t) => t.kill());
}
```

- [x] **Step 6: CSS**

Replace the `.nav-link::after` / `:hover::after` rules (2327–2341) and add:

```css
.nav-links {
  position: relative;
  display: flex;
  gap: 1.5rem;
}
.nav-link {
  color: var(--fg-muted);
  transition: color var(--dur-micro) var(--ease-settle);
}
.nav-link:hover,
.nav-link[aria-current] {
  color: var(--fg);
}
.nav-indicator {
  position: absolute;
  left: 0;
  bottom: 0.5rem;
  width: 1px;
  height: 1px;
  background: var(--ink);
  transform-origin: 0 50%;
  transform: translateX(var(--nav-x, 0)) scaleX(var(--nav-w, 0));
  opacity: 0;
  transition:
    transform var(--dur-ui) var(--ease-settle),
    opacity var(--dur-micro) linear;
}
.nav-links[data-active] .nav-indicator {
  opacity: 1;
}
/* Compact on scroll: the row tightens by transform, so nothing reflows. */
.header .nav {
  transition: transform var(--dur-ui) var(--ease-settle);
}
html[data-scrolled] .header .nav {
  transform: translateY(-0.25rem);
}
.nav-menu {
  display: none;
}
@media (max-width: 639px) {
  .nav-links {
    display: none;
  }
  .nav-menu {
    display: inline-grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border: 0;
    background: transparent;
  }
}
/* Keyframes, not a transition: Radix keeps a closing dialog mounted only while an animation runs. */
@keyframes sheet-in { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes sheet-out { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 0 100% 0); } }
.sheet-content {
  background: var(--paper);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem;
}
.sheet-content[data-state="open"] { animation: sheet-in var(--dur-ui) var(--ease-settle); }
.sheet-content[data-state="closed"] { animation: sheet-out var(--dur-micro) var(--ease-release); }
.sheet-links {
  display: grid;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}
.sheet-links a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  min-height: 3rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border);
  font: 400 var(--text-title) / 1.2 var(--font-display);
}
.sheet-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 3rem;
  height: 3rem;
  border: 0;
  background: transparent;
}
```

Remove the old `.nav-link { display: none }` from the base-layer 700px block (the 639px rule replaces it).

- [ ] **Step 7: Keyboard check (pins Review Focus #4)**

`npm run build`, serve, at 375 px wide: Tab to the menu button → Enter opens; Tab cycles only inside the sheet; Escape closes and focus is back on the menu button; reopen, Enter on "The pause" closes the sheet and the page scrolls to `#details` with focus on the section. At 1440: links show, the underline slides as you scroll through `#details`.

- [ ] **Step 8: Full check, phase screenshots, review stop**

Run: `npm run lint && npm run typecheck && npm test && npm run build` (paste output). Screenshots 375/768/1440 light+dark into `$SCRATCH/p1`. Run the overflow check (Task 18 Step 1 script). **Stop: ask the owner to review Phase 1. No commit unless approved.**

---

# Phase 2 — Hero

### Task 6: Hero composition and type

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/app/globals.css` (hero base rules near `.hero-intro`, polish 1820–1950, 900/700px blocks)

**Interfaces:**
- Produces: `.grid-12` utility; heading lines as `.line` spans (consumed by `lineReveal`).

- [x] **Step 1: Markup**

Replace the `.hero-intro` block in `Hero.tsx`:

```tsx
      <div className="hero-intro grid-12">
        <div className="hero-head">
          <p className="eyebrow">EyePause for macOS — 01</p>
          <h1 id="hero-title">
            <span className="line">In your menu bar.</span>
            <span className="line accent-line serif">On your side.</span>
          </h1>
        </div>
        <div className="intro-right">
          <p className="lede">
            <span className="lede-lead">A small reminder to look away.</span>
            <br />
            EyePause makes the 20–20–20 rule part of your day on Mac.
          </p>
          <div className="hero-action">
            <a className="btn hero-cta" href="#download">
              Get EyePause for Mac
              <ArrowDownToLine aria-hidden="true" />
            </a>
            <ul className="facts">
              <li>Free</li>
              <li>Always local</li>
            </ul>
          </div>
        </div>
      </div>
```

The `<br />` between headline lines is replaced by block `.line` spans; screen readers still read one sentence pair. Remove the `.status-dot` from the eyebrow and its `.hero .status-dot` CSS.

- [x] **Step 2: CSS**

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1.5rem;
}
.line {
  display: block;
}
.hero-intro {
  align-items: end;
  row-gap: 2rem;
}
.hero-head {
  grid-column: 1 / span 7;
}
.intro-right {
  grid-column: 8 / -1;
  padding-bottom: 0.5rem;
}
.hero h1 {
  font-size: var(--text-display);
  line-height: var(--text-display--line-height);
}
.accent-line.serif {
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--rest-text);
  /* Serif italics sit optically smaller; nudge them up to match Geist's cap height. */
  font-size: 1.08em;
}
.hero-cta {
  transition:
    transform var(--dur-micro) var(--ease-settle),
    background-color var(--dur-micro) var(--ease-settle);
}
.hero-cta:hover {
  transform: translateY(-1px);
}
.hero-cta:hover svg {
  transform: translateY(2px);
}
.hero-cta:active {
  transform: scale(0.98);
}
@media (max-width: 1023px) {
  .hero-head,
  .intro-right {
    grid-column: 1 / -1;
  }
}
@media (max-width: 639px) {
  .hero-cta {
    width: 100%;
    min-height: 3rem;
    justify-content: center;
  }
}
```

Delete the old `.hero .eyebrow` (1849–1858), `.hero .status-dot*` (1859–1881) and the `.accent-line` gradient-text rule (1882–1891); `.accent-line` without `.serif` (none left after Tasks 12–17) gets no special colour. Keep `.hero h1` size in the 900px block deleted (the clamp handles it).

- [ ] **Step 3: Full check and screenshots**

`npm run lint && npm run typecheck && npm test && npm run build`; screenshots 375/768/1024/1440. At ≥1024 the headline holds columns 1–7 and the lede/CTA columns 8–12 bottom-aligned; at 375 order is headline → lede → full-width CTA → scene.

- [x] **Step 4: Checkpoint (no commit)**

---

### Task 7: Scene depth: layers, tilt, parallax, mobile crop

**Files:**
- Modify: `src/components/sections/ProductShot.tsx`
- Modify: `src/components/motion/MotionRuntime.tsx`
- Modify: `src/app/globals.css` (hero desktop block 2202–2311)

**Interfaces:**
- Consumes: `tilt`, `parallax` (Task 4).
- Produces: `.desktop` children carry `data-depth="0|1|2"`; wrapper `.scene` for the parallax.

- [x] **Step 1: Markup**

In `ProductShot.tsx`, wrap `.desktop` in `<div className="scene">` and set layers: a new `<div className="wallpaper" data-depth="0">` wraps `.desktop-mark`, `.desktop-word`, `.desk-bottom`; `.menubar` gets `data-depth="1"`; `.popover` gets `data-depth="2"`. No visible change yet.

- [x] **Step 2: CSS**

```css
.scene {
  perspective: 75rem;
}
.hero .desktop {
  transform-style: preserve-3d;
}
.wallpaper {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
/* Phones: crop to the menu bar and popover, fixed ratio so nothing shifts. */
@media (max-width: 639px) {
  .hero .desktop {
    aspect-ratio: 4 / 5;
    min-height: 0;
  }
  .wallpaper {
    display: none;
  }
}
```

`.wallpaper` must keep the three children positioned exactly as before at ≥640: their `left/top` rules are relative to `.desktop`; since `.wallpaper` is `inset: 0`, coordinates are unchanged. Verify by screenshot diff at 1440 (expect identical scene apart from Task 6 changes).

- [x] **Step 3: Wire motion**

In `choreograph()` (keep its return of a cleanup; return a combined cleanup):

```ts
  // Tilt owns .desktop's rotation; the scroll rotateX lives on its parent so they never fight.
  const stopTilt = tilt(".hero .desktop", { max: { x: 3, y: 4 } });
  parallax(".hero .scene", { rotateX: 6, start: "top 70%", end: "bottom top" });
  parallax(".wallpaper", { y: -24, trigger: ".hero .scene" });
  parallax(".hero .popover", { y: -48, trigger: ".hero .scene" });
  const stopFlips = flipOnChange("#seconds-tens, #seconds-ones");
  return () => {
    stopTilt();
    stopFlips();
  };
```

- [ ] **Step 4: Guard check (pins Review Focus #5)**

In Chrome DevTools with touch emulation (or Playwright `hasTouch: true, isMobile: true`), load the page: `.hero .desktop` has no inline `transform` after a tap and `getEventListeners` shows no `pointermove`. Run: `npm run lint && npm run typecheck && npm test && npm run build`.

- [x] **Step 5: Checkpoint (no commit)**

---

### Task 8: Live mock-up details and intro sequence

**Files:**
- Modify: `src/components/sections/ProductShot.tsx`
- Modify: `src/components/motion/engine.ts` (add `rollDigits`)
- Modify: `src/components/motion/MotionRuntime.tsx` (`choreograph` intro)
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `rollDigits(target: Target): () => void` (MutationObserver like `flipOnChange`, rolls each changed character up).

- [x] **Step 1: Ring breathes, pause freezes it**

`breathe(".progress", …)` already runs. Keep its timeline and pause it while the demo is paused (`#pause-btn[aria-pressed]`), settling the ring to full opacity:

```ts
  const ring = breathe(".progress", intro.duration());
  const pauseBtn = document.getElementById("pause-btn");
  const pauseObs = new MutationObserver(() => {
    const paused = pauseBtn?.getAttribute("aria-pressed") === "true";
    if (paused) {
      ring?.pause();
      gsap.to(".progress", { opacity: 1, duration: MOTION.ui, ease: MOTION.release });
    } else ring?.resume();
  });
  if (pauseBtn) pauseObs.observe(pauseBtn, { attributes: true, attributeFilter: ["aria-pressed"] });
```

Disconnect `pauseObs` in the returned cleanup.

- [x] **Step 2: Slot-roll digits**

In `engine.ts`:

```ts
/** Menu bar digits roll up a slot when their text changes. Returns a cleanup. */
export function rollDigits(target: Target) {
  const observers = nodes(target).map((el) => {
    const observer = new MutationObserver(() => {
      gsap.fromTo(el, { yPercent: 40, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: MOTION.ui, ease: MOTION.settle, clearProps: "transform,opacity" });
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    return observer;
  });
  return () => observers.forEach((o) => o.disconnect());
}
```

`#menu-time` gets `display: inline-block` and its parent `.menu-timer` gets `overflow: clip` so the roll is masked. The intro drain rewrites the text every frame, so start rolling only after it ends, in `choreograph`:

```ts
  let stopRoll = () => {};
  const roll = gsap.delayedCall(1.6 + GENTLE.count, () => (stopRoll = rollDigits("#menu-time")));
  // cleanup: roll.kill(); stopRoll();
```

- [x] **Step 3: Pressed states**

```css
.hero .pop-actions button {
  transition:
    transform var(--dur-micro) var(--ease-settle),
    background-color var(--dur-micro) var(--ease-settle);
}
.hero .pop-actions button:active {
  transform: scale(0.96);
}
```

- [x] **Step 4: Cursor ghost**

Add to `ProductShot.tsx` inside `.desktop` (after `.popover`):

```tsx
        <svg className="cursor-ghost" aria-hidden="true" viewBox="0 0 16 20">
          <path d="M1 1v15l4-4 3 7 2-1-3-7h6Z" />
        </svg>
```

CSS:

```css
.cursor-ghost {
  position: absolute;
  top: 60%;
  left: 55%;
  width: 1rem;
  height: 1.25rem;
  fill: var(--ink);
  stroke: var(--paper);
  stroke-width: 1;
  opacity: 0;
  pointer-events: none;
}
```

In `choreograph`, after the intro (one time; never repeats because `choreograph` runs once per page load and the tween has no repeat):

```ts
  const ghost = document.querySelector<HTMLElement>(".cursor-ghost");
  const timer = document.querySelector<HTMLElement>(".menu-timer");
  if (ghost && timer) {
    const g = ghost.getBoundingClientRect();
    const t = timer.getBoundingClientRect();
    intro
      .to(ghost, { opacity: 1, duration: MOTION.micro }, "+=0.2")
      .to(ghost, { x: t.left + t.width / 2 - g.left, y: t.top + t.height / 2 - g.top, duration: 1, ease: MOTION.settle })
      .to(ghost, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 })
      .to(ghost, { opacity: 0, duration: MOTION.ui });
  }
```

Rects are valid at call time: pending styles hide the hero by opacity only, so layout is settled.

- [x] **Step 5: Intro sequence (~1.6 s after the splash)**

Replace the head of `choreograph()`:

```ts
  const intro = gsap.timeline({ delay: 0.9 });
  intro
    .add(lineReveal("#hero-title"), 0)
    .from(".hero .eyebrow", vars("fade"), 0)
    .from(".intro-right > *", vars("rise", { stagger: GENTLE.stagger }), 0.25)
    .from(".hero .scene", vars("rise", { y: GENTLE.y * 1.6, scale: 0.985 }), 0.35)
    .from(".wallpaper > *", vars("fade", { stagger: 0.1 }), 0.55)
    .from(".hero .menubar", vars("fade"), 0.5)
    .from(".popover", { opacity: 0, scaleY: 0.6, scaleX: 0.92, y: -12, transformOrigin: popOrigin(), duration: MOTION.section, ease: MOTION.settle, clearProps: "transform,opacity" }, 0.8)
    .from(".scene-caption", vars("fade"), 1.2);
  heroTimer.animate(heroTimer.cycle, heroTimer.start, { duration: GENTLE.count, delay: 1.6, ease: "power2.inOut" });
```

Define next to `choreograph` (the popover drops from the menu bar icon):

```ts
function popOrigin() {
  const pop = document.querySelector(".popover")?.getBoundingClientRect();
  const icon = document.querySelector(".menu-timer svg")?.getBoundingClientRect();
  if (!pop || !icon) return "85% 0%";
  return `${icon.left + icon.width / 2 - pop.left}px 0px`;
}
```

Check `heroTimer.animate`'s current options type before passing `ease`; drop it if the signature has no `ease`.

Remove the old `.hero-intro > div:first-child > *`, `.hero .desktop` and `.desktop-mark` / `.desktop-word` / `.desk-bottom` froms. The pending CSS rule targeting `.hero > figure` stays as is (`figure` still wraps the scene).

- [ ] **Step 6: Full check**

`npm run lint && npm run typecheck && npm test && npm run build`. In `npm run dev` with motion on: intro finishes by ~2.9 s from load; ring drains to 18:42; menubar digits roll each second; pause freezes the ring opacity; the ghost appears once, clicks the timer, fades. Reduced motion (DevTools rendering emulation): all final, no ghost, no roll.

- [x] **Step 7: Checkpoint (no commit)**

---

### Task 9: Rule strip: serif numerals, glyphs, hairlines

**Files:**
- Modify: `src/components/sections/Hero.tsx` (`.rule`)
- Modify: `src/components/motion/MotionRuntime.tsx`
- Modify: `src/app/globals.css` (2360–2400)

- [x] **Step 1: Markup**

Replace each `.unit` with this shape (three units; glyphs: clock tick, horizon, blink):

```tsx
          <div className="unit">
            <svg className="unit-glyph" aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <b className="serif">20</b>
            <i className="unit-rule" aria-hidden="true" />
            <span className="label">
              minutes <br />
              between breaks
            </span>
          </div>
```

Horizon glyph: `<path d="M3 15h18M7 15a5 5 0 0 1 10 0" />`. Blink glyph: `<path d="M3 12c3-4 15-4 18 0" /><path d="M8 15l-1 2M12 16v2M16 15l1 2" />`.

Wrap the strip intro in `<p className="rule-lead serif">A simple rhythm.<br />A moment beyond your screen.</p>` (same copy).

- [x] **Step 2: CSS**

```css
.rule {
  border-block: 1px solid var(--border);
  background: none;
}
.unit + .unit::before {
  display: none;
}
.unit {
  display: grid;
  gap: 0.5rem;
  justify-items: start;
}
.unit b {
  font-size: clamp(3rem, 2rem + 3vw, 4.5rem);
  line-height: 1;
  color: var(--ink);
  background: none;
  -webkit-text-fill-color: currentColor;
}
.unit-rule {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--border-strong);
  transform-origin: 0 50%;
}
.unit-glyph {
  color: var(--rest-text);
}
.rule-lead {
  font-size: var(--text-title);
  color: var(--ink);
}
```

Delete the old `.unit b` gradient rule (2389–2400) and `.rule > p::first-line`.

- [x] **Step 3: Motion**

Replace the rule lines in `choreograph`:

```ts
  reveal(".rule-lead", "rise", { trigger: ".rule" });
  reveal(".unit", "rise", { trigger: ".rule" });
  nodes(".unit b").forEach((el, i) => count(el, { delay: 0.2 + i * 0.15, scrollTrigger: trigger(".rule") }));
  grow(".unit-rule", "x", { scrollTrigger: trigger(".rule"), delay: 0.3 });
  gsap.timeline({ scrollTrigger: trigger(".rule") }).add(draw(".unit-glyph circle, .unit-glyph path"), 0.2);
```

- [ ] **Step 4: Full check**

`npm run lint && npm run typecheck && npm test && npm run build`. Task 9A ends Phase 2 and holds its review stop.

- [x] **Step 5: Checkpoint (no commit)**

---

### Task 9A: Watch interlude: editorial header, player chrome, motion

**Files:**
- Modify: `src/components/sections/Watch.tsx`
- Modify: `src/components/sections/PromoVideo.tsx` (class names only)
- Modify: `src/app/globals.css` (promo block, `.watch` rule at its end)
- Modify: `src/components/motion/MotionRuntime.tsx`

**Interfaces:**
- Consumes: `.label`, `.serif`, `.line` (Tasks 2, 6), `--dur-micro`, `--dur-ui`, `--ease-settle` (Task 1), `lineReveal`, `reveal`, `trigger` (engine), the glass-free promo CSS from Task 3.
- Keeps: `section#watch`, every prop and handler in `PromoVideo` (`preload="none"`, `key={lang}`, `controls={started}`, `aria-pressed`, `aria-label`s, `lang` attributes, `useSyncExternalStore` language default, the resume-on-switch effect), `VIDEOS` copy, the `.promo-switch[data-lang]` indicator, and the `max-width: 30rem` and reduced-motion blocks.
- Produces: `section.watch` laid out on the 12-column grid; `#watch-title`.

Behaviour is not touched. If a change would need a new prop, state or effect in `PromoVideo`, stop and ask.

- [x] **Step 1: Watch header**

```tsx
// src/components/sections/Watch.tsx
import { PromoVideo } from "./PromoVideo";

/** Interlude between the hero and the story: the narrated tour. Unnumbered, so the beats keep 01–06. */
export function Watch() {
  return (
    <section className="section watch" id="watch" aria-labelledby="watch-title">
      <div className="section-copy watch-copy">
        <p className="label">Interlude — The tour</p>
        <h2 id="watch-title" className="serif">
          <span className="line">See it in two minutes.</span>
        </h2>
        <p>A short tour of every feature, narrated in English or Arabic.</p>
      </div>
      <PromoVideo />
    </section>
  );
}
```

- [x] **Step 2: PromoVideo class names**

Only two `className` edits; nothing else in the file changes:

```tsx
        <p className="promo-meta label">
```

```tsx
                <span className="promo-play-label label" aria-hidden="true">
```

Run: `git diff --stat src/components/sections/PromoVideo.tsx` → `1 file changed, 2 insertions(+), 2 deletions(-)`.

- [x] **Step 3: CSS**

Replace the `.watch` rule at the end of the promo block and add the header rules:

```css
/* Asymmetric: a narrow editorial column, the window takes the rest. */
.watch {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1.5rem;
  row-gap: 2.5rem;
  align-items: start;
  border-top: 1px solid var(--border);
}
.watch-copy {
  grid-column: 1 / span 4;
  display: grid;
  gap: 1rem;
  padding-top: 3.25rem;
}
.watch-copy h2 {
  margin-bottom: 0;
  font-size: var(--text-section);
  line-height: 1.15;
  color: var(--ink);
}
.watch-copy p:last-child {
  color: var(--fg-muted);
}
.watch .promo {
  grid-column: 5 / -1;
  min-width: 0;
}
@media (max-width: 1023px) {
  .watch-copy,
  .watch .promo {
    grid-column: 1 / -1;
  }
  .watch-copy {
    padding-top: 0;
  }
}
```

In the existing promo rules, change only these declarations:

```css
.promo-switch::before {
  /* was: transition: translate .45s var(--ease-out); */
  transition: translate var(--dur-ui) var(--ease-settle);
}
.promo-switch button {
  /* was: transition: color .25s var(--ease-out); */
  transition: color var(--dur-micro) var(--ease-settle);
}
.promo-meta {
  /* delete font-size: .8125rem; the .label tier sets the type */
}
.promo-play-icon {
  /* was: transition: scale .35s var(--ease-out); */
  transition: scale var(--dur-micro) var(--ease-settle);
}
.promo-play-icon::after {
  opacity: .6; /* static hairline ring, no loop */
}
.promo-play:hover .promo-play-icon,
.promo-play:focus-visible .promo-play-icon {
  scale: 1.06;
}
.promo-play-label {
  color: var(--ov-fg);
}
```

`.promo-meta span + span::before` stays (the middle dot separates the label items). `.promo-window` keeps `--radius-window`; no new radius values.

- [x] **Step 4: Motion**

In `choreograph`, after the rule-strip lines:

```ts
  lineReveal("#watch-title", { scrollTrigger: trigger(".watch", "top 75%") });
  reveal(".watch-copy > :not(h2)", "rise", { trigger: ".watch", start: "top 75%" });
  reveal(".promo-stage", "depth", { trigger: ".promo-stage" });
  reveal(".promo-bar", "fade", { trigger: ".promo-stage" });
```

No tilt or parallax on the video: a moving frame under a playing video is a distraction, and the hero owns depth.

- [ ] **Step 5: Behaviour checks (nothing regressed)**

With the build served on 4173, in a Playwright script (scratchpad, `$SCRATCH/watch.mjs`):
1. Fresh load at 1440, scroll the whole page: no request URL matches `/video/.*\.mp4/` (`page.on("request")`). Expected: zero.
2. New context with `locale: "ar-EG"`: `.promo-switch` has `data-lang="ar"` and the play button's name contains "Arabic".
3. Click the play button: one `.mp4` request for the current language, `video.paused === false` within 3 s (launch with `--autoplay-policy=no-user-gesture-required`).
4. While playing, click the other language: the `<video>` remounts with the other `src` and `paused === false` within 3 s.
5. Pause, switch back: the play button returns (`.promo-play` exists) and nothing plays.

Print one line per check; all five must pass. Manually confirm captions still show in Safari or Chrome after play.

- [ ] **Step 6: Phase check and review stop**

`npm run lint && npm run typecheck && npm test && npm run build` (paste). Screenshots 320/375/768/1024/1440/1920 light+dark into `$SCRATCH/p2`; overflow script (320: the `.promo-bar` wraps, the titlebar collapses, nothing scrolls sideways); reduced-motion shot (Watch heading, bar and window fully visible). Keyboard: Tab reaches EN, عربي and the play button with a visible focus ring in both themes; Space toggles the language. **Stop: owner reviews Phase 2. No commit unless approved.**

---

# Phase 3 — Story

### Task 10: Break phases (pure logic, TDD)

**Files:**
- Modify: `src/lib/preview.ts`
- Modify: `tests/preview.test.ts`

**Interfaces:**
- Produces:
  - `HEADS_UP_DEMO_SECONDS = 3`, `BREAK_SECONDS = 20`
  - `type BreakPhase = { kind: "work" } | { kind: "headsUp"; left: number } | { kind: "break"; left: number } | { kind: "done" }`
  - `startPhase(kind: "headsUp" | "break", now: number): { phase: BreakPhase; deadline: number }`
  - `nextPhase(phase: BreakPhase, now: number, deadline: number): BreakPhase`
  - `breakControlLabel(phase: BreakPhase): string`
  - `breakAnnouncement(phase: BreakPhase): string`
  - `formatDuration(seconds: number): string` ("hh:mm:ss", used in Task 13)

- [x] **Step 1: Write the failing tests** (append to `tests/preview.test.ts`; extend the import)

```ts
import {
  BREAK_SECONDS,
  HEADS_UP_DEMO_SECONDS,
  breakAnnouncement,
  breakControlLabel,
  cycleFraction,
  formatClock,
  formatDuration,
  nextPhase,
  remainingSeconds,
  startPhase,
  type BreakPhase,
} from "../src/lib/preview";

describe("break sequence", () => {
  it("starts a heads-up and a break with their own deadlines", () => {
    expect(startPhase("headsUp", 1000)).toEqual({ phase: { kind: "headsUp", left: HEADS_UP_DEMO_SECONDS }, deadline: 1000 + HEADS_UP_DEMO_SECONDS * 1000 });
    expect(startPhase("break", 0)).toEqual({ phase: { kind: "break", left: BREAK_SECONDS }, deadline: BREAK_SECONDS * 1000 });
  });
  it("counts the heads-up down, then hands over to the break", () => {
    const { phase, deadline } = startPhase("headsUp", 0);
    expect(nextPhase(phase, 1000, deadline)).toEqual({ kind: "headsUp", left: 2 });
    expect(nextPhase(phase, 3000, deadline)).toEqual({ kind: "break", left: BREAK_SECONDS });
  });
  it("counts the break down to done", () => {
    const { phase, deadline } = startPhase("break", 0);
    expect(nextPhase(phase, 999, deadline)).toEqual({ kind: "break", left: 20 });
    expect(nextPhase(phase, 19_500, deadline)).toEqual({ kind: "break", left: 1 });
    expect(nextPhase(phase, 20_000, deadline)).toEqual({ kind: "done" });
  });
  it("catches up after a background tab without a negative clock", () => {
    const { phase, deadline } = startPhase("break", 0);
    expect(nextPhase(phase, 600_000, deadline)).toEqual({ kind: "done" });
  });
  it("leaves work and done alone", () => {
    expect(nextPhase({ kind: "work" }, 5000, 0)).toEqual({ kind: "work" });
    expect(nextPhase({ kind: "done" }, 5000, 0)).toEqual({ kind: "done" });
  });
  it("labels the control and the live region like before", () => {
    const cases: [BreakPhase, string, string][] = [
      [{ kind: "work" }, "Preview 20-second break", "Break preview ready."],
      [{ kind: "headsUp", left: 2 }, "Skip preview", "A break is coming."],
      [{ kind: "break", left: 12 }, "Skip preview", "Break preview started."],
      [{ kind: "done" }, "Replay break preview", "Break complete. Back to your day."],
    ];
    for (const [phase, label, said] of cases) {
      expect(breakControlLabel(phase)).toBe(label);
      expect(breakAnnouncement(phase)).toBe(said);
    }
  });
});

describe("long duration", () => {
  it("formats hours, minutes and seconds", () => {
    expect(formatDuration(2832)).toBe("00:47:12");
    expect(formatDuration(3600 + 61)).toBe("01:01:01");
    expect(formatDuration(-5)).toBe("00:00:00");
  });
});
```

- [x] **Step 2: Run to verify failure**

Run: `npx vitest run tests/preview.test.ts` → FAIL, `startPhase is not a function` / missing exports.

- [x] **Step 3: Implement** (append to `src/lib/preview.ts`)

```ts
/** The heads-up runs 30 s in the app; the demo compresses it. */
export const HEADS_UP_DEMO_SECONDS = 3;
export const BREAK_SECONDS = 20;

export type BreakPhase =
  | { kind: "work" }
  | { kind: "headsUp"; left: number }
  | { kind: "break"; left: number }
  | { kind: "done" };

const PHASE_SECONDS = { headsUp: HEADS_UP_DEMO_SECONDS, break: BREAK_SECONDS } as const;

export function startPhase(kind: "headsUp" | "break", now: number): { phase: BreakPhase; deadline: number } {
  const left = PHASE_SECONDS[kind];
  return { phase: { kind, left }, deadline: now + left * 1000 };
}

/** The phase at `now`. A finished heads-up becomes a fresh break; the caller starts its deadline. */
export function nextPhase(phase: BreakPhase, now: number, deadline: number): BreakPhase {
  if (phase.kind === "work" || phase.kind === "done") return phase;
  const left = remainingSeconds(deadline, now);
  if (left > 0) return left === phase.left ? phase : { kind: phase.kind, left };
  return phase.kind === "headsUp" ? { kind: "break", left: BREAK_SECONDS } : { kind: "done" };
}

export function breakControlLabel(phase: BreakPhase): string {
  if (phase.kind === "work") return "Preview 20-second break";
  if (phase.kind === "done") return "Replay break preview";
  return "Skip preview";
}

export function breakAnnouncement(phase: BreakPhase): string {
  switch (phase.kind) {
    case "work":
      return "Break preview ready.";
    case "headsUp":
      return "A break is coming.";
    case "break":
      return "Break preview started.";
    case "done":
      return "Break complete. Back to your day.";
  }
}

/** Seconds as hh:mm:ss, e.g. 2832 -> "00:47:12". */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
```

Note: `nextPhase` returns the same object when nothing changed, so a React state setter bails out of a re-render.

- [x] **Step 4: Run to verify pass**

Run: `npx vitest run tests/preview.test.ts` → PASS. Then `npm test` → all pass.

- [x] **Step 5: Checkpoint (no commit)**

---

### Task 11: `useBreakSequence` hook

**Files:**
- Create: `src/hooks/useBreakSequence.ts`

**Interfaces:**
- Consumes: Task 10 exports.
- Produces: `useBreakSequence<T extends Element>(): { phase: BreakPhase; ref: RefObject<T | null>; toggle: () => void }`.

Behaviour decisions (clarifying the spec): ticking needs the element visible and the tab visible. Autoplay on first view needs motion allowed. A user-started preview runs under reduced motion too, because the existing preview does and the countdown is information, not decoration.

- [x] **Step 1: Implement**

```ts
// src/hooks/useBreakSequence.ts
"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { nextPhase, startPhase, type BreakPhase } from "@/lib/preview";

const WORK: BreakPhase = { kind: "work" };
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives the break preview: heads-up → break → done, on wall-clock deadlines so a
 * throttled tab catches up instead of stretching the break. Ticks only while the
 * preview is on screen and the tab is visible; autoplays once on first view when
 * motion is allowed.
 */
export function useBreakSequence<T extends Element>(): {
  phase: BreakPhase;
  ref: RefObject<T | null>;
  toggle: () => void;
} {
  const [phase, setPhase] = useState<BreakPhase>(WORK);
  const [visible, setVisible] = useState(false);
  const deadline = useRef(0);
  const autoplayed = useRef(false);
  const ref = useRef<T | null>(null);

  const begin = useCallback((kind: "headsUp" | "break") => {
    const next = startPhase(kind, Date.now());
    deadline.current = next.deadline;
    setPhase(next.phase);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || autoplayed.current || reduceMotion()) return;
    autoplayed.current = true;
    begin("headsUp");
  }, [visible, begin]);

  const running = phase.kind === "headsUp" || phase.kind === "break";
  useEffect(() => {
    if (!running || !visible) return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      setPhase((current) => {
        const next = nextPhase(current, Date.now(), deadline.current);
        if (current.kind === "headsUp" && next.kind === "break") deadline.current = startPhase("break", Date.now()).deadline;
        return next;
      });
    };
    tick();
    const id = setInterval(tick, 200);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [running, visible]);

  const toggle = useCallback(() => {
    autoplayed.current = true;
    if (phase.kind === "work" || phase.kind === "done") begin(reduceMotion() ? "break" : "headsUp");
    else setPhase(WORK);
  }, [phase.kind, begin]);

  return { phase, ref, toggle };
}
```

The ref mutation inside the `setPhase` updater is idempotent (same deadline for repeated calls within the same ms is fine, and React may call updaters twice in Strict Mode: both calls set an equivalent deadline). If lint (`react-hooks` purity rules) flags it, move the deadline update into a `useEffect` keyed on `phase.kind` that sets `deadline.current = startPhase("break", Date.now()).deadline` when `phase.kind` becomes `"break"` from `"headsUp"` (track previous kind in a ref).

- [ ] **Step 2: Full check**

`npm run lint && npm run typecheck && npm test && npm run build` → pass (hook unused yet; lint must not flag unused exports).

- [x] **Step 3: Checkpoint (no commit)**

---

### Task 12: Experience + hinge: `BreakPreview` and `Tour`

**Files:**
- Modify: `src/components/sections/BreakPreview.tsx`
- Modify: `src/components/sections/Tour.tsx`
- Modify: `src/components/motion/MotionRuntime.tsx` (`#details` block)
- Modify: `src/app/globals.css` (tour block 2401–2495)

**Interfaces:**
- Consumes: `useBreakSequence`, `breakControlLabel`, `breakAnnouncement`, `BREAK_SECONDS`, `HEADS_UP_DEMO_SECONDS`.
- Keeps: ids `#break-preview`, `#seconds-tens`, `#seconds-ones`; the `role="timer"` and `role="status"` regions.

- [x] **Step 1: BreakPreview**

```tsx
"use client";
import type { CSSProperties } from "react";
import { useBreakSequence } from "@/hooks/useBreakSequence";
import { BREAK_SECONDS, HEADS_UP_DEMO_SECONDS, breakAnnouncement, breakControlLabel } from "@/lib/preview";

export function BreakPreview() {
  const { phase, ref, toggle } = useBreakSequence<HTMLElement>();
  const seconds = phase.kind === "break" ? phase.left : phase.kind === "done" ? 0 : BREAK_SECONDS;
  const headsUp = phase.kind === "headsUp" ? phase.left / HEADS_UP_DEMO_SECONDS : 1;
  return (
    <figure ref={ref} className="break-preview" data-phase={phase.kind}>
      <div className="toast" style={{ "--heads-up": headsUp } as CSSProperties}>
        <span className="logo">
          <svg aria-hidden="true">
            <use href="#eye" />
          </svg>
        </span>
        <div className="toast-text">
          <b>A little break is coming</b>
          <p>Time to look away in 30 seconds.</p>
        </div>
        <svg className="toast-ring" aria-hidden="true" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" pathLength="1" />
        </svg>
      </div>
      <div className="break-screen">
        <div className="overlay-top">
          <span>
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
            EyePause
          </span>
          <span>Eye break</span>
        </div>
        <h3>Let your eyes wander.</h3>
        <p>Find something 20 feet away.</p>
        <div className="flip-clock" role="timer" aria-label={`${seconds} seconds remaining`}>
          <span className="flip">0</span>
          <span className="flip">0</span>
          <span className="colon">:</span>
          <span className="flip" id="seconds-tens">
            {Math.floor(seconds / 10)}
          </span>
          <span className="flip" id="seconds-ones">
            {seconds % 10}
          </span>
        </div>
      </div>
      {/* Outside .break-screen so the clip-path never hides it from pointer or keyboard. */}
      <button className="break-control" id="break-preview" onClick={toggle}>
        {breakControlLabel(phase)}
      </button>
      <p className="break-done" aria-hidden="true">Back to your day.</p>
      <figcaption className="figure-label">
        <span>A pause, with an end in sight.</span>
        <span className="mono">00:20</span>
      </figcaption>
      <span className="sr-only" role="status">
        {breakAnnouncement(phase)}
      </span>
    </figure>
  );
}
```

The `.break-screen` children are today's markup unchanged. The button moved out of it; update `.break-control` CSS so it keeps its current position (absolute, bottom of the figure) at every breakpoint. The toast's `<time>now</time>` is replaced by the ring. The `.break-done` line is `aria-hidden` because the status region already announces "Back to your day."

- [x] **Step 2: Tour (hinge + step label)**

```tsx
import { BreakPreview } from "./BreakPreview";
export function Tour() {
  return (
    <section className="section split hinge" id="details" aria-labelledby="details-title">
      <i className="horizon" aria-hidden="true" />
      <div className="section-copy">
        <p className="label">02 — The pause</p>
        <h2 id="details-title">
          <span className="line">Look up.</span>
          <span className="line">There’s a world</span>
          <span className="line serif accent-line">out there.</span>
        </h2>
        <p>
          When it’s time, a full-screen reminder gives your eyes a moment away
          from close-up work. Twenty seconds. Then back to your day.
        </p>
        <div className="step">
          <span className="label">03 — The break</span>
          <h3>A heads-up, before you pause.</h3>
          <p>
            A quiet notification gives you time to finish your thought. You can
            always skip a break.
          </p>
        </div>
      </div>
      <BreakPreview />
    </section>
  );
}
```

- [x] **Step 3: CSS**

```css
.hinge {
  position: relative;
}
/* The page's one gradient: strain fading into rest along the horizon. */
.horizon {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100vw;
  height: 1px;
  translate: -50% 0;
  background: linear-gradient(90deg, var(--strain), var(--rest));
  transform-origin: 0 50%;
}
.step {
  display: grid;
  gap: 0.375rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}
.toast-ring {
  width: 1.25rem;
  height: 1.25rem;
  transform: rotate(-90deg);
}
.toast-ring circle {
  stroke: var(--rest);
  stroke-width: 2;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--heads-up, 1));
  transition: stroke-dashoffset 200ms linear;
}
.break-preview {
  position: relative;
}
.break-preview .break-screen {
  clip-path: inset(0 0 0 0 round var(--radius-window));
  transition: clip-path var(--dur-section) var(--ease-settle);
}
.break-preview[data-phase="headsUp"] .break-screen,
.break-preview[data-phase="done"] .break-screen {
  /* Collapsed to the toast's band at the top. */
  clip-path: inset(0 0 calc(100% - 4.5rem) 0 round var(--radius-window));
}
.break-preview[data-phase="break"] .break-screen {
  animation: break-breathe 10s var(--ease-release) infinite alternate;
}
@keyframes break-breathe {
  to {
    transform: scale(1.015);
  }
}
.break-done {
  position: absolute;
  inset: 5.5rem 0 auto;
  text-align: center;
  font: italic 400 var(--text-title) / 1.2 var(--font-display);
  color: var(--ink);
  opacity: 0;
  transition: opacity var(--dur-ui) var(--ease-settle) var(--dur-section);
}
.break-preview[data-phase="done"] .break-done {
  opacity: 1;
}
```

The toast must sit over the collapsed band: confirm `.toast` is positioned above `.break-screen` in the current layout (today it overlaps the screen's top edge). If the collapsed inset does not line up with the toast, set the inset to the toast's bottom edge measured in rem at each breakpoint. `.sub-feature` CSS was removed in Task 3; the `.step` markup above replaces it.

- [x] **Step 4: Motion**

Replace the `#details` block in `choreograph`:

```ts
  lineReveal("#details-title", { scrollTrigger: trigger("#details", "top 75%") });
  reveal("#details .section-copy > :not(h2)", "rise", { trigger: "#details" });
  grow(".horizon", "x", { scrollTrigger: trigger("#details", "top 85%"), duration: 1.6, ease: MOTION.settle });
  gsap
    .timeline({ scrollTrigger: trigger("#details figure", "top 85%") })
    .from("#details .toast", vars("slide"))
    .from("#details .figure-label", vars("fade"), "<0.3");
```

The old `.break-screen` depth reveal and digit `from` are removed (the phase CSS owns the screen now). `flipOnChange("#seconds-tens, #seconds-ones")` stays.

- [ ] **Step 5: Verify**

`npm run lint && npm run typecheck && npm test && npm run build`. In `npm run dev`: scrolling to `#details` autoplays heads-up (ring drains 3 s) → screen expands → 00:20 counts with flips → collapses → "Back to your day." Click "Replay break preview" repeats. Reduced motion: no autoplay; clicking starts the break directly at 00:20 and ends with the done line. Keyboard: Tab reaches `#break-preview` in every phase. VoiceOver/`role=status` text changes per phase.

- [x] **Step 6: Checkpoint (no commit)**

---

### Task 13: Problem beat

**Files:**
- Create: `src/components/sections/Problem.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/motion/MotionRuntime.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `formatDuration` (Task 10), `--strain`, `--strain-glare`.
- Produces: `section.problem#strain` with CSS var `--glare` (0…1).

Performance decision: per spec §4.2 fallback, the blur is a static pre-blurred duplicate layer whose opacity follows `--glare`. No animated `filter`.

- [x] **Step 1: Component**

```tsx
// src/components/sections/Problem.tsx
import { formatDuration } from "@/lib/preview";

const LINES = [92, 78, 96, 64, 88, 72, 94, 58, 84];

function Lines() {
  return (
    <div className="problem-lines">
      {LINES.map((w, i) => (
        <i key={i} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

/** Beat 01: close-up work wears on the eyes. The stage pins on desktop while glare builds. */
export function Problem() {
  return (
    <section className="problem" id="strain" aria-labelledby="problem-title">
      <div className="problem-stage wrap">
        <div className="problem-copy">
          <p className="label">01 — The strain</p>
          <h2 id="problem-title" className="serif">
            <span className="line">Close-up work, hour after hour.</span>
            <span className="line">Your eyes stay locked at one distance.</span>
            <span className="line">They rarely get a say.</span>
          </h2>
          <p className="problem-counter label">
            <span className="problem-time">{formatDuration(2832)}</span> since you last looked up
          </p>
        </div>
        <div className="problem-screen" aria-hidden="true">
          <Lines />
          <div className="problem-blur">
            <Lines />
          </div>
          <div className="problem-glare" />
        </div>
      </div>
    </section>
  );
}
```

In `page.tsx` the band is full-bleed and has its own inner `.wrap`, so split the first `.wrap`:

```tsx
        <div className="wrap">
          <Hero />
          <Watch />
        </div>
        <Problem />
        <div className="wrap">
          <Tour />
        </div>
```

`<Watch />` stays right after the hero, inside the first `.wrap`, where the owner placed it.

- [x] **Step 2: CSS** (final state is the default, so reduced motion and no-JS show full glare)

```css
.problem {
  --glare: 1;
  border-top: 1px solid var(--border);
}
.problem-stage {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1.5rem;
  align-items: center;
  padding-block: 6rem;
}
.problem-copy {
  grid-column: 1 / span 6;
  display: grid;
  gap: 1.5rem;
}
.problem-copy h2 {
  font-size: var(--text-section);
  line-height: 1.15;
  color: var(--ink);
}
.problem-copy h2 .line + .line {
  color: var(--fg-muted);
}
.problem-counter {
  color: var(--fg-muted);
}
.problem-time {
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.problem-screen {
  grid-column: 8 / -1;
  position: relative;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--border);
  border-radius: var(--radius-window);
  background: var(--surface);
  overflow: hidden;
  padding: 1.5rem;
}
.problem-lines {
  display: grid;
  gap: 0.75rem;
}
.problem-lines i {
  height: 0.5rem;
  border-radius: 0.125rem;
  background: var(--strain);
  opacity: 0.45;
}
.problem-blur {
  position: absolute;
  inset: 1.5rem;
  filter: blur(1.5px);
  opacity: var(--glare);
}
.problem-glare {
  position: absolute;
  inset: 0;
  background: var(--strain-glare);
  opacity: calc(var(--glare) * 0.55);
  mix-blend-mode: normal;
}
/* Desktop with motion: a 150vh band and a sticky stage the glare scrubs across. */
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  html[data-motion="ready"] .problem {
    --glare: 0;
    height: 150vh;
  }
  html[data-motion="ready"] .problem-stage {
    position: sticky;
    top: 0;
    min-height: 100vh;
  }
}
@media (max-width: 1023px) {
  .problem-copy,
  .problem-screen {
    grid-column: 1 / -1;
  }
  .problem-stage {
    row-gap: 2.5rem;
    padding-block: 4rem;
  }
}
```

- [x] **Step 3: Motion**

In `choreograph`:

```ts
  const problem = document.querySelector<HTMLElement>(".problem");
  const clock = document.querySelector<HTMLElement>(".problem-time");
  const pm = gsap.matchMedia();
  pm.add("(min-width: 1024px)", () => {
    if (!problem) return;
    gsap.fromTo(problem, { "--glare": 0 }, {
      "--glare": 1,
      ease: "none",
      scrollTrigger: { trigger: problem, start: "top top", end: "bottom bottom", scrub: true },
    });
    if (clock) {
      const proxy = { s: 2790 };
      gsap.to(proxy, {
        s: 2832,
        ease: "none",
        scrollTrigger: { trigger: problem, start: "top top", end: "bottom bottom", scrub: true },
        onUpdate: () => (clock.textContent = formatDuration(proxy.s)),
      });
    }
  });
  pm.add("(max-width: 1023px)", () => {
    if (!problem) return;
    gsap.fromTo(problem, { "--glare": 0 }, { "--glare": 1, duration: 2.4, ease: MOTION.settle, scrollTrigger: trigger(problem, "top 60%") });
  });
  lineReveal("#problem-title", { scrollTrigger: trigger(".problem", "top 70%") });
```

`clock.textContent` is safe: React rendered static text and never re-renders this server component. Revert `pm` in the cleanup (`pm.revert()`); `mm.revert()` does not cover a nested matchMedia created outside its context. Mobile sets `--glare: 0` only after the CSS default 1: the `fromTo` sets 0 immediately, which is the intended start.

- [ ] **Step 4: Final-state assertion (pins Review Focus #1)**

With reduced motion emulated, in the Playwright console: `getComputedStyle(document.querySelector('.problem')).getPropertyValue('--glare').trim() === '1'` and `.problem-time` text is `00:47:12`. Record the result in the phase report.

- [ ] **Step 5: Full check + perf trace**

`npm run lint && npm run typecheck && npm test && npm run build`. Chrome Performance panel, scroll through the Problem band at 1440: no long tasks > 50 ms from scripts, paint only on the glare layers (enable "Paint flashing").

- [x] **Step 6: Checkpoint (no commit)**

---

### Task 14: Product beat: `ProductDetails` replaces `Features`

**Files:**
- Create: `src/components/sections/ProductDetails.tsx`
- Delete: `src/components/sections/Features.tsx`
- Modify: `src/components/sections/TourScreens.tsx` (delete `HeadsUpScreen`; live hooks)
- Modify: `src/app/page.tsx`, `MotionRuntime.tsx`, `globals.css` (replace `.feature-band`, `.details*`, `.ledger-row*`)

**Interfaces:**
- Consumes: `SmartPauseScreen`, `BreakScreen({ active })`, `SettingsScreen` from `TourScreens.tsx`.
- Produces: `section#product.product`; rows `.product-row[data-row="0|1|2"]`; stage `.product-stage[data-active="0|1|2"]` with `.product-shot[data-shot="0|1|2"]`.

- [x] **Step 1: Component**

```tsx
// src/components/sections/ProductDetails.tsx
import type { ReactNode } from "react";
import { Moon, Settings2 } from "lucide-react";
import { BreakScreen, SettingsScreen, SmartPauseScreen } from "./TourScreens";

type Row = { icon: ReactNode; title: string; body: string; screen: (active: boolean) => ReactNode };

const rows: Row[] = [
  {
    icon: <Moon aria-hidden="true" />,
    title: "Away from your Mac? So is the timer.",
    body: "Smart pause follows idle time, sleep, and screen lock. Your break schedule waits for you.",
    screen: () => <SmartPauseScreen />,
  },
  {
    icon: (
      <svg aria-hidden="true">
        <use href="#eye" />
      </svg>
    ),
    title: "A change of focus.",
    body: "Guided eye exercises bring a little variety to your breaks, from gentle blinking to near-and-far focus.",
    screen: (active) => <BreakScreen active={active} />,
  },
  {
    icon: <Settings2 aria-hidden="true" />,
    title: "Make yourself comfortable.",
    body: "Adjust your schedule, choose your sounds, and launch at login. Set it once; let EyePause keep time.",
    screen: () => <SettingsScreen />,
  },
];

/** Beat 04. Desktop: rows scroll past a sticky screen. Phones: each row shows its screen inline. */
export function ProductDetails() {
  return (
    <section className="product" id="product" aria-labelledby="product-title">
      <div className="wrap grid-12">
        <header className="product-intro">
          <p className="label">04 — The details</p>
          <h2 id="product-title">
            <span className="line">Thoughtful about</span>
            <span className="line serif accent-line">your time.</span>
          </h2>
          <p>The useful details, right where you expect them.</p>
        </header>
        <ol className="product-rows">
          {rows.map((r, i) => (
            <li key={r.title} className="product-row" data-row={i}>
              {r.icon}
              <div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
              <div className="product-inline">{r.screen(true)}</div>
            </li>
          ))}
        </ol>
        <div className="product-stage" data-active="0">
          {rows.map((r, i) => (
            <div key={r.title} className="product-shot" data-shot={i}>
              {r.screen(true)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Copy is identical to `Features.tsx`. The duplicated screens are each hidden with `display: none` at the other breakpoint, so only one copy is ever in the accessibility tree.

- [x] **Step 2: Delete `Features.tsx` and `HeadsUpScreen`**

`grep -rn "Features\|HeadsUpScreen" src` → only `page.tsx` imports `Features`. Remove the file and the `HeadsUpScreen` function. In `page.tsx` replace `<Features />` with `<ProductDetails />` (its own `.wrap` is inside).

- [x] **Step 3: CSS**

```css
.product {
  border-top: 1px solid var(--border);
  padding-block: 7rem;
}
.product-intro {
  grid-column: 1 / -1;
  display: grid;
  gap: 1rem;
  margin-bottom: 4rem;
}
.product-rows {
  grid-column: 1 / span 5;
  margin: 0;
  padding: 0;
  list-style: none;
}
.product-row {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  gap: 1rem;
  padding-block: 2rem 30vh;
  border-top: 1px solid var(--border);
  transition: border-color var(--dur-ui) var(--ease-release);
}
.product-row > svg {
  margin-top: 0.25rem;
  color: var(--fg-muted);
}
.product-stage {
  grid-column: 7 / -1;
  grid-row: 2;
  position: sticky;
  top: 6rem;
  align-self: start;
  display: grid;
}
.product-shot {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(0.75rem) scale(0.985);
  transition:
    opacity var(--dur-ui) var(--ease-release),
    transform var(--dur-section) var(--ease-settle);
}
.product-stage[data-active="0"] [data-shot="0"],
.product-stage[data-active="1"] [data-shot="1"],
.product-stage[data-active="2"] [data-shot="2"] {
  opacity: 1;
  transform: none;
}
.product-inline {
  display: none;
}
/* With motion, inactive rows dim to --fg-subtle and the active one gets an ink rule. */
html[data-motion="ready"] .product-rows[data-active] .product-row:not([data-current]) :is(h3, p, svg) {
  color: var(--fg-subtle);
}
html[data-motion="ready"] .product-rows[data-active] .product-row[data-current] {
  border-top-color: var(--ink);
}
.product-row :is(h3, p, svg) {
  transition: color var(--dur-ui) var(--ease-release);
}
@media (max-width: 1023px) {
  .product-rows {
    grid-column: 1 / -1;
  }
  .product-row {
    padding-block: 2rem;
  }
  .product-inline {
    display: block;
    grid-column: 1 / -1;
    margin-top: 1.5rem;
  }
  .product-stage {
    display: none;
  }
}
```

Delete old `.feature-band`, `.details`, `.details-intro`, `.ledger-row*` CSS in base and polish layers.

- [x] **Step 4: Live states in `TourScreens.tsx`**

`SettingsScreen` toggles flip once on view. Add `data-toggle` and `data-on={t.on || undefined}` to each `<i>`, and change its knob classes so "on" is a transform: keep the off position via the existing `after:left-*` class and replace the on-state `after:left-*` class with `after:translate-x-3` (read the current classes; the travel must equal today's on/off distance). CSS:

```css
[data-toggle],
[data-toggle]::after {
  transition:
    background-color var(--dur-ui) var(--ease-settle),
    translate var(--dur-ui) var(--ease-settle);
}
html[data-motion="ready"] :is(.product-shot, .product-inline):not([data-seen]) [data-toggle][data-on] {
  background: var(--border);
}
html[data-motion="ready"] :is(.product-shot, .product-inline):not([data-seen]) [data-toggle][data-on]::after {
  translate: 0 0;
}
```

(Tailwind 4 `translate-x-*` uses the `translate` property, so `translate: 0 0` overrides it.)

`SmartPauseScreen` chips cycle: give each row `data-status-row` and add an ambient CSS highlight (no JS):

```css
@media (prefers-reduced-motion: no-preference) {
  [data-status-row] {
    animation: status-focus 10s var(--ease-release) infinite;
  }
  [data-status-row]:nth-child(2) { animation-delay: 2s; }
  [data-status-row]:nth-child(3) { animation-delay: 4s; }
  [data-status-row]:nth-child(4) { animation-delay: 6s; }
  [data-status-row]:nth-child(5) { animation-delay: 8s; }
}
@keyframes status-focus {
  0%, 20%, 100% { opacity: 0.55; }
  5%, 15% { opacity: 1; }
}
```

- [x] **Step 5: Motion**

In `choreograph`:

```ts
  lineReveal("#product-title", { scrollTrigger: trigger("#product", "top 75%") });
  const stage = document.querySelector<HTMLElement>(".product-stage");
  const list = document.querySelector<HTMLElement>(".product-rows");
  nodes(".product-row").forEach((row) => {
    ScrollTrigger.create({
      trigger: row,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: (self) => {
        if (!self.isActive || !stage || !list) return;
        stage.dataset.active = row.dataset.row;
        list.dataset.active = "";
        nodes(".product-row").forEach((r) => r.toggleAttribute("data-current", r === row));
        stage.querySelector<HTMLElement>(`[data-shot="${row.dataset.row}"]`)?.setAttribute("data-seen", "");
      },
    });
  });
  nodes(".product-inline").forEach((el) =>
    ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => el.setAttribute("data-seen", "") }),
  );
```

- [ ] **Step 6: Final-state assertion and phase review stop**

Reduced motion: no row is dimmed (`[data-active]` never set), stage shows shot 0, toggles show their real on/off state. `npm run lint && npm run typecheck && npm test && npm run build` (paste). Screenshots all widths light+dark into `$SCRATCH/p3`; overflow; keyboard pass on `#details` and nav links to `#product`. **Stop: owner reviews Phase 3. No commit unless approved.**

---

# Phase 4 — Close

### Task 15: Insights

**Files:**
- Modify: `src/components/sections/Specs.tsx`
- Modify: `src/components/sections/TourScreens.tsx` (`StatisticsScreen` hook classes)
- Modify: `MotionRuntime.tsx`, `globals.css` (`.stats-*`)

**Interfaces:**
- Produces: `section#habit.insights`; classes on `StatisticsScreen`: `.stat-value` on each `b`, `.stat-bar` on each bar column, `.stat-heat` on each heat cell.

- [x] **Step 1: Specs.tsx**

```tsx
import { StatisticsScreen } from "./TourScreens";

/** Beat 05: the habit, as the app's own statistics window shows it. */
export function Specs() {
  return (
    <section className="section insights" id="habit" aria-labelledby="habit-title">
      <div className="insights-copy">
        <p className="label">05 — The habit</p>
        <h2 id="habit-title">
          <span className="line">Small breaks.</span>
          <span className="line serif accent-line">A habit you can see.</span>
        </h2>
        <p>
          See the breaks you’ve taken today and across the week. A simple record
          of making a little time for yourself.
        </p>
        <p className="label">Your history stays on your Mac.</p>
      </div>
      <p className="insights-figure" aria-hidden="true">
        <span className="insights-84 serif">84</span>
        <span className="label">breaks this week</span>
      </p>
      <div className="insights-window">
        <StatisticsScreen />
      </div>
    </section>
  );
}
```

The `84` is `aria-hidden` because it is decorative; the statistics window keeps its `role="img"` label. Add to the window's `aria-label`: nothing (its label already describes the data).

- [x] **Step 2: TourScreens classes**

In `StatisticsScreen`, prepend a class to each element's existing `className` string without removing any: the stat `b` gets `stat-value`, each week column div gets `stat-bar`, each heat `<i>` gets `stat-heat`. Example for the stat value: `className="stat-value font-mono …"` where the rest is the current class list verbatim.

- [x] **Step 3: CSS**

```css
.insights {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1.5rem;
  row-gap: 2rem;
  border-top: 1px solid var(--border);
}
.insights-copy {
  grid-column: 1 / span 5;
  display: grid;
  gap: 1rem;
  align-content: start;
}
.insights-figure {
  grid-column: 1 / span 6;
  grid-row: 2;
  display: grid;
  margin: 0;
  max-width: none;
}
.insights-84 {
  font-size: clamp(5rem, 3rem + 8vw, 9rem);
  line-height: 0.85;
  color: var(--ink);
}
.insights-window {
  grid-column: 6 / -1;
  grid-row: 1 / span 2;
  align-self: end;
  /* Overlaps the numeral's baseline. */
  margin-bottom: -2rem;
  position: relative;
}
@media (max-width: 1023px) {
  .insights-copy,
  .insights-figure,
  .insights-window {
    grid-column: 1 / -1;
    grid-row: auto;
    margin-bottom: 0;
  }
}
```

Delete `.stats-section`, `.stats-window`, `.window-head`, `.stats-body`, `.stats-title`, `.stat-number`, `.chart*` and their responsive entries.

- [x] **Step 4: Motion** (replace the stats block in `choreograph`)

```ts
  lineReveal("#habit-title", { scrollTrigger: trigger("#habit", "top 75%") });
  reveal(".insights-copy > :not(h2)", "rise", { trigger: "#habit" });
  const habit = trigger(".insights-window", "top 60%");
  count(".insights-84", { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  const values = nodes(".stat-value");
  count(values[0], { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  count(values[1], { duration: 2, ease: MOTION.settle, scrollTrigger: habit });
  count(values[2], { duration: 2, ease: MOTION.settle, format: (v) => `${Math.round(v)}%`, scrollTrigger: habit });
  grow(".stat-bar", "y", { stagger: 0.06, scrollTrigger: habit });
  gsap.from(".stat-heat", {
    opacity: 0,
    duration: MOTION.ui,
    ease: MOTION.settle,
    clearProps: "opacity",
    // Diagonal wave: column + row, spread over ~900 ms (26 columns × 7 rows).
    stagger: (i) => (Math.floor(i / 7) + (i % 7)) * (0.9 / 31),
    scrollTrigger: habit,
  });
```

`count` reads the text node: `.insights-84`'s first child is the text "84" (good). `values[3]` ("6h 40m") is not counted. "Triggered at 40% visibility" → `start: "top 60%"`.

- [ ] **Step 5: Full check**

`npm run lint && npm run typecheck && npm test && npm run build`. Screenshot 375/1440: on 375 the numeral sits above the window, no overlap; on 1440 the window overlaps the numeral baseline. Nav "The habit" link now lands here.

- [x] **Step 6: Checkpoint (no commit)**

---

### Task 16: Download visuals

**Files:**
- Modify: `src/components/sections/Download.tsx`
- Modify: `src/components/download/PlatformPicker.tsx` (visual only)
- Modify: `src/components/download/DownloadButton.tsx` (visual only)
- Modify: `MotionRuntime.tsx`, `globals.css` (download blocks 2017–2200, 2624–2735)

**Interfaces:**
- Consumes: `tilt`.
- Produces: `.platforms` reads `--seg-index`, `--seg-count`.

- [x] **Step 1: Band and icon**

`Download.tsx`: add `<p className="label">06 — Make room</p>` above the `h2`, change the h2 to `.line` spans with the second line `serif accent-line`, keep everything else (facts list from Task 3). Wrap the icon: `<div className="app-icon" data-tilt>` with inner `<span className="app-icon-face">` holding the svg, and a sibling `<i className="app-icon-shadow" aria-hidden="true" />`.

CSS:

```css
.download-section {
  border-block: 1px solid var(--border);
  background: var(--paper);
  padding-block: 6rem;
}
.download-panel {
  border: 1px solid var(--border);
  border-radius: 0;
  background: none;
  box-shadow: none;
}
.app-icon {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  perspective: 30rem;
}
.app-icon-face {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 1.125rem;
  background: var(--rest);
  color: var(--accent-fg);
  box-shadow:
    inset 0 1px 0 color-mix(in oklab, var(--paper) 45%, transparent),
    inset 0 -2px 0 color-mix(in oklab, var(--ink) 12%, transparent);
}
.app-icon-shadow {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: -0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: color-mix(in oklab, var(--ink) 18%, transparent);
  filter: blur(6px);
}
```

(`filter` here is static, not animated.)

- [x] **Step 2: Picker indicator** (visual only; no logic change)

In `PlatformPicker.tsx` add a style on the `RadioGroup`:

```tsx
      style={{ "--seg-index": Math.max(0, choices.findIndex((c) => c.id === selected)), "--seg-count": choices.length } as CSSProperties}
```

(import `type CSSProperties` from `react`). In the tag line, mark coming-soon items: add `data-soon={c.comingSoon || undefined}` on `RadioGroupItem`.

CSS:

```css
.platforms {
  position: relative;
}
.platforms::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 2px;
  width: calc((100% - (var(--seg-count) - 1) * 0.25rem) / var(--seg-count));
  background: var(--rest-text);
  transform: translateX(calc(var(--seg-index) * (100% + 0.25rem)));
  transition: transform var(--dur-ui) var(--ease-settle);
}
.platforms button[aria-checked="true"] {
  border-bottom-color: transparent;
}
.platforms button[data-soon] svg {
  opacity: 0.5;
}
.platforms small {
  font-family: var(--mono);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

Delete the polish-layer segmented-track rules (2087–2131) that conflict.

- [x] **Step 3: CTA states** (visual only)

In `DownloadButton.tsx` `ReadyButton`, add `data-done={done || undefined}` to the existing `Button` (where `done` is the existing download-started flag; read the component to find its name, do not change its logic). CSS:

```css
.download-controls .native-download-action {
  transition:
    transform var(--dur-micro) var(--ease-settle),
    background-color var(--dur-micro) var(--ease-settle);
}
.download-controls .native-download-action:hover:not(:disabled) {
  transform: translateY(-1px);
}
.download-controls .native-download-action:hover:not(:disabled) svg {
  transform: translateY(2px);
}
.download-controls .native-download-action:active:not(:disabled) {
  transform: scale(0.98);
}
.download-controls .native-download-action svg {
  transition: transform var(--dur-micro) var(--ease-settle);
}
.download-controls .native-download-action[data-done] svg {
  animation: tray 600ms var(--ease-settle);
}
@keyframes tray {
  0% { transform: translateY(-4px); opacity: 0; }
  60% { transform: translateY(2px); opacity: 1; }
  100% { transform: none; }
}
```

The disabled "available soon" button matches `:disabled` and gets none of this.

- [x] **Step 4: Motion**

```ts
  lineReveal("#download-title", { scrollTrigger: trigger("#download", "top 75%") });
  reveal(".download-intro > :not(h2)", "rise", { trigger: "#download" });
  reveal(".download-controls", "depth");
  const stopIcon = tilt(".app-icon", { max: { x: 6, y: 6 }, depth: 0 });
```

Add `stopIcon()` to the returned cleanup.

- [ ] **Step 5: Download flow regression check**

`npm run build`, serve. On macOS user agent: the macOS option is selected, the button downloads the DMG link from `release.json` (`href` unchanged vs. baseline: compare `document.querySelector('.native-download-action').href` before/after), install steps appear. Switch to Windows/Linux: "Coming soon" notice shows, button disabled, indicator slides. Arrow keys, Home and End still select. iPhone UA: mobile view unchanged.

`npm run lint && npm run typecheck && npm test && npm run build`.

- [x] **Step 6: Checkpoint (no commit)**

---

### Task 17: Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`, `globals.css` (2588–2623)

- [x] **Step 1: Markup**

```tsx
export function Footer() {
  return (
    <div className="wrap">
      <footer className="site-footer">
        <i className="horizon footer-horizon" aria-hidden="true" />
        <span className="brand">
          <svg aria-hidden="true">
            <use href="#eye" />
          </svg>
          EyePause
        </span>
        <span className="footer-tagline serif">A little less screen. A little more around you.</span>
        <span className="footer-credit">
          <span className="footer-copy">©</span> {new Date().getFullYear()}{" "}
          <strong>Naroz Ezzat</strong>
        </span>
      </footer>
    </div>
  );
}
```

The footer is also used by `not-found.tsx`; check it renders there.

- [x] **Step 2: CSS**

```css
.site-footer {
  position: relative;
  background: none;
}
/* Echoes the hinge's horizon as a plain hairline; the strain → rest gradient stays unique to the hinge. */
.footer-horizon {
  top: 0;
  background: var(--border-strong);
}
.footer-tagline {
  font-style: italic;
  font-size: var(--text-lede);
  color: var(--ink);
}
```

Delete the old `.site-footer` gradient hairline (2589–2592) and the accented brand-mark rules.

- [x] **Step 3: Motion**

`grow(".footer-horizon", "x", { scrollTrigger: trigger(".site-footer", "top 95%"), duration: 1.6, ease: MOTION.settle });`

- [ ] **Step 4: Full check**

`npm run lint && npm run typecheck && npm test && npm run build`; check `/404/` page in the build renders header and footer correctly.

- [x] **Step 5: Checkpoint (no commit)**

---

### Task 18: Full verification across viewports

**Files:**
- Modify (scratchpad only): `$SCRATCH/shot.mjs`
- Create (scratchpad only): `$SCRATCH/overflow.mjs`

- [x] **Step 1: Extend the harness**

`shot.mjs` default widths become `320,375,390,414,768,1024,1280,1440,1920`. Add `overflow.mjs`:

```js
// overflow.mjs <url>: fails if any width scrolls sideways, in light or dark.
import { chromium } from "/Users/narozfahmy/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
const url = process.argv[2] ?? "http://localhost:4173/";
const widths = [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920];
const browser = await chromium.launch({
  executablePath: `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
});
let bad = 0;
for (const scheme of ["light", "dark"]) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
    });
    const { sw, iw, culprits } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
      culprits: [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 5)
        .map((el) => el.className || el.tagName),
    }));
    const ok = sw <= iw;
    if (!ok) bad++;
    console.log(`${scheme} ${width}: ${ok ? "ok" : `OVERFLOW ${sw} > ${iw}`} ${ok ? "" : JSON.stringify(culprits)}`);
    await page.close();
  }
}
await browser.close();
process.exit(bad ? 1 : 0);
```

- [ ] **Step 2: Run everything**

```bash
npm run lint && npm run typecheck && npm test && npm run build
npx serve out -l 4173 &   # restart if already running
node $SCRATCH/overflow.mjs
node $SCRATCH/shot.mjs $SCRATCH/final
```

Expected: four commands pass; overflow prints `ok` for all 18 rows; 18 full-page screenshots exist (reduced-motion renders, final states). Rerun `node $SCRATCH/watch.mjs` (Task 9A): all five video checks pass.

- [ ] **Step 3: Motion-on screenshots**

Run `shot.mjs` once more with `reducedMotion: 'no-preference'` and a scroll pass at 375/1440 (temporary flag in the script) to confirm no element is left at opacity 0 after its trigger.

- [ ] **Step 4: Keyboard pass**

From a fresh load, Tab only: skip link → main; header links (or menu → sheet at 375); hero CTA; Pause, Skip, sliders link in the popover; video language switch (EN, عربي) and the play button; `#break-preview`; platform picker (arrows, Home, End); download button; copy link; theme toggle. Every stop shows a visible focus ring in light and dark.

- [ ] **Step 5: Contrast and perf**

DevTools contrast checker on: label tier (`--fg-subtle` on `--bg`), dimmed product rows, Problem counter, serif accent lines (`--rest-text`), footer tagline, both themes, all ≥ 4.5:1 (or ≥ 3:1 for ≥ 24 px text). Performance trace at 1440 with 4× CPU throttle through hero intro and Problem band: no long tasks > 50 ms from animation; layers panel shows only transform/opacity/clip-path animations.

- [x] **Step 6: Final report and review stop**

Write a short report in the chat: commands with real output, overflow table, screenshot folder, keyboard/contrast/perf results, and any deviation from the spec (each with its reason). **Stop: owner reviews everything locally. No commit, push or deploy until the owner explicitly approves.**
