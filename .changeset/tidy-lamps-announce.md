---
'@thewhileloop/whileui': minor
---

Make the catalog reachable by screen reader and keyboard.

`Pressable` carries no `accessibilityRole` of its own, and React Native Web renders a
role-less `Pressable` as a `div` with `tabindex` — focusable, announced as nothing, and
**not activatable by Enter or Space**. That described most interactive elements here.

- Roles added across 29 components and blocks: `button` on every trigger and close,
  `menuitem` on menu items (with `menu` on their panels, which ARIA requires),
  `tab`/`tablist` on `Tabs`, `BottomNav`, `TabBar` and `FloatingBottomNav`, `radio` on
  `RadioGroup` items. `ListItem` and `NotificationItem` take a `button` role only when
  given a press handler — a static row is not a control.
- `Checkbox`, `Switch` and `SegmentedControl` now set `aria-checked`. React Native Web
  no longer derives it from `accessibilityState`, so assistive technology could not tell
  a checked control from an unchecked one. `SegmentedControl` was also sending
  `selected`, which ARIA does not allow on `role="radio"`.
- Overlays no longer swallow their own contents. Backdrops and panels built from
  `Pressable` were accessibility elements, and on iOS an accessibility element hides its
  descendants — VoiceOver reached an open dialog as a single "dismiss" target and could
  not get to the buttons inside it. Fixed in `AlertDialog`, `Dialog`, `Sheet`,
  `DropdownMenu`, `ContextMenu`, `Menubar`, `ConfirmActionSheet`, `DrawerMenu` and both
  date-picker modals.
- `AlertDialog` announces as an `alert`, names itself from its title, keeps VoiceOver
  inside the panel, and marks its title as a heading. Menu section labels are headings
  too.
- `Progress` and `Spinner` carry a default `accessibilityLabel`; a `progressbar` with no
  name fails WCAG 4.1.2. Override it with what is actually loading.
