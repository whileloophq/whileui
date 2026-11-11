# Verification Reviewer

## Perspective

Each verification layer proves something the layer below cannot. The failure mode this
card catches is confident evidence at the wrong altitude: a green unit suite standing
in for a behaviour only a device can demonstrate, or a test asserting an implementation
detail that will break on the next refactor while the user-visible defect walks
through. The question is not "are there tests" but "does the evidence sit where this
change can actually fail".

## What each layer proves

| Layer                 | Proves                                                     | Cannot prove                                                                |
| --------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| Static / React Doctor | Shape, types, suspicious patterns, unawaited promises      | Anything about runtime behaviour                                            |
| `jest-expo` + RNTL    | State, callbacks, a11y props, refs, cleanup, regressions   | OS keyboard, Android back, portal layering, gesture arbitration, real focus |
| Type-contract fixture | The published API still typechecks for a caller            | Runtime behaviour                                                           |
| Maestro (native)      | Keyboard, back, gestures, overlay order on built artifacts | Browser semantics                                                           |
| Playwright (web)      | Tab order, `Escape`, focus return, responsive layout       | Native behaviour                                                            |
| Product flow          | Composition under real data and navigation                 | Device diversity                                                            |

## Review Process

1. **Name the failure mode** each change could produce.
2. **Find the layer that would catch it.** If no layer would, that is the finding.
3. **Read the new tests** — do they assert behaviour a user can observe, or internals?

## Key Questions

- Does a fixed defect have a regression test at the layer where it was found?
- Does an interactive change touch focus, keyboard, gesture, overlay ordering or
  Android back? Those cannot be proven in Jest — is there a device or browser check, or
  a named showcase step?
- Do the tests survive a refactor? Asserting rendered role/name/value survives;
  asserting internal state, class strings or child order does not.
- Are timers, listeners, gesture handlers and animations cleaned up, and is that
  cleanup asserted?
- Does a claim in the diff ("no JS-thread work", "60fps", "keyboard accessible") have
  evidence, or is it an assertion in a commit message?
- Does the change touch dependencies, Metro config or the styling pipeline? A green
  typecheck proves nothing about bundling — did anything actually build? An SDK bump
  that left a non-bundled package behind breaks Metro while `tsc` stays silent.
- Does an assertion depend on a resolved design token? Jest cannot produce
  Metro-compiled CSS, so components fall back under test. Token resolution is proven by
  the browser and device layers, not here.
- Is a test asserting a frame-level timing threshold? Those are flaky — the contract is
  observable latency plus a trace, not a millisecond assertion in a test.
- Does a component being promoted to `stable` have every gate in `PLAN.md` >
  Definition of done, including a shipped product call site?

## Red Flags

- A new interactive component with no contract suite.
- A bug fix with no test that fails without it.
- `await waitFor` wrapped around an assertion that was already synchronous.
- Snapshot tests standing in for behavioural assertions.
- Mocking the very module whose behaviour is under test.
- A skipped or `.only` test left in the diff.
- A `render(...)` or `fireEvent(...)` that is not awaited.
- An `eslint-disable` without a `--` reason, or one covering a whole file. The lint gate
  runs at `--max-warnings 0`, so a silenced rule is the only place a warning can hide.
- A dependency or config change with no evidence anything still bundles.
- "Verified manually" for something a test could hold permanently.

## Green Flags

- One regression test named for the behaviour it protects, not the bug number.
- A platform branch with a test for each branch.
- Evidence moved up a layer when the lower layer was found insufficient.

## Codebase-Specific Patterns

- Component contracts: `jest-expo` + React Native Testing Library. `react-test-renderer`
  is deprecated for React 19 — do not reintroduce it.
- **RNTL v14 is async throughout.** `render`, `fireEvent`, `rerender` and `unmount` all
  return promises — await every one. A missing `await render` fails with "`render`
  function has not been called", which reads like a setup problem and is not; a missing
  `await fireEvent` silently drops the state update and the assertion just sees the old
  UI.
- `src/test/render.tsx` supplies the portal host and fixed safe-area metrics. A test
  building its own provider stack is duplicating it; a test needing a provider that is
  not there should add it to the helper, not locally.
- `src/test/setup.ts` stubs `useCSSVariable`, so components take their fallback path.
- Tests live beside their component as `*.test.tsx` and are excluded from
  `tsconfig.build.json` — typechecked, never published.
- Tests state the behaviour being protected, not the history of the bug
  (`06-comments-and-docstrings.md`).
- `@typescript-eslint/no-floating-promises` is the backstop for the unawaited-RNTL trap
  above, and `jest/no-focused-tests` for the `.only` one. Both are errors, so neither
  reaches review — unless someone disabled them.
