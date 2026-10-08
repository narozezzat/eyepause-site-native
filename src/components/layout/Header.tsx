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
          <a className="nav-link" href={to("#details")}>
            A closer look
          </a>
          <ThemeToggle />
          <a className="nav-download" href={to("#download")}>
            Download
            <svg aria-hidden="true">
              <use href="#down" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
