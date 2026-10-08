"use client";

import { useState } from "react";
import { Notice } from "@/components/ui/Notice";
import { platforms } from "@/config/platforms";
import { useDetectedPlatform } from "@/hooks/useDetectedPlatform";
import {
  downloadMeta,
  downloadView,
  type DownloadOption,
} from "@/lib/releases";
import { CopyLink } from "./CopyLink";
import { DownloadButton, MetaRow } from "./DownloadButton";
import { PlatformPicker } from "./PlatformPicker";

export function DownloadPanel({ options }: { options: DownloadOption[] }) {
  const detected = useDetectedPlatform();
  const [override, setOverride] = useState<string | null>(null);

  const detectedOption = options.find((o) => o.platformId === detected);
  const fallback =
    options.find((o) => o.status !== "coming-soon") ?? options[0];
  const selectedId =
    override ?? detectedOption?.platformId ?? fallback.platformId;
  const selected = options.find((o) => o.platformId === selectedId) ?? fallback;
  const installSteps =
    platforms.find((p) => p.id === selected.platformId)?.installSteps ?? [];
  const view = downloadView(selected, detected);

  if (view === "mobile") {
    return (
      <div className="download-controls">
        <Notice title="EyePause runs on macOS" role={null}>
          You&apos;re on a phone or tablet. Copy the link and open it on your
          Mac to download.
        </Notice>
        <div className="mt-4">
          <CopyLink />
        </div>
        <MetaRow parts={downloadMeta(fallback, null)} />
      </div>
    );
  }

  return (
    <div className="download-controls">
      <PlatformPicker
        choices={options.map((o) => ({
          id: o.platformId,
          label: o.label,
          comingSoon: o.status === "coming-soon",
          available: o.status === "available",
        }))}
        selected={selected.platformId}
        recommended={detectedOption?.platformId ?? null}
        onSelect={setOverride}
      />
      <div aria-live="polite">
        <div className="release-title">
          <strong>
            EyePause for{" "}
            {selected.platformId === "macos" ? "Mac" : selected.label}
          </strong>
          <span>
            {view === "ready"
              ? "Free download"
              : view === "coming-soon"
                ? "Coming soon"
                : "Available soon"}
          </span>
        </div>
        <DownloadButton
          key={selected.platformId}
          option={selected}
          view={view}
          installSteps={installSteps}
        />
      </div>
    </div>
  );
}
