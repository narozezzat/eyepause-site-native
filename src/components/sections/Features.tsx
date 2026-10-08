export function Features() {
  return (
    <section className="feature-band">
      <div className="wrap">
        <div className="details">
          <div className="details-intro">
            <h2>
              Thoughtful about
              <br />
              your time.
            </h2>
            <p>The useful details, right where you expect them.</p>
          </div>
          <div>
            <div className="ledger-row">
              <svg aria-hidden="true">
                <use href="#moon" />
              </svg>
              <div>
                <h3>Away from your Mac? So is the timer.</h3>
                <p>
                  Smart pause follows idle time, sleep, and screen lock. Your
                  break schedule waits for you.
                </p>
              </div>
            </div>
            <div className="ledger-row">
              <svg aria-hidden="true">
                <use href="#eye" />
              </svg>
              <div>
                <h3>A change of focus.</h3>
                <p>
                  Guided eye exercises bring a little variety to your breaks,
                  from gentle blinking to near-and-far focus.
                </p>
              </div>
            </div>
            <div className="ledger-row">
              <svg aria-hidden="true">
                <use href="#sliders" />
              </svg>
              <div>
                <h3>Make yourself comfortable.</h3>
                <p>
                  Adjust your schedule, choose your sounds, and launch at login.
                  Set it once; let EyePause keep time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
