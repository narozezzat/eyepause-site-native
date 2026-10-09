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
      <div className="break-frame">
        <div className="toast" hidden={phase.kind !== "headsUp"} style={{ "--heads-up": headsUp } as CSSProperties}>
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
        <div className="break-screen" aria-hidden={phase.kind === "headsUp" || phase.kind === "done"}>
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
          <div
            className="flip-clock"
            role="timer"
            aria-label={`${seconds} seconds remaining`}
          >
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
        <p className="break-done" hidden={phase.kind !== "done"} aria-hidden="true">Back to your day.</p>
      </div>
      {/* Keep the control outside the clipped screen in every phase. */}
      <button className="break-control" id="break-preview" onClick={toggle}>
        {breakControlLabel(phase)}
      </button>
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
