# Token Discipline Reviewer

## Perspective

Every colour, radius, spacing and control size in this package comes from the token
layer. A literal is a bug: it cannot follow the theme, it diverges silently between
tracks, and a consumer cannot override it. The acceptance test is that switching a
preset (`themePresetToCss`) restyles everything with no component change.

## Review Process

1. **Scan for literals** — hex, `rgb(`, `oklch(`, pixel numbers used for geometry.
2. **Trace each token** — does it exist in the contract, or was it invented here?
3. **Check both dialects** — a value the native track consumes unitless must be
   `calc(var(--x) * 1px)` on the DOM.

## Key Questions

- Does any new class or style carry a literal colour (`bg-[#…]`, `#fff`, `rgba(`)?
- Is every semantic token used one that exists in `THEME_TOKEN_SPECS`? A new token is
  added to the contract, to `deriveThemeColors`, and to both presets — not just used.
- Does geometry read `--ui-*` (DOM via `web/lib/recipes.ts`, RN via `useVisualTokens`)
  rather than hardcoding 44 / 12 / 16?
- If a consumer omits a token, does the component derive from the app's palette
  (`deriveThemeColors`) rather than fall back to the default one?
- Do light and dark both get a value?

## Red Flags

- Hex / rgb / oklch literals in a component or block. Third-party brand marks are the
  only exception and belong in the consumer, not here.
- `className="h-10 w-10"` overriding a control recipe instead of a `size` variant.
- A `--color-*` used in a class but absent from `theme-contract.ts`.
- Unitless `--ui-*` used directly in DOM CSS.
- `WHILEUI_LIGHT_THEME_COLORS` reached for as a fallback inside a component.
- `font-weight` toggled for an active state (width jump — colour only).

## Green Flags

- Semantic classes only; geometry through recipes.
- New token lands in contract + derive + both presets in one change.
- Both showcases render the change in both themes.

## Codebase-Specific Patterns

- Contracts: `packages/ui/src/lib/theme-contract.ts` (52 colours in four groups),
  `visual-token-contract.ts` (82 `--ui-*`).
- Derivation: `lib/theme-derive.ts` — 25 base colours → 52. `useThemeColors` applies
  it to whatever an app left out.
- Generators: `apps/site/scripts/gen-theme.ts` emits the Tailwind dialect;
  consumers on Uniwind use `themePresetToCss`.
- The unitless gotcha: `--ui-radius-md: 14`. DOM side is `web/lib/recipes.ts`.
