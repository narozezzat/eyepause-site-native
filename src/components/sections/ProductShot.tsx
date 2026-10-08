"use client";
import { heroTimer, useDemoTimer } from "@/hooks/useDemoTimer";
import { cycleFraction, formatClock } from "@/lib/preview";

/** 2π × 74, as the popover ring is drawn. */
const RING = 465;

export function ProductShot() {
  const { left, paused, skipped } = useDemoTimer(heroTimer);
  const time = formatClock(left);
  return (
    <figure>
      <div
        className="desktop"
        aria-label="Interactive preview of EyePause in the macOS menu bar"
      >
        <div className="menubar">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path
              d="M12 4c1-1 1-2 1-3-1 0-3 1-3 3m5 9c-3-1-3-5 0-6-2-3-4-1-5-1S6 4 4 7s0 8 2 10c1 1 3-1 4-1s3 2 4 0l2-3"
              fill="currentColor"
              stroke="none"
            />
          </svg>
          <b>Finder</b>
          <span className="menu-item">File</span>
          <span className="menu-item">Edit</span>
          <span className="menu-item">View</span>
          <span className="menu-item">Go</span>
          <span className="menu-spacer"></span>
          <div className="menu-timer">
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
            <span className="mono" id="menu-time">
              {paused ? "Ⅱ" : time}
            </span>
          </div>
          <div className="menu-right">
            <svg aria-hidden="true" className="battery" viewBox="0 0 24 24">
              <rect x="2" y="7" width="17" height="10" rx="2" />
              <path d="M22 10v4M5 10h11v4H5Z" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0" />
              <circle cx="12" cy="20" r=".5" />
            </svg>
            <span className="date">Mon 8 Jun</span>
            <span>9:41</span>
          </div>
        </div>
        <div className="desktop-mark">Less screen. More perspective.</div>
        <div className="desktop-word" aria-hidden="true">
          Your day,
          <br />
          with a little
          <br />
          breathing
          <br />
          room.
        </div>
        <div className="desk-bottom">
          <span className="desk-bottom-icon" aria-hidden="true">
            <svg>
              <use href="#eye" />
            </svg>
          </span>
          <span>
            Right here when you need it.
            <br />
            Out of the way when you don’t.
          </span>
        </div>
        <div className="popover">
          <div className="pop-head">
            <span>EyePause</span>
            <span className="live">
              <span className="status-dot"></span>
              <span id="timer-state">{paused ? "Paused" : "Focus time"}</span>
            </span>
          </div>
          <div className="timer-face">
            <svg aria-hidden="true" viewBox="0 0 160 160">
              <circle className="track" cx="80" cy="80" r="74" />
              <circle
                className="progress"
                style={{
                  strokeDashoffset: Math.round(
                    RING * (1 - cycleFraction(left, heroTimer.cycle)),
                  ),
                }}
                cx="80"
                cy="80"
                r="74"
              />
            </svg>
            <div
              className="timer-label"
              role="timer"
              aria-label={`${time} until your next break`}
            >
              <strong id="timer" data-paused={paused || undefined}>
                {time}
              </strong>
              <span>until your next break</span>
            </div>
          </div>
          <div className="pop-actions">
            <button
              id="pause-btn"
              aria-pressed={paused}
              onClick={heroTimer.togglePause}
            >
              <svg aria-hidden="true">
                <use href="#pause" />
              </svg>
              <span>{paused ? "Resume" : "Pause"}</span>
            </button>
            <button id="skip-btn" onClick={heroTimer.skip}>
              <svg aria-hidden="true">
                <use href="#skip" />
              </svg>
              Skip
            </button>
          </div>
          <div className="pop-footer">
            <span id="today-count" role="status">
              {skipped
                ? "Next break reset to 20 minutes"
                : "Sample · 6 breaks taken today"}
            </span>
            <a
              className="icon-button"
              href="#details"
              aria-label="Explore EyePause features"
            >
              <svg aria-hidden="true">
                <use href="#sliders" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <figcaption className="scene-caption">
        <span>A familiar place for a better habit.</span>
        <span>EyePause on macOS · Interactive preview</span>
      </figcaption>
    </figure>
  );
}
