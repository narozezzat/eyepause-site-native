"use client";

import { useState } from "react";
import { platforms } from "@/config/platforms";
import { useDetectedPlatform } from "@/hooks/useDetectedPlatform";
import { isMobile } from "@/lib/platform/detect";
import type { DownloadOption } from "@/lib/releases";
import { CopyLinkNote } from "./CopyLinkNote";
import { DownloadButton } from "./DownloadButton";
import { PlatformPicker } from "./PlatformPicker";

export function DownloadPanel({ options }: { options: DownloadOption[] }) {
  const detected = useDetectedPlatform();
  const [override, setOverride] = useState<string | null>(null);

  const detectedOption = options.find((o) => o.platformId === detected);
  const fallback = options.find((o) => o.status !== "coming-soon") ?? options[0];
  const selectedId = override ?? detectedOption?.platformId ?? fallback.platformId;
  const selected = options.find((o) => o.platformId === selectedId) ?? fallback;
  const installSteps = platforms.find((p) => p.id === selected.platformId)?.installSteps ?? [];

  return (
    <div className="mt-9 w-full max-w-110">
      <PlatformPicker
        choices={options.map((o) => ({ id: o.platformId, label: o.label }))}
        selected={selected.platformId}
        recommended={detectedOption?.platformId ?? null}
        onSelect={setOverride}
      />
      <div className="mt-3.5 min-h-37.5" aria-live="polite">
        <DownloadButton
          key={selected.platformId}
          option={selected}
          installSteps={installSteps}
          recommended={selected.platformId === detectedOption?.platformId}
        />
      </div>
      {detected !== null && isMobile(detected) && <CopyLinkNote />}
    </div>
  );
}
