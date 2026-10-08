import { DownloadPanel } from "@/components/download/DownloadPanel";
import type { DownloadOption } from "@/lib/releases";
export function Download({ options }: { options: DownloadOption[] }) {
  return (
    <section
      className="download-section"
      id="download"
      aria-labelledby="download-title"
    >
      <div className="download-panel">
        <div className="download-intro">
          <div className="app-icon">
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
          </div>
          <h2 id="download-title">
            A small addition.
            <br />A welcome pause.
          </h2>
          <p>
            Give EyePause a place in your menu bar. Your next break is on us.
          </p>
          <span className="caption">100% local. No account. No telemetry.</span>
        </div>
        <DownloadPanel options={options} />
      </div>
    </section>
  );
}
