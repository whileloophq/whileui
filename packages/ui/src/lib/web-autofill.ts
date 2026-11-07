/**
 * Browser autofill paints its own field background and text colours. The large inset
 * shadow covers that paint without changing the native style contract; the other two
 * declarations restore the active theme's text and caret.
 *
 * Apply only to fields whose own surface is `bg-muted`. Transparent/unstyled inputs
 * must keep inheriting the surface chosen by their composition.
 */
export const webAutofillField =
  'web:autofill:shadow-[inset_0_0_0_1000px_var(--color-muted)] web:autofill:[-webkit-text-fill-color:var(--color-foreground)] web:autofill:caret-foreground';
