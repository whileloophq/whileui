---
'@thewhileloop/whileui': minor
---

`FormModalScreen` draws the Cancel · title · Save bar itself. `onClose` is now a "Cancel"
text button (it was a "×" glyph; set `closeLabel` to change the word), and the new
`onSave`, `saveLabel` and `saveDisabled` draw a primary Save button that disables and
shows a spinner while `saving`. The header slots were a fixed 48px, so a Save button in
`rightSlot` spilled into the title and a long title crowded it; each side now takes the
width its content needs and the title truncates. `leftSlot` and `rightSlot` still
replace the buttons.
