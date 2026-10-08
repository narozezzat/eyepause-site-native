export function NativeIcons() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <defs>
        <symbol id="eye" viewBox="0 0 24 24">
          <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </symbol>
        <symbol id="pause" viewBox="0 0 24 24">
          <path d="M8 5v14M16 5v14" />
        </symbol>
        <symbol id="skip" viewBox="0 0 24 24">
          <path d="m5 5 10 7-10 7V5Zm13 0v14" />
        </symbol>
        <symbol id="sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </symbol>
        <symbol id="sliders" viewBox="0 0 24 24">
          <path d="M4 7h9m4 0h3M4 17h3m4 0h9" />
          <circle cx="15" cy="7" r="2" />
          <circle cx="9" cy="17" r="2" />
        </symbol>
        <symbol id="sound" viewBox="0 0 24 24">
          <path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
        </symbol>
      </defs>
    </svg>
  );
}
