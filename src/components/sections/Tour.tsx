import { BreakPreview } from "./BreakPreview";
export function Tour() {
  return (
    <section className="section split hinge" id="details" aria-labelledby="details-title">
      <i className="horizon" aria-hidden="true" />
      <div className="section-copy">
        <p className="label">02 — The pause</p>
        <h2 id="details-title">
          <span className="line">Look up.</span>
          <span className="line">There’s a world</span>
          <span className="line serif accent-line">out there.</span>
        </h2>
        <p>
          When it’s time, a full-screen reminder gives your eyes a moment away
          from close-up work. Twenty seconds. Then back to your day.
        </p>
        <div className="step">
          <span className="label">03 — The break</span>
          <h3>A heads-up, before you pause.</h3>
          <p>
            A quiet notification gives you time to finish your thought. You can
            always skip a break.
          </p>
        </div>
      </div>
      <BreakPreview />
    </section>
  );
}
