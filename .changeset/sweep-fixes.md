---
'@thewhileloop/whileui': patch
---

Fixes from an accessibility sweep of every catalog screen:

- `Switch` and `Checkbox` put `accessibilityLabel`, `testID` and the other props you pass
  on the control itself. They landed on the inner box, so on web a switch or checkbox
  named with `accessibilityLabel` had no name. `className` and `style` still style the box.
- `ListItem`, `NotificationItem` and `ProductCard` are buttons only when they have
  `onPress`. Without one they were still Tab stops on web, with no role. `ProductCard`
  had no role even with `onPress`.
- `ListItem` draws its chevron only when pressable, and hides it from screen readers;
  VoiceOver read it as part of the row.
- `PricingCard` features say "Included" or "Not included"; a screen reader read the mark's
  symbol name, and the strikethrough is visual only.
- `RadioGroupItem`, an unlabelled `Checkbox` and a `Button` with `variant="link"` are at
  least 24px targets on web, where `hitSlop` does nothing. Their look is unchanged.
- The date pickers no longer show the next month's days, which were disabled yet still
  Tab stops with no role.
- `BottomNav` names each tab "label, badge" ("Inbox, 12"). iOS built the name from the
  children, badge first, and the active tab also exposed its icon glyph as an element.
