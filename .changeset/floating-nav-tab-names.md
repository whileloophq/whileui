---
'@thewhileloop/whileui': patch
---

`FloatingBottomNav` now gives every tab an accessible name. Inactive tabs render only their icon, so VoiceOver, TalkBack and browser screen readers announced them as an unnamed "tab". Each tab now carries its `label` as `accessibilityLabel`. No call-site change is needed.
