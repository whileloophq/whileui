---
'@thewhileloop/whileui': minor
---

`DataRow` takes `onPress` (and `onLongPress`). With it the whole row is one button: the
role, the shared pressed background and a focus ring are built in, and a screen reader
reads the row's content as its name. Without it the row stays plain content. Replace a
`Pressable` you wrapped around a `DataRow` with `onPress` on the row itself.
