---
'@thewhileloop/whileui': minor
---

`useThemeBridge` returns `toggleTheme`, which switches to the opposite of the theme on
screen. A sun/moon button wired to `cycleMode` needed two taps on first use: the cycle goes
light → dark → system, so from `system` its first step was to `light`, the theme already
showing. Use `toggleTheme` for a two-state button and keep `cycleMode` for a control that
shows all three modes. The hook is now documented under Theming in the README.
