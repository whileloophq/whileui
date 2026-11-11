# Distribution Reviewer

## Perspective

Our own products install WhileUI from npm, so a packaging mistake is a product bug that
the monorepo cannot see. Workspace resolution hides missing `files`, broken export maps,
undeclared dependencies, duplicated peers and Uniwind classes that stop being detected
once the package sits in `node_modules`. This card reviews what a consumer receives,
not what the repo contains.

**Run this card when the diff touches** `package.json`, the export map, `tsconfig`,
dependencies, `src/index.ts`, `src/tokens.ts`, `src/vite.ts`, `fixtures/`, `global.css`
or anything under `metro.config.js`. Skip it otherwise.

## Review Process

1. **Ask what the tarball contains** after this change — `files`, `exports`, `dist`.
2. **Trace one public import** end to end, from both Metro/Expo and Vite/RNW.
3. **Check dependency placement** — peer, dependency, or dev.

## Key Questions

- Does a new public entry point appear in `exports`, in `files`, and in a fixture import
  test? Every subpath is verified from both consumer environments.
- Does anything rely on a deep import into internals? That is not a supported path.
- Is a new runtime import declared? A workspace symlink resolves hoisted packages the
  consumer will not have.
- Should this be a **peer**? React, React Native, RNW, Reanimated, Worklets, Gesture
  Handler and RN Primitives break when duplicated — context and native registration are
  singletons. Optional capabilities are optional peers behind adapters.
- Do peer ranges match the pinned stack in `PLAN.md`, or are they wider than what we
  actually test?
- Does the change introduce class names that Uniwind must discover in the **published**
  artifact? A consumer may need `@source` pointing into `node_modules`, and detection
  can fail when only compiled JS ships. The monorepo's
  `@source '../../packages/ui/src'` is not evidence.
- Would `publint` or `@arethetypeswrong/cli` have something to say about this?
- If conditional exports are used, does `browser` precede the community `react-native`
  condition so RNW resolves correctly?

## Red Flags

- A new export in `src/index.ts` with no corresponding README entry or fixture import.
- A runtime import added to `dependencies` that should be a peer, or vice versa.
- A peer range wider than the stack we test (`expo >=52` while we support 57).
- A new file type in `dist` that `files` does not ship.
- Test files, fixtures or harness code reaching `dist` — `tsconfig.build.json` excludes
  them; a new test location must be excluded there too.
- Evidence gathered against the workspace package rather than the packed tarball.
- A consumer-side config change documented only in a commit message.

## Green Flags

- Export map stays small; one new subpath, one new fixture import.
- Peer range moves in the same diff as the stack it tracks.
- A packaging change comes with the fixture that would have caught it.

## Codebase-Specific Patterns

- `fixtures/type-smoke` compiles the public types as a consumer;
  `fixtures/vite-smoke` proves React Native Web consumption.
- `packages/ui/src/tokens.ts` is the renderer-free entry; it must stay importable
  without React or React Native present.
- `prepack` copies the root `README.md` into the package — the published README is the
  repo README.
- Distribution contract: `PLAN.md` > Distribution contract.
