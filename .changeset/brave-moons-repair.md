---
'@thewhileloop/whileui': patch
---

Fix four defects found by type-aware linting.

- `SelectTrigger` and `SelectItem` dropped a caller's `style` function. Their props
  accept `style` as a `(state) => ...` callback, but the implementation put it into a
  style array, where React Native ignores a function. Resolved inside a state callback
  now.
- `useThemeBridge` could leave an app on its loading gate forever: a rejected
  `loadThemeMode` never set `hydrated`. It now falls back to the initial mode.
- `SmartInput` mirrored a controlled `value` into state through an effect, so the
  rotating placeholder animated for one extra frame over text the user had already
  typed. It is derived now.
- `AlertDialog` read `nativeCopyRef.current` in effect cleanups that may have run after
  the ref moved on.

`PullToRefreshScrollView` also declares `onRefresh: () => void | Promise<void>`. Every
real handler is async, and the narrower type silently accepted one and discarded its
rejection. Nothing awaits it — drive the spinner with `refreshing` and catch your own
errors.
