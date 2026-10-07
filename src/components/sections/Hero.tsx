import { DownloadPanel } from "@/components/download/DownloadPanel";
import type { DownloadOption } from "@/lib/releases";
import { ProductShot } from "./ProductShot";

export function Hero({ options }: { options: DownloadOption[] }) {
  const version = (options.find((o) => o.platformId === "macos") ?? options[0])?.version;

  return (
    <section
      className="grid grid-cols-1 items-start gap-10 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pt-14 lg:pb-28"
      aria-labelledby="hero-h"
    >
      <div id="download" className="scroll-mt-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.75 font-mono text-xs leading-none font-medium text-fg-muted">
          <i className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          {version ? `v${version} · ` : ""}Free · No account
        </span>
        <h1 id="hero-h" className="mt-5.5 text-display font-semibold tracking-[-0.035em] text-balance">
          A break reminder that lives in your menu bar.
        </h1>
        <p className="mt-5 max-w-[44ch] text-lede text-fg-muted">
          Every 20 minutes, EyePause asks you to look 20 feet away for 20 seconds. It pauses on
          idle, lock and calls, then gets out of the way.
        </p>
        <DownloadPanel options={options} />
      </div>
      <ProductShot />
    </section>
  );
}
