---
name: whileui
description: Build React Native screens with WhileUI (@thewhileloop/whileui) for iOS, Android and web — setup, picking components, theming, and checking the result. Use when a project depends on @thewhileloop/whileui or the user asks for WhileUI UI.
---

# WhileUI

WhileUI is a React Native component library styled with Uniwind (Tailwind v4) and themed
through a typed token contract. One component tree serves iOS, Android and React Native
Web.

## Read the docs for the installed version

Never rely on memory for props; the installed package ships its own docs:

- `node_modules/@thewhileloop/whileui/dist/agent/llms.txt` — rules, the composition
  grammar and every component, one page. Read this first.
- `dist/agent/llms-components.txt` — each component's API section.
- With the MCP server (`claude mcp add whileui -- npx -y @thewhileloop/whileui-mcp`):
  `list_components`, `get_component_docs`, `get_theme_tokens`, `get_guide`.

## Setup traps

These fail silently — no build error, just an unstyled or broken app:

- `metro.config.js` must wrap the config with `withWhileUIMetro` from
  `@thewhileloop/whileui/metro`, as the outermost wrapper. Without it, icon fonts never
  load on iOS and Android.
- `global.css` sits at the app root, is imported in `App.tsx`, and — when installed from
  npm — contains `@source './node_modules/@thewhileloop/whileui/dist';`. Without that
  line every component renders unstyled.
- Wrap the root in `MotionProvider` and render `PortalHost` once, at the root.
- A custom theme defines every colour token in both light and dark, or components fall
  back to unstyled values.

## Composing screens

Follow the composition grammar in `llms.txt`. In short: one page canvas with flat
sections; a `Surface` only where grouping means something; hierarchy through `Text`
variants, not ad-hoc font sizes; one primary action per region; long content inside
`Container`.

## Theming

Build a palette from three colours with `themeFromSeeds`, render it with
`themePresetToCss`, and check any palette — generated or hand-written — with
`checkThemeContrast` (all from `@thewhileloop/whileui/tokens`). Seeds are kept as given;
a failing brand colour is reported, never changed, so show the user the failures.

## Check your work

Do not report a screen as done from reading code. Run the app on the web
(`npx expo start --web`) and look at it: the rendered screen, its accessibility tree
(every control needs a role and a name), and the console. Check light and dark.
