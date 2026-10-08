import type { CSSProperties } from "react";
export function Specs() {
  return (
    <section className="section stats-section">
      <figure
        className="stats-window"
        aria-label="Sample weekly statistics: 84 breaks taken this week, 6 today"
      >
        <div className="window-head">
          <span className="traffic"></span>
          <span className="traffic"></span>
          <span className="traffic"></span>
          <span>EyePause · Sample statistics</span>
        </div>
        <div className="stats-body">
          <div className="stats-title">
            A week of looking up.<span>2–8 Jun</span>
          </div>
          <div className="stat-number">
            84<small>breaks this week</small>
          </div>
          <div className="chart" aria-hidden="true">
            <div
              className="chart-col"
              style={{ "--height": "70%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col"
              style={{ "--height": "85%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col"
              style={{ "--height": "60%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col"
              style={{ "--height": "90%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col"
              style={{ "--height": "70%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col"
              style={{ "--height": "15%" } as CSSProperties}
            >
              <i></i>
            </div>
            <div
              className="chart-col today"
              style={{ "--height": "30%" } as CSSProperties}
            >
              <i></i>
            </div>
          </div>
          <div className="chart-labels" aria-hidden="true">
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
            <span>M</span>
          </div>
          <div className="chart-summary">
            <span>
              Today <strong>6 breaks</strong>
            </span>
            <span>Illustrative data</span>
          </div>
        </div>
      </figure>
      <div className="section-copy">
        <h2>
          Small breaks.
          <br />A habit you can see.
        </h2>
        <p>
          See the breaks you’ve taken today and across the week. A simple record
          of making a little time for yourself.
        </p>
        <div className="privacy">
          <svg aria-hidden="true">
            <use href="#lock" />
          </svg>
          Your history stays on your Mac.
        </div>
      </div>
    </section>
  );
}
