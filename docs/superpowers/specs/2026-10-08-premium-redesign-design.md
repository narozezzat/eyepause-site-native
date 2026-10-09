# EyePause site: premium redesign (design spec)

Date: 2026-10-08 · Status: awaiting review · Approach: A (evolve in place, 4 phases)

## 1. Intent

Evolve the existing "Menu Bar Native" site into a premium, editorial, product-led site. It must read as designed by a person who understands EyePause, not as a generic AI SaaS template.

**Stated by the owner**

- Keep the branding, voice, download flow, platform info, mockups and information architecture.
- Remove template patterns: glow gradients, pill chips everywhere, every section as a card, repeated layouts, uniform motion.
- Add a real motion system and purposeful depth.
- Must be excellent at 320–1920+ px, in light and dark, accessible and fast.
- Nothing is pushed or deployed until the owner approves. Work stays local.

**Decisions made in brainstorming**

- Narrative: keep the current voice and headline. Add a Problem beat and a Product beat; recompose the existing sections rather than remove them.
- Typography: Geist (UI and body) + Geist Mono (labels, timers) + Instrument Serif (display and large numerals) via `next/font`. No npm dependency.
- Approach A: build on the existing `globals.css` component CSS and the GSAP + Lenis engine, in 4 verified local phases.

**Assumptions**

- New copy is allowed only for new beats. It stays short and in the existing voice.
- No new runtime dependencies. GSAP (with ScrollTrigger) and Lenis already cover all the motion.

**Success criteria**

- A side-by-side review against the baseline shows a distinct, editorial identity, and no section repeats another's layout.
- All existing functions keep working: the download flow, platform picker, theme toggle, demo timer, break preview and skip link.
- `npm run lint && npm run typecheck && npm test && npm run build` pass with no new warnings.
- At 320/375/390/414/768/1024/1280/1440/1920, in light and dark: no horizontal overflow, no layout shift from motion, keyboard reachable, a visible `:focus-visible` everywhere, WCAG AA contrast.
- A reduced-motion render shows the final states with no movement beyond short crossfades.

## 2. Page narrative

| # | Beat | Source | Label |
|---|------|--------|-------|
| — | Header | `layout/Header.tsx` | — |
| 00 | Hero + rule strip | `sections/Hero.tsx`, `ProductShot.tsx` | EyePause for macOS |
| — | Watch (interlude, added after this spec) | `sections/Watch.tsx`, `PromoVideo.tsx` | Interlude — The tour |
| 01 | Problem (new) | `sections/Problem.tsx` | The strain |
| 02 | Solution (hinge) | `sections/Tour.tsx` (heading) | The pause |
| 03 | Experience | `sections/Tour.tsx` + `BreakPreview.tsx` | The break |
| 04 | Product | `sections/ProductDetails.tsx` (replaces `Features.tsx`) + `TourScreens.tsx` | The details |
| 05 | Insights | `sections/Specs.tsx` + `StatisticsScreen` | The habit |
| 06 | Download | `sections/Download.tsx` + `download/*` | Make room |
| — | Footer | `layout/Footer.tsx` | — |

Section indices use the mono label tier ("01 — The strain"). The `#details` and `#download` anchors stay stable.

## 3. Foundations

### 3.1 Type

- Instrument Serif is loaded in `layout.tsx` with `next/font/google`, exposed as `--font-serif` and mapped to `--font-display` in `@theme`.
- Serif is used only for `--text-display`, `--text-section` and large numerals (the 20/20/20 strip, the "84" insight). Regular weight, `-0.01em` tracking. Italic serif is the emphasis device, at most once per heading.
- Geist stays for body and UI. A new `--text-label` tier uses Geist Mono, uppercase, `0.14em` tracking. It is used for eyebrows, section indices and mockup captions.
- The two-line "teal second line" heading pattern stays only in the hero.
- Display sizes keep their `clamp()` values in rem. No size exceeds the current `--text-display` cap except the decorative "84" numeral, which is capped at `clamp(5rem, 3rem + 8vw, 9rem)`.

### 3.2 Color

- The palette is unchanged. Semantic aliases are added in `globals.css` with light and dark values:
  - `--ink`: the primary text role. It aliases `--fg`.
  - `--paper`: the page background role. It aliases `--bg`.
  - `--rest`: aliases `--accent` and `--accent-text`. It is used only where the product means rest or break, plus the primary CTA.
  - `--strain` and `--strain-glare`: a muted warm grey and a glare tint. They are used only in the Problem beat.
- The hero and download glow gradients are removed. The single remaining gradient is the strain → rest transition in beats 01 and 02.
- No hex values in components. Every new color is a token with light and dark values.

### 3.3 Shape

- Sections sit on hairline rules and an asymmetric 12-column grid (`.grid-12`), not cards.
- Radius and `--shadow-float` are reserved for real app surfaces: windows, the popover, the toast, the app icon.
- Pill chips (hero assurances, download assurances, privacy line, eyebrow) become plain mono text separated by a middle dot.

### 3.4 Motion language

These live in `src/components/motion/tokens.ts`, mirrored as CSS custom properties in `globals.css`:

| Token | Value | Use |
|-------|-------|-----|
| `micro` | 180 ms | hover, press, focus |
| `ui` | 360 ms | state changes, indicator slides |
| `section` | 750 ms | scroll reveals, line masks |
| `ambient` | 4 s in / 6 s out | breathing loops |
| `settle` | `cubic-bezier(.22,1,.36,1)` | arrivals |
| `release` | `cubic-bezier(.65,0,.35,1)` | state swaps |
| `breath` | `sine.inOut` | ambient loops |

`GENTLE` in `engine.ts` is re-expressed in these tokens; existing callers keep working. New engine primitives:

- `lineReveal(target)`: wraps each heading line in an overflow clip and rises it by 100% of its line height, staggered 90 ms. It uses a `clip-path` mask with no layout change. The text stays in the DOM for assistive technology.
- `tilt(el, { max })`: pointer-driven `rotateX` and `rotateY` with per-layer `translateZ` read from `data-depth`. It is rAF-throttled, eases back to flat on pointer leave, and runs only for `(hover: hover) and (pointer: fine)`.
- `parallax(el, depth)`: a ScrollTrigger-scrubbed `translateY` and `rotateX`, using transform only.
- `breathe`: retuned to the 4 s / 6 s ambient cadence. It still pauses while off screen.

Only `transform`, `opacity`, `clip-path` and CSS variables animate. Every primitive is registered inside the existing `gsap.matchMedia("(prefers-reduced-motion: no-preference)")` block, so reduced motion renders final states. A CSS-only `@media (prefers-reduced-motion: reduce)` rule caps any transitions at 120 ms opacity.

### 3.5 Navigation

- Desktop: the section links get a sliding underline indicator, a transform-scaled element positioned by ScrollTrigger as each beat becomes active. The header compacts (reduced vertical padding through a transform on the inner row) once `data-scrolled` is set.
- Under 640px, the links collapse into a menu button that opens a sheet built on Radix Dialog (`npx shadcn@latest add sheet`). The sheet reveals with a clip-path, traps and returns focus, closes on Escape, and has 48px targets.
- The nav links are The pause (`#details`), The details (`#product`), The habit (`#habit`) and Download. The new anchors are added; the existing ones are unchanged.

## 4. Sections

### 4.1 Hero (00)

- **Desktop (≥1024px)**
  - The headline spans columns 1–7: "In your menu bar." in ink, then "On your side." in serif italic using the `--rest` text color.
  - The lede and CTA span columns 8–12, aligned to the headline baseline.
  - The eyebrow becomes the label "EyePause for macOS — 01".
- **Scene layers** (`data-depth` 0/1/2):
  - 0: the wallpaper and the "Your day, with a little breathing room" word art.
  - 1: the menu bar.
  - 2: the popover.
- **Scene motion**
  - `tilt` caps at ±3° X and ±4° Y.
  - `parallax` settles the scene from `rotateX(6deg)` to 0 as the hero scrolls out, and the wallpaper moves slower than the popover.
- **Live details**
  - The ring breathes on the ambient cadence, and pausing freezes it.
  - Menu bar digits slot-roll (a translateY digit strip) on each change.
  - The Pause and Skip buttons get pressed states.
  - A one-time cursor ghost moves to the menu bar timer on first view. It never repeats and has `aria-hidden`.
- **Intro sequence** (~1.6 s after the splash):
  1. Headline `lineReveal`.
  2. The scene rises from its layers.
  3. The popover drops from the timer (`transform-origin` at the menu bar icon).
  4. The ring drains to 18:42 (the existing `heroTimer.animate`).
- **Rule strip:** serif numerals over a mono unit label. Each numeral counts up from 0 and a hairline draws beneath it. Each unit gets a small inline SVG glyph (a clock tick, a horizon line, a blink) drawn with `draw()`.
- **Mobile (<640px)**
  - Order: headline → lede → full-width CTA (≥48px) → scene.
  - The scene crops to the menu bar and popover (no word art, no tilt) with a fixed `aspect-ratio` so it causes no layout shift.

### 4.2 Problem (01): new `Problem.tsx`

- **Desktop**
  - A full-bleed band about 150vh tall with one sticky stage.
  - An abstract screen (a plain rectangle of grey text lines) gains glare as you scroll. A scrubbed CSS variable drives an overlay toward `--strain-glare`, the lines get a slight blur through `filter` on one layer, and a mono counter reads "00:47:12 since you last looked up".
- **Copy:** "Close-up work, hour after hour." / "Your eyes stay locked at one distance." / "They rarely get a say."
- **Mobile and reduced motion:** no pin. A short sequence plays on view; reduced motion shows the end state.
- **Performance:** the blur is applied to one small composited layer and capped at 1.5px. If tracing shows jank, it is replaced by an opacity crossfade between two pre-blurred states.

### 4.3 Solution (02): the hinge

- The glare dims and a single horizon line draws across the full width. The existing heading "Look up. There's a world out there." sits on it.
- This is the only strain → rest gradient on the page.

### 4.4 Experience (03): break sequence

- Pure logic goes in `src/lib/preview.ts` as a discriminated union:
  `type BreakPhase = { kind: "work" } | { kind: "headsUp"; left: number } | { kind: "break"; left: number } | { kind: "done" }`
  with `nextPhase(phase, now, deadline)` and its transitions. It gets unit tests in `tests/preview.test.ts`.
- `src/hooks/useBreakSequence.ts` drives the phases with the same wall-clock approach as `useDemoTimer`. It ticks only while visible, the tab is visible and motion is allowed.
- `BreakPreview.tsx` renders the phases:
  1. The heads-up toast slides in with a 30s ring draining (demo-compressed to 3s).
  2. A click, or an auto-advance on first view, expands it into the full break screen with a `clip-path: inset()` animation from the toast's rect.
  3. The flip clock counts 00:20 down while the background breathes (scale 1 → 1.015).
  4. At 00:00 the screen collapses back toward the menu bar, and "Back to your day." is announced.
- The existing live-region announcements and button labels are kept. The "A heads-up, before you pause" sub-feature becomes a step label (mono index + text), not a bordered card.

### 4.5 Product (04): `ProductDetails.tsx` replaces `Features.tsx`

- The three ledger rows and their copy are unchanged. Each pairs with a screen from `TourScreens.tsx`:
  - Smart pause → `SmartPauseScreen`.
  - Eye exercises → `BreakScreen`.
  - Comfort → `SettingsScreen`.
- **Desktop:** the screen column is sticky. The active row (set by ScrollTrigger) gets an ink rule while the others dim to `--fg-subtle`, and the screen crossfades with a small depth offset.
- **Mobile:** each row renders its screen inline below the copy. Nothing is sticky.
- **Live states:** the settings toggles flip once on view and the smart-pause chips cycle through statuses. `HeadsUpScreen` is unused here and is deleted if nothing else needs it.
- `id="product"` is added for the nav.

### 4.6 Insights (05)

- The bespoke chart markup in `Specs.tsx` is deleted, and `StatisticsScreen` is reused. One stats mock remains.
- **Layout:** a large serif "84" with the mono label "breaks this week" hangs off the left column. The window sits offset right and overlaps the numeral baseline. On mobile the numeral goes above the window and nothing overlaps.
- **Motion** (triggered at 40% visibility):
  - The counts tween over 2 s with `settle`.
  - The bars grow with a 60 ms stagger.
  - The heatmap cells fade in a diagonal wave over ~900 ms.
- The copy "Small breaks. A habit you can see." and the privacy line (now plain mono) are kept. `id="habit"` is added.

### 4.7 Download (06)

- The glow card is replaced by a full-width paper band with a hairline frame.
- The app icon gets a real depth stack (squircle, inner highlight, contact shadow) and a small `tilt`.
- `PlatformPicker`: the Radix radio group and its logic are unchanged. A sliding selected indicator (transform, `ui` duration) is added, and unavailable platforms show "Coming soon" in mono with dimmed icons.
- **CTA states**
  - Hover: a 1px lift and the arrow nudges down 2px.
  - Press: scale 0.98.
  - Click: the arrow traces into a tray line, and the existing live region announces the download.
  - The disabled "available soon" state shows no fake feedback.
- `useDownloadState`, `DownloadButton` behavior and `src/lib/releases` are untouched.

### 4.8 Footer

- Same content. The tagline is set in serif italic, with a closing horizon rule that echoes 4.3.

## 5. Files

- **New**
  - `src/components/motion/tokens.ts`
  - `src/components/sections/Problem.tsx`
  - `src/components/sections/ProductDetails.tsx`
  - `src/hooks/useBreakSequence.ts`
  - `src/components/ui/sheet.tsx` (shadcn)
- **Changed**
  - `globals.css` (tokens, type, sections; glow, pill and card CSS removed)
  - `layout.tsx` (serif font)
  - `page.tsx` (beat order)
  - `engine.ts` (primitives)
  - `MotionRuntime.tsx` (choreography)
  - `Header.tsx`
  - `Hero.tsx`
  - `ProductShot.tsx`
  - `Tour.tsx`
  - `BreakPreview.tsx`
  - `Specs.tsx`
  - `Download.tsx`
  - `PlatformPicker.tsx` (visual only)
  - `DownloadButton.tsx` (visual feedback only)
  - `Footer.tsx`
  - `src/lib/preview.ts` + tests
- **Deleted**
  - `Features.tsx` (replaced)
  - The Specs chart markup and its CSS
  - `HeadsUpScreen`, if unused
- **Untouched**
  - `src/lib/releases/*`
  - `src/lib/platform/*`
  - `src/lib/theme.ts`
  - `src/data/release.json`
  - The theme provider and toggle logic

## 6. Phases

Every phase ends with the full verification in §7 and an owner review of the screenshots. Nothing is committed or pushed without the owner's go-ahead.

1. **Foundations:** tokens, serif, motion tokens and primitives, header and mobile sheet, pill and glow removal.
2. **Hero:** composition, scene depth (tilt and parallax), live mockup details, intro sequence, rule strip.
3. **Story:** Problem, Solution hinge, Experience break sequence (lib + hook + tests), Product details.
4. **Close:** Insights, Download, Footer, and the final review across all viewports.

## 7. Verification

- `npm run lint && npm run typecheck && npm test && npm run build`, with real output pasted.
- Unit tests for the `BreakPhase` transitions.
- Playwright screenshots of `out/` at 320, 375, 390, 414, 768, 1024, 1280, 1440 and 1920, in light and dark, compared with the baseline.
- A scripted horizontal-overflow check at every width (`scrollWidth <= innerWidth`).
- A keyboard-only pass: skip link, nav, sheet, timer controls, break preview, platform picker, download.
- A reduced-motion render: final states only.
- A performance trace on the hero and the Problem pin: no long tasks over 50 ms from animation, and only transform, opacity and clip-path in the animation frames.

## 8. Out of scope

- Content or IA changes beyond the beats listed above.
- New runtime dependencies or 3D libraries.
- Changes to the release data pipeline or the deploy workflow.
