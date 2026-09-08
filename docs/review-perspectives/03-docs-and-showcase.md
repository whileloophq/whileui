# Docs and Showcase Reviewer

## Perspective

Docs here have gone stale before: items marked pending months after shipping, a
checklist pointing at a deleted `apps/site`, a roadmap naming the wrong consumer.
The README is the source of truth and the showcases are the proof. A change that
touches a component, block or export without touching them is incomplete by this
repo's own rule.

## Review Process

1. **List what the diff adds, removes or renames** — exports, props, blocks, files,
   scripts.
2. **Find each one's README row or section, its showcase demo (right track), and any
   doc that names it.**
3. **Check the docs still describe reality** — commands run, paths exist, the
   consumers named are the real ones.

## Key Questions

- New or changed component/block: README table row? API section if the props are
  notable? Demo in `apps/site` (DOM) or `apps/showcase` (RN)?
- Removed or renamed: gone from README, the showcase, `index.ts` / `web/index.ts`?
- New export path (`./tokens`, `./web/*`): in `package.json` `exports` **and**
  documented?
- Does any doc still name a file, command or directory this diff deletes?
- Extracted from an app: does the app import it in this change, or is there a dated
  entry in that app's backlog?

## Red Flags

- `README.md` unchanged in a diff that adds or removes an export.
- A showcase `Pending` list still naming something this diff ported.
- `AGENTS.md` checklist steps referencing paths the diff removes.
- "frozen", "primary", "first consumer" claims that contradict `ROADMAP.md`.
- A tracked file linking to `TODO.md`, which is gitignored.

## Green Flags

- README, showcase and `TODO.md` change in the same commit as the code.
- `git grep` for an old name returns nothing after a rename.

## Codebase-Specific Patterns

- README: Components table, Blocks table, "DOM Track" section, per-component API
  sections further down.
- `apps/site/src/tabs.tsx` holds `PENDING` per category — remove the item when it
  ships and add a demo in that tab.
- `TODO.md` is local. Summarise its content in tracked docs; never link to it.
