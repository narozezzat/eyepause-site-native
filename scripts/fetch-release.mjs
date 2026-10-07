// Fetches the latest EyePause release from the private app repo, copies its
// installers into public/downloads/, and writes src/data/release.json.
//
// Env:
//   EYEPAUSE_RELEASES_TOKEN  read-only token for the private repo (or GITHUB_TOKEN)
//   EYEPAUSE_REPO            owner/name, default narozezzat/EyePause
//   RELEASE_REQUIRED=true    fail instead of falling back (used in CI so a broken
//                            download page is never deployed)
//
// Locally: EYEPAUSE_RELEASES_TOKEN=$(gh auth token) npm run fetch-release

import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const releasePath = join(root, "src/data/release.json");
const downloadsDir = join(root, "public/downloads");
const repo = process.env.EYEPAUSE_REPO ?? "narozezzat/EyePause";
const token = process.env.EYEPAUSE_RELEASES_TOKEN || process.env.GITHUB_TOKEN;
const required = process.env.RELEASE_REQUIRED === "true";
const wanted = /\.(dmg|zip)$/i;

async function api(path, accept = "application/vnd.github+json") {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "eyepause-site",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  return res;
}

async function sizeOnDisk(file) {
  try {
    return (await stat(file)).size;
  } catch {
    return -1;
  }
}

async function download(asset) {
  const file = join(downloadsDir, asset.name);
  if ((await sizeOnDisk(file)) === asset.size) {
    console.log(`  ${asset.name}: already present`);
    return;
  }
  const res = await api(`/repos/${repo}/releases/assets/${asset.id}`, "application/octet-stream");
  await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
  const written = await sizeOnDisk(file);
  if (written !== asset.size) {
    throw new Error(`${asset.name}: expected ${asset.size} bytes, wrote ${written}`);
  }
  console.log(`  ${asset.name}: ${(asset.size / 1e6).toFixed(1)} MB`);
}

async function main() {
  if (!token) throw new Error("no EYEPAUSE_RELEASES_TOKEN or GITHUB_TOKEN set");
  const release = await (await api(`/repos/${repo}/releases/latest`)).json();
  const assets = (release.assets ?? []).filter((a) => wanted.test(a.name));
  if (assets.length === 0) throw new Error(`release ${release.tag_name} has no .dmg or .zip`);

  console.log(`Release ${release.tag_name}`);
  await mkdir(downloadsDir, { recursive: true });
  for (const asset of assets) await download(asset);

  const data = {
    version: String(release.tag_name).replace(/^v/, ""),
    publishedAt: release.published_at,
    source: "remote",
    assets: assets.map((a) => ({ name: a.name, size: a.size, available: true })),
  };
  await writeFile(releasePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${releasePath}`);
}

main().catch(async (error) => {
  if (required) {
    console.error(`fetch-release failed: ${error.message}`);
    process.exit(1);
  }
  const current = JSON.parse(await readFile(releasePath, "utf8"));
  console.warn(
    `fetch-release: ${error.message}. Using checked-in release.json (${current.version}, source: ${current.source}).`,
  );
});
