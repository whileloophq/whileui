---
'@thewhileloop/whileui': minor
---

`Toast` now looks like the rest of the theme. Every variant renders on the `popover`
surface; `success` and `destructive` show a status dot and tinted border instead of
filling the whole toast with the status colour. The description uses `muted-foreground` —
it previously referenced `success-foreground-muted` and `destructive-foreground-muted`,
which are not theme tokens, so it was never styled.

`ToastContainer` caps the stack at `max-w-md` and centres it, so a toast on a wide browser
window is a notice rather than a full-width banner. Phones are unaffected.

Toasts are now announced to screen readers without taking focus: through a polite live
region on Android and the web, and with `AccessibilityInfo.announceForAccessibility` on
iOS, which has no live regions. The dismiss control is a 44 px target on every platform
with a focus ring, and the entry animation is skipped when the motion policy disables
animation.

No call-site change is needed. `toastVariants` is still exported for extending the variant
styles.
