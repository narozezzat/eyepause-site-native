import { BreakPreview } from "./BreakPreview";
export function Tour() {
  return (
    <section className="section split" id="details">
      <div className="section-copy">
        <h2>
          Look up.
          <br />
          There’s a world
          <br />
          <span className="accent-line">out there.</span>
        </h2>
        <p>
          When it’s time, a full-screen reminder gives your eyes a moment away
          from close-up work. Twenty seconds. Then back to your day.
        </p>
        <div className="sub-feature">
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
