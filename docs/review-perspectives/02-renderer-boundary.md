# Renderer Boundary Reviewer

## Perspective

Two tracks, one token layer. The DOM track (`src/web/`) never imports React Native;
the shared contracts in `src/lib/` import no renderer at all; anything that differs
by host is a device capability behind `platform/`, never a branch in a component.
Leaks compile fine and break at runtime, or in the consumer's tsconfig.

## Review Process

1. **Check imports** of every changed file against where it lives.
2. **Look for host detection** in UI code.
3. **Run both tsconfigs** — `bun run typecheck` in `packages/ui` does.

## Key Questions

- Anything under `src/web/` importing `react-native`, `uniwind`, `expo-*`,
  `@rn-primitives/*`, or the native entry `@thewhileloop/whileui`?
- Anything in `src/lib/theme-*`, `visual-token-contract`, `theme-derive`, `tokens.ts`
  importing React, RN or Uniwind?
- Does a DOM component touch `window` / `document` / `navigator` for a _capability_
  (haptics, storage, share, back key)? That belongs in `platform/`.
- Does anything branch on `Capacitor`, `__TAURI__` or `Platform.OS` to change
  _layout_? Layout is breakpoints, not hosts.
- Is new DOM code covered by `tsconfig.web.json`'s roots? Under the main tsconfig,
  `document` resolves to React Native's ambient types and fails.

## Red Flags

- Any `from 'react-native'` in `src/web/` — a type-only import slipped through once
  (`recipes.ts`) and happened to work; runtime imports will not.
- `useCSSVariable` (Uniwind) in a lib file meant to be renderer-free.
- `Platform.OS === 'web'` guards in the native track for behaviour the DOM track
  should own.
- A DOM component calling `currentPlatform()` instead of the proxied handles.

## Green Flags

- `src/web/` imports only `../../lib/cn`, `../../lib/tv`, `../lib/recipes`,
  `../platform` and React.
- A new capability lands in `platform/types.ts` with web **and** Capacitor
  implementations, the web one reporting `false` rather than throwing.
- Renderer-free additions are re-exported from `src/tokens.ts`.

## Codebase-Specific Patterns

- `tsconfig.web.json` compiles `src/web/**` with the DOM lib; `tsconfig.json` excludes
  `src/web`. Never add `"DOM"` to the main config — it collides with RN's
  `fetch` / `FormData`.
- `HTMLAttributes` prop collisions (`onSelect`, `title`, `color`): `Omit` explicitly,
  with a one-line comment saying why.
- Handles: `import { haptics, secureStore, hardwareBack } from '../platform'`.
