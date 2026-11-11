---
'@thewhileloop/whileui': patch
---

`Input`, `Textarea`, `NumericInput` and `SmartInput` draw the caret and text selection in
the theme's primary colour on iOS and Android, instead of the platform blue that ignored
every theme. Android keeps a translucent highlight so selected text stays readable. A
`selectionColor` or `cursorColor` you pass still wins.
