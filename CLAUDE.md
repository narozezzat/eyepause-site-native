# CLAUDE.md

@AGENTS.md

## Claude Code specifics

`AGENTS.md` is the shared source of truth. Put project rules there, not here. This file holds only Claude-specific behavior.

- **Plan first** for anything touching 3+ files, `globals.css` tokens, the theme system or the download flow: state the plan and affected files before editing.
- **Inspect before editing.** Read the component, its CSS in `globals.css` and every usage before changing it.
- **Visual verification.** For UI or CSS changes, build, serve `out/` and compare screenshots before and after at 375 / 768 / 1440 in light and dark. A refactor must show no pixel changes.
- **Verification.** Run `npm run lint && npm run typecheck && npm test && npm run build` yourself before reporting done. Paste failing output. Never say "should work".
- **Edits.** Prefer editing existing files over creating new ones. Don't create docs unless asked.
- **Memory.** When the user corrects an approach or states a preference, propose adding it to `AGENTS.md`.
