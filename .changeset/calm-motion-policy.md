---
'@thewhileloop/whileui': minor
---

Add `MotionProvider` and `useMotionPolicy`: one policy for system reduced motion, explicit
`reduced` and `full` overrides, and a deterministic `disabled` mode for tests.

The provider is optional. Without it, `useMotionPolicy` returns the default policy — the
token defaults, with Reanimated following the system setting — so existing apps keep
working. Wrap the root in `<MotionProvider>` to have `--ui-motion-*` overrides and the
non-Reanimated reduced-motion paths (web transitions, drawer timing) honoured too.
