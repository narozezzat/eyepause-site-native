import { EyeOff, HardDrive, UserX } from "lucide-react";
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
            <br />
            <span className="accent-line">A welcome pause.</span>
          </h2>
          <p>
            Give EyePause a place in your menu bar. Your next break is on us.
          </p>
          <ul className="assurances download-assurances">
            <li>
              <HardDrive aria-hidden="true" />
              100% local
            </li>
            <li>
              <UserX aria-hidden="true" />
              No account
            </li>
            <li>
              <EyeOff aria-hidden="true" />
              No telemetry
            </li>
          </ul>
        </div>
        <DownloadPanel options={options} />
      </div>
    </section>
  );
}
