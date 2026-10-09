export function Footer() {
  return (
    <div className="footer-bleed">
      <div className="wrap">
        <footer className="site-footer">
          <i className="horizon footer-horizon" aria-hidden="true" />
          <span className="brand">
            <svg aria-hidden="true">
              <use href="#eye" />
            </svg>
            EyePause
          </span>
          <span className="footer-tagline serif">A little less screen. A little more around you.</span>
          <span className="footer-credit">
            <span className="footer-copy">©</span> {new Date().getFullYear()}{" "}
            <strong>Naroz Ezzat</strong>
          </span>
        </footer>
      </div>
    </div>
  );
}
