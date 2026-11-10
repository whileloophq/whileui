---
'@thewhileloop/whileui': minor
---

Fixes pulled from the first consuming application. `withWhileUIMetro` from
`@thewhileloop/whileui/metro` wraps Uniwind's Metro config and keeps `expo-asset`,
`expo-font` and `@expo/vector-icons` on the real `react-native`, so icon fonts load on
device without every app copying the resolver exemption. `Alert` is an `alert` live
region by default. `HeaderAction` accepts `accessibilityLabel` so icon-only actions have
a name. `SelectContent` keeps its listbox inside the safe area by default. `Text` gains an
`eyebrow` variant for the muted label above a title. `LoadingState` joins `EmptyState`
and `ErrorState` as the in-flow placeholder for a section still fetching.
