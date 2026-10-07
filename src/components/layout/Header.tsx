import { BrandMark } from "@/components/brand/BrandMark";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./layout.module.css";

const links = [
  { href: "#tour", label: "Tour" },
  { href: "#features", label: "Features" },
  { href: "#download", label: "Download" },
];

export function Header({ home = "#" }: { home?: string }) {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href={home} aria-label="EyePause home">
        <BrandMark />
        <span aria-hidden="true">EyePause</span>
      </a>
      <div className={styles.end}>
        <nav aria-label="Primary" className={styles.nav}>
          {links.map((l) => (
            <a key={l.href} href={home === "#" ? l.href : `${home}${l.href}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
