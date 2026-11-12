---
'@thewhileloop/whileui': minor
---

`Pressable` is now the base every control renders through, and it derives what each
control used to set by hand. With a press handler it is a `button` unless you pass
another role, a Tab stop on web with a focus ring, and at least 24px there, where
`hitSlop` does nothing. Without a handler it is plain content: no role, no feedback and
no Tab stop. A new `focusIndicator` prop (`ring`, `inset`, `none`) chooses the web focus
treatment.

Rows, cards, navigation items, dialog and sheet buttons, the toast and search-field
buttons, the numeric steppers and the date-picker triggers now render through it. What
changes for users:

- Header actions, the Sheet and Dialog close buttons, the AlertDialog and
  ConfirmActionSheet buttons, the date-picker triggers and the drawer items show the themed focus ring on web instead of at most the browser's default
  outline.
- The Sheet close button draws its cross instead of a "×" glyph, at 44px like the
  toast's, so it no longer sits off-centre.
- `Chat`'s send button is named "Send message" whether or not it is enabled; its state
  is announced as disabled rather than read out as part of the name.
- `Chat` suggestions, `ListItem` and `NotificationItem` show the pressed state with
  `bg-state-pressed`; the suggestion chips showed no press at all before.
- The time picker's wheel rows are no longer Tab stops inside a region hidden from
  assistive technology; the wheels' own adjustable controls remain the keyboard path.

No props were removed. Two things to check at call sites:

- A `HeaderBackButton` (or any control built on `Pressable`) rendered without
  `onPress` is no longer announced as a button or reachable by Tab. Pass the handler,
  or wrap it in your router's link with `asChild` so the link supplies one.
- If you relied on a handler-less `Pressable` being focusable, give it a handler or
  pass `tabIndex={0}`.
