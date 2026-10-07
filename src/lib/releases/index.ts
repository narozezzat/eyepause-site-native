import { platforms } from "@/config/platforms";
import { withBasePath } from "@/config/site";
import releaseJson from "@/data/release.json";
import { parseRelease } from "./parse";
import { resolveDownloads } from "./resolve";
import type { DownloadOption, Release } from "./types";

export type { DownloadOption, DownloadFile, DownloadStatus, Release } from "./types";

export function getRelease(): Release {
  return parseRelease(releaseJson);
}

export function getDownloads(): DownloadOption[] {
  return resolveDownloads(getRelease(), platforms, withBasePath("/downloads"));
}
