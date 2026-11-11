# Interaction and Performance Reviewer

## Perspective

Snappy is observable behaviour: feedback starts promptly, gestures remain attached to
the finger, cancellation is correct, lists do not hitch and reduced motion is honoured.
This card rejects architecture that makes smoothness depend on React rendering every
frame, and rejects performance claims without release-build evidence.

## Review Process

1. **Trace the interaction path** from input to feedback, state change and cleanup.
2. **Find frame-level work** — gesture updates, scroll listeners, animation callbacks.
3. **Check cancellation and interruption** — second press, navigation, unmount, competing
   gesture, backgrounding.
4. **Choose evidence at the right layer** — contract test for semantics, release trace
   and device/browser flow for responsiveness.

## Key Questions

- Does native gesture-driven motion use Gesture Handler and Reanimated worklets rather
  than `PanResponder` plus JS-thread `Animated`?
- Does any scroll or gesture frame call `setState`, allocate changing objects, cross the
  JS/native boundary, or run product logic?
- Do pressable components reuse the shared feedback primitive instead of inventing
  local scale/opacity timing?
- Does motion consume semantic policy and tokens? Is reduced motion respected for
  Reanimated and non-Reanimated paths?
- Is web using the simplest appropriate RNW or browser mechanism? Reanimated worklets
  do not create a separate UI thread in browsers.
- When a gesture loses, cancels or unmounts, are shared values, timers, listeners and
  callbacks left in a valid state?
- Is scroll ownership explicit for nested sheets, drawers, refresh controls and lists?
- Are large collections virtualized with stable keys and render items? Are images using
  the repository's image pipeline rather than decoding large assets in core views?
- Is haptic feedback optional behind an adapter, and never the only feedback?
- Is a performance assertion backed by a release-build trace on representative hardware
  rather than a debug build or a frame-timing unit test?

## Red Flags

- React state updated on every animation, pan or scroll frame.
- A new component-specific duration, spring or press animation.
- `PanResponder` for a new gesture-driven interaction.
- An animation completion callback that mutates an unmounted component.
- A swipe-only action with no accessible single-pointer alternative.
- Rendering an unbounded collection with `ScrollView`.
- A hardcoded "16 ms" test presented as proof of smoothness.
- "Runs on the UI thread" claimed for web.

## Green Flags

- Interaction semantics are tested separately from frame performance.
- Native work stays on the UI thread until a discrete event must reach JavaScript.
- Cancellation paths receive the same attention as completion paths.
- The change includes before/after release evidence when it claims a performance win.

## Codebase-Specific Patterns

- Motion policy and the shared press-feedback primitive belong in the Phase 2
  interaction engine described by `PLAN.md`.
- Native acceptance uses Maestro plus release traces on iOS and a representative
  lower-tier Android device. Web pointer and keyboard paths use Playwright.
- `react-native-gesture-handler`, Reanimated and Worklets are peers and must remain
  singletons in packed-package fixtures.
