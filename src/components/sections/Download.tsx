import { DownloadPanel } from "@/components/download/DownloadPanel";
import type { DownloadOption } from "@/lib/releases";
export function Download({ options }: { options: DownloadOption[] }) {
  return (
    <section
      className="download-section"
      id="download"
      aria-labelledby="download-title"
    >
      <div className="wrap">
        <div className="download-panel">
          <div className="download-intro">
            <div className="app-icon" data-tilt>
              <span className="app-icon-face">
                <svg aria-hidden="true">
                  <use href="#eye" />
                </svg>
              </span>
              <i className="app-icon-shadow" aria-hidden="true" />
            </div>
            <p className="label">06 — Make room</p>
            <h2 id="download-title">
              <span className="line">A small addition.</span>
              <span className="line serif accent-line">A welcome pause.</span>
            </h2>
            <p>
              Give EyePause a place in your menu bar. Your next break is on us.
            </p>
            <ul className="facts">
              <li>100% local</li>
              <li>No account</li>
              <li>No telemetry</li>
            </ul>
          </div>
          <DownloadPanel options={options} />
        </div>
      </div>
    </section>
  );
}
