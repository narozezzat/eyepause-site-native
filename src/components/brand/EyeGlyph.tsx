interface EyeGlyphProps {
  className?: string;
  strokeWidth?: number;
  /** Fill the pupil, as in the brand mark. */
  solidPupil?: boolean;
  pupilRadius?: number;
}

export const EYE_PATH = "M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z";

/** The EyePause eye: the same outline the app shows in the menu bar. */
export function EyeGlyph({
  className,
  strokeWidth = 2,
  solidPupil = false,
  pupilRadius = 2.6,
}: EyeGlyphProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={EYE_PATH} />
      <circle cx="12" cy="12" r={pupilRadius} fill={solidPupil ? "currentColor" : "none"} />
    </svg>
  );
}
