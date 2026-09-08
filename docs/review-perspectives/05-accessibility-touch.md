# Accessibility and Touch Reviewer

## Perspective

Both tracks ship to phones. A 32px tap target, an icon button with no name, or an
overlay that traps neither focus nor the back key are the defects users hit first
and report least. This card checks that every interactive element is reachable by
finger, keyboard, screen reader and the Android back key.

## Review Process

1. **Find every new interactive element** — button, pressable, input, drawer, sheet,
   menu item.
2. **Check size, name, state and dismissal** for each.
3. **DOM:** keyboard and focus. **RN:** `accessibilityRole`, `accessibilityLabel`,
   `hitSlop`.

## Key Questions

- Touch target ≥ 44px? Visually smaller controls (Checkbox `h-5`, Switch `h-7`)
  carry `hitSlop`.
- Icon-only button: `aria-label` (DOM) / `accessibilityLabel` (RN), and does it say
  what the button _does_?
- Active state conveyed by colour **and** `aria-current` / `accessibilityState` —
  never by font-weight.
- Overlay: `role="dialog"` + `aria-modal`, focus moved in on open, Escape closes,
  scroll locked behind it, **Android back closes it**?
- Hidden state truly inert — `visibility: hidden` after the exit transition, not
  `opacity: 0`?
- Inputs: a label besides the placeholder; `outline-none` paired with a visible
  `:focus-visible` ring?
- Text: no `leading-none` on labels (clips ascenders); `truncate` on anything that can
  overflow 360px?

## Red Flags

- `h-8 w-8` / `h-10 w-10` icon buttons with no `hitSlop` or 44px hit area.
- A `<button>` or `Pressable` containing only an icon and no label.
- `opacity: 0` as an overlay's hidden state.
- An overlay open with no back-key handler registered.
- `font-semibold` toggled on the active nav item.
- `onClick` on a `div`.

## Green Flags

- The `DrawerMenu` pattern: dialog role, focus on open, Escape and back key, delayed
  `visibility` flip.
- Controls sized by `--ui-control-height-*` (default 44) rather than ad-hoc classes.
- `HeaderIconButton` with its required `label`.

## Codebase-Specific Patterns

- AGENTS.md → UI Standards: 44px minimum, colour-only active state, `hitSlop` below 44.
- DOM back key: `hardwareBack.onBack(() => { close(); return true; })` on open,
  released on close — `web/blocks/navigation/drawer-menu.tsx`.
- `HeaderAction.label` is required on the DOM for exactly this reason.
