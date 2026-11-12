---
'@thewhileloop/whileui': patch
---

Small `Button`, `Toggle` and `ToggleGroup` items set their text at label size, the same
as the default size, instead of caption size (11px in most presets). A small control is
now shorter, not harder to read. Every `size="sm"` button gets slightly larger text; check
tight rows of small buttons.
