---
'@thewhileloop/whileui': patch
---

`ToggleGroup` and `Toggle` now tell a screen reader on web which items are on. They set
only `accessibilityState`, which React Native Web no longer turns into ARIA, so a browser
announced a row of plain buttons with no state. A `type="single"` group is now a radio
group with each item checked or not, and `type="multiple"` items and `Toggle` are toggle
buttons with `aria-pressed`. On iOS and Android, single-mode items are now announced as
radio buttons rather than selected buttons. Add
`flex-wrap` to a group's `className` for chips that wrap; the README shows it.
