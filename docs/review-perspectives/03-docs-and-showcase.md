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
2. **Find each one's README row or section, its showcase demo, and any
   doc that names it.**
3. **Check the docs still describe reality** — commands run, paths exist, the
   consumers named are the real ones.

## Key Questions

- New or changed component/block: README table row? API section if the props are
  notable? Demo in `apps/showcase`?
- Removed or renamed: gone from README, the showcase, and `index.ts`?
- New export path: in `package.json` `exports` **and** documented?
- Does any doc still name a file, command or directory this diff deletes?
- Extracted from an app: does the app import it in this change, or is there a dated
  entry in that app's backlog?
- New export: is its maturity level declared, and is the claim honest? A showcase demo
  is `experimental`; `stable` needs a shipped product call site (`PLAN.md` > Maturity
  and lifecycle).
- Does the diff contradict `PLAN.md` — a dependency off the pinned stack, a rule it
  quietly drops? Either the plan changes in this diff or the code does.
- **This repo is public.** Does any tracked file name a consuming app, its screens, its
  business model or a path inside its repo? That belongs in `CONSUMERS.md`, which is
  gitignored. Same test for the commit message.
- Does it make a claim about another project? The bar is that the claim is verified
  against that project's source, neutral in tone, and load-bearing for a decision we are
  documenting. "Library X has no tests" fails all three — cut it or verify it
  (`AGENTS.md` > Attribution).

## Red Flags

- `README.md` unchanged in a diff that adds or removes an export.
- A showcase `Pending` list still naming something this diff ported.
- `AGENTS.md` checklist steps referencing paths the diff removes.
- "frozen", "primary", "first consumer" claims that contradict `ROADMAP.md`.
- A tracked file linking to `TODO.md`, which is gitignored.
- A `stable` claim with no product call site behind it.
- A consuming app named, or one of its paths quoted, in a tracked file.

## Green Flags

- README, showcase and `TODO.md` change in the same commit as the code.
- `git grep` for an old name returns nothing after a rename.

## Codebase-Specific Patterns

- README: Components table, Blocks table, and per-component API sections further
  down.
- `apps/showcase/App.tsx` is the executable component catalog for native and React
  Native Web.
- `ROADMAP.md` is direction, `PLAN.md` is the foundation plan and phases, `AGENTS.md`
  is day-to-day rules. A diff that outdates one of them must change it.
- `TODO.md` is local. Summarise its content in tracked docs; never link to it.
