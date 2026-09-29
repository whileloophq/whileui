---
'@thewhileloop/whileui': patch
---

Require `expo-image`, which is statically used by root-exported media and commerce components. This prevents consumers from installing a configuration that passes package checks but crashes when the native module is unavailable.
