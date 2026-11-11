---
'@thewhileloop/whileui': minor
---

`themePresetToCss` now also writes Tailwind's `--radius-sm`, `--radius-md`, `--radius-lg`
and `--radius-xl`, and `--spacing-control-sm`, `--spacing-control` and
`--spacing-control-lg`, from the preset's visual tokens. Classes in your own markup then
follow the preset: `rounded-md` is the preset's medium radius rather than Tailwind's fixed
6px, and `h-control` is its default control height.

Regenerate your theme file to pick it up. Corners drawn with `rounded-sm` to `rounded-xl`
change size where your preset differs from Tailwind's defaults; that is the point, but
check screens that relied on the old values. To keep your own scale, define those
variables after importing the generated file.
