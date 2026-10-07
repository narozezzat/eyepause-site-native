import { BrandMark } from "@/components/brand/BrandMark";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <span className="animate-pulse-soft">
        <BrandMark size="large" />
      </span>
      <span className="sr-only">Loading EyePause</span>
    </div>
  );
}
