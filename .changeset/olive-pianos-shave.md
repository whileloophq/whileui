---
'@thewhileloop/whileui': minor
---

Add `createThemePreset`, which builds a theme preset from the 25 base colours and
derives the other 27.

`ThemePreset.visual` has always been `Partial`, but `light` and `dark` are the full
52-key `ThemeColors`. Writing the literal therefore asks an author for every active
variant, soft variant, overlay, surface, interaction state and shadow — the values
`deriveThemeColors` already computes from the palette — and nothing in the type points
at that helper. The predictable outcome is a hand-written derivation that drifts from
the library's own; the bundled Atelier preset is 110 lines for this reason.

```ts
const preset = createThemePreset({
  name: 'acme',
  description: 'Acme brand palette.',
  light: lightBaseColors, // 25 keys
  dark: darkBaseColors,
  visual: { radiusLg: 12 }, // optional
});
```

Nothing is removed: `ThemePreset` keeps its shape, and existing literals still compile.
Override a derived value by assigning to the returned preset.
