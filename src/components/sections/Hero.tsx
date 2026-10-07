import { DownloadPanel } from "@/components/download/DownloadPanel";
import type { DownloadOption } from "@/lib/releases";
import { ProductShot } from "./ProductShot";
import styles from "./sections.module.css";

export function Hero({ options }: { options: DownloadOption[] }) {
  const version = (options.find((o) => o.platformId === "macos") ?? options[0])?.version;

  return (
    <section className={styles.hero} aria-labelledby="hero-h">
      <div id="download" className={styles.anchor}>
        <span className={styles.tag}>
          <i aria-hidden="true" />
          {version ? `v${version} · ` : ""}Free · No account
        </span>
        <h1 id="hero-h">A break reminder that lives in your menu bar.</h1>
        <p className={styles.lede}>
          Every 20 minutes, EyePause asks you to look 20 feet away for 20 seconds. It pauses on
          idle, lock and calls, then gets out of the way.
        </p>
        <DownloadPanel options={options} />
      </div>
      <ProductShot />
    </section>
  );
}
