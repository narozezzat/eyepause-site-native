"use client";

import { ArrowDownToLine, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/Notice";
import { useDownloadState } from "@/hooks/useDownloadState";
import {
  downloadMeta,
  type DownloadFile,
  type DownloadOption,
  type DownloadView,
} from "@/lib/releases";
import { InstallSteps } from "./InstallSteps";

interface DownloadButtonProps {
  option: DownloadOption;
  view: Exclude<DownloadView, "mobile">;
  installSteps: string[];
}

function ArrowIcon({ done }: { done: boolean }) {
  const Icon = done ? Check : ArrowDownToLine;
  return <Icon className="size-4 flex-none" aria-hidden="true" focusable="false" />;
}

/** version · size · macOS 14+ · date, as honest small print under the button. */
export function MetaRow({ parts }: { parts: string[] }) {
  return <p className="meta wrap-anywhere">{parts.join(" · ")}</p>;
}

function deviceName(option: DownloadOption) {
  return option.platformId === "macos" ? "Mac" : option.label;
}

export function DownloadButton({
  option,
  view,
  installSteps,
}: DownloadButtonProps) {
  if (view === "ready" && option.primary) {
    return (
      <ReadyButton
        option={option}
        primary={option.primary}
        installSteps={installSteps}
      />
    );
  }

  if (view === "coming-soon") {
    return (
      <div className="animate-rise">
        <Notice
          className="download-message"
          role={null}
          title={`No ${option.label} build yet`}
        >
          EyePause is a Mac app for now. A {option.label} version is planned and
          will be offered here when it ships.
        </Notice>
        <button className="btn download-button" disabled>
          Coming soon
        </button>
      </div>
    );
  }

  if (view === "error" && option.alternate) {
    const alt = option.alternate;
    return (
      <div className="animate-rise">
        <Notice
          className="download-message"
          tone="error"
          role={null}
          title={`The ${deviceName(option)} installer is missing from this release`}
        >
          Version {option.version} shipped without its usual disk image. The .
          {alt.label.toLowerCase()} below installs the same app: unzip it and
          drag EyePause to Applications.
        </Notice>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            href={alt.href}
            download={alt.name}
            size="lg"
            fullWidth
            className="sm:w-auto"
            icon={<ArrowIcon done={false} />}
          >
            Download .{alt.label.toLowerCase()}
          </Button>
        </div>
        <MetaRow parts={downloadMeta(option, alt)} />
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <MetaRow parts={downloadMeta(option, null)} />
      <button className="btn download-button" disabled>
        Download available soon
      </button>
      <Notice
        className="download-message"
        role={null}
        title="Installer not available yet"
      >
        The installer for version {option.version} isn&apos;t attached to this
        page yet. Nothing is wrong on your side. Please check back a little
        later.
      </Notice>
      <p className="mt-3 text-caption text-fg-subtle text-pretty">
        Requires {option.requirements}.
      </p>
    </div>
  );
}

function ReadyButton({
  option,
  primary,
  installSteps,
}: Omit<DownloadButtonProps, "view"> & { primary: DownloadFile }) {
  const { state, begin } = useDownloadState();
  const busy = state === "starting";
  const done = state === "started";
  const label = busy
    ? "Starting download…"
    : done
      ? "Download started"
      : `Download for ${deviceName(option)}`;

  return (
    <div>
      <MetaRow parts={downloadMeta(option)} />
      <div className="download-actions">
        <Button
          href={primary.href}
          download={primary.name}
          size="lg"
          busy={busy}
          fullWidth
          className="native-download-action"
          icon={<ArrowIcon done={done} />}
          onClick={(event) => {
            if (busy) {
              event.preventDefault();
              return;
            }
            begin();
          }}
        >
          {label}
        </Button>
        {option.alternate && (
          <a
            className="inline-flex min-h-11 items-center rounded-control text-body-sm text-fg-muted underline decoration-border-strong underline-offset-4 transition-colors duration-150 hover:text-fg hover:decoration-fg"
            href={option.alternate.href}
            download={option.alternate.name}
          >
            or .{option.alternate.label.toLowerCase()}
          </a>
        )}
      </div>
      {done && installSteps.length > 0 && (
        <div className="install animate-rise">
          <Notice tone="success" title="Your download has started" role={null}>
            <InstallSteps steps={installSteps} />
            <p className="mt-3 text-caption">
              Didn&apos;t start?{" "}
              <a
                className="inline-flex min-h-11 items-center text-fg underline decoration-border-strong underline-offset-4 hover:decoration-fg"
                href={primary.href}
                download={primary.name}
              >
                Download again
              </a>
            </p>
          </Notice>
        </div>
      )}
    </div>
  );
}
