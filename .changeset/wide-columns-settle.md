---
'@thewhileloop/whileui': minor
---

Add `Container`, a centred content column with a maximum width.

Phone-first layouts stretch to whatever the viewport is. That is correct at 390px and
wrong at 1600px: line lengths become unreadable and related controls drift apart. Web is
a production target here, so every screen owed a fix and nothing in the package owned
content width — `AppShell` had no width handling at all.

```tsx
<Container size="lg">{children}</Container>
```

`sm` for forms and auth, `md` (default) for most screens, `lg` for dashboards, `xl` for
wide tables, `full` to opt out. `fill` adds `flex-1` for a container used as a screen
root.

There is no platform branch and none is needed: every size is wider than any phone, so
on iOS and Android the cap never engages and it renders as a plain full-width `View`.
The same component is a no-op on native and the whole fix on desktop.

For a scroll view, put the column on the content container instead, so the scrollbar
stays at the window edge:

```tsx
<ScrollView contentContainerClassName="w-full max-w-5xl self-center" />
```
