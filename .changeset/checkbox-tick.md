---
'@thewhileloop/whileui': patch
---

`Checkbox` draws a check mark when checked. It drew a smaller filled square inside the
box, which read as a radio button, or as unchecked, rather than as a tick. No change at
call sites. The README also now says that `KeyboardAwareScreen` does not scroll, so a
form inside it needs a `ScrollView`.
