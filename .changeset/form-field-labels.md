---
'@thewhileloop/whileui': patch
---

A `FormLabel` now names the `Input`, `Textarea` or `NumericInput` in its `FormField` on the
web and Android (`aria-labelledby`). A `NumericInput` in a form had no accessible name on
the web, and an `Input` was only named by its placeholder. A label you pass yourself
(`accessibilityLabel` or `aria-label`) still wins. A required field now sets
`aria-required` on the control, and the asterisk is hidden from screen readers instead of
being read as part of the label. iOS does not support labelled-by;
VoiceOver reads the visible label just before the field. No call-site change is needed.
