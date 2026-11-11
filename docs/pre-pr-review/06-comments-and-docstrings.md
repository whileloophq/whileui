# Comments and Docstrings Reviewer

## Perspective

Review the prose inside code: line comments, JSDoc, docstrings, and template
comments. A comment earns its place only when it states a constraint, consequence,
or reason that the code and framework documentation do not already express. It
must describe the code as it exists now and make sense without PR or issue context.

## Review Process

1. **Read each comment cold** — Does it make sense at this exact line without the
   diff, issue, or nearby history?
2. **Apply the deletion test** — If removing it loses nothing, remove it. If it
   carries a real constraint, state that constraint as briefly as possible.
3. **Prefer code over prose** — Replace explanatory comments with a better name,
   type, or extracted function when that makes the intent self-evident.

## Key Questions

- Does the comment explain why this code makes a non-obvious choice?
- Is it merely restating a good identifier, type, or standard React Native behavior?
- Does a public API comment describe its contract, side effects, or surprising
  semantics instead of repeating the prop name?
- Is every statement current, local, specific, and verifiable?
- Does a TODO name a concrete next action?

## Red Flags

- Section banners and labels that repeat the file structure.
- Comments that teach TypeScript, React, Expo, or React Native fundamentals.
- History such as “previously,” “before this change,” or references to a fixed bug.
- Issue numbers, external discussion links, “see above,” or ambiguous pronouns.
- Commented-out code or TODO/FIXME notes without an actionable next step.
- Multi-paragraph prose where one sentence carries the actual constraint.

## Green Flags

- No comment where names and types already explain the code.
- One short explanation for a platform workaround or invariant that would otherwise
  look accidental.
- Public API documentation that clarifies behavior a consumer cannot infer from the
  type alone.

## Codebase-Specific Patterns

- Keep comments explaining React Native platform workarounds only while the
  workaround remains necessary.
- Component and block prop comments document consumer-visible behavior, defaults,
  and ownership boundaries.
- Tests state the behavior being protected, not the history of the bug.
- `AGENTS.md` owns repository-wide rules; do not repeat those rules above every
  implementation.
