# Accessibility and Touch Reviewer

## Perspective

We ship to phones and to browsers. A 32px tap target, an icon button with no name, a
swipe action with no alternative, or an overlay that traps neither focus nor the back
key are the defects users hit first and report least. This card checks that every
interactive element is reachable by finger, keyboard, screen reader and the Android
back key — on all three targets.

## Review Process

1. **Find every new interactive element** — button, pressable, input, drawer, sheet,
   menu item, swipe action.
2. **Check size, name, state, dismissal and alternative** for each.
3. **Check both input models:** touch (`accessibilityRole`, `accessibilityLabel`,
   `hitSlop`) and keyboard/pointer on web (focus visible, tab order, `Escape`).

## Touch targets

Platform minimums differ; one universal number is wrong.

| Target  | Minimum interactive area                                                     |
| ------- | ---------------------------------------------------------------------------- |
| iOS     | ≥ 44 × 44 pt                                                                 |
| Android | ≥ 48 × 48 dp                                                                 |
| Web     | WCAG 2.2 AA target size (≥ 24 CSS px); design ≥ 44 CSS px for touch controls |

Keep the visual size; reach the minimum with `hitSlop` or padding.

## Key Questions

- Does the effective touch area clear 44pt on iOS **and** 48dp on Android? Visually
  smaller controls (Checkbox `h-5`, Switch `h-7`) carry `hitSlop`.
- Does every interactive element declare an `accessibilityRole`? `Pressable` does not
  supply one, so a custom control built on it is announced as a plain view until the
  role is set explicitly. `Button` shipped this defect for months.
- Is any `Pressable` being used as a **container**? A tap-to-dismiss backdrop, or a panel
  whose only `onPress` is `stopPropagation`, is not a control. `Pressable` defaults to
  `accessible: true`, and on iOS that collapses everything inside it into one element —
  the buttons within become unreachable. Both need `accessible={false}`, and a backdrop
  also needs `importantForAccessibility="no"`. Every overlay in this catalog shipped this
  defect. No test will tell you: RNTL finds descendants either way.
- Do section headings — dialog titles, menu labels — carry `accessibilityRole="header"`?
- Icon-only button: does `accessibilityLabel` say what the button _does_?
- Active state conveyed by colour **and** `accessibilityState` / `aria-current` — never
  by font-weight?
- Overlay: dialog role, focus moved in on open, `Escape` closes on web, **Android back
  closes it**, scroll locked behind it, focus returned to the trigger on close?
- Is the hidden state truly inert, not just `opacity: 0`?
- Inputs: a label besides the placeholder; `outline-none` paired with a visible focus
  ring?
- Does any drag or swipe action have an equivalent single-pointer path? WCAG 2.2
  requires one unless dragging is essential. Ask at design time, not as a retrofit.
- Does the layout survive RTL? Logical start/end spacing, mirrored direction for swipe,
  drawers and directional icons.
- Does it survive large text? Fixed-height controls, OTP cells, dialog and sheet
  layout are where font scaling breaks first.
- Text: no `leading-none` on labels (clips ascenders); `truncate` on anything that can
  overflow 360px?

## Red Flags

- `h-8 w-8` / `h-10 w-10` icon buttons with no `hitSlop`.
- A `Pressable` with an `onPress` and no `accessibilityRole`.
- A `Pressable` wrapping content it does not own, without `accessible={false}`.
- A `Pressable` containing only an icon and no label.
- `opacity: 0` as an overlay's hidden state.
- An overlay open with no Android back handler and no `Escape` path.
- `font-semibold` toggled on the active nav item.
- A swipe-only destructive action with no button equivalent.
- Hardcoded `marginLeft` / `left` for something that should mirror in RTL.

## Green Flags

- The `DrawerMenu` pattern: dialog role, focus on open, `Escape` and back key, delayed
  inert flip.
- Controls sized by `--ui-control-height-*` rather than ad-hoc classes.
- An icon button whose `label` prop is required rather than optional.

## Codebase-Specific Patterns

- `AGENTS.md` → UI Standards: platform touch minimums, colour-only active state,
  `hitSlop` below the minimum.
- `PLAN.md` → Accessibility and input contract: the release matrix (VoiceOver,
  TalkBack, keyboard-only browser, RTL, large text) that `stable` status requires.
- Automated a11y scanning is a defect detector, not a conformance certificate. A clean
  scan does not close a finding from this card.
