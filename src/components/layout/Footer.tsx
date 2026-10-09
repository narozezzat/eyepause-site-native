export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span className="brand">
          <svg aria-hidden="true">
            <use href="#eye" />
          </svg>
          EyePause
        </span>
        <span>A little less screen. A little more around you.</span>
        <span className="footer-credit">
          <span className="footer-copy">©</span> {new Date().getFullYear()}{" "}
          <strong>Naroz Ezzat</strong>
        </span>
      </div>
    </footer>
  );
}
