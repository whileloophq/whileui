---
'@thewhileloop/whileui': minor
---

`fabClearance(size?)` returns the bottom padding a scrolling screen needs so a floating
`FAB` never covers its last row: the FAB's 24pt inset, its height and a 16pt gap. Lists
behind a FAB had nothing to measure against, and their final amount or button sat under
it. Add `contentContainerStyle={{ paddingBottom: fabClearance() }}` to those lists.
