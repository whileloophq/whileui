---
'@thewhileloop/whileui': patch
---

Halve the published package. `src/` is not shipped, so every source map pointed at files
no consumer has — 302 of the 604 files in the tarball. Maps are no longer emitted:
604 → 304 files, 203 kB → 122 kB.
