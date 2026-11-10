---
'@thewhileloop/whileui': patch
---

`withWhileUIMetro` matches Windows paths, so the icon-font exemption also applies on
Windows machines, and throws a message naming `cssEntryFile` when called without options.
`Sheet` and `DrawerMenu` no longer report a second close when back or Escape arrives during
their exit animation.
