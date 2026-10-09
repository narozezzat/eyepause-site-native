import { formatDuration } from "@/lib/preview";

const LINES = [92, 78, 96, 64, 88, 72, 94, 58, 84];

function Lines() {
  return (
    <div className="problem-lines">
      {LINES.map((width, index) => (
        <i key={index} style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

/** Beat 01: close-up work wears on the eyes as the desktop stage builds glare. */
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
          <div className="problem-blur"><Lines /></div>
          <div className="problem-glare" />
        </div>
      </div>
    </section>
  );
}
