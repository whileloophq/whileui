---
'@thewhileloop/whileui': patch
---

On iOS and Android a `Select` whose options are taller than the screen now scrolls inside
the listbox, bounded by the safe-area insets, instead of rendering one column that runs
under the status bar with nothing to scroll. Web already capped the height.
