---
'@thewhileloop/whileui': minor
---

Stateful controls follow the WAI-ARIA keyboard patterns on web, which seven of the
eight checked did not.

- `RadioGroup`, `SegmentedControl`, single-choice `ToggleGroup` and `TabsList` are one
  Tab stop, and the arrow keys move between items. Before, every item was its own Tab
  stop. Behaviour comes from `@rn-primitives/radio-group`, `toggle-group` and `tabs`,
  now dependencies pinned to 1.5.2, so there is nothing new to install.
- `Checkbox`, `Switch`, radios and tabs answer Space. React Native Web presses on Space
  only for buttons, so they answered Enter alone; any `Pressable` with one of those
  roles now handles Space itself.
- `TabsContent` is a `tabpanel` named by its tab.
- `Accordion` and `Collapsible` triggers say whether they are open (`aria-expanded`).
- `CollapsibleTrigger asChild` gives the child the press instead of wrapping it in a
  second pressable, which nested one control inside another.
- `RadioGroupItem` takes `label` and `description`. The row becomes one radio named by
  its text; before, the text beside a radio was a separate element outside the group.

What to check at call sites:

- Replace a `Label` placed beside a `RadioGroupItem` with the item's `label` prop.
- In tests, a multiple-choice `ToggleGroup` item on native is now a `checkbox` that is
  checked, not a `button` that is selected (`getByRole('checkbox')`, `toBeChecked()`).
- `withInteractivePressableStyle` and `InteractivePressableOptions` are removed. Render
  the control through `Pressable` with `feedback` (`pressedVariant`) and
  `disabledFeedback` (`disabledVariant`), and pass `disabled` to it directly.
