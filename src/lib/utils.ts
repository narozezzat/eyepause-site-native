import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom @theme scales in globals.css. Without this it
// reads `text-body-sm` as a color and drops a real color class like `text-fg`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["body-sm", "caption", "display", "lede", "micro", "section", "title"],
      radius: ["control", "card", "window"],
      tracking: ["caps"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
