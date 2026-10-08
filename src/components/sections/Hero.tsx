import { ArrowDownToLine } from "lucide-react";
import { ProductShot } from "./ProductShot";
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-intro">
        <div>
          <div className="eyebrow">
            <span className="status-dot"></span>A little room for your eyes
          </div>
          <h1 id="hero-title">
            In your menu bar.
            <br />
            On your side.
          </h1>
        </div>
        <div className="intro-right">
          <p className="lede">
            A small reminder to look away.
            <br />
            EyePause makes the 20–20–20 rule part of your day on Mac.
          </p>
          <div className="hero-action">
            <a className="btn" href="#download">
              Get EyePause for Mac
              <ArrowDownToLine aria-hidden="true" />
            </a>
            <span className="caption">Free. Always local.</span>
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
