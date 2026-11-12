---
'@thewhileloop/whileui': patch
---

`HeaderBackButton` (and so `PageHeader`'s back button) and the date pickers' month arrows
draw their chevrons instead of setting a "‹" or "›" character. The character was small in
most fonts and sat at the left edge of its 44pt target, so the back button read as a stray
mark with a gap beside it; the chevron is now centred. Pass `icon` to use your own.
