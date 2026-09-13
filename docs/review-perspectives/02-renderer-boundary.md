# React Native Boundary Reviewer

## Perspective

One public contract — one exported name, one prop contract, one set of state and
accessibility semantics — across iOS, Android and React Native Web. That is not the
same as one implementation. React Native Web deliberately mocks `KeyboardAvoidingView`,
`BackHandler` and `Keyboard`, and does not support `RefreshControl`, so a narrow
`.web.tsx` is sometimes the correct universal architecture. This card checks that every
platform branch is earned and that shared contracts in `src/lib/` stay renderer-free.

## Review Process

1. **Check imports** for React DOM, browser globals, or renderer leakage into `lib/`.
2. **Apply the justification test to every platform branch** — `.web.tsx`,
   `.native.tsx`, `Platform.OS`, `Platform.select`.
3. **Run package and showcase typechecks** with `bun run typecheck`.

## The justification test

A platform branch is earned when **one** of these is true:

- the browser has a different semantic primitive (focus order, form submission, URL
  behaviour, viewport handling);
- the native API is mocked or missing on the other target;
- accessible behaviour would otherwise regress.

It is not earned to shorten a file, to dodge a conditional, or to ship a different
visual design — that is what Uniwind's `ios:` / `android:` / `web:` / `native:`
selectors are for. Styling variants must never hide a _behavioural_ divergence that
deserves a real implementation split.

## Key Questions

- Anything in `src/lib/theme-*`, `visual-token-contract`, `theme-derive`, `tokens.ts`
  importing React, RN or Uniwind?
- Does a component import `react-dom` or a browser global outside a narrow web adapter?
- Does each `Platform.OS` branch pass the justification test, or is it maintaining two
  layouts?
- Does a new platform file keep the same public props, state ownership and
  accessibility intent, so callers cannot tell which one they got?
- Is a Reanimated worklet relied on for UI-thread behaviour on web? There is no separate
  UI thread in browsers — worklets are plain JS there.
- Does a new dependency work under Expo **and** React Native Web, at the pinned stack?

## Red Flags

- A second component tree for the same control.
- `react-dom` or browser-global imports in package components.
- A `.web.tsx` whose public props differ from its native sibling.
- A `web:` styling variant standing in for missing web behaviour.
- App-specific policy or product copy embedded in a reusable block.
- Multiple nested `KeyboardAvoidingView` owners for one screen.

## Green Flags

- The same exported component is exercised by the Expo showcase on native and web.
- Platform branches are local, one-line-justified, and share a prop contract.
- Renderer-free additions are re-exported from `src/tokens.ts`.

## Codebase-Specific Patterns

- Primary entry point: `@thewhileloop/whileui`.
- `vite.ts` and `fixtures/vite-smoke` validate React Native Web consumption; they do
  not define a second DOM component API.
- Screen-level keyboard policy belongs in `KeyboardAwareScreen`, while leaf inputs
  remain reusable and do not apply another keyboard offset.
- Supported stack and platform contract: `PLAN.md`.
