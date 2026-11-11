---
'@thewhileloop/whileui': minor
---

New `KeyboardAwareScrollView`: the scroll root for a form. On iOS it insets its content
by whatever the keyboard covers and scrolls the focused field above it, measured natively
in window coordinates. `FormModalScreen`, `SheetContent` and `PullToRefreshScrollView` now
do the same by default; pass `automaticallyAdjustKeyboardInsets={false}` to the last two to
opt out.

If a form sits in a `ScrollView` inside `KeyboardAwareScreen`, replace both with one
`KeyboardAwareScrollView`. `KeyboardAvoidingView`, which `KeyboardAwareScreen` wraps,
cannot see where iOS placed a native sheet, so in a `pageSheet` modal the lower fields
stayed under the keyboard. Do not nest the two. `KeyboardAwareScreen` remains the root for
a screen with controls docked to its bottom edge.
