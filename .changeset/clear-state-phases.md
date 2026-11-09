---
'@thewhileloop/whileui': patch
---

Make asynchronous UI phases explicit: theme persistence now reads a replacement adapter before writing and preserves user choices made during hydration, AvatarImage and SmartImage restore loading fallbacks when a source starts loading, and existing toast timers no longer restart when the stack changes.
