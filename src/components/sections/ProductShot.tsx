"use client";

import { EyeGlyph } from "@/components/brand/EyeGlyph";
import { PlatformIcon } from "@/components/download/PlatformIcon";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./sections.module.css";

const RING = 414.7;
const CYCLE = 20 * 60;

function clock(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** The macOS menu bar with the EyePause popover open, as the hero's product shot. */
export function ProductShot() {
  const [s, ref] = useCountdown<HTMLDivElement>(18 * 60 + 4, CYCLE);

  return (
    <div
      ref={ref}
      className={styles.desk}
      role="img"
      aria-label="EyePause popover open from the macOS menu bar, showing 18 minutes until the next break"
    >
      <div className={styles.menubar}>
        <div className={styles.mbL}>
          <PlatformIcon platformId="macos" />
          <span className={styles.app}>Xcode</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
        </div>
        <div className={styles.mbR}>
          <span className={styles.ep}>
            <EyeGlyph />
            <span>{Math.ceil(s / 60)}m</span>
          </span>
          <span className={styles.opt}>100%</span>
          <span>Tue 14:02</span>
        </div>
      </div>
      <div className={styles.pop}>
        <div className={styles.ring}>
          <svg viewBox="0 0 150 150" fill="none">
            <circle className={styles.track} cx="75" cy="75" r="66" strokeWidth="5" />
            <circle
              className={styles.progress}
              cx="75"
              cy="75"
              r="66"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - s / CYCLE)}
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div>
            <b>{clock(s)}</b>
            <span>next micro break</span>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.btn}>Pause for…</div>
          <div className={`${styles.btn} ${styles.btnAccent}`}>Break now</div>
        </div>
        <div className={styles.stats}>
          <div>
            <b>9</b>
            <span>taken</span>
          </div>
          <div>
            <b>1</b>
            <span>skipped</span>
          </div>
          <div>
            <b>4h 12m</b>
            <span>screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
