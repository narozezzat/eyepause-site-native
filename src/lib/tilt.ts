type Point = { x: number; y: number };
type Rect = { left: number; top: number; width: number; height: number };

const clamp = (value: number) => Math.min(1, Math.max(-1, value));
/** Avoids -0 so callers see a plain 0. */
const round = (value: number) => Math.round(value * 100) / 100 + 0;

/** Pointer position scaled to clamped rotateX / rotateY angles in degrees. */
export function tiltAngles(point: Point, rect: Rect, max: Point): { rx: number; ry: number } {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp(((point.x - rect.left) / rect.width) * 2 - 1);
  const ny = clamp(((point.y - rect.top) / rect.height) * 2 - 1);
  return { rx: round(-ny * max.x), ry: round(nx * max.y) };
}
