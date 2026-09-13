---
'@thewhileloop/whileui': minor
---

Give every interactive component a visible focus indicator on web.

Several components removed the browser's focus outline with `outline-none` and replaced
it with nothing — `Input`, `Textarea`, `NumericInput` and `SmartInput` among them — so a
keyboard user tabbing to them saw no focus at all. That is a WCAG 2.4.7 (Focus Visible,
AA) failure, and an automated accessibility scan cannot detect it.

- New `focusRing` and `focusRingInset` exports, applied across `Button`, `Input`,
  `Textarea`, `NumericInput`, `SmartInput`, `Select`, `Checkbox`, `Switch`, `RadioGroup`,
  `SegmentedControl`, `Toggle`, `ToggleGroup` and `Tabs`. Use them on your own controls
  instead of a bare `outline-none`.
- Driven by `--color-ring` and scoped to `:focus-visible`, so the ring follows your theme
  and does not appear after a mouse click.
- `focusRingInset` drops the offset for controls sitting flush inside a track, where an
  offset ring would be clipped.

Tabbing the whole showcase is now asserted in the browser suite.
