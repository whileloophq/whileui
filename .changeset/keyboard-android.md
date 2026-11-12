---
'@thewhileloop/whileui': patch
---

Fields stay above the keyboard on Android. Since apps draw edge to edge, Android no
longer shrinks the window for the keyboard, which `KeyboardAwareScreen` and
`KeyboardAwareScrollView` relied on there, so the docked field and lower form fields sat
under it. Both now shorten themselves to the keyboard's top edge on Android as on iOS
(`KeyboardAwareScreen` defaults to `behavior="height"` on every platform); where the
window still shrinks, the measured overlap is zero, so nothing is applied twice. `FormModalScreen`,
`SheetContent` and `PullToRefreshScrollView` are now built on `KeyboardAwareScrollView`,
so their fields follow suit.
`SmartInput` also turns off Android's landscape full-screen editor, which hid the app
and its send button while typing.
