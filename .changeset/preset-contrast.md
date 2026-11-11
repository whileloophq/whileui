---
'@thewhileloop/whileui': minor
---

The built-in presets now pass WCAG AA: 4.5:1 for text, 3:1 for the focus ring. The Soft
preset is also the runtime fallback palette, so this changes what an unthemed component
shows.

| Preset · mode   | Token                            | Was                                  | Now       |
| --------------- | -------------------------------- | ------------------------------------ | --------- |
| Soft · light    | `ring`                           | `rgba(61, 139, 255, 0.34)`           | `#3d8bff` |
| Soft · light    | `destructive`                    | `#f66151`                            | `#d03d31` |
| Soft · light    | `destructiveActive`              | `#e0503f`                            | `#bb261d` |
| Soft · light    | `success`                        | `#13a86d`                            | `#00864d` |
| Soft · light    | `info`                           | `#3d8bff`                            | `#2070e1` |
| Soft · dark     | `ring`                           | `rgba(127, 240, 197, 0.36)`          | `#7ff0c5` |
| Atelier · light | `primary`, `ring`                | `#b4552d`, `rgba(180, 85, 45, 0.45)` | `#af5028` |
| Atelier · light | `mutedForeground`, `placeholder` | `#7a6a58`                            | `#716150` |
| Atelier · dark  | `ring`                           | `rgba(232, 147, 95, 0.45)`           | `#e8935f` |

The soft tints and borders of the changed colours follow them. A translucent ring was the
main cause: blended onto the page it measured 1.45–2.67:1, too faint for keyboard users to
find. To keep an old value, override that token in your theme. A unit test now keeps every
built-in preset passing.
