---
'@thewhileloop/whileui': minor
---

Add `FAB` and `FABGroup`, a floating action button.

Pulled by a consuming app that had written its own: a primary action raised above the
content is the shape most product screens end up needing, and every app re-deriving the
size, the shadow and the accessible name is how they drift apart.

```tsx
<FAB label="New group" onPress={create}>
  <Feather name="plus" size={24} color={icons.primaryForeground} />
</FAB>
```

`label` is required, because a FAB is an icon with no text and would otherwise announce
as an unlabelled button. Sizes are 48 / 56 / 64, all of which clear the iOS 44pt and
Android 48dp minimums on their own, so a FAB never needs `hitSlop`. `placement` defaults
to floating bottom-right and can be set to `inline` for callers that position it
themselves.

It owns no icon dependency: the glyph is children, coloured from `useIconColors()`,
because icon libraries need a concrete colour rather than a class.
