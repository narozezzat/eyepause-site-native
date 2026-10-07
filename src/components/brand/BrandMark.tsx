import { EyeGlyph } from "./EyeGlyph";
import styles from "./brand.module.css";

/** Rounded app mark: the eye on a solid ink tile. */
export function BrandMark({ size = "small" }: { size?: "small" | "large" }) {
  return (
    <span className={size === "large" ? `${styles.mark} ${styles.large}` : styles.mark}>
      <EyeGlyph solidPupil />
    </span>
  );
}
