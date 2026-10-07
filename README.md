# eyepause-site-native

Download site for EyePause, the macOS menu bar break reminder. Next.js (App Router) with static export, styled as the "Menu Bar Native" design: a macOS menu bar product shot, a segmented platform picker and a five-tab app tour.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test
npm run build      # static site in out/
```

`src/data/release.json` is a checked-in fallback. With it the page builds, but the download button shows "temporarily unavailable" because no installer files are attached. To build with real installers locally:

```bash
EYEPAUSE_RELEASES_TOKEN=<token> npm run fetch-release && npm run build
```

This copies the latest `.dmg` and `.zip` into `public/downloads/` and rewrites `src/data/release.json`. Don't commit the rewritten file.

## Deploy

GitHub Pages, via `.github/workflows/pages.yml` (push to `main`, manual run, daily schedule, or a release dispatch). The workflow needs the repository secret `EYEPAUSE_RELEASES_TOKEN`: a fine-grained personal access token with **Contents: read** on the private EyePause app repository. Without it the build fails on purpose rather than deploying a page with no downloads.
