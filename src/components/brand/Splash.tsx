import { EYE_PATH } from "./EyeGlyph";
import styles from "./brand.module.css";

/**
 * The menu bar icon draws itself, then fades to reveal the page. Pure CSS so it
 * starts with first paint, never intercepts input, and is skipped entirely when
 * the visitor prefers reduced motion.
 */
export function Splash() {
  return (
    <div className={styles.splash} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d={EYE_PATH} pathLength={80} />
        <circle cx="12" cy="12" r="2.8" pathLength={80} />
      </svg>
    </div>
  );
}
