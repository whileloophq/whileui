---
'@thewhileloop/whileui': patch
---

Icons inside buttons and navigation no longer leak into the spoken label on iOS. React Native
builds a pressable's VoiceOver label by joining every child's text, and an icon font glyph is
text, so a `Button` with a `ButtonIcon` was read as ", Download". `ButtonIcon` and the icon
slots of `BottomNav`, `TabBar`, `FloatingBottomNav`, `DrawerMenu`, `ListItem` and
`NotificationItem` are now marked `aria-hidden`. No call-site change is needed.
