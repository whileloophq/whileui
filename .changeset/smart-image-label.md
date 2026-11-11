---
'@thewhileloop/whileui': patch
---

`SmartImage` now exposes its image to screen readers under its `alt` text on every
platform. On the web `expo-image` dropped `alt` (its renderer reads only
`accessibilityLabel`), and on iOS and Android an image is skipped unless it is marked
accessible. An empty `alt` keeps a decorative image hidden. No call-site change is needed.
