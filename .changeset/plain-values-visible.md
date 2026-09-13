---
'@thewhileloop/whileui': patch
---

Fix `SelectValue` rendering unstyled text on web.

Neither `className` nor `style` reached the rendered element. The web build of
`@rn-primitives/select` wraps a Radix span in a `Slot.Text`, which drops React Native
props — so the value and placeholder fell back to the user-agent default black. On a dark
theme that measured 1.2:1 against the surface, which is unreadable.

`SelectValue` now sets the colour on a wrapper and lets it inherit, which reaches the
text on both platforms. Measured at 6.5:1 after the fix.
