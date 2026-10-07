"use client";

import { useId } from "react";
import { useDownloadState } from "@/hooks/useDownloadState";
import { formatBytes, formatDate } from "@/lib/format";
import type { DownloadFile, DownloadOption } from "@/lib/releases";
import { PlatformIcon } from "./PlatformIcon";
import { cn } from "@/lib/cn";

/** Bordered note card under the download button (install steps, empty and error states). */
export const noteCard = "animate-rise rounded-xl border text-sm";
export const noteSpacing = "mt-3.5 px-4 py-3.5";
export const noteColors = "border-border bg-surface";

const primaryBase =
  "flex min-h-16 w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left no-underline focus-visible:outline-offset-3";
const iconTile = "grid size-9 flex-none place-items-center rounded-[9px]";
const titleText = "block text-body font-semibold";
const metaText = "block font-mono text-xs leading-[1.4] opacity-80";

interface DownloadButtonProps {
  option: DownloadOption;
  installSteps: string[];
  recommended: boolean;
}

export function DownloadButton({ option, installSteps, recommended }: DownloadButtonProps) {
  if (option.status === "coming-soon") {
    return (
      <div className={cn(noteCard, noteColors, "p-4.5 [animation-duration:0.3s]")}>
        <b className="block font-semibold">No {option.label} build yet</b>
        <p className="mt-1 text-sm text-fg-muted">
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
      <button
        type="button"
        className={cn(primaryBase, "cursor-not-allowed bg-surface-2 text-fg-subtle")}
        disabled
        aria-describedby={noteId}
      >
        <span className={cn(iconTile, "bg-surface")}>
          <PlatformIcon className="size-4.5" platformId={option.platformId} />
        </span>
        <span>
          <b className={titleText}>{downloadTitle(option)}</b>
          <small className={metaText}>Temporarily unavailable</small>
        </span>
      </button>
      <div className={cn(noteCard, noteSpacing, "border-danger/35 bg-danger-soft")} id={noteId}>
        <b className="block font-semibold text-danger">Download temporarily unavailable</b>
        <p className="mt-1 text-sm text-fg-muted">
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
        className={cn(
          primaryBase,
          "cursor-pointer bg-accent text-accent-fg transition-[filter,transform] hover:brightness-105 active:scale-[0.99]",
        )}
        href={primary.href}
        download={primary.name}
        aria-busy={busy || undefined}
        onClick={() => {
          if (state === "idle") begin();
        }}
      >
        <span className={cn(iconTile, "bg-white/20")}>
          {busy ? (
            <span
              className="size-4.5 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
          ) : (
            <PlatformIcon className="size-4.5" platformId={option.platformId} />
          )}
        </span>
        <span className="min-w-0">
          <b className={titleText}>{title}</b>
          <small className={metaText}>
            {recommended ? `Recommended for this ${option.platformId === "macos" ? "Mac" : "device"} · ` : ""}
            {primary.label} · {formatBytes(primary.size)}
          </small>
        </span>
        <span className="ml-auto text-lg" aria-hidden="true">
          {done ? "✓" : "↓"}
        </span>
      </a>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 font-mono text-xs leading-normal text-fg-subtle">
        <span className="py-1">
          Version {option.version} · {formatDate(option.publishedAt)}
        </span>
        {option.alternate && (
          <a
            className="inline-flex min-h-11 items-center underline-offset-3 hover:text-fg"
            href={option.alternate.href}
            download={option.alternate.name}
          >
            Also as .{option.alternate.label.toLowerCase()} · {formatBytes(option.alternate.size)}
          </a>
        )}
      </div>
      {done && installSteps.length > 0 && (
        <div className={cn(noteCard, noteSpacing, noteColors)}>
          <b className="block font-semibold">Almost there</b>
          <ol className="mt-1.5 list-decimal pl-4.5 text-fg-muted">
            {installSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-2 text-ui text-fg-subtle">
            Didn&apos;t start?{" "}
            <a
              className="inline-flex min-h-11 items-center text-fg-muted underline underline-offset-3"
              href={primary.href}
              download={primary.name}
            >
              Download again
            </a>
          </p>
        </div>
      )}
    </>
  );
}
