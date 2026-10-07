"use client";

import { useId } from "react";
import { useDownloadState } from "@/hooks/useDownloadState";
import { formatBytes, formatDate } from "@/lib/format";
import type { DownloadFile, DownloadOption } from "@/lib/releases";
import { PlatformIcon } from "./PlatformIcon";
import styles from "./download.module.css";

interface DownloadButtonProps {
  option: DownloadOption;
  installSteps: string[];
  recommended: boolean;
}

export function DownloadButton({ option, installSteps, recommended }: DownloadButtonProps) {
  if (option.status === "coming-soon") {
    return (
      <div className={styles.empty}>
        <b>No {option.label} build yet</b>
        <p>
          EyePause is macOS-only for now. {option.label} support is planned and will be available
          here when it ships.
        </p>
      </div>
    );
  }

  if (option.status === "unavailable" || !option.primary) {
    return <UnavailableButton option={option} />;
  }

  return (
    <AvailableButton
      option={option}
      primary={option.primary}
      installSteps={installSteps}
      recommended={recommended}
    />
  );
}

function downloadTitle(option: DownloadOption): string {
  return `Download for ${option.platformId === "macos" ? "Mac" : option.label}`;
}

function UnavailableButton({ option }: { option: DownloadOption }) {
  const noteId = useId();
  return (
    <>
      <button type="button" className={`${styles.primary} ${styles.off}`} disabled aria-describedby={noteId}>
        <span className={styles.ic}>
          <PlatformIcon platformId={option.platformId} />
        </span>
        <span>
          <b>{downloadTitle(option)}</b>
          <small>Temporarily unavailable</small>
        </span>
      </button>
      <div className={styles.error} id={noteId}>
        <b>Download temporarily unavailable</b>
        <p>
          The installer for version {option.version} could not be attached to this page. Nothing is
          wrong on your side. Please check back a little later.
        </p>
      </div>
    </>
  );
}

function AvailableButton({
  option,
  primary,
  installSteps,
  recommended,
}: DownloadButtonProps & { primary: DownloadFile }) {
  const { state, begin } = useDownloadState();
  const busy = state === "starting";
  const done = state === "started";
  const title = busy ? "Preparing download…" : done ? "Downloading EyePause" : downloadTitle(option);

  return (
    <>
      <a
        className={styles.primary}
        href={primary.href}
        download={primary.name}
        aria-busy={busy || undefined}
        onClick={() => {
          if (state === "idle") begin();
        }}
      >
        <span className={styles.ic}>
          {busy ? <span className={styles.spinner} aria-hidden="true" /> : <PlatformIcon platformId={option.platformId} />}
        </span>
        <span>
          <b>{title}</b>
          <small>
            {recommended ? `Recommended for this ${option.platformId === "macos" ? "Mac" : "device"} · ` : ""}
            {primary.label} · {formatBytes(primary.size)}
          </small>
        </span>
        <span className={styles.chev} aria-hidden="true">
          {done ? "✓" : "↓"}
        </span>
      </a>
      <div className={styles.sub}>
        <span>
          Version {option.version} · {formatDate(option.publishedAt)}
        </span>
        {option.alternate && (
          <a href={option.alternate.href} download={option.alternate.name}>
            Also as .{option.alternate.label.toLowerCase()} · {formatBytes(option.alternate.size)}
          </a>
        )}
      </div>
      {done && installSteps.length > 0 && (
        <div className={styles.done}>
          <b>Almost there</b>
          <ol>
            {installSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className={styles.retry}>
            Didn&apos;t start?{" "}
            <a href={primary.href} download={primary.name}>
              Download again
            </a>
          </p>
        </div>
      )}
    </>
  );
}
