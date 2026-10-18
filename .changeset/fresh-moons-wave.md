---
'@thewhileloop/whileui': major
---

Move the supported runtime to Expo 58, React Native 0.88 and React 19.3. Consumers must
upgrade those packages together with the matching Gesture Handler, Reanimated,
Worklets, safe-area and screens versions before installing this release. Ref types now
use React Native's public strict-API instance types so generated declarations remain
portable on the Expo 58 stack. `ThemeBridge` no longer accepts the redundant
`onModeChange` prop; use the controlled `mode` prop or `useThemeBridge` when the caller
needs to observe and change theme state.

Date-picker draft state now resets at the session boundary without an effect-delayed
frame, drawer sections are virtualized, and complex input/render paths are split into
focused hooks and components without changing their public behavior.
