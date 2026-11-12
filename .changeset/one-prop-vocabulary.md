---
'@thewhileloop/whileui': major
---

One prop vocabulary across controls: an overlay is `open` / `onOpenChange`, a selection
is `value` / `onValueChange`, as in `Dialog`, `Sheet`, `Select`, `Tabs` and the rest.
Five blocks used their own names. Rename at each call site:

| Component           | Before                  | After                                                       |
| ------------------- | ----------------------- | ----------------------------------------------------------- |
| `DrawerMenu`        | `visible`, `onClose`    | `open`, `onOpenChange` — called with `false` when dismissed |
| `DrawerMenu`        | `activeKey`, `onSelect` | `value`, `onValueChange`                                    |
| `BottomNav`         | `activeKey`, `onSelect` | `value`, `onValueChange`                                    |
| `FloatingBottomNav` | `activeKey`, `onSelect` | `value`, `onValueChange`                                    |
| `TabBar`            | `activeKey`, `onSelect` | `value`, `onValueChange`                                    |
| `PlanToggle`        | `selected`, `onChange`  | `value`, `onValueChange`                                    |

For `DrawerMenu`, `onClose={() => setOpen(false)}` becomes `onOpenChange={setOpen}`.
