---
'@thewhileloop/whileui': patch
---

Text fields type in the app's font, and `SmartInput` lays its text out like a composer.

- In a `card`, the text starts 16pt past a slot's glyph. It started 36pt past it: a row gap,
  the field's own padding and the slot's padding stacked up.
- One line sits on the slots' centre line, and the slots stay on the last line as the
  field grows. One line used to sit a few points above the icons.
- On the web, the field is one line that grows with what is typed, with no resize grip.
  It was a fixed two-row textarea that scrolled.
- On the web, focus colours the card's border (in a `bar`, the field's border) instead of
  drawing an offset ring around the field inside the card.
- `Input`, `Textarea`, `NumericInput`, `SearchField` and `SmartInput` type in the
  `FontProvider`'s regular family. On iOS and Android they typed in the system font beside
  text in the app's own; web was unaffected.

Nothing to change at call sites.
