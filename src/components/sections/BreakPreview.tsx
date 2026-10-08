"use client";
import { useEffect, useState } from "react";
import { remainingSeconds } from "@/lib/preview";
export function BreakPreview() {
  const [seconds, setSeconds] = useState(20);
  const [deadline, setDeadline] = useState<number | null>(null);
  const running = deadline !== null && seconds > 0;
  useEffect(() => {
    if (!running || deadline === null) return;
    const tick = () => setSeconds(remainingSeconds(deadline, Date.now()));
    const timer = setInterval(tick, 200);
    return () => clearInterval(timer);
  }, [deadline, running]);
  function toggle() {
    setSeconds(20);
    setDeadline(running ? null : Date.now() + 20_000);
  }
  return (
    <figure>
      <div className="toast">
        <span className="logo">
          <svg aria-hidden="true">
            <use href="#eye" />
          </svg>
        </span>
        <div className="toast-text">
          <b>A little break is coming</b>
          <p>Time to look away in 30 seconds.</p>
        </div>
        <time>now</time>
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
        <button className="break-control" id="break-preview" onClick={toggle}>
          {running
            ? "Skip preview"
            : seconds === 0
              ? "Replay break preview"
              : "Preview 20-second break"}
        </button>
      </div>
      <figcaption className="figure-label">
        <span>A pause, with an end in sight.</span>
        <span className="mono">00:20</span>
      </figcaption>
      <span className="sr-only" role="status">
        {seconds === 0
          ? "Break complete. Back to your day."
          : running
            ? "Break preview started."
            : "Break preview ready."}
      </span>
    </figure>
  );
}
