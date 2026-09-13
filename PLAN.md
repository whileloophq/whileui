# WhileUI Production Foundation Plan

## What this file is

Three tracked documents, one job each.

| File             | Answers                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `ROADMAP.md`     | Why WhileUI exists, what it owns, what it refuses to own         |
| `PLAN.md` (this) | What "production ready" means here, and the sequence to reach it |
| `AGENTS.md`      | How to edit this repo day to day                                 |

`README.md` remains the API source of truth. `docs/review-perspectives/` holds the
per-PR review cards that enforce this plan.

**This repo is public.** Everything here is written to apply to any consuming
application. Product specifics — which apps consume WhileUI, their pull order and
acceptance flows — live in `CONSUMERS.md`, which is gitignored. A rule that needs a
product's name to make sense belongs there, not here.

Where this plan and `AGENTS.md` disagree, this plan wins and the rule is stale — fix
it. Where this plan and `ROADMAP.md` disagree, the roadmap wins.

## North star

> WhileUI is the base platform for WhileLoop products. It is open source by default,
> but its architecture, roadmap, compatibility policy and abstractions are driven by
> real WhileLoop applications, not by hypothetical external consumers.

Five consequences that actually change what gets built:

1. **Products pull work.** A component exists because a product needed it. Nothing is
   added because an external user might want it.
2. **WhileUI owns the stack; products track it.** The library is the base, not a
   downstream dependency negotiating with many apps.
3. **Breaking changes are cheap while we own every consumer.** Refactor aggressively
   now. Do not build deprecation machinery, compatibility shims or migration codemods
   for users who do not exist.
4. **Opinionated beats configurable.** The job is to make WhileLoop screens faster to
   build, not to expose every option.
5. **Evidence is scaled to real delivery targets** — iOS, Android and web — not to an
   open-source support promise.

Open source means the work is public and MIT. It does not mean external compatibility
is a constraint on the roadmap.

## Supported stack

One known-good stack at a time, pinned to the current Expo SDK. No N-1 matrix, no bare
React Native promise, no Old Architecture support.

**The package and showcase run this stack as of 2026-09-12** (Phase 0 moved them from
SDK 54 / RN 0.81.5 / React 19.1, and tightened the published peer ranges in the same
change). The proving product has not moved yet — it is the remaining Phase 0 item.

For anything Expo bundles, take the version from that SDK's `bundledNativeModules.json`,
never from npm `latest`. For everything else — `uniwind`, `tailwindcss`, tooling — track
latest stable, and treat a version left behind during an SDK bump as a suspect when
Metro breaks.

| Layer        | Pinned                                                                           |
| ------------ | -------------------------------------------------------------------------------- |
| Expo SDK     | 57 (`expo@57.0.x`)                                                               |
| React Native | 0.86.3, New Architecture required                                                |
| React        | 19.2.3                                                                           |
| Web renderer | `react-native-web@~0.21.0`                                                       |
| Motion       | `react-native-reanimated@4.5.1` + `react-native-worklets@0.10.1`                 |
| Gesture      | `react-native-gesture-handler@~2.32.0`                                           |
| Styling      | `uniwind@^1.12` + `tailwindcss@^4`                                               |
| Behavior     | `@rn-primitives/*`, pinned exactly                                               |
| Test runtime | `jest-expo@~57.0.x` + React Native Testing Library                               |
| Toolchain    | `bun@1.3.9`, TypeScript 5.9                                                      |
| Browsers     | Chromium and WebKit gated per PR; Firefox on release                             |
| Devices      | Current iOS simulator, current Android emulator, one physical lower-tier Android |

Rules:

- React Native Testing Library replaces `react-test-renderer`, which is deprecated for
  React 19.
- A product that cannot take the current stack pins the last WhileUI version that
  worked for it. We never branch the library to keep an old product alive.
- Upgrading the SDK is a WhileUI task with its own changeset, not something each
  product discovers independently.

## Platform contract

### One public contract, not one implementation

iOS, Android and React Native Web are production targets. One exported component name,
one prop contract, one set of state semantics and one accessibility intent across all
three. Internals may differ, and callers never choose a renderer.

React Native Web deliberately does not reproduce every native mechanism.
`KeyboardAvoidingView`, `BackHandler` and `Keyboard` are mocks; `RefreshControl` is
unsupported. A narrow `.web.tsx` is therefore the correct universal architecture in
those places, not a failure of universality.

A platform file is justified when **one** of these is true:

- the browser has a different semantic primitive (focus order, form submission, URL
  behavior, viewport handling);
- the native API is mocked or missing on the other target;
- the accessible behavior would otherwise regress.

A platform file is **not** justified to reduce line count, to avoid a conditional, or
to ship a different visual design. Styling differences use Uniwind `ios:`, `android:`,
`web:` and `native:` selectors; they must never hide a behavioral divergence that
deserves a real implementation split.

### Native baseline

- Gesture-driven motion runs through Gesture Handler and Reanimated worklets on the UI
  thread.
- Hardware back dismisses the topmost dismissible overlay.
- Keyboard, safe area, orientation, font scaling and screen-reader behavior are
  explicit contracts, not emergent behavior.
- Performance acceptance happens in release builds on both platforms.

### Web baseline

Web is a production target, not a preview. Every stable interactive component owes:

- keyboard reachability and a visible focus state that hover never replaces — one shared
  `focusRing` on `:focus-visible`, asserted by tabbing the showcase in `e2e/keyboard.spec.ts`;
- `Escape` dismissing the topmost dismissible overlay, with focus returning to its
  trigger;
- working layout from 320 px to desktop widths;
- browser globals confined to narrow web adapters;
- SSR safety where free; SSR-first rendering is not a release requirement.

### Desktop

Mac and Windows ship as the responsive web build or PWA. A native desktop variant needs
an active WhileLoop consumer and its own test matrix before it is considered.

## Accessibility and input contract

Platform guidance differs and a single universal number is wrong.

| Target  | Minimum interactive target                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| iOS     | ≥ 44 × 44 pt hit area                                                                                            |
| Android | ≥ 48 × 48 dp touch target                                                                                        |
| Web     | WCAG 2.2 AA target size (≥ 24 × 24 CSS px, documented exceptions); design ≥ 44 CSS px for primary touch controls |

Visually smaller controls keep their visual size and reach the minimum through
`hitSlop` or padding.

Also required for stable status:

- **Drag alternatives.** Any function driven by dragging or swiping has an equivalent
  single-pointer path unless dragging is essential (WCAG 2.2 "Dragging Movements"). This
  is a design requirement at the point the interaction is proposed, not a retrofit.
- **RTL.** Logical start/end spacing, mirrored directional motion and icons where
  semantic, correct swipe/drawer direction. Verified in an RTL showcase mode.
- **Large text.** Font-scaling stress on inputs, OTP cells, dialogs and sheets.
- **Screen readers.** VoiceOver and TalkBack pass on the product critical flow: role,
  name, value, state, reading order, modal containment, async status announcements.

Automated accessibility scanning is a defect detector, never a conformance
certificate. Manual keyboard and screen-reader checks stay in the release checklist.

## Architecture boundaries

| Layer             | Contains                                                                                                                               | Forbidden                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Renderer-free** | Token contracts, theme derivation, presets, registry schemas, pure utilities                                                           | React, React Native, Uniwind, DOM imports                                            |
| **Styling**       | Semantic Uniwind classes; `StyleSheet.create` for fixed hot-path styles; focused token hooks where a native API needs a concrete value | Arbitrary runtime style-prop resolution, responsive prop objects, deep theme merging |
| **Primitive**     | Accessibility state, press behavior, disabled/loading semantics, refs, platform differences                                            | Navigation, auth, billing, analytics, domain state                                   |
| **Block**         | Compositions of stable primitives that accept data and events                                                                          | Application stores, services, product copy                                           |
| **Adapter**       | Small injectable boundaries for haptics, clipboard, alerts, permissions                                                                | Hard dependencies that break when the capability is absent                           |

Uniwind's own guidance matches this: `className` is the default path, and runtime class
resolution is a slower interoperability tool for special cases. Performance work stays
measurement-driven — static classes first, `StyleSheet.create` as a targeted
optimization, runtime resolution only where nothing else fits.

## Tokens: one canonical source

Today the token contract lives in TypeScript (`theme-contract.ts`,
`visual-token-contract.ts`, `theme-derive.ts`, `theme-presets.ts`) and the values land
in each app's `global.css`. Those are two places to be wrong.

The rule going forward:

1. The renderer-free TypeScript layer is **canonical** for token names, groups, types
   and derivation.
2. Consumer CSS variable blocks are **generated** from a preset via `themePresetToCss`
   into a `theme.generated.css` the app imports. Generated files carry a header saying
   so and are never hand-edited.
3. An app's own design decisions — its `@theme` scale, font mapping, custom variants —
   stay hand-authored in `global.css`. We generate the contract, not the taste.
4. `verify` regenerates and fails on a dirty diff.
5. Reading tokens at runtime goes through typed helpers, never raw CSS-variable access.
   Uniwind returns `16` on native and `"16px"` on web for the same variable; the helper
   normalizes and the component never learns about it.

## Maturity and lifecycle

Every export carries exactly one level, recorded in the stability inventory and in
generated docs.

| Level          | Means                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `experimental` | Showcase renders it. API will change without notice.                                                                     |
| `candidate`    | Contract tests pass. A real WhileLoop app is integrating it right now.                                                   |
| `stable`       | Definition of done met, and it is used in a shipped production flow in a WhileLoop app.                                  |
| `deprecated`   | Superseded. Has a named replacement and a migration note. Removal allowed in the next minor while we own every consumer. |

Two clarifications that matter:

- **Any consuming product can prove a component**, not one designated app. The current
  proving product is simply the one furthest along. The requirement is real production
  usage, not usage by a particular app.
- **Products default to stable components, but the proving product may use candidates
  deliberately** while proving them. Without this the plan deadlocks: a component
  cannot become stable until a product uses it, and the product cannot use it until it
  is stable.

## Definition of done for a component

1. Public props and state ownership are explicit; controlled and uncontrolled modes
   behave consistently.
2. Ref forwarding and imperative behavior are tested where exposed.
3. Disabled, loading, error, empty, interrupted and unmounted states are covered where
   applicable.
4. Accessibility role, name, value, state, focus, `Escape` and Android back are
   verified.
5. Target sizes, font scaling and RTL meet the accessibility contract.
6. Motion respects reduced motion and updates no React state per frame.
7. Light, dark and one product theme all render correctly.
8. The same API runs on iOS, Android and web, or has a documented platform
   implementation that meets the justification test.
9. README API section and a showcase demo are current.
10. The packed-package fixtures build against it.
11. A real product call site uses it before it is marked stable.

## Evidence model

Each layer proves something the layer below cannot. Unit tests are the fast inner loop,
not the top of the pyramid.

| Layer                | Tool                                                       | Proves                                                                    | Cannot prove                                                    |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Static               | Prettier, TypeScript, ESLint, React Doctor                 | Shape, types, lint rules, suspicious patterns                             | Anything about runtime behavior                                 |
| Component contract   | `jest-expo` + RNTL                                         | State, callbacks, a11y props, refs, cleanup, regressions                  | Real keyboards, back dispatch, portal layering, focus, gestures |
| Public type contract | Compile-only consumer fixtures                             | The published API still typechecks for a caller                           | Runtime behavior                                                |
| Distribution         | `npm pack` → Expo and Vite/RNW fixtures, `publint`, `attw` | Export map, files, peers, conditional resolution, Uniwind class detection | Product behavior                                                |
| Native integration   | Maestro on built iOS/Android artifacts                     | OS keyboard, Android back, gesture arbitration, overlay order, focus      | Browser semantics                                               |
| Browser integration  | Playwright (Chromium + WebKit)                             | Keyboard order, `Escape`, focus return, responsive layout, a11y scan      | Native behavior                                                 |
| Product              | The proving product's acceptance flow                      | Composition under real data and navigation                                | Device diversity at scale                                       |
| Production           | Telemetry on startup, interaction, errors                  | What actually happens on users' devices                                   | —                                                               |

Two corrections to earlier drafts of this plan:

- **React Doctor is a static signal, not proof.** A clean report does not prove gesture
  work stayed off the JS thread. Release traces and device E2E provide that.
- **The static layer is worth more than "shape and types" suggests** — but only the
  type-aware rules. `no-floating-promises` is what stands between a dropped `await` in a
  test and a green suite proving nothing, and `no-deprecated` turns an SDK bump's
  removals into errors here instead of red screens later. Rules that run without the
  type checker would have caught none of the eight defects the first lint pass found.
- **"Runs on the UI thread" is native-only.** Reanimated has no separate UI thread in
  browsers; worklets there are ordinary JavaScript functions. Simple web press, hover
  and focus transitions should use whatever RNW or CSS mechanism is simplest, behind
  the same WhileUI API.

## Distribution contract

The library is published and consumed through npm even by our own apps, so publishing
mistakes are product bugs. Current peer ranges (`expo >=52`, `reanimated >=3`) are
looser than the stack we actually support and will be tightened.

- **Test the packed tarball, not the workspace.** `bun run verify:package` packs one and
  inspects it away from any `node_modules`. A workspace symlink hides missing `files`,
  bad export maps, undeclared dependencies and different conditional resolution.
- **`publint` and `@arethetypeswrong/cli`** run against that tarball.
- **`src/` is not published**, so source maps are not emitted either — they would point
  at files no consumer has. Tailwind therefore scans `dist` for class names, and the
  packed check proves it still can. If we ever want consumers stepping into library
  source, ship `src` and turn the maps back on together; one without the other is
  300 dead files.
- **Export map stays small and explicit.** Every public subpath has an import test from
  both Metro/Expo and Vite/RNW. Deep imports into internals are not supported. When
  conditional exports are used, `browser` precedes the community `react-native`
  condition so RNW resolves correctly.
- **Peers, not dependencies,** for React, React Native, RNW, Reanimated, Worklets,
  Gesture Handler and RN Primitives — anything where two copies break context or native
  registration. Optional capabilities stay optional peers behind adapters.
- **Uniwind source scanning is part of the contract.** A shared UI package may need the
  consumer's CSS to declare `@source` pointing at it inside `node_modules`, and class
  detection can fail if only compiled JavaScript is published. The clean packed-package
  fixture must prove WhileUI classes are detected from the published artifact; the
  monorepo's `@source '../../packages/ui/src'` is not evidence.

## Interaction and motion

- Native gesture-driven motion uses Gesture Handler and Reanimated worklets. Web uses
  the most appropriate RNW or browser mechanism for the same intent.
- One shared press-feedback primitive. Components do not each invent press animation.
- The motion provider carries **policy** only: reduced motion, motion disabled under
  test, semantic duration and spring tokens. Reanimated already honors the system
  reduced-motion setting; the provider coordinates that with non-Reanimated paths
  rather than duplicating it.
- Haptics stay behind an adapter and are opt-in, never a default in a primitive.

**Frame budget wording.** 16.67 ms is the interval for 60 Hz, not a universal budget;
high-refresh devices have less. Acceptance is dropped-frame and interaction evidence
from release builds on representative devices, not a CI assertion at frame
granularity. Press feedback has an observable latency goal backed by traces, not a
hardcoded millisecond test.

Non-negotiable: no component updates React state on every scroll or gesture frame;
large collections are virtualized; images use `expo-image` unless a documented API
constraint applies.

## Overlays and keyboard

The overlay coordinator is deliberately narrow. It owns:

- stacking order and which overlay is topmost;
- dismissal policy — Android back priority, web `Escape` priority;
- portal root coordination;
- return-focus intent.

It does **not** reimplement focus trapping, dismissable-layer mechanics or menu
semantics that the RN Primitives / Radix substrate already provides correctly. We test
the WhileUI contract _around_ that substrate: nested Dialog → Popover, Sheet →
confirmation Dialog, interrupted exit animation, trigger unmounted during close,
multiple portal roots, Android back on a non-dismissible overlay, `Escape` consumed by
an inner overlay, and focus return when the original trigger is gone.

Keyboard behavior is a platform seam by design, because the native keyboard APIs are
mocked on web. Native verifies overlap, safe area, orientation, accessory views and
dismissal. Web uses document layout, responsive CSS and focus management rather than
translating native keyboard offsets. OTP and numeric inputs additionally specify IME,
paste and autofill behavior while keeping identical `value`/`onChange` semantics.

## Phases

Web, native and packaging evidence arrive in Phase 1. The point is to discover
cross-platform and distribution problems before three phases of work sit on top of them.

### Phase 0 — Baseline and stack upgrade

Status as of 2026-09-12: everything below is done except the proving product's upgrade.

- [x] Move `packages/ui` and `apps/showcase` to the Expo 57 stack above, and tighten the
      published peer ranges to match.
- [x] Stability inventory (`docs/stability.md`): every family → maturity → the evidence
      behind it. 80 families, all `experimental`, 30 with a production call site, 0 with
      tests.
- [x] Resolve Tier 3 — `Box`, `OnboardingScreen`, `SwipeableItem` and `NavigationSidebar`
      had no consumer and no demo, and were deleted.
- [x] Record the baseline: package size, bundle sizes, export map (`docs/stability.md` >
      Baseline). React Doctor and release traces move to Phase 1, which sets up the
      tooling they need.
- [x] Delete `apps/site` remnants and the docs naming the removed DOM track.
- [ ] Move the proving product to the same stack. Until then the library is ahead of its
      consumer, which is the one state this policy is meant to avoid.
- [ ] Freeze new components until the stable kernel has evidence.

**Exit:** both apps run on the new stack; a tracked stability inventory and reproducible
baseline commands exist.

### Phase 1 — Evidence and distribution infrastructure

- [x] Jest + `jest-expo` + RNTL; `bun run test` fails when no tests are found.
- [x] Shared render helper (`src/test/render.tsx`): portal host and fixed safe-area
      metrics. Build and typecheck configs split so tests are typechecked but never
      published.
- [x] A real ESLint task, not the package build standing in for one. One flat config at
      the root over every workspace, the fixtures and the config files — 183 files in a
      single pass, `--max-warnings 0`, no backlog. Type-aware rules are enumerated, not
      preset: `no-floating-promises`, `await-thenable`, `no-misused-promises` and
      `no-deprecated`. Plus the React Compiler rule set and `eslint-plugin-jest`.
- [x] Public API type-contract fixtures that compile as a consumer
      (`fixtures/type-smoke/`, run by `bun run typecheck`). **No `paths` mapping** —
      resolution goes through `node_modules` and the package's `exports` map, so a
      broken subpath fails here. Verified by deleting `./tokens` from the export map and
      watching it fail. `@ts-expect-error` blocks pin the contracts a positive test
      cannot: they fail if the API becomes _more_ permissive.
- [x] `bun run verify:package` packs a real tarball, extracts it away from any
      `node_modules`, and asks four things of it: every export-map entry exists; no file
      imports something undeclared; Tailwind still finds our class names with no `src/`
      to scan; and `publint` plus `attw` are clean. About 8 seconds, chained into
      `verify`.
      It only gates `bundler` resolution — the mode Metro and Vite both use. `node16`
      reports 69 internal resolution errors because the emitted `.d.ts` use extensionless
      relative imports; fixing that means `.js` suffixes through the source, and no
      consumer of ours needs it.
- [x] Playwright smoke on the showcase in Chromium and WebKit: tab order, keyboard
      activation, `Escape`, focus return, and an axe scan of every category. Runs against
      the **exported** bundle, not the dev server. 32 tests. The scan is a ratchet —
      per-category violation allowances that may only go down — because fixing every
      finding in one pass was not realistic. Seven of ten categories are at zero, and
      the catalog went from 13 violations and 185 role-less focusable elements to 7 and 20. Both remaining sets are showcase demo markup, not library code.
- [x] First Maestro smoke on built iOS and Android artifacts. `e2e/maestro/` holds the flows and
      `bun run test:native` runs them against a built app. The first flow is native smoke for
      `AlertDialog`: it opens from its trigger, title and description reach the platform
      accessibility tree, both controls are addressable by name, and Cancel dismisses it.
      **This layer earned its place on the overlay containment fix**, which nothing else can
      see. Measured on an iOS simulator, same screen, one prop changed: with
      `accessible={false}` the tree holds the title, description, Cancel and Delete; without
      it, only the title — VoiceOver could not reach either button of a destructive
      confirmation. The flow fails without the fix on iOS and passes with it.
      **Android cannot see it**: `accessible` groups children for TalkBack but leaves every
      node in the UIAutomator tree, so the same flow passes there either way. iOS is the gate
      for accessibility containment.
      Requires Xcode ≥ 16.1 (`react-native/scripts/cocoapods/helpers.rb`); `pod install`
      refuses below it.
- [x] Changesets and a release checklist (`AGENTS.md` > Releasing). Twenty-two versions
      shipped before this existed, with no record of what changed in any of them. Four
      changesets are pending for the work above; the first applied bump will be a major,
      for two pieces of public API that did nothing and were removed.
- [x] One command runs every gate: `bun run verify` — format, lint, typecheck, unit,
      build, iOS and Android exports, then the browser suite. About 70 seconds. Run it
      before pushing.
      **There is no CI, by choice.** Nothing here is enforced by a server, so the
      discipline is the command. As gates are added — packed fixtures, Maestro — they
      join `verify` rather than a workflow file.

Contract suites land one family at a time, each promoting its family to `candidate` in
`docs/stability.md`. All six exit families are done — 40 tests — and they caught two
real accessibility defects in already-shipping components.

**Exit:** ~~contract suites for the first six Tier 1 families~~ (done 2026-09-12:
`Button`, `Input`, `OTPInput`, `AlertDialog`, `SmartInput`, `KeyboardAwareScreen`); the
tarball installs cleanly in both fixtures; web and native smokes are green.

Draw this list from Tier 1, never Tier 2. Writing suites for a component no product
uses is the same mistake as hardening one — it spends the budget where no defect can
reach a user.

### Phase 2 — Interaction engine

- Motion policy provider with reduced-motion support.
- One press-feedback primitive with native and web-appropriate internals.
- Audit drawer, sheet, pull-to-refresh and press interactions for gesture cancellation
  and scroll ownership.
- Add `react-native-gesture-handler` to peers and to both fixtures.

Gesture-driven motion is built on Gesture Handler and Reanimated from the start —
`PanResponder` with JS-thread `Animated` is not an acceptable starting point for new
work. The swipe-action component that would have needed that migration was deleted in
Phase 0 for having no consumer; when a product asks for swipe actions, it gets built on
the right foundation once, with its non-drag path included.

**Exit:** release-build gesture behavior verified on iOS and Android via Maestro; web
pointer and keyboard paths verified via Playwright; traces show no per-frame React
state; no unexplained React Doctor findings in touched components.

### Phase 3 — Overlays and keyboard

- Overlay coordinator with the narrow contract above.
- Harden Dialog, AlertDialog, Sheet, DrawerMenu, Popover, ContextMenu, DropdownMenu,
  Menubar, Tooltip.
- Platform keyboard implementations behind one API; `KeyboardAwareScreen`,
  `DockedInput`, `SmartInput`, numeric input and OTP verified under font scaling and
  orientation change.

**Exit:** the proving product's critical flow (defined in `CONSUMERS.md`) passes Maestro
on iOS and Android and Playwright in Chromium and WebKit.

### Phase 4 — Tokens and hot paths

- Make the renderer-free token layer canonical; generate CSS variable blocks and typed
  metadata; add the dirty-diff gate to `verify`.
- Replace repeated full-contract token reads with semantic classes, static styles or
  typed focused hooks — after profiling, not before.
- Split high-complexity components along state or rendering boundaries without
  expanding their public APIs.
- Render-count tests around providers and compound controls; package payload budgets.

**Exit:** generated artifacts are clean; measured regressions are addressed; no second
source of truth for any token.

### Phase 5 — Web production hardening

- Whole stable showcase operated keyboard-only.
- Chromium and WebKit on every PR; Firefox added to the release matrix.
- Responsive verification at phone, tablet and desktop widths; deep links; asset
  loading; PWA packaging for Mac and Windows delivery.
- Visual regression on deterministic showcase states.
- WCAG 2.2 target-size and drag-alternative audit across stable components.

**Exit:** the product acceptance flow passes the browser matrix and the web release
checklist.

### Phase 6A — Internal registry

- One catalog manifest describing every item: `distribution: package | registry`,
  maturity, required WhileUI range, supported platforms, files, package dependencies,
  registry dependencies, install hash.
- Blocks stored as source; registry items import stable primitives from
  `@thewhileloop/whileui` rather than copying them.
- `whileui add <item>` only, with dry run, conflict detection and no silent overwrite of
  owned application source.
- Clean-project fixture install as part of `verify`.

**Exit:** a new WhileLoop product can install a block and its dependencies
reproducibly.

### Phase 6B — Public developer experience (deferred)

`list`, `search`, `info`, `diff`, a public registry endpoint, offline caching, generated
documentation site, migration UX. Start only when the internal registry has proven
valuable across at least two products. Building this before then is tooling for
developers who do not exist.

### Phase 7 — Product migration and first stable release

Migrate the proving product screen by screen, riskiest interaction first: keyboard and
text entry, then overlays and confirmations, then lists and gestures, then presentation.
The concrete per-screen order lives in `CONSUMERS.md`.

Generic defects are fixed in WhileUI. A product never adds a wrapper or patch that
conceals a broken primitive; if it does, that is a WhileUI bug report with a failing
test.

Release gates: screen readers, RTL, large text, physical lower-tier Android, browser
matrix, release builds. Production telemetry enabled and tied to the WhileUI version.

**Exit:** a versioned stable kernel ships on iOS, Android and web with no local
component forks, and the acceptance flows are monitored.

## Decisions not being revisited

| Decision                            | Reopen only when                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| One styling foundation              | All five gates below are true simultaneously                                                         |
| One renderer, no parallel DOM track | A product ships a surface React Native Web genuinely cannot serve                                    |
| No bare React Native support        | A product ships bare and carries its own fixture                                                     |
| No N-1 SDK matrix                   | Two products are stuck on different SDKs for reasons we cannot fix                                   |
| No deprecation/compat machinery yet | An external consumer we care about exists, or products outnumber our ability to migrate them by hand |
| Desktop via web/PWA                 | A product needs a native desktop surface and funds its test matrix                                   |

**The styling-foundation gate.** Compiler-based styling systems can extract static
styles and flatten views, and that is genuinely attractive. But a compiler of that kind
comes bundled with its own primitives, tokens and runtime — adopting one replaces our
foundation rather than extending it. Do not reopen this because an individual component
is hard. Reopen only when _all_ of: SSR-first web output is a committed requirement; web
receives equal product and QA investment; our measured styling cost is a material
bottleneck in release builds; the team accepts a full foundation replacement; and a
production spike of a real acceptance flow shows meaningful improvement. If the gate
passes, migrate completely — never run two public styling systems at once.

## How this plan evolves

This is a living document tied to products, not a fixed program.

- A phase is done when its **exit evidence** exists as a gate in `bun run verify` or a
  checked-in checklist — not when the work feels finished.
- When a product needs something the plan does not cover, the plan changes in the same
  change as the code.
- When a rule here is discovered to be wrong, delete it. Stale rules are worse than
  missing ones.
- `docs/review-perspectives/` is where these rules get enforced per PR. A new invariant
  that no review card can see will not survive; add it to a card or accept that it is
  advisory.
