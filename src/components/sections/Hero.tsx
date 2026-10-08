import { ArrowDownToLine, Check } from "lucide-react";
import { ProductShot } from "./ProductShot";
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-intro">
        <div>
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true"></span>A little room for your eyes
          </div>
          <h1 id="hero-title">
            In your menu bar.
            <br />
            <span className="accent-line">On your side.</span>
          </h1>
        </div>
        <div className="intro-right">
          <p className="lede">
            <span className="lede-lead">A small reminder to look away.</span>
            <br />
            EyePause makes the 20–20–20 rule part of your day on Mac.
          </p>
          <div className="hero-action">
            <a className="btn hero-cta" href="#download">
              Get EyePause for Mac
              <ArrowDownToLine aria-hidden="true" />
            </a>
            <ul className="assurances">
              <li>
                <Check aria-hidden="true" />
                Free
              </li>
              <li>
                <Check aria-hidden="true" />
                Always local
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ProductShot />
      <div className="rule">
        <p>
          A simple rhythm.
          <br />A moment beyond your screen.
        </p>
        <div className="rule-units">
          <div className="unit">
            <b>20</b>
            <span>
              minutes
              <br />
              between breaks
            </span>
          </div>
          <div className="unit">
            <b>20</b>
            <span>
              feet
              <br />
              into the distance
            </span>
          </div>
          <div className="unit">
            <b>20</b>
            <span>
              seconds
              <br />
              just for your eyes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
