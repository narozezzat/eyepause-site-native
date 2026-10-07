/** Release metadata written by `scripts/fetch-release.mjs` into `src/data/release.json`. */
export interface ReleaseAsset {
  name: string;
  /** Size in bytes. */
  size: number;
  /** True when the file was copied into `public/downloads/` for this build. */
  available: boolean;
}

export interface Release {
  version: string;
  publishedAt: string;
  /** Where the metadata came from: the live release feed or the checked-in snapshot. */
  source: "remote" | "fallback";
  assets: ReleaseAsset[];
}

export type DownloadStatus = "available" | "coming-soon" | "unavailable";

export interface DownloadFile {
  name: string;
  label: string;
  size: number;
  href: string;
}

export interface DownloadOption {
  platformId: string;
  label: string;
  status: DownloadStatus;
  version: string;
  publishedAt: string;
  requirements: string;
  primary: DownloadFile | null;
  alternate: DownloadFile | null;
}
