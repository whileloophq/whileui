---
'@thewhileloop/whileui': patch
---

Build the published types with TypeScript 6.

Expo SDK 57 pins `typescript@~6.0.3`, and the rule in `AGENTS.md` is that the SDK's pin
wins for anything it bundles. The library was still emitting `dist/*.d.ts` from 5.9,
which meant the types a consumer installed were produced by a different compiler than
the one their app typechecks with.

Nothing in the public API changed. If you are on the supported stack you need to do
nothing; `expo install --fix` already moves you to TS 6.

Two things to know if you hit the migration yourself:

- TypeScript 6 no longer includes `@types/*` packages automatically. Name them in
  `compilerOptions.types` (`["jest", "node"]`) or every test global becomes
  `Cannot find name`.
- A workspace-level `typescript` pin overrides the root one, and a stale copy under
  `node_modules` survives an install that reports no changes. Confirm with
  `bunx tsc --version` inside the workspace, not at the root.
