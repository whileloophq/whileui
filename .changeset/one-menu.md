---
'@thewhileloop/whileui': minor
---

Menus close when you choose an item, and work from the keyboard.

- `DropdownMenuItem`, `ContextMenuItem` and `MenubarItem` with an `onPress` — every real
  item — left their menu open: the item spread your props over its own closing handler.
  Choosing an item now runs your `onPress` and closes the menu; call
  `event.preventDefault()` to keep it open. The three menus now share one
  implementation, so they cannot drift apart again.
- Triggers say whether their menu is open (`aria-expanded`). On web, opening from the
  keyboard focuses the first item; the arrow keys, Home and End move between items; Escape
  closes and returns focus to the trigger.
- `ContextMenuTrigger` opened only on a long press, which a keyboard or mouse cannot do.
  On web it also opens on right-click, the context-menu key, Shift+F10, Enter and Space.
- Every overlay backdrop — Dialog, AlertDialog, Sheet, ConfirmActionSheet, DrawerMenu,
  the menus and the date and time pickers — is one component. On web it is no longer a
  Tab stop sitting in front of the overlay's contents.

Nothing to change at call sites. `DropdownMenuContentProps` and the other menu part prop
types are now aliases of one shared type, with the same props as before.
