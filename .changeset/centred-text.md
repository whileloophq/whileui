---
'@thewhileloop/whileui': patch
---

Centred text is centred on iOS and Android, and `BottomNav` badges are redrawn.

- `Text`, `ButtonText` and `Label` no longer add 4pt of right padding under a
  `FontProvider` on iOS and Android. It pushed every centred label 2pt left of centre —
  button labels, `Badge`, initials, and most visibly a tab's count. `ResolvedFont` loses
  its `paddingRight` field.
- A `BottomNav` count sits in a fixed line box with tabular digits, so it is centred in
  its pill whatever the font's metrics. It overlaps the icon's top-right corner and grows
  to the right, so "12" no longer spreads back over the icon.

Nothing to change at call sites.
