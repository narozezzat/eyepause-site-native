import { EyeGlyph } from "@/components/brand/EyeGlyph";

export default function Loading() {
  return (
    <div className="route-loading grid min-h-[60vh] place-items-center" role="status">
      <EyeGlyph className="size-10 animate-pulse-soft text-fg-subtle" strokeWidth={1.6} />
      <span className="sr-only">Loading EyePause</span>
    </div>
  );
}
