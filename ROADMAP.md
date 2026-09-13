# WhileUI: React Native product direction

## The one idea

WhileUI is the base platform for WhileLoop products. It exists so a React Native
app starts from proven, branded application patterns instead of assembling
primitives screen by screen, and it is judged by how much real screen work it
removes for an active consumer.

It is open source by default. External users are welcome; they are not a
constraint on the roadmap, the API or the compatibility policy.

`PLAN.md` states what "production ready" means here and the sequence to get
there. This file states direction and ownership.

## Active renderer

WhileUI has one renderer: React Native, developed and demonstrated through Expo.
iOS, Android and React Native Web are all production targets. iOS and Android
define the interaction and performance baseline; web must stay accessible,
keyboard-operable and responsive without distorting the native API or growing a
second component library.

The former plain-DOM track and its Capacitor adapter were removed in September 2026. Maintaining two implementations made every behavioural component a
parallel product and slowed the applications the library was meant to speed up.

## What the experiment taught us

- Share a design system, not renderer abstractions.
- Mobile mechanics such as keyboard avoidance, safe areas, gestures, sheets and
  pull-to-refresh belong in tested native blocks.
- Device capabilities should have narrow boundaries, but authentication,
  billing, routing and application state remain in the consuming app.
- Build a pattern in a real screen, then extract it once its API is understood.
- Do not pursue component parity with an inactive platform.

## Ownership

| Layer                                     | Owner                                                                |
| ----------------------------------------- | -------------------------------------------------------------------- |
| Tokens, themes and visual contracts       | WhileUI                                                              |
| Presentational and behavioural primitives | WhileUI                                                              |
| Repeated app-shaped blocks                | WhileUI                                                              |
| Navigation state and routes               | Consuming app                                                        |
| Authentication and billing                | Consuming app                                                        |
| Device libraries and permissions          | Consuming app, exposed through narrow adapters where reuse is proven |
| Domain state and API clients              | Consuming app                                                        |

## The proving product

At any time one consuming application is the proving product: the app whose real
screens decide what gets built, in what order, and when a component is done. Any
consuming application can play that role; the current one is simply the app
furthest along.

Two rules follow:

- **Work is pulled, not proposed.** A component is built because a screen needs
  it. The proving product's current pull order, its critical acceptance flow and
  its migration sequence live in `CONSUMERS.md` — local and gitignored, because
  they are product plans rather than library contracts.
- **WhileUI owns the stack and products track it.** A product never negotiates
  the library down to an older Expo SDK (`PLAN.md` > Supported stack).

The acceptance flow is exercised on both iOS and Android, and in the supported
browsers, before lower-priority components are expanded.

## Non-goals

- A plain-DOM or Capacitor component implementation.
- A universal primitive layer spanning React DOM and React Native.
- Owning application routing, API state, RevenueCat or authentication flows.
- Speculative macOS or Windows component variants without an active consumer.
- Pixel-perfect imitation of stock iOS or Material chrome.
- Supporting more than one Expo SDK at a time, or bare React Native.
- API surface, configuration or tooling added for external consumers rather than
  for a WhileLoop product.

## Extraction rule

Prefer implementing a new composition in the consuming app. Move it into
WhileUI when its reusable boundary is demonstrated by a second call site or a
second application. Primitives and correctness fixes may be added directly when
their ownership is already clear.
