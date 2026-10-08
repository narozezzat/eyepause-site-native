"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlatformChoice {
  id: string;
  label: string;
  comingSoon?: boolean;
  available?: boolean;
}

interface PlatformPickerProps {
  choices: PlatformChoice[];
  selected: string;
  recommended: string | null;
  onSelect: (id: string) => void;
}

/** Segmented control following the ARIA radio group pattern: one tab stop, arrows move and select. */
export function PlatformPicker({
  choices,
  selected,
  recommended,
  onSelect,
}: PlatformPickerProps) {
  return (
    <RadioGroup
      className="platforms"
      aria-label="Platform"
      value={selected}
      onValueChange={onSelect}
      onKeyDown={(event) => {
        // Radix moves focus on Home and End but only selects on arrows.
        if (event.key === "Home") onSelect(choices[0].id);
        else if (event.key === "End") onSelect(choices[choices.length - 1].id);
      }}
    >
      {choices.map((c) => {
        const isRecommended = c.id === recommended;
        const tag = c.comingSoon
          ? "Coming soon"
          : c.available
            ? "Available now"
            : "Available soon";
        const device = c.id === "macos" ? "this Mac" : "this computer";
        const name = isRecommended
          ? `${c.label}, recommended for ${device}`
          : c.comingSoon
            ? `${c.label}, coming soon`
            : undefined;
        return (
          <RadioGroupItem key={c.id} value={c.id} aria-label={name}>
            {c.label}
            <small aria-hidden="true">{tag}</small>
          </RadioGroupItem>
        );
      })}
    </RadioGroup>
  );
}
