import { EYE_PATH } from "./EyeGlyph";

/**
 * The menu bar icon draws itself, then fades to reveal the page. Pure CSS so it
 * starts with first paint, never intercepts input, and is skipped entirely when
 * the visitor prefers reduced motion.
 */
export function Splash() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 grid animate-splash-out place-items-center bg-bg motion-reduce:hidden"
      aria-hidden="true"
    >
      <svg
        className="size-14 text-fg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path className="animate-draw [stroke-dasharray:80] [stroke-dashoffset:80]" d={EYE_PATH} pathLength={80} />
        <circle
          className="animate-draw-late [stroke-dasharray:80] [stroke-dashoffset:80]"
          cx="12"
          cy="12"
          r="2.8"
          pathLength={80}
        />
      </svg>
    </div>
  );
}
