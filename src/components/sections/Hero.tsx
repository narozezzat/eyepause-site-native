import { ArrowDownToLine } from "lucide-react";
import { ProductShot } from "./ProductShot";
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-intro grid-12">
        <div className="hero-head">
          <p className="eyebrow">EyePause for macOS — 01</p>
          <h1 id="hero-title">
            <span className="line">In your menu bar.</span>
            <span className="line accent-line serif">On your side.</span>
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
            <ul className="facts">
              <li>Free</li>
              <li>Always local</li>
            </ul>
          </div>
        </div>
      </div>
      <ProductShot />
      <div className="rule">
        <p className="rule-lead serif">
          A simple rhythm.
          <br />A moment beyond your screen.
        </p>
        <div className="rule-units">
          <div className="unit">
            <svg className="unit-glyph" aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <b className="serif">20</b>
            <i className="unit-rule" aria-hidden="true" />
            <span className="label">
              minutes{" "}
              <br />
              between breaks
            </span>
          </div>
          <div className="unit">
            <svg className="unit-glyph" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M3 15h18M7 15a5 5 0 0 1 10 0" />
            </svg>
            <b className="serif">20</b>
            <i className="unit-rule" aria-hidden="true" />
            <span className="label">
              feet{" "}
              <br />
              into the distance
            </span>
          </div>
          <div className="unit">
            <svg className="unit-glyph" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M3 12c3-4 15-4 18 0" />
              <path d="M8 15l-1 2M12 16v2M16 15l1 2" />
            </svg>
            <b className="serif">20</b>
            <i className="unit-rule" aria-hidden="true" />
            <span className="label">
              seconds{" "}
              <br />
              just for your eyes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
