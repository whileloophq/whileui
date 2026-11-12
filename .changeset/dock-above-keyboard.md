---
'@thewhileloop/whileui': patch
---

On iOS, a `DockedInput` inside `KeyboardAwareScreen` now rises above the keyboard. The
screen avoided the keyboard with bottom padding, which it measured correctly, but the
dock is pinned to the screen's bottom edge, and an absolutely positioned view ignores its
parent's padding: the field and its send button stayed under the keyboard. The screen
now shortens itself by the keyboard's height instead (`behavior="height"` on iOS).
