---
'@thewhileloop/whileui': patch
---

Nothing changed in the library here, but the showcase theme carried a defect worth
knowing about if you copied its tokens: `--color-popover` had an alpha channel, so every
overlay drawn on it — `Select`, `Popover`, `DropdownMenu`, `ContextMenu`, `Menubar`,
`HoverCard` — let page content read straight through it.

A popover floats over arbitrary content, unlike a card, which sits over the page's own
backdrop. It has to be opaque. Translucent surfaces belong to
`--color-surface-translucent` and the `frosted` props, which draw a blur behind
themselves to stay readable.
