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
