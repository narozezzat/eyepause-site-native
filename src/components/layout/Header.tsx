import { ArrowDownToLine } from "lucide-react";
import { sections } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header({ home = "#main" }: { home?: string }) {
  const to = (hash: string) => (home === "#main" ? hash : `${home}${hash}`);
  return (
    <header className="header">
      <nav className="wrap nav" aria-label="Main navigation">
        <a className="brand" href={home} aria-label="EyePause home">
          <span className="logo">
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
          </span>
          EyePause
        </a>
        <div className="nav-right">
          <div className="nav-links">
            {sections.map((section) => (
              <a key={section.id} className="nav-link" data-nav={section.id} href={to(`#${section.id}`)}>
                {section.label}
              </a>
            ))}
            <span className="nav-indicator" aria-hidden="true" />
          </div>
          <ThemeToggle />
          <a className="nav-download" href={to("#download")}>
            Download
            <ArrowDownToLine aria-hidden="true" />
          </a>
          <MobileNav links={sections.map((section) => ({ href: to(`#${section.id}`), index: section.index, label: section.label }))} />
        </div>
      </nav>
    </header>
  );
}
