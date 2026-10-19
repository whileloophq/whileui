/**
 * One focus treatment for every interactive component.
 *
 * Web needs this and native does not: React Native has no `:focus-visible`, and the
 * platforms draw their own focus for hardware keyboards and TV remotes. So these classes
 * are scoped with Uniwind's `web:` selector and compile to nothing elsewhere.
 *
 * `focus-visible`, not `focus`. `:focus` also fires on mouse press, which puts a ring on
 * a button someone just clicked — visually noisy, and it trains people to ignore the ring
 * that keyboard users actually depend on.
 *
 * WCAG 2.4.7 (Focus Visible, AA) requires an indicator. Several components here removed
 * the browser default with `outline-none` and replaced it with nothing, which is the
 * failure this exists to fix — the outline is only safe to remove if a ring takes over.
 *
 * The offset keeps the ring outside the control's own border so the two do not merge
 * into one thick smudge, and `ring-offset-background` fills that gap with the surface
 * colour rather than letting the ring sit on whatever is behind.
 */
export const focusRing =
  'web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 web:focus-visible:ring-offset-background';

/**
 * For controls drawn flush against an edge or inside a dense row, where an offset ring
 * would be clipped by the parent or collide with a neighbour.
 */
export const focusRingInset =
  'web:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring';

/**
 * For text fields. Browsers treat every focus on a text field as keyboard focus, so a
 * `:focus-visible` ring fires on a tap too — and an offset ring around a rounded field
 * reads as a second, squarer border. A field shows focus the way the platforms do:
 * its own border takes the ring colour. The class carries the colour; a field whose
 * border lives on a wrapper (`Input`, `NumericInput`) applies it there from focus state.
 */
export const focusField = 'web:outline-none web:focus-visible:border-ring';

/** The wrapper half of `focusField`: the border colour while the inner field has focus. */
export const focusFieldWrapper = 'border-ring';
