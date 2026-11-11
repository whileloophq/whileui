---
'@thewhileloop/whileui': patch
---

A `FormLabel` now names the `Input`, `Textarea` or `NumericInput` in its `FormField` on the
web and Android (`aria-labelledby`). A `NumericInput` in a form had no accessible name on
the web, and an `Input` was only named by its placeholder. A label you set yourself
(`accessibilityLabel`, `aria-label`, `aria-labelledby` or `accessibilityLabelledBy`)
still wins. A required field sets `aria-required` on the control, and the asterisk is no
longer read as part of the label on any platform. iOS has no labelled-by, so VoiceOver
reads the visible label just before the field. No call-site change is needed.
