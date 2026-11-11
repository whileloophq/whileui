---
'@thewhileloop/whileui': minor
---

`Checkbox` and `Switch` take `label` and `description`. The whole row becomes one
pressable control named by the label, so pressing the text toggles it. A row composed by
hand — a `Pressable` with a checkbox role around a `Checkbox` and a `Text` — nests a
checkbox inside a checkbox, which Android and web expose as two; replace it with `label`.

Both also show a focus ring on web now. The ring was on the inner box or track, which
never takes focus, so keyboard users saw nothing. `className` still styles the box or
track.
