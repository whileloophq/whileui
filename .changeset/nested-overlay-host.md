---
'@thewhileloop/whileui': patch
---

Host every Modal-based overlay through one internal host so nested overlays layer and
dismiss correctly. A Select, Popover, Tooltip or HoverCard opened inside a Dialog,
AlertDialog, Sheet, ConfirmActionSheet, DrawerMenu, menu or picker now renders above that
overlay on iOS, Android and web instead of beneath it; `portalHost` is only needed for a
host you place yourself. Android back and web Escape close the innermost open layer first,
and one Escape press no longer closes both a popover and the dialog around it. `DrawerMenu`
is hosted in a modal on every platform, so it closes on Escape and keeps keyboard focus
inside on web. `Sheet` fades its backdrop in place while the panel slides, instead of
sliding the dim layer up with it, and stays mounted through its exit animation. Menu
items, `MenubarTrigger`, `Toggle` and `Header` actions press with the subtle
`state-pressed` token instead of the theme's accent colour. The shadow recipe emits an
outset `boxShadow` instead of `elevation` and the legacy `shadow*` props, so a shadow
no longer shows through a translucent surface on Android; Android below 9 keeps
`elevation`. `DialogTitle` is now a heading. No public prop changed.
