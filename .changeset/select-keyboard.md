---
'@thewhileloop/whileui': patch
---

`Select` and `Popover` close the on-screen keyboard when they open. Both draw in a portal
rather than a Modal, so iOS and Android left the keyboard up and it covered the lower half
of the options: a category picker opened while typing a description showed only the first
few choices. Once the keyboard has gone the trigger is measured again, so the panel stays
anchored on screens that move with the keyboard. Nothing to change at call sites.
