---
'@thewhileloop/whileui': patch
---

`OTPInput` can be tapped and reached by screen readers. Its hidden text field had opacity
0: below 0.01 an iOS view takes no touches, and iOS and Android both leave it out of the
accessibility tree, so on iOS tapping the cells did nothing and neither VoiceOver nor
TalkBack could reach the field. It now sits at 0.011, still invisible — its text is
transparent and its caret hidden. On Android it also no longer opens the landscape
full-screen editor, which covered the cells.
