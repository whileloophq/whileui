---
'@thewhileloop/whileui': minor
---

New `SelectField`: a labelled single choice from an `options` array of
`{ value, label, icon? }`, with optional `hint`, `error`, `disabled` and `required`. An
option may have the value `''` (for "None" or "All"), which the `Select` primitive
cannot hold on its own. The trigger is named by the label and the current choice, so a
screen reader hears both. Replace a hand-written label-plus-`Select` wrapper with it.
