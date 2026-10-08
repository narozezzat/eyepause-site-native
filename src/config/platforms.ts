export type PlatformId = "macos" | "windows" | "linux";

export interface AssetRule {
  /** Matched against release asset file names. */
  pattern: RegExp;
  label: string;
}

export interface PlatformConfig {
  id: PlatformId;
  label: string;
  /** Flip to "available" and add asset rules once a build ships for this platform. */
  status: "available" | "coming-soon";
  requirements: string;
  /** Short form for the meta row under the download button, e.g. "macOS 14+". */
  minimumOs?: string;
  primary?: AssetRule;
  alternate?: AssetRule;
  installSteps: string[];
}

export const platforms: PlatformConfig[] = [
  {
    id: "macos",
    label: "macOS",
    status: "available",
    requirements: "macOS 14 Sonoma or later · Apple silicon and Intel",
    minimumOs: "macOS 14+",
    primary: { pattern: /\.dmg$/i, label: "DMG" },
    alternate: { pattern: /\.zip$/i, label: "ZIP" },
    installSteps: [
      "Open the downloaded EyePause DMG.",
      "Drag EyePause into your Applications folder.",
      "Launch it. The eye icon appears in your menu bar.",
    ],
  },
  {
    id: "windows",
    label: "Windows",
    status: "coming-soon",
    requirements: "Planned",
    installSteps: [],
  },
  {
    id: "linux",
    label: "Linux",
    status: "coming-soon",
    requirements: "Planned",
    installSteps: [],
  },
];
