import { BrandMark } from "@/components/brand/BrandMark";
import styles from "@/components/brand/brand.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status">
      <span className={styles.pulse}>
        <BrandMark size="large" />
      </span>
      <span className="visually-hidden">Loading EyePause</span>
    </div>
  );
}
