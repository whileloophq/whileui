---
'@thewhileloop/whileui': patch
---

`DrawerMenu` renders every row at once. Its list mounted rows after the first render
batch, and on iOS those rows were drawn but never reached the accessibility tree:
VoiceOver could not reach any entry past roughly the eighth until the list scrolled.
