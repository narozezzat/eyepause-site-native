import { cn } from "@/lib/utils";
import { EyeGlyph } from "./EyeGlyph";

/** Rounded app mark: the eye on a solid ink tile. */
export function BrandMark({ size = "small" }: { size?: "small" | "large" }) {
  const large = size === "large";
  return (
    <span
      className={cn(
        "grid flex-none place-items-center bg-fg text-bg",
        large ? "size-14 rounded-card" : "size-7 rounded-[calc(var(--radius-control)-2px)]",
      )}
    >
      <EyeGlyph className={large ? "size-8" : "size-4"} solidPupil />
    </span>
  );
}
