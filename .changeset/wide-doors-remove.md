---
'@thewhileloop/whileui': major
---

Remove two pieces of public API that did nothing.

- `ButtonIcon` no longer accepts `position`. React Native has no `order`, so placement
  always came from where the icon sat among the button's children — the prop was
  destructured and discarded. Remove it from call sites; nothing about the rendering
  changes.
- `useResolvedThemeColors` is gone. It was an alias of `useThemeColors`, marked
  `@deprecated`, and had no callers. Use `useThemeColors` or `useThemeTokens`.
