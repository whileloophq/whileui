---
'@thewhileloop/whileui': minor
---

`SegmentedControl` takes `wrap="scroll"`: one row, each segment as wide as its label,
scrolling sideways when they do not fit. Four or five word-length labels do not fit a
phone, and the alternatives were wrapping onto two rows or squeezing the text, so apps
wrapped the control in their own `ScrollView` and overrode every segment with
`flex-none`. Replace that with `wrap="scroll"`.
