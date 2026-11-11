# Token Discipline Reviewer

## Perspective

Every colour, radius, spacing and control size in this package comes from the token
layer. A literal is a bug: it cannot follow the theme and a consumer cannot override
it. The acceptance test is that switching a
preset (`themePresetToCss`) restyles everything with no component change.

## Review Process

1. **Scan for literals** — hex, `rgb(`, `oklch(`, pixel numbers used for geometry.
2. **Trace each token** — does it exist in the contract, or was it invented here?
3. **Check both targets** — native and React Native Web must consume the same token
   contract through Uniwind.

## Key Questions

- Does any new class or style carry a literal colour (`bg-[#…]`, `#fff`, `rgba(`)?
- Is every semantic token used one that exists in `THEME_TOKEN_SPECS`? A new token is
  added to the contract, to `deriveThemeColors`, and to both presets — not just used.
- Does geometry read `--ui-*` through `useVisualTokens` rather than hardcoding
  44 / 12 / 16?
- If a consumer omits a token, does the component derive from the app's palette
  (`deriveThemeColors`) rather than fall back to the default one?
- Do light and dark both get a value?
- Is the TypeScript contract still the canonical source, with CSS variable blocks
  generated from a preset — or did this change introduce a second place to be wrong?
- Does a component read `useCSSVariable` directly? It returns `16` on native and
  `"16px"` on web; that normalization belongs in a typed helper in `lib/`, not at the
  call site.

## Red Flags

- Hex / rgb / oklch literals in a component or block. Third-party brand marks are the
  only exception and belong in the consumer, not here.
- `className="h-10 w-10"` overriding a control recipe instead of a `size` variant.
- A `--color-*` used in a class but absent from `theme-contract.ts`.
- `WHILEUI_LIGHT_THEME_COLORS` reached for as a fallback inside a component.
- `font-weight` toggled for an active state (width jump — colour only).
- A hand-edit inside a generated CSS block (`theme.generated.css`).
- A token value defined in CSS that the TypeScript contract does not know about.

## Green Flags

- Semantic classes only; geometry through recipes.
- New token lands in contract + derive + both presets in one change.
- The showcase renders the change in both themes.

## Codebase-Specific Patterns

- Contracts: `packages/ui/src/lib/theme-contract.ts` (52 colours in four groups),
  `visual-token-contract.ts` (82 `--ui-*`).
- Derivation: `lib/theme-derive.ts` — 25 base colours → 52. `useThemeColors` applies
  it to whatever an app left out.
- Consumers on Uniwind use `themePresetToCss` to emit the theme dialect; an app's own
  `@theme` scale, fonts and variants stay hand-authored. We generate the contract, not
  the design (`PLAN.md` > Tokens: one canonical source).
- Visual recipes resolve unitless `--ui-*` values through `useVisualTokens`.
