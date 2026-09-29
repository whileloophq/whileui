---
'@thewhileloop/whileui': minor
---

Add shared, motion-aware press feedback to `Pressable` and migrate `Button` and
`PlanToggle` to it.

- `Pressable` takes `feedback` (`none` | `default` | `strong`, default `none`) for the
  pressed opacity and `disabledFeedback` (default `default`) for the resting opacity while
  disabled or loading. A disabled `Pressable` is now dimmed by default; pass
  `disabledFeedback="none"` to keep it at full opacity.
- `loading` on `Pressable` and `Button` is one busy, disabled state: it blocks input,
  exposes `busy` and `disabled` to assistive technology, and on `Button` shows a spinner
  without changing the control's size or accessible name.
- Feedback changes opacity only, never layout. Native reads React Native's press state
  directly; web adds a CSS opacity transition that follows the motion policy.
