---
'@thewhileloop/whileui': patch
---

`SmartImage` now names its image on the web. `expo-image`'s web renderer reads only
`accessibilityLabel`, so the `alt` you pass was dropped and the image was announced
without a name. No call-site change is needed.
