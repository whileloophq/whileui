---
'@thewhileloop/whileui': minor
---

- New `display` typography role and `Text variant="display"`: the largest size, for an
  amount, a total or a metric that leads its screen. It reads the new
  `--ui-font-size-display` visual token (36 by default); regenerate your theme, or add the
  variable to a hand-written one. `PricingCard`'s price uses it.
- `CardTitle` is announced as a heading, so a screen reader can move between cards by
  title.
- `DataRow` takes `disabled`: the row stays a button but does not fire, dims, and is
  announced as disabled — for a row whose action is busy.
- The date pickers draw their own month header: "Previous month" and "Next month" are real
  buttons, and the month is announced when it changes. The calendar library's arrows were
  role-less views on web, which Tab reached and Enter could not press.
