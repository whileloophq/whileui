---
name: review-perspectives
description: >-
  Perspective-based self-review of the current branch using the repo's review cards in
  docs/review-perspectives/. Reviews the branch diff against main from all five
  perspectives in parallel and reports only improvements (CR/QUESTION), never what is
  satisfied. Optionally takes a GitHub issue number or URL for intent context. Use before
  opening or updating a PR.
---

# Perspective-Based Branch Review

Review the current branch from the five perspectives in `docs/review-perspectives/`,
reporting only what could be improved. This is the author's self-review; it does not
replace a human one.

## 1. Guard

If `docs/review-perspectives/` does not exist, say so and stop.

## 2. Diff scope

- Base: `git merge-base HEAD origin/main` (fall back to local `main`).
- Scope: `git diff <merge-base>...HEAD` **plus** uncommitted working-tree changes.
- Collect `git diff --stat`. If empty, report nothing to review and stop.

## 3. Intent (optional)

- If invoked with an argument (`/review-perspectives 12` or an issue URL), fetch it:
  `gh issue view <n> --json number,title,body`.
- Otherwise take the first standalone number in the branch name; if the fetched title
  is clearly unrelated to the diff, drop it and say the review ran without intent.

## 4. Fan out — one subagent per card

Launch **five subagents in parallel, one Agent call per card, in a single message**:

1. Token discipline — `01-tokens.md`
2. Renderer boundary — `02-renderer-boundary.md`
3. Docs and showcase — `03-docs-and-showcase.md`
4. Bloat — `04-bloat.md`
5. Accessibility and touch — `05-accessibility-touch.md`

Each prompt includes: branch name, merge-base SHA, changed-file list (the agent reads
the diff itself — do not paste it), the issue if found, and these instructions:

- Read exactly **one** card; use its Review Process, Key Questions, Red Flags and
  Codebase-Specific Patterns as the checklist.
- Read changed files with surrounding context where a finding needs it.
- Report only what is visible from this perspective.
- Findings only — no praise, no "satisfied" items. Each: `file:line`, severity `CR`
  (change needed) or `QUESTION` (needs clarification), one short paragraph, optional
  one-line suggestion. Return exactly "no findings" if clean.

## 5. Merge

Combine. If two perspectives flag the same `file:line`, keep it under the more
relevant card and note the overlap once.
