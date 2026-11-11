---
'@thewhileloop/whileui': patch
---

A `FAB` inside a `FABGroup` no longer floats a second time. Each one kept its own
`floating` placement inside the already-floating group, so the main FAB landed up and
to the left of the small ones and covered them; the group now lays out its FABs in a
column whatever their `placement`, and `placement="inline"` inside a group is no longer
needed.

`FAB` and `FABGroup` take `safeArea`, which adds the safe-area insets to the floating
position. Use it over a full-screen view, where a 24pt inset left the button in the home
indicator and the screen's curved corner; leave it off above a tab bar.
`fabClearance(size, bottomInset)` takes the inset to match. The floating position is now
a style rather than `absolute bottom-6 right-6` classes, so a `className` that set
`bottom-*` or `right-*` should move to `style`.

The dismiss cross on `Toast` is drawn rather than set as a "×" character, which sat low
and to one side of its round pressed background in most fonts.
