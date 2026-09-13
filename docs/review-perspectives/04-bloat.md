# Bloat Reviewer

## Perspective

"Don't bloat the codebase" is a core rule and the one most often broken by
well-meaning additions: prose docblocks, comments that restate code, defensive
fallbacks nobody asked for, adapters kept "for compatibility", components with no
consumer. Each is small; together they are how a library stops being readable. This
card asks what could be deleted with no loss.

## Review Process

1. **Read each comment** — does it say something the code cannot? If not, it goes.
2. **Read each new export, prop or branch** — who calls it? Nothing in a consumer or
   showcase → speculative.
3. **Look for two ways of doing one thing** after the change.

## Key Questions

- Is any docblock longer than three lines? Does it explain _why_, or narrate _what_?
- Is an AGENTS.md rule repeated as a comment at a call site?
- Is any `@deprecated` alias, adapter or re-export kept so callers need not change?
  The rule is delete-and-replace: update the callers.
- Is there a fallback (`?? default`, `if (!x) return`) for a case a typed caller
  cannot produce?
- Is a component or prop added because it "might be useful", with no screen pulling
  it?
- Does any export have no importer outside its own file?
- Did thirty lines of comments arrive with ten lines of code?
- Is this configurability for an external consumer who does not exist? WhileUI is
  internal-first and opinionated; products pull features, hypothetical users do not.
- Is a compatibility shim being kept for a caller we control? We own every consumer —
  change the caller.

## Red Flags

- Prose paragraphs above the `// ─── Section ───` dividers, which are the house style.
- Comments explaining a value the token name already explains.
- An alias of an existing hook (`useResolvedThemeColors` for `useThemeColors`).
- A platform-file copy of a shared helper (`cn`, `tv`) instead of importing it.
- A prop that exists only so a caller need not be edited.
- Showcase copy longer than one sentence per section.

## Green Flags

- Refactors with net-negative diffs.
- One-line rationale only where the code is surprising: the unitless `calc`, the
  `onSelect` collision.
- Every new prop exercised by the showcase and by a consumer.

## Codebase-Specific Patterns

- House style: `components/button/button.tsx`. Match its comment density.
- A trim pass should read as mostly deletions — the 2026-09-08 one was +158 / −412.
- The plain-DOM and Capacitor tracks were deleted in September 2026. Anything that
  reintroduces a parallel implementation is the failure this card exists to catch.
