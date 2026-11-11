---
'@thewhileloop/whileui': minor
---

New `PageHeader`: the heading at the top of a screen's content — a kicker over the
title, an optional leading mark and back button, trailing actions, and content such as
tabs underneath. The title is announced as a header. It is the piece every screen of an
app otherwise writes for itself.

`HeaderBackButton` now has a button role, is named "Back" unless given a `label`, hides
its chevron glyph from screen readers, shows a focus ring on web and meets the touch
target size. Without the role, React Native Web gave it a Tab stop that Enter and Space
could not press.
