# Web Production Reviewer

## Perspective

React Native Web is a production target, not a screenshot preview and not a second
component library. This card checks the browser contract users actually experience:
semantics, keyboard operation, focus, responsive containment, URLs and packaging. The
public WhileUI API stays shared even when a narrow web implementation is justified.

## Review Process

1. **Operate the changed surface without a pointer** — Tab, Shift+Tab, Enter, Space and
   Escape.
2. **Inspect browser semantics** — role, name, value, state, focus order and URL/form
   behaviour.
3. **Test the width range at both ends** — phone overflow and wide-screen containment.
4. **Exercise the exported bundle and packed package**, not only Expo development mode.

## Key Questions

- Is the same exported component and prop contract used on native and web?
- Does each custom `Pressable` have the role needed for Enter/Space activation in RNW?
- Is focus visible on `:focus-visible`, never dependent on hover, and returned to a
  sensible target after an overlay closes?
- Does Escape dismiss only the topmost dismissible overlay?
- Are hidden and closed surfaces removed from keyboard and accessibility traversal, not
  merely transparent?
- Does responsive layout avoid horizontal overflow at 320/390 px and avoid stretching
  content edge to edge on desktop?
- Are links, external navigation, forms, downloads and viewport behaviour handled by a
  narrow web adapter when browser semantics differ?
- Are `window`, `document`, storage and media-query access confined to web files and
  guarded so importing the package does not crash server tooling?
- Does web motion respect reduced motion and remain simple where a CSS/RNW transition
  is sufficient?
- Does the Vite/RNW fixture consume the public packed artifact, including Uniwind class
  discovery and conditional exports?

## Red Flags

- A parallel React DOM component tree or a `/web` API with different props.
- Click-only behaviour with no keyboard path.
- A focus ring removed without a `focus-visible` replacement.
- A modal that visually closes but leaves focus in hidden content.
- Browser globals imported by renderer-free code or a shared module's top level.
- Testing only one narrow viewport and calling the layout responsive.
- Treating successful Expo web rendering as production browser evidence.
- Adopting a second styling/token runtime only for web.

## Green Flags

- A small `.web.tsx` exists because semantics differ and shares the public type with
  native.
- Chromium and WebKit tests assert behaviour; Firefox joins the release matrix.
- Phone, tablet and desktop layouts are the same composition with responsive rules.
- Desktop delivery uses the web/PWA build until a product funds a native desktop target.

## Codebase-Specific Patterns

- `apps/showcase` is exported before Playwright runs; tests do not rely on the dev
  server.
- `e2e/keyboard.spec.ts` owns keyboard order and activation;
  `e2e/responsive.spec.ts` owns both ends of the width range.
- `fixtures/vite-smoke` proves public React Native Web consumption.
- A platform split must also pass `02-renderer-boundary.md`; this card reviews the
  resulting browser behaviour.
