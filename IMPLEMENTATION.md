# WhileUI Resumable Implementation Ledger

## Purpose

This file turns `PLAN.md` into work that can be paused and resumed by a developer or
an AI assistant without relying on chat history. It records execution state, not product
strategy.

Read these files before changing code:

1. `ROADMAP.md` — direction, ownership and non-goals.
2. `PLAN.md` — production contracts, architecture and phase exits.
3. `AGENTS.md` — repository rules and commands.
4. This file — current task, completed evidence and the next safe action.

Product-specific screens, migration order and acceptance flows belong in the local,
gitignored `CONSUMERS.md`. Never copy product names, paths, business rules or private
context into this public file.

## Status vocabulary

Use exactly one status for every task:

- `[ ]` — not started.
- `[~]` — in progress. There may be at most one in-progress task in this file.
- `[!]` — blocked. Record the blocker and the evidence needed to unblock it.
- `[x]` — complete. The acceptance evidence must be recorded in the task.

Never mark a task complete because its implementation exists. Mark it complete only
when its listed evidence passes.

## Resume here

Update this block before ending every work session, including sessions that end because
of an error or missing decision.

```text
Current phase: Phase 2C — One control foundation
Current task: C-02 — Stateful controls on `@rn-primitives` (not started)
Status: C-01 complete in the working tree, not committed
Branch: main
Last verified commit: dca0656 (`Draw the back and month chevrons`, after 4.7.1;
  verified, not released)
Working tree at handoff: the Phase 2C plan (IMPLEMENTATION.md, PLAN.md); C-01 — the
  control base, 23 call sites moved onto it, AGENTS/README updates, a catalog demo, one
  reviewed accessibility baseline, `.changeset/control-base.md`
Last command run: bun run verify
Last command result: passed — 227 unit tests, 289 kB tarball, iOS and Android exports,
  150 Chromium/WebKit tests
Next safe action: commit C-01 once the owner has reviewed it; then C-02 with Checkbox —
  pin `@rn-primitives/checkbox` exactly, boot the Android emulator for the spike's
  missing half, and write the Space-key Playwright spec before moving the component
Blockers: none. The Android emulator is unusable while the host load average is above
  roughly 12; see AGENTS.md > Tooling gotchas before rerunning its flows
```

The commit and working-tree lines are historical hints, not authority. Always run
`git status --short` and inspect the current diff before editing.

## Session protocol

### Starting or resuming

1. Read the four files listed under Purpose.
2. Run `git status --short` and `git log -5 --oneline`.
3. Preserve existing changes. Do not reset, delete or overwrite work you did not create.
4. Compare the repository with Resume here. If they disagree, trust the repository and
   repair this ledger before continuing.
5. Select the single `[~]` task. If none exists, take the first unblocked task whose
   prerequisites are complete and mark it `[~]`.
6. Read the task's review cards before implementation.
7. Keep the change inside the selected task. New findings become follow-up tasks unless
   they are necessary to make the current task correct.

### Pausing or handing off

1. Stop at a coherent boundary; do not leave generated files or source halfway updated.
2. Run the narrowest relevant checks and record their exact results.
3. Update the task's Notes and Evidence sections.
4. Update Resume here with one concrete next action.
5. Leave exactly one `[~]` item if work is safely resumable. Use `[!]` if continuation
   requires a decision, authority, device or external state.
6. Summarise changed files and remaining risk in the handoff log.

### Completing a task

1. Meet every acceptance criterion in the task.
2. Run the task checks plus `bun run format`, `bun run lint` and `bun run typecheck`.
3. Run the applicable cards in `docs/pre-pr-review/`.
4. Update README, showcase, `docs/stability.md` and a changeset when the public package
   or maturity evidence changed.
5. Replace `[~]` with `[x]`, record evidence, and advance Resume here.
6. Run `bun run verify` before pushing or merging.

## Global constraints

- One React Native renderer; iOS, Android and React Native Web are production targets.
- No parallel React DOM or Capacitor component implementation.
- One public component contract across targets. Narrow platform internals are allowed
  only under the justification test in `PLAN.md`.
- Keep Uniwind as the only styling foundation. Do not add Tamagui alongside it.
- Prefer Tier 1 families from `docs/stability.md`; do not harden unused catalog items.
- Fix generic defects in WhileUI. Do not ask a consumer to hide them with wrappers.
- No new public prop, component or dependency without a real consuming need.
- Performance claims require release-build evidence. Unit tests cannot prove frame
  performance, OS keyboard behavior, portal order or accessibility-tree containment.
- A showcase demonstrates behavior. A shipped consuming flow proves stability.

## Product-pulled deliveries

### [x] D-03 — Consumer audit: fixes and pulled components

**Closed 2026-11-12.** Items 1–7 and 9 shipped in 4.5.0–4.7.0 (`KeyboardAwareScrollView`,
`SelectField`, `PageHeader`, `SearchField` + `useDebouncedSearch`, labelled `Checkbox` and
`Switch`, `SectionedList`, `Pagination`, scrolling `SegmentedControl`, pressable and
disabled `DataRow`, `FormModalScreen` text actions) and the proving product adopted
each. Item 8 stays an application pattern: a `Stack` holding the sentence and two
buttons, no component. Item 10 moves to C-03, which needs a device check for it anyway.

**Goal:** close the generic gaps the first consuming application exposed, without
publishing product-shaped components or letting the app hide library defects behind
wrappers.

**Source:** a 2026-11-10 audit of the proving product's 39 source files against 4.1.2,
plus its own dated WhileUI backlog. Product specifics stay in the local `CONSUMERS.md`.

**Shipped 2026-11-10 (minor changeset pending):** `withWhileUIMetro` at the `./metro`
subpath, so no app copies the icon-font resolver exemption; `Alert` is an `alert` live
region by default (the app wrapped it in 15 places only to add that); `HeaderAction`
takes `accessibilityLabel`; `SelectContent` defaults its insets to the safe area (every
picker in the app passed them by hand); `Text variant="eyebrow"` (the app wrote that
class string 35 times); `LoadingState` beside `EmptyState` and `ErrorState` (16 inline
spinners). README documents the `Select` empty-value constraint of the web primitive.
Contract tests cover each; the showcase demonstrates the new block and variant and uses
the Metro helper itself.

**Pulled, in order of how many screens asked for them — awaiting the owner's call on
shape before any is built:**

1. Labelled `Select` (9 screens) — `SelectField` block, or an `options` prop on `Select`.
2. `PageHeader` block (11 screens) — kicker, title, leading mark, trailing actions.
3. `SearchField` + `useDebouncedSearch` (6 screens + 5 hook sites).
4. Labelled `Checkbox`/`Switch` (5 sites, each a nested-interactive defect today) —
   `label`/`description` props or a `CheckboxField`.
5. `SectionedList` with `groupBy` and header roles (3 screens); `Pagination` (3).
6. `SegmentedControl overflow="scroll"` with an edge fade (2 screens hand-wrap it).
7. Pressable `DataRow`/`ListItem` with avatar and value slots (19 sites).
8. In-place destructive confirm pattern (6 sites) — likely a showcase recipe, not a
   component.
9. `FormModalScreen` with text actions: its 48 px slots fit an icon, not "Cancel" and
   "Save", and it owns a scroll view, so a form that uses `KeyboardAwareScreen` cannot
   adopt it. The product's three modal screens hand-roll the bar instead.
10. Navigator-presented modal screens: a Select on an Expo Router `presentation: "modal"`
    screen portals to the app root, which may sit beneath the presented view on iOS.
    Needs a device check; the fix shape is `FormModalScreen` carrying its own portal
    target, not a new prop.

**Acceptance evidence for the shipped part:** `bun run verify`; the new contract
suites; showcase demos; README rows and API sections.

**Review cards:** 03, 04, 05, 07, 08, 09.

**Notes/evidence:** see the handoff entry dated 2026-11-10 — consumer audit. Released
as 4.2.0 the same day; the proving product moved to it and dropped its local copies of
each fix, passing typecheck, lint and both exports.

### [x] D-02 — Composition foundation without parallel APIs

**Goal:** give generated and hand-built product screens stronger hierarchy without
publishing application-owned chat payload components or a second styling system.

**Evidence:** `Text` variants consume typography tokens while preserving class-based
custom sizing; `Surface` is the single radius/padding/border/depth/frost primitive and
`Card` consumes it. `FormField` state reaches Input, Textarea, NumericInput and Select
with explicit props taking precedence. Markdown and code live behind explicit optional
subpaths; their link/clipboard effects remain application-owned. README composition
grammar, showcase, stability inventory, type/Vite fixtures and changeset are current.
`bun run verify` passed on 2026-11-06: 121 unit tests, a 145 kB publishable tarball,
iOS and Android exports, and 106 Chromium/WebKit tests.

### [x] D-01 — Composable chat conversation viewport

**Goal:** let a consuming application compose structured assistant content with the
existing `SmartInput` without publishing speculative reasoning, tool or source APIs.

**Evidence:** `ChatConversation` follows growing output only while the reader remains
near the bottom, preserves caller callbacks and forwards its scroll ref. `Chat` uses it
internally. The showcase composes assistant text, reasoning-shaped content, a tool card
and sources through `renderMessage`. README, stability inventory, public type fixture
and changeset are current. `bun run verify` passed on 2026-11-05: 108 unit tests,
publishable tarball, iOS and Android exports, and 98 Chromium/WebKit tests including the
Chat accessibility, runtime and 320/390 px responsive matrices.

## Required review cards

| Change type                                        | Required cards                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| Any change                                         | `03-docs-and-showcase`, `04-bloat`, `06-comments-and-docstrings` |
| Tokens or recipes                                  | `01-tokens`                                                      |
| Platform branch or renderer seam                   | `02-renderer-boundary`, `11-web-production`                      |
| Component, block or public API                     | `05-accessibility-touch`, `09-component-contract`                |
| Behavior change or defect fix                      | `07-verification`                                                |
| Package, dependency or export change               | `08-distribution`                                                |
| Press, motion, gesture, scroll, list or image work | `10-interaction-performance`                                     |

## Phase 2 — Interaction engine

Phase exit: release-build gestures are verified on iOS and Android; browser pointer and
keyboard paths pass; touched components have no unexplained React Doctor findings; no
interaction updates React state per frame.

### [x] P2-01 — Motion policy contract

**Goal:** define one policy surface for reduced motion, disabled-under-test behavior and
semantic duration/spring tokens without duplicating Reanimated's system handling.

**Prerequisites:** Phase 1 complete.

**Work:**

- Inventory Reanimated, `Animated`, duration and spring usage across components/blocks.
- Specify the smallest provider/hook contract before implementation.
- Define behavior for system reduced motion, explicit app override and tests.
- Keep concrete animation values in the token layer.
- Add contract tests for policy changes and stable provider values.
- Demonstrate normal and reduced motion in the showcase.

**Acceptance evidence:** contract tests; token review; showcase state; web import remains
safe; `bun run verify` passes.

**Review cards:** 01, 02, 07, 09, 10, 11.

**Notes/evidence:** Completed 2026-09-26. Added `MotionProvider` and `useMotionPolicy`
with system, reduced, full and deterministic disabled modes; live accessibility-setting
updates; stable context values; semantic durations; and one responsive spring. Five
contract tests cover modes, live updates, cleanup and value stability. The showcase has
a four-mode policy demo, the public type fixture consumes the provider, and the README,
stability inventory and changeset are current. `bun run verify` passed: 46 unit tests,
publishable tarball, iOS and Android exports, and 80 Chromium/WebKit tests. React Doctor
reported 19 existing warnings and none in the new policy or changed showcase section.

### [x] P2-02 — Shared press-feedback primitive

**Goal:** one composable press-feedback implementation with native and web-appropriate
internals, consistent disabled/loading semantics and no layout movement.

**Prerequisites:** P2-01.

**Work:**

- Inventory local press opacity/scale implementations and rank Tier 1 adopters.
- Define feedback states: idle, hovered, focused, pressed, disabled and loading.
- Preserve caller styles, event handlers, refs, roles and accessible names.
- Use the motion policy and interaction tokens.
- Cover cancellation, rapid repeat, disabled/loading and unmount.
- Migrate `Button` first; do not bulk-migrate unrelated families.

**Acceptance evidence:** Button contract tests; Playwright keyboard/pointer checks;
native Maestro smoke; release trace showing no per-frame React updates.

**Review cards:** 01, 02, 05, 07, 09, 10, 11.

**Notes/evidence:** Completed 2026-09-27. Added semantic press and unavailable feedback
to the shared `Pressable`, with loading as one busy, disabled interaction state. The
implementation preserves function styles, handlers, refs and accessible names. Native
uses React Native's `Pressable` state callback and web uses the same state plus a
motion-policy-aware CSS opacity transition; there is no component state or animation
callback that can schedule per-frame React renders. `Button` is the first adopter and
adds a layout-stable, label-preserving spinner state. Contract tests cover callbacks,
styles and loading; Playwright covers pointer geometry, keyboard activation and ARIA in
Chromium and WebKit; the same Maestro activation flow passed on iOS and Android. React
Doctor remains at the same 19 pre-existing findings with none in the changed primitive.
Also corrected the package contract: root-exported `SmartImage` and `ProductCard`
statically import `expo-image`, so it is now a required peer instead of an optional peer
that could crash a consumer at startup.

### [x] P2-03 — Gesture and scroll-ownership audit

**Goal:** make cancellation and gesture ownership explicit for Tier 1 drawer, sheet,
pull-to-refresh and scroll interactions.

**Prerequisites:** P2-02; Gesture Handler declared and verified as a peer in both
consumer fixtures.

**Work:**

- Map the gesture hierarchy and scroll owner for every affected family.
- Remove new-work uses of `PanResponder` or JS-thread frame updates.
- Test gesture loss, cancellation, navigation, backgrounding and unmount.
- Provide a non-drag path for every non-essential drag interaction.
- Verify RTL direction and nested scroll behavior.

**Acceptance evidence:** Maestro on iOS and Android; Playwright pointer/keyboard path;
release traces on representative devices; packed fixtures pass.

**Review cards:** 02, 05, 07, 08, 09, 10, 11.

**Notes/evidence:** Implementation complete 2026-09-29; device and browser evidence
pending. Nothing here is accepted until the evidence below passes.

Gesture hierarchy and scroll owner, as implemented:

| Family                    | Host                                    | Scroll owner                                     | Dismiss / action paths                                                  | Drag path                       |
| ------------------------- | --------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------- |
| `Sheet`                   | RN `Modal` (slide)                      | `SheetContent` `ScrollView`, nested scrolling on | backdrop tap, `onRequestClose` (Android back, web Escape), `SheetClose` | none; no drag-to-dismiss        |
| `DrawerMenu`              | Android `Modal`; overlay view elsewhere | sections `ScrollView`                            | backdrop tap, `onRequestClose`, item select                             | none; no swipe-to-open or close |
| `PullToRefreshScrollView` | caller's screen                         | its own `ScrollView` with `RefreshControl`       | **Refresh** accessibility action                                        | pull, native `RefreshControl`   |

- **No `PanResponder` and no JS-thread `Animated`** in any of the three. The drawer is
  one Reanimated shared value driven by `withTiming`; nothing updates React state per
  frame. The package has no Gesture Handler call site yet — the peer is declared for
  the first drag interaction, and none of these needs one.
- **Defect found and fixed:** a drag across a `Sheet` or `DrawerMenu` backdrop closed
  it. `lib/tap-only` drops a press whose finger moved past the touch slop. Found by the
  first Android run of the scroll-ownership flow; recorded in `docs/stability.md`.
- **Non-drag paths:** the sheet and drawer have no drag to replace. Pull-to-refresh now
  offers a **Refresh** accessibility action, ignored while refreshing.
- **RTL:** the drawer slides in from the right under RTL, where React Native has already
  moved its `left` inset. Contract-tested by the exit direction.
- **Cancellation, navigation and unmount:** reopening the drawer mid-exit keeps it
  mounted; selecting an item reports it and the drawer unmounts once the owner closes
  it; unmounting mid-exit leaves no timer that can throw. Contract-tested.
- **Backgrounding:** `e2e/maestro/drawer-lifecycle.yaml` closes the drawer and leaves
  the app during the exit, then asserts on return that the drawer is gone and the
  screen still takes input.
- **Not covered:** nested scrolling under RTL on a device. Forcing RTL needs a
  showcase switch that restarts the app; left as a follow-up rather than added here.

Evidence recorded 2026-10-18:

- All four Maestro flows pass against release builds on the iPhone 17 Pro simulator
  and Pixel 8 API Baklava emulator: button activation, alert-dialog accessibility,
  drawer background/unmount lifecycle and scroll ownership. The final flow proves both
  halves of the defect: a backdrop drag leaves the sheet open, then two in-sheet drags
  reveal the end of its content.
- Chromium and WebKit pass all 86 Playwright/axe tests. Package verification passes the
  packed consumer checks, `publint` and `attw`. The iOS and Android Expo exports pass.
- `bun run verify` passes in full after the final source, docs, asset and flow changes:
  format, lint, typecheck, 60 unit tests, package build and inspection, both native
  exports and all 86 browser tests.
- A real Android `assembleRelease` exposed two showcase assets whose JPEG bytes had
  `.png` names. Renaming them to `.jpg` fixed AAPT packaging; the ARM64 release APK then
  built, installed and ran the Android Maestro suite.
- React Doctor scanned the five touched source files. Its nine warnings are explained:
  the showcase's large-component/dynamic-padding findings predate this change; the
  drawer intentionally maps a bounded navigation model inside its scroll owner; and
  the drawer's control-flow warning reflects discrete visibility/cancellation states,
  not frame work. No touched component updates React state from a scroll or animation
  frame.

**Blocked 2026-10-18.** Implementation and every reproducible gate are complete. One
acceptance criterion remains and it needs hardware this machine does not have.

**Measured, so that nobody repeats the attempt.** `scroll-ownership.yaml` was run
against the release APK on the Pixel 8 API Baklava emulator and `dumpsys gfxinfo` read
immediately afterwards: 3098 frames, 63.56% janky, a 61 ms median, 1026 missed vsyncs.
The same command against the system launcher on the same emulator reports 85.51% janky
and an identical **4950 ms GPU percentile** — a figure no physical GPU produces. The
emulator renders through a software path, so these numbers describe the emulator rather
than the application, and the launcher control is worse than the app under test. An
emulator cannot supply performance acceptance. That is now a measurement rather than an
appeal to the plan.

**Blocker:** drawer and sheet release traces from one physical lower-tier Android
device. None is attached.

**Scope correction.** An earlier revision of this task asked for physical iOS _and_
Android hardware. `PLAN.md` does not. Its device row is "current iOS simulator, current
Android emulator, one physical lower-tier Android", and the only physical device named
anywhere in the plan appears in the Phase 7 release gates. The representative iOS device
for this stack **is** the simulator, and the iPhone 17 Pro simulator release run already
covers it. The gap is one Android phone, not two devices.

**Unblocked by:** attaching any lower-tier physical Android, installing the release APK
that `apps/showcase/android` already builds, running `scroll-ownership.yaml` and
`drawer-lifecycle.yaml` against it and recording `dumpsys gfxinfo` here. No source
change is expected; the task closes on that record alone.

**On the Phase 2 gate:** the phase exit asks that release-build gestures are verified on
iOS and Android, which the simulator and emulator release runs satisfy as written. The
outstanding evidence is the performance half, which this task lists as its own
acceptance criterion. Whether that gates P3-01 is a decision for the next session; it is
recorded here rather than resolved, because resolving it either way would relax a
contract or stall a phase without the authority to do so.

**Closed 2026-11-10 by decision.** No lower-tier Android device exists for this
project, and none is expected. The owner decided that the Phase 2 exit is met by the
evidence above, and that the physical-device trace is release-gate evidence rather than
phase evidence: `PLAN.md` already lists "physical lower-tier Android" under the Phase 7
release gates, and its device row now says so explicitly. The criterion moved to P7-03,
where a borrowed or mid-tier phone, or a cloud device lab that runs the release APK on
real hardware, satisfies it. Nothing in Phases 3 to 6 claims a performance number, so
nothing is overstated by closing here. The emulator measurement above stays as the
record of what cannot substitute.

**Follow-up, not a blocker:** nested scrolling under forced RTL on a device. Forcing RTL
needs a showcase switch that restarts the app.

## Phase 2C — One control foundation

Phase exit: no component or block renders React Native's press primitives except
through the control base; every Tier 1 stateful control and menu takes its behaviour
from `@rn-primitives`, pinned exactly; the interaction sweep, including opened overlays
and arrow keys, reports nothing in Chromium and WebKit; the iOS sweep flow passes; a
release with upgrade notes is published and the proving product runs on it.

**Why this phase exists.** Phase 2 built a shared press primitive and migrated `Button`,
and nothing required anything else to use it. An inventory on 2026-11-12 found 67
`Pressable`s across components and blocks — 48 controls and 19 containers (backdrops
and panels). Three components rendered the shared primitive. Of the 48 controls, 16
drew `focusRing` on the element that takes focus, 3 set `tabIndex`, 5 had a minimum
target, and selection state reached assistive technology in six different ways.
Thirteen behaviour components — Accordion, AlertDialog, Checkbox, Collapsible,
ContextMenu, Dialog, DropdownMenu, Menubar, RadioGroup, Switch, Tabs, ToggleGroup and
Toggle — were hand-built, although `PLAN.md` > Supported stack names `@rn-primitives/*`
as the behaviour layer, and the dependency range was `>=1.5.2` rather than pinned. None
of the thirteen handles an arrow key, so on web every radio, tab and menu item is its
own Tab stop.

The defects consumers reported through 4.4–4.7 — a checkbox whose label was a second
control, toggles the browser could not tell were on, a focus ring that never showed on
one screen — were each one instance of that. Fixing instances does not end the class.
Making the correct path the only path does.

**Contract this phase establishes:**

1. **Behaviour from `@rn-primitives`, appearance and layering from WhileUI.** On native
   the primitives set role, `aria-*` state and `accessibilityState` together; on web
   they wrap our React Native element in Radix through `asChild`, which supplies the
   WAI-ARIA keyboard patterns (roving focus, arrow keys, Home/End, typeahead). Checked
   against the 1.5.2 sources of checkbox, switch, radio-group, tabs, toggle-group,
   accordion, dropdown-menu and dialog. Overlay layering stays with `OverlayHost`.
2. **One control base.** Every interactive element in a component or block renders
   through `components/pressable`, extended rather than duplicated, either directly or
   as the `asChild` target of a primitive part. The base derives what callers kept
   getting wrong:
   - interactive only when it has a press handler: otherwise no role, no feedback and
     `tabIndex={-1}`;
   - role `button` by default when interactive;
   - a focus indicator by default (`ring`, `inset`, `field` or an explicit `none`);
   - a 24px minimum target on web, where `hitSlop` does nothing.
3. **State through `aria-*` only.** `aria-checked`, `aria-selected`, `aria-expanded` and
   `aria-disabled`: React Native maps them to native accessibility state and React
   Native Web emits them as they are. Library code stops writing `accessibilityState`.
4. **State styled from data attributes, if the spike proves it** — `data-state` and
   `data-disabled`, matched by Uniwind's `data-[…]:` variants on native (documented
   since Uniwind 1.3), giving consumers one styling vocabulary across targets.
5. **Containers are not controls.** One backdrop and one panel implementation —
   inaccessible, hidden from assistive technology, tap-only — serve all 19 container
   sites.
6. **Enforced by lint and gates, not by memory**, and stated briefly enough that the
   agent docs can carry it whole.

**Release shape:** C-01 to C-04 change roles, ARIA and keyboard behaviour but not props,
so they ship as minor releases. Prop renames from C-05 land together in one major with
call-site instructions.

### [x] C-01 — Control base

**Goal:** extend the shared `Pressable` into the base every control renders through,
and move the plain buttons onto it.

**Prerequisites:** none.

**Work:**

- Spike first and record the result: does a `data-*` prop reach the DOM through React
  Native Web 0.21, and does the same `data-[…]:` class apply on iOS, Android and web? If
  not, drop contract item 4 and keep state styling per component.
- Derive interactivity from the handlers. An explicit `accessibilityRole` or `tabIndex`
  from the caller still wins.
- Default role, focus indicator and web minimum target. Native `hitSlop` stays
  explicit, because the base cannot know a visual size before layout.
- Keep feedback, loading, disabled, refs and function styles exactly as P2-02 left
  them.
- Move the plain buttons onto the base: `DataRow`, `ListItem`, header actions, the toast
  close, chips, the FAB items, pagination and calendar buttons, and the rest of the
  inventory's controls that are not stateful.

**Acceptance evidence:** contract tests for each derived default (no handler: no role
and not focusable on web; handler: `button`, a Tab stop, Enter and Space activate;
disabled: `aria-disabled` and no press; keyboard focus shows the ring); the interaction
sweep passes with no new allowance; the accessibility-tree baseline diff is reviewed;
`bun run verify`.

**Review cards:** 02, 05, 07, 09, 10, 11.

**Notes/evidence:** Started 2026-11-12.

- Spike, 2026-11-12: three probes in the catalog — a `View` with `data-state="on"`, one
  with `"off"`, and a `Pressable` with a bare boolean `data-checked`, each styled
  `bg-muted data-[…]:bg-destructive`. Web (React Native Web 0.21, Chromium): the
  attributes reach the DOM and the computed backgrounds are destructive, muted,
  destructive. iOS 17 Pro simulator through Expo Go: the same three colours. Contract
  item 4 holds. Android is not yet observed — no emulator was running — and is part of
  this task's closing device run.
- Base, 2026-11-12: `Pressable` derives interactivity from its four press handlers;
  with one it defaults to `button`, carries `focusRing` (or `focusRingInset`, or none
  through `focusIndicator`) and `web:min-h-6 web:min-w-6`; without one it has no role
  and `tabIndex={-1}` on web only — on Android `tabIndex` maps to `focusable`, which
  there is no reason to touch. State is `aria-*` only; React Native's `Pressable.js`
  merges those into `accessibilityState` with `disabled` winning, so the base no longer
  writes `accessibilityState`. Five new contract tests.
- Moved onto it: Chat suggestions and send, ProductCard, ListItem, NotificationItem,
  DataRow, the three date-picker triggers and the time-picker wheel rows, Sheet's close
  and `SheetClose`, ConfirmActionSheet's actions, DrawerMenu items, Header actions and
  `HeaderBackButton`, BottomNav, FloatingBottomNav and TabBar items, Dialog and
  AlertDialog triggers and actions, Toast's action and dismiss, SearchField's clear and
  NumericInput's steppers. Four files lost a hand-written copy of the handler-derived
  role and `tabIndex` logic. Their backdrops and panels stay on React Native's
  `Pressable`, imported as `RNPressable`, until C-03.
- Defects fixed on the way: Chat's suggestion chips pressed `bg-muted` onto `bg-muted`
  and showed nothing; the send button's name carried its state ("Send (disabled)");
  Sheet's close drew a "×" glyph with `leading-none`, now `CrossGlyph` at 44px; the
  time-picker wheel rows were Tab stops inside a subtree hidden from assistive
  technology; header actions were 40px with no `hitSlop`; nineteen of the moved
  controls carried no `focusRing` class, so web showed at most the browser's default
  outline.
- The base caught a demo bug at once: the catalog's `HeaderBackButton` had no
  `onPress`, so it is no longer announced as a button. The demo now has a handler.
- Closed 2026-11-12. `bun run verify` passed: format, zero-warning lint, typecheck, 227
  unit tests, build, a 289 kB tarball, iOS and Android exports, 150 Chromium/WebKit
  tests. The one accessibility-tree change is the new Pressable demo, reviewed. No
  container changed, and the classes the base adds are `web:`-scoped, so the device
  run moves to C-02, the first task that styles from data attributes and changes native
  behaviour; the Android half of the spike goes with it.

### [ ] C-02 — Stateful controls on `@rn-primitives`

**Goal:** Checkbox, Switch, RadioGroup, SegmentedControl, Toggle, ToggleGroup, Tabs,
Accordion and Collapsible take behaviour from their primitive and appearance from the
base. SegmentedControl is a radio group in behaviour, so it takes the radio-group or
toggle-group primitive.

**Prerequisites:** C-01.

**Work:**

- One family per commit, in that order. Public props unchanged; renames wait for C-05.
- Pin each primitive exactly, and pin the four already in use, which today float.
- Delete the hand-written state ARIA in favour of the primitive's.
- Label and Progress: migrate only if it improves semantics; neither has keyboard
  behaviour to gain.
- Decide how navigation selection is expressed. `BottomNav`, `FloatingBottomNav` and
  `TabBar` items are `tab`s with no `tablist` arrow keys, and DrawerMenu's active item
  has no state at all. `aria-current="page"` is the web answer, and React Native has
  no such prop, so the choice is between real tab lists with arrow keys and buttons
  carrying a selected state.
- Deprecate `withInteractivePressableStyle` once its last internal user moves; it is a
  public export, so it is removed in C-05's major.

**Acceptance evidence per family:** RNTL contract; once per task, before the first
family that styles from `data-*`, the Android half of the C-01 spike and the existing
Maestro flows on iOS and Android release builds; a Playwright keyboard spec in
Chromium and WebKit following the WAI-ARIA pattern — one Tab stop and arrow keys with
Home/End for radio groups, toggle groups and tab lists; Space for checkbox and switch;
Enter and Space on accordion headers — with the tabs activation mode recorded as a
decision; the baseline diff reviewed; reachable as its own element in the iOS sweep
flow; `docs/stability.md` updated.

**Review cards:** 02, 05, 07, 09, 11.

**Notes/evidence:** Not started.

### [ ] C-03 — Menus and containers

**Goal:** DropdownMenu, ContextMenu and Menubar on their primitives inside the overlay
host; one backdrop and panel for every container.

**Prerequisites:** C-01.

**Work:**

- Follow `Select`'s pattern: the primitive's portal takes `useOverlayPortalTarget()`
  and the content registers with `useNestedOverlay()`, so a menu inside a Dialog opens
  inside it and Escape or back closes one layer.
- Menu items render through the base with `menuitem`, `menuitemcheckbox` and
  `menuitemradio` roles; arrow keys and typeahead come from the primitive on web.
- Dialog, AlertDialog, Sheet and DrawerMenu stay on `OverlayHost`: P3-01 proved their
  nesting, back and Escape on both devices, and no defect argues for replacing it.
- Replace the 19 container `Pressable`s with the shared backdrop and panel.
- Check on an iOS device whether a Select on a navigator-presented modal screen opens
  above it (moved from D-03).

**Acceptance evidence:** contract tests; Playwright opens each menu from the keyboard,
moves with arrows, and Escape returns focus to the trigger, including one menu nested
in a Dialog; the iOS and Android nested Maestro flow; baseline diff reviewed.

**Review cards:** 02, 05, 07, 09, 10, 11.

**Notes/evidence:** Not started.

### [ ] C-04 — Enforcement and gates

**Goal:** a contract violation fails a command instead of waiting for a consumer to see
it.

**Prerequisites:** C-02 and C-03, so the rules land with zero violations.

**Work:**

- ESLint `no-restricted-imports`: `Pressable` and the `Touchable*` family from
  `react-native` are banned in `components/` and `blocks/` outside the base.
- ESLint `no-restricted-syntax`: no `accessibilityState` attribute and no class string
  containing a bare `outline-none` in library code.
- The interaction sweep opens every menu, select, popover, dialog and sheet in the
  catalog and runs the same checks inside it, and checks one Tab stop plus arrow-key
  movement in every `radiogroup`, `tablist`, `menu` and toggle group.
- A permanent iOS Maestro flow visits every catalog screen and asserts each control is
  its own accessibility element — the container defect only iOS shows.

**Acceptance evidence:** lint passes with no disables outside the base; the widened
sweep passes in Chromium and WebKit; the iOS flow passes on the simulator and is listed
in the release checklist, since it needs a device and so cannot run inside `verify`.

**Review cards:** 04, 05, 07, 11.

**Notes/evidence:** Not started.

### [ ] C-05 — Agent-ready contract

**Goal:** an agent or a new contributor builds a correct control from the docs alone,
and the docs cannot drift from the code.

**Prerequisites:** C-04.

**Work:**

- Rewrite `AGENTS.md` > Core component robustness: entries the base now enforces
  collapse into "render controls through the base; lint stops anything else". Keep only
  the platform facts that still need a person.
- One prop vocabulary across controls: `value` / `defaultValue` / `onValueChange`,
  `checked` / `defaultChecked` / `onCheckedChange`, `open` / `defaultOpen` /
  `onOpenChange`, `disabled`, `onPress`. Audit every control; renames ship together in
  one major whose changeset says what to change at each call site.
- `catalog.json` and the llms files carry each control's role, keys and state
  attributes, generated from source so they cannot drift; the build fails when an
  exported control lacks them. The skill and the MCP server answer "how do I make this
  interactive" with the base.

**Acceptance evidence:** the generated docs build and their examples typecheck in the
type-smoke fixture; the changeset names every rename with its replacement; the proving
product upgrades using only those notes.

**Review cards:** 03, 04, 06, 08, 09.

**Notes/evidence:** Not started.

## Phase 3 — Overlays and keyboard

Phase exit: the local critical acceptance flow passes Maestro on iOS and Android and
Playwright in Chromium and WebKit.

### [x] P3-01 — Overlay coordinator contract

**Closed:** committed and released in 4.2.0; the evidence below is what closed it.

**Goal:** coordinate stack order, topmost dismissal, portal roots and return-focus intent
without reimplementing focus traps or menu semantics from the behavior substrate.

**Prerequisites:** Phase 2 exit.

**Work:**

- Write the stack and dismissal state machine before code.
- Cover nested Dialog → Popover and Sheet → confirmation Dialog.
- Define Android back and web Escape priority.
- Define focus return when a trigger unmounts.
- Cover interrupted exit, multiple roots and non-dismissible overlays.

**Acceptance evidence:** contract suite plus native and browser integration flows for
every scenario above.

**Review cards:** 02, 05, 07, 09, 10, 11.

**Notes/evidence:** Started 2026-11-10. Design and state machine recorded here before
any code, per the task.

**What the platform already owns, measured 2026-11-10.** Nine of the eleven dismissal
sites host themselves in React Native's `Modal`: Dialog, AlertDialog, Sheet,
ConfirmActionSheet, DropdownMenu, ContextMenu, Menubar and the date and time pickers;
DrawerMenu uses it on Android only. Each Modal is its own window, so Android back
reaches only the topmost one, and React Native documents that `BackHandler` events are
not emitted while a Modal is open. React Native Web's Modal fires `Escape` only on the
active Modal, traps Tab and restores focus to the previously focused element; read in
its `ModalContent` and `ModalFocusTrap` sources. The `@rn-primitives` popover, select,
tooltip and hover-card already register a BackHandler listener on native. A global
overlay stack, back dispatcher or focus-return registry would duplicate all of this.

**Defects the platform leaves open, measured 2026-11-10.**

- No Modal-hosted overlay renders its own portal host. A Select, Popover, Tooltip or
  HoverCard opened inside a Dialog or Sheet portals to the app-root `PortalHost`, which
  sits beneath the native Modal window on iOS and Android. On web it is visible — the
  Modal's portal root is `z-index: 0`, so a later body sibling paints above it despite
  the `zIndex: 9999` inside — but it sits outside the `aria-modal` dialog and its focus
  trap. Measured with a DOM probe on 2026-11-10; an earlier draft of this note blamed
  the z-index and was wrong. The same defect is the react-native-reusables "Select
  inside Dialog" report; their fix was a named host inside the modal plus a `portalHost`
  prop, and their later Dialog moved to `FullWindowOverlay` on iOS. WhileUI already
  exposes `portalHost` on all four content components, so consumers currently have to
  wire the host by hand.
- Web `Escape` with a Select open inside a Sheet closes both: Radix dismisses on
  `keydown` and prevents default, React Native Web's Modal still receives the `keyup`.
  Traced event by event on 2026-11-10 before the fix.
- Android back with a Popover open inside a Dialog closes the Dialog, because the
  popover's BackHandler listener is suppressed while the Modal is open.
- DrawerMenu is a plain overlay view outside Android, so web `Escape` does nothing and
  there is no focus trap or focus return. Git history records no reason for the branch.
- Eleven copies of the same Modal configuration: transparent, translucent status and
  navigation bars, `overFullScreen`, request-close wiring.

**Design: one internal `OverlayHost`, not a coordinator.** `lib/overlay-host` wraps the
platform `Modal` and is not a public API. It carries the shared Modal props, renders a
uniquely named native `PortalHost` and a web container `View` inside the Modal, provides
both through context, and keeps a per-host stack of registered nested overlays. Two
hooks: `useOverlayPortalTarget()` for the four portal content components, where an
explicit `portalHost` prop still wins, and `useOverlayChild(close)` which content
components call while mounted. Nothing is global, no new dependency, no new public prop.
`Select` already wraps its content in `react-native-screens`' `FullWindowOverlay` on
iOS, which lifts it above a navigation-presented modal screen that WhileUI does not host;
that stays, because the in-host portal cannot reach a screen it does not own. It is
iOS-only and leaves Android and web open, so it is not the general answer. The in-host
portal covers every WhileUI-hosted overlay on all three targets, and `portalHost` remains
the consumer's escape hatch for a host they placed themselves.

**State machine.** Host: `closed → opening → open → closing → closed`, where `opening`
and `closing` are the platform animation and reopening during `closing` returns to
`open`. A dismiss request is Android back, web `Escape` or backdrop tap:

- in `open` with nested children registered: close the topmost child only;
- in `open` with no children and dismissible: call the owner's close;
- in `open` and non-dismissible: ignore;
- in `opening` or `closing`: nothing to do, the platform does not deliver `Escape`
  before `onShow`, and a backdrop tap on an unmounting host is dropped.

Web only: the host listens for `Escape` `keydown` in the capture phase while a child
is registered and swallows the Modal's following `keyup` request, so one press closes
one layer. Children register on content mount and unregister on unmount; a child that
closes itself therefore unregisters before the next request. Portal target: nested
content portals into the nearest host unless `portalHost` is explicit. Focus return:
the platform restores focus to the previously focused element; when that element is
gone the browser focuses `body`, which the Playwright test asserts remains operable, and
no custom code is added unless that assertion fails.

**Upstream risk recorded, not fixed.** facebook/react-native #50152, open through
0.86.3 on the New Architecture: on iOS, opening a second Modal while a first is closing
can leave an invisible layer that blocks touches. Nested hosts are not that sequence,
but a consumer that closes a Sheet and immediately opens a Dialog is. The Maestro flow
covers rapid reopen of one host; if it reproduces, the single host is the one place a
deferred-open workaround goes.

**Test matrix, written before code.** Contract: request forwarded to the topmost
child; non-dismissible host ignores it; portal target context with explicit prop
precedence; unregister on unmount. Playwright, Chromium and WebKit: Select inside Dialog
is visible and operable; one `Escape` closes only the Select; a second closes the Dialog
and returns focus; Sheet → confirmation Dialog Escape order; DrawerMenu closes on
`Escape`; focus stays operable when the trigger is removed during close. Maestro, iOS
and Android release builds: Select inside Sheet opens above it; Android back closes the
Select first, then the Sheet; rapid close and reopen leaves the screen taking input.
Showcase: one nested demo in the Overlays tab, a Sheet containing a Select and a
confirmation Dialog, because every browser and device flow drives it.

**Migration order.** Dialog first, then AlertDialog, Sheet and ConfirmActionSheet, the
three menus, the three pickers, then DrawerMenu on every platform. Each family keeps its
public props. Expected net code change is negative.

**Evidence recorded 2026-11-10.**

- Implemented `lib/overlay-host` (one internal component, two hooks) and migrated all
  eleven hosts and the four portal content components. `DialogTitle` gained the
  `header` role it was missing next to `AlertDialogTitle`. No public prop changed.
- Contract suite: four `overlay-host` tests — topmost-nested-first dismissal, forgetting
  an unmounted child, a non-dismissible host that still closes nested overlays, and
  portal content rendering inside the host's Modal. Full unit run: 130 tests pass.
- Browser, Chromium and WebKit, `e2e/overlays.spec.ts`: Select inside Sheet renders as
  a descendant of the sheet's dialog and takes the click; Escape closes one layer per
  press and leaves the page operable when the trigger unmounted; confirmation Dialog
  inside Sheet closes before the sheet; DrawerMenu closes on Escape. 14 of 14 pass.
  With the host's portal target and registration disabled in the built package, the
  first two fail and the rest pass, so the tests are load-bearing. A DOM probe before
  the fix measured the real web defects: the listbox outside the `aria-modal` dialog,
  and one Escape press closing both layers. An earlier draft blamed React Native Web's
  `zIndex: 9999`; the probe showed its portal root is `z-index: 0`, so that claim was
  removed everywhere.
- iOS, iPhone 17 Pro simulator, release build: `nested-overlays.yaml`,
  `drawer-lifecycle.yaml`, `scroll-ownership.yaml` and `alert-dialog.yaml` all pass.
  The nested flow also proves the Select renders above the sheet on iOS and that a
  nested native Modal dismisses cleanly, and its rapid close-and-reopen step found no
  blocked layer. Two flow mistakes were fixed on the way: Maestro text selectors are
  regular expressions, so `Remove region?` matched the "Remove region" button, and a
  dismissed native Modal needs an explicit wait to leave the accessibility tree.
- Android, Pixel 8 API Baklava emulator, release build: `nested-overlays.yaml` passes
  every step, including the Android-only ones — back closes the open Select and leaves
  the sheet, then closes the nested confirmation and leaves the sheet, then closes the
  sheet. The emulator was storage-starved and ANR-prone under a host load average above
  20 (recipe in `AGENTS.md` > Tooling gotchas), so single taps took up to eight minutes;
  the flow completed in 24 minutes. The other three flows were not rerun on Android:
  the drawer, sheet and AlertDialog hosts on Android changed only by sharing the host's
  Modal configuration, which that flow exercises.
- Two defects the owner saw in the iOS simulator the same afternoon, fixed in the same
  change: pressed menu items painted with the theme accent (five `active:bg-accent`
  sites moved to `active:bg-state-pressed`), and the sheet's dim backdrop rising with
  the panel because a `slide` Modal moves everything inside it. The drawer's
  mount-through-exit hook became `lib/overlay-presence`, shared by DrawerMenu and
  Sheet, and the sheet host no longer animates. A sheet contract test pins the
  lifecycle. After that change the iOS release build was rebuilt and the nested, drawer
  and scroll-ownership flows passed again. Android was rebuilt and installed, but three
  rerun attempts under a host load average of 25 to 33 died before the first in-app
  tap — the app took longer than the flow's 60-second launch wait, then a tap found no
  element while the screen was still drawing. The Android pass recorded above is the
  build before the sheet and press change. After the machine was rebooted the flow
  was rerun on the rebuilt build and passed with zero errors.
- A third owner-reported defect, reproduced on the emulator: a translucent `Card` went
  grey on Android with lighter patches behind its children, while iOS was clean. The
  shadow recipe rendered `elevation`, which Android draws under the whole view and
  which shows through a 72%-opaque background. Bisected on the device with four card
  variants: every shadowed card greyed, the unshadowed one did not. The recipe now
  emits an outset `boxShadow` and keeps `elevation` only below Android 9;
  `lib/recipes.test.ts` pins both branches, and the card renders clean on both
  platforms. A first "fixed" build still showed the defect because Gradle had not
  rebundled a library-only change — recorded in `AGENTS.md` > Tooling gotchas.

### [ ] P3-02 — Migrate Tier 1 overlays

**Goal:** move the product-used overlay families to the coordinator one family at a
time without widening their public APIs.

**Prerequisites:** P3-01; C-03 for the menu families, which move there.

**Order:** AlertDialog, Sheet, DrawerMenu, then any additional family pulled by the
local consumer plan.

**Acceptance evidence per family:** contract tests; accessible role/name/state;
VoiceOver/TalkBack reachability; Escape/back; focus return; interrupted close; README,
showcase and stability inventory updated.

**Review cards:** 02, 03, 05, 07, 09, 10, 11.

**Notes/evidence:** Not started.

### [ ] P3-03 — Keyboard and text-entry matrix

**Goal:** harden `KeyboardAwareScreen`, `DockedInput`, `SmartInput`, `Input`,
`NumericInput`, `Textarea` and `OTPInput` against real platform keyboard behavior.

**Prerequisites:** P3-01 for the overlay work. The keyboard flows do not use the
coordinator, and they are not blocked on it.

**Work:**

- Native: overlap, safe area, dismissal, orientation and accessory views.
- Web: document layout, focus visibility and responsive containment; do not translate
  native keyboard offsets.
- OTP/numeric: IME composition, paste, autofill, invalid input and selection behavior.
- All targets: large text, RTL, controlled/uncontrolled state and cleanup.

**Acceptance evidence:** RNTL contracts; Maestro on iOS/Android; Playwright at narrow
and wide widths; manual VoiceOver/TalkBack checklist recorded in `docs/stability.md`.

**Review cards:** 01, 02, 05, 07, 09, 10, 11.

**Notes/evidence:** Keyboard slice started 2026-10-18. The Layout tab's 144px Smart Input
clip cannot prove avoidance, so the showcase opens a full-screen `KeyboardAwareScreen` +
`DockedInput` (`apps/showcase/catalog/keyboard-dock-screen.tsx`). `e2e/maestro/keyboard-dock.yaml`
types into that field with the keyboard open and asserts the field, the send button, and
the submitted word. `e2e/maestro/otp.yaml` rejects `000000`, accepts `123456`, pastes
`1234567` (truncated), and accepts PIN `0000`. The result text no longer clears on a
timer, because that raced the flow. `e2e/keyboard-dock.spec.ts` checks the same dock at
390px and 1280px: in the viewport, bottom-docked, Tab-reachable, focus ring visible. No
native keyboard offset on web. `e2e/maestro/keyboard-orientation.yaml` repeats the dock
check in landscape. The showcase orientation is `default` so that rotation is observable;
Android `softwareKeyboardLayoutMode` is `resize`. Large text, RTL, IME composition,
autofill, and the VoiceOver/TalkBack pass are still open. Run the device flows against a
build that contains this screen.

## Phase 4 — Tokens and hot paths

Phase exit: generated token artifacts are clean, no token has two sources of truth, and
measured hot-path regressions are addressed without expanding public APIs.

### [ ] P4-01 — Canonical token generation

**Goal:** generate consumer CSS variable blocks and typed metadata from the
renderer-free TypeScript contracts.

**Prerequisites:** Phase 3 exit.

**Work:** implement generation, add generated-file headers, normalize native/web token
values through typed helpers, and make `verify` fail on a dirty regeneration diff.

**Acceptance evidence:** clean regeneration from scratch; light/dark/product themes;
native and web fixtures; token card clean.

**Review cards:** 01, 02, 07, 08, 11.

**Notes/evidence:** Not started. On 2026-10-18 press, disabled, inactive, motion and
drawer durations were left out of `VISUAL_TOKEN_SPECS` on purpose. They live in
`INTERACTION_TOKENS`. Generated themes must not grow those variables, and
`useInteractionTokens` must not read them from CSS. That read was the Uniwind
missing-variable warning on every generated theme.

### [ ] P4-02 — Profile provider and compound-control renders

**Goal:** remove measured avoidable renders and full-contract token reads without
speculative memoization.

**Prerequisites:** P4-01.

**Work:** record baselines, add render-count regression tests where deterministic,
stabilize provider values, narrow token hooks, then remeasure release builds.

**Acceptance evidence:** before/after measurements and behavior-preserving contract
tests.

**Review cards:** 01, 04, 07, 09, 10.

**Notes/evidence:** First measured slice landed early, 2026-11-10, because the proving
product made the cost visible: the token hooks re-derived the whole theme on every
component render (about 0.16 ms per render in Node, 67 component files calling them).
They now resolve once per CSS snapshot with a stable result; a contract test pins it.
Numbers and the bundle breakdown are in `docs/stability.md` > Token hooks derived once.
The rest of this task — render-count baselines and release re-measurement — waits for
Phase 4 as planned.

### [ ] P4-03 — Package and runtime budgets

**Goal:** make payload and interaction regressions visible without brittle frame-level
CI assertions.

**Prerequisites:** P4-02.

**Work:** record tarball/exported-bundle budgets, define allowed growth rationale, and
document the release-trace procedure for startup and critical interactions.

**Acceptance evidence:** reproducible budget commands joined to `verify`; packed package
remains clean.

**Review cards:** 04, 07, 08, 10.

**Notes/evidence:** Not started.

## Phase 5 — Web production hardening

Phase exit: the local product acceptance flow passes the browser matrix and web release
checklist.

### [ ] P5-01 — Complete keyboard and semantic coverage

**Goal:** operate every stable showcase surface using only the keyboard with correct
roles, names, states, focus order, Escape and focus return.

**Prerequisites:** Phase 4 exit.

**Acceptance evidence:** Chromium and WebKit per change; Firefox release run; axe
allowance ratchet reaches zero for stable surfaces; manual keyboard checklist.

**Review cards:** 02, 05, 07, 09, 11.

**Notes/evidence:** Not started.

### [ ] P5-02 — Responsive and browser-delivery matrix

**Goal:** verify phone, tablet and desktop containment, deep links, assets and PWA
delivery for desktop users.

**Prerequisites:** P5-01.

**Acceptance evidence:** automated checks at both ends of every supported width range;
deep-link and asset smoke; installable web build; no parallel DOM API.

**Review cards:** 02, 07, 08, 11.

**Notes/evidence:** Not started.

### [ ] P5-03 — Deterministic visual regression

**Goal:** catch unintended visual changes across themes and responsive states without
masking behavioral failures.

**Prerequisites:** P5-02.

**Acceptance evidence:** deterministic fonts, animation disabled through motion policy,
documented baseline-update process, representative stable states in both themes.

**Review cards:** 01, 03, 07, 10, 11.

**Notes/evidence:** Not started.

## Phase 6A — Internal registry

Phase exit: a clean project can reproducibly install a source-owned block and its
dependencies without silent overwrite.

### [ ] P6-01 — Registry manifest and schema

**Goal:** one renderer-free catalog manifest containing distribution mode, maturity,
required WhileUI range, supported platforms, files, dependencies and install hash.

**Prerequisites:** stable kernel from Phases 2–5.

**Acceptance evidence:** schema tests, duplicate/path validation, renderer-free token
entry remains importable without React Native.

**Review cards:** 02, 04, 07, 08, 09.

**Notes/evidence:** Not started.

### [ ] P6-02 — Minimal `whileui add` workflow

**Goal:** support add, dry-run and conflict detection only.

**Prerequisites:** P6-01.

**Work:** install source-owned blocks that import stable package primitives; never copy
primitive internals; never silently overwrite application files.

**Acceptance evidence:** clean-project fixture installs and typechecks a block; repeated
install is deterministic; changed local file produces a conflict.

**Review cards:** 03, 04, 07, 08, 09.

**Notes/evidence:** Not started.

### [ ] P6-03 — Prove before expanding registry UX

**Goal:** validate the minimal workflow in at least two products before considering
search, info, diff, public hosting, offline caching or generated documentation.

**Prerequisites:** P6-02.

**Acceptance evidence:** two local consumer records in `CONSUMERS.md`; concrete friction
list; explicit go/no-go decision for Phase 6B.

**Review cards:** 03, 04, 07, 08.

**Notes/evidence:** Not started.

## Phase 7 — Product adoption and stable kernel

Phase exit: a versioned stable kernel ships on iOS, Android and web with no local
component forks, and acceptance flows are monitored.

### [ ] P7-01 — Migrate the critical flow

**Goal:** adopt hardened WhileUI families in the order defined by local `CONSUMERS.md`:
text entry and keyboard, overlays, lists/gestures, then presentation.

**Prerequisites:** applicable Phase 2–5 families complete.

**Acceptance evidence:** no consumer wrapper hiding a generic defect; iOS/Android/web
acceptance flows pass; package version is visible in production telemetry.

**Review cards:** all applicable cards.

**Notes/evidence:** Not started.

### [ ] P7-02 — Promote proven families to stable

**Goal:** promote only families meeting every item in `PLAN.md` > Definition of done.

**Prerequisites:** P7-01 and a shipped production call site for each family.

**Acceptance evidence:** stability inventory links each family to contract, package,
native, browser, accessibility and product evidence.

**Review cards:** 03, 05, 07, 08, 09, 10, 11.

**Notes/evidence:** Not started.

### [ ] P7-03 — Stable release and monitoring

**Goal:** publish the stable kernel with release notes and monitor real startup,
interaction and error behavior.

**Prerequisites:** P7-02.

**Acceptance evidence:** changesets applied; `bun run verify`; release-device matrix,
including the drawer and sheet release traces from one physical Android that P2-03
deferred here on 2026-11-10 — `scroll-ownership.yaml` and `drawer-lifecycle.yaml`
against the release APK with `dumpsys gfxinfo` recorded, on a lower-tier device or a
cloud device lab where one exists, otherwise on the best available phone with the tier
stated; manual screen-reader, RTL and large-text checks; telemetry tied to the released
version.

**Review cards:** 03, 07, 08.

**Notes/evidence:** Not started. The emulator cannot supply the trace; P2-03 records
why.

### [ ] P7-04 — Developer and agent experience

**Goal:** make the stable kernel adoptable by a new universal Expo application and by a
coding agent without reading the source.

**Prerequisites:** P7-02.

**Work:**

- A minimal universal Expo starter that consumes the published package on iOS, Android
  and web with the showcase's Metro, Uniwind and portal configuration.
- Guidance separating an application web target from a marketing website, with the
  responsive and keyboard expectations each carries.
- Copyable screen compositions for auth, chat, forms and settings built only from
  stable families and the README composition grammar.
- An agent skill derived from the versioned README, regenerated per release, never
  hand-maintained alongside it.
- Upgrade guidance tied to each release's changeset entries.

**Acceptance evidence:** a clean starter installs, typechecks, exports all three
targets and renders one composition from each category; the skill is generated from the
README of the released version; every item here is derived from a shipped artifact, not
written separately.

**Review cards:** 03, 04, 08.

**Notes/evidence:** Not started. Recorded 2026-11-10 so the items stop living only in
conversation. Nothing here starts before the kernel is stable; a starter that tracks an
unstable API is churn, not help.

## Deferred unless a reopen gate passes

- Tamagui or another styling-foundation replacement. Use the five-part reopen gate in
  `PLAN.md`; if it passes, replace Uniwind completely rather than running both.
- A parallel React DOM library or Capacitor component implementation.
- Native macOS or Windows variants without a funded product and test matrix.
- Bare React Native, an N-1 Expo matrix or compatibility machinery for hypothetical
  external consumers.
- Phase 6B public registry UX before the internal registry is proven twice.

## Handoff log

### 2026-11-12 — Phase 2C planned; C-01 control base

- Outcome: researched how established React Native libraries structure interaction —
  behaviour primitives separate from styling, state exposed as data attributes, a
  touchable with no handler treated as non-interactive — and checked the
  `@rn-primitives` 1.5.2 sources for the families WhileUI hand-built. Wrote Phase 2C
  (C-01 to C-05) here and in `PLAN.md`, closed D-03 and P3-01, which had shipped, and
  completed C-01.
- Evidence: the data-attribute spike on web and iOS; `bun run verify` passed (see C-01).
- Changed: `components/pressable`, 23 call sites in components and blocks, AGENTS
  (four entries folded into one rule), README, the catalog's Pressable demo and back
  button, `all-components.aria.yml`, `.changeset/control-base.md`.
- Risk: a consumer's handler-less `HeaderBackButton` or custom `Pressable` stops being
  a button; the changeset says so. Not yet observed on a device.

Append one concise entry per work session. Keep the newest entry first and remove detail
that has been incorporated into a completed task's Evidence section.

### 2026-11-10 — Self-review findings fixed

- Outcome: ran the generic branch-review checklist over the day's commits. Fixed what it
  found: `withWhileUIMetro` now matches Windows paths and names `cssEntryFile` when
  called without options; `Sheet` and `DrawerMenu` ignore a dismiss request that arrives
  during their exit so the owner is not told to close twice; the showcase Header demo
  names its icon actions; the state demos use `Surface` instead of literal radius classes.
- Changed files: `metro.cjs` and test, sheet and drawer with tests, showcase, a patch
  changeset.
- Checks run and results: `bun run verify` passed — 147 unit tests, 153 kB tarball,
  both native exports, 116 browser tests with the one existing skip.
- Evidence added: a Windows-path and a missing-options case in the Metro test; exit-window
  dismiss tests for Sheet and DrawerMenu.
- Remaining risk or blocker: 4.2.2 and the pending 4.2.3 both await a publish the
  permission layer blocks in this session.
- Next safe action: publish, bump the proving product, then D-03 shapes.

### 2026-11-10 — Token hooks derived once per theme

- Outcome: measured, then removed, the one render-time cost the library imposed on
  every themed component: `useThemeColors` and `useVisualTokens` re-parsed and
  re-derived on every render. Both now cache per CSS snapshot and return stable objects;
  `useIconColors` follows. Bundle attribution of the proving product recorded for P4-03.
- Changed files: `theme-colors.ts`, `visual-tokens.ts`, `token-hooks.test.tsx`,
  stability notes, this ledger, a patch changeset.
- Checks run and results: `bun run verify` passed — 144 unit tests, 153 kB tarball,
  both native exports, 116 browser tests with the one existing skip.
- Evidence added: Node benchmark before and after (160 µs → 2 µs per render); contract
  tests for referential stability and re-derivation.
- Remaining risk or blocker: none; frame-time proof stays a Phase 7 device trace.
- Next safe action: release, bump the proving product, then back to D-03 shapes.

### 2026-11-10 — Ran the proving product on 4.2.0; native Select overflow fixed

- Outcome: built the proving product's iOS release against its local backend and ran
  its Maestro journey: sign-in, quick add to the ledger, expense detail and edit, settle
  up, new group and sign-out all pass; its sign-up step stalled on the runner's own
  log-reading, not the UI. Screens show the icon glyphs, the eyebrow labels and the
  library FAB. Opening a twenty-option `Select` on its quick-add modal screen answered
  the audit's open question — the list renders above the presented screen on iOS — and
  exposed that a native list taller than the screen had no scroll owner. Fixed in
  `SelectContent`; a forty-option showcase demo and `select-long-list.yaml` prove it.
- Changed files: `select.tsx`, showcase Controls demo, the new flow, README,
  stability, a patch changeset.
- Checks run and results: `bun run verify` passed — 142 unit tests, 153 kB tarball,
  both native exports, 116 browser tests with the one existing skip; the new flow
  passes on both the iOS simulator and the Android emulator release builds. Published
  as 4.2.1 and pushed.
- Evidence added: the device flow for a long list; the proving product's own journey on
  the released package.
- Also seen on the product, app-side: its modal screens' hand-rolled action bar used
  `px-2`, so the Save button sat inside the page sheet's corner curve. `FormModalScreen`
  is not a drop-in for that bar because its action slots are 48 px wide, sized for
  icons, and it owns its own scroll view — added to D-03's list.
- Remaining risk or blocker: none.
- Next safe action: bump the product to 4.2.1 and re-check its picker; then D-03 shapes.

### 2026-11-10 — Consumer audit; small fixes shipped, pulled components logged

- Outcome: audited the proving product against 4.1.2 (two read-only passes over all 39
  source files plus its WhileUI backlog). Setup, providers, theme preset and Metro
  config were correct. Shipped the six small generic fixes listed in D-03; logged nine
  pulled components for a shape decision. Release 4.1.2 is committed and pushed but not
  published: npm rejected the token (`E404` on publish, `401` on `whoami`).
- Changed files: `metro.cjs`/`metro.d.cts` and test, alert, header, select, text,
  loading-state and tests, layout index, package exports and build script, showcase
  Metro config and demos, README, stability counts, AGENTS, a minor changeset.
- Checks run and results: `bun run verify` passed format, zero-warning lint, typecheck,
  142 unit tests, build, a 152 kB tarball with the new `./metro` entry present and
  `publint`/`attw` clean, both native exports and the browser suite, except two
  assertions that counted alert regions on a tab that now also shows an `Alert`
  component; scoped to the dialog's text, the overlay spec reran 14 of 14 in Chromium
  and WebKit.
- Evidence added: contract tests for the Metro exemption routing, Alert role, Header
  action name, eyebrow variant and LoadingState.
- Remaining risk or blocker: publish needs a fresh npm token; D-03's pulled list needs
  the owner's shape decisions before building public API.
- Next safe action: refresh the npm token and run `nvm exec 24 bunx changeset publish`;
  then decide D-03 item shapes, starting with the labelled Select.

### 2026-11-10 — P3-01 overlay host implemented and verified

- Outcome: one internal `OverlayHost` replaces eleven bare `Modal` sites; nested
  Select, Popover, Tooltip and HoverCard render inside their host on all three targets;
  back and Escape close the innermost layer first; DrawerMenu is hosted on every
  platform. `DialogTitle` gained the `header` role. No public prop changed.
- Changed files: `lib/overlay-host` and its test; dialog, alert-dialog, sheet,
  confirm-action-sheet, drawer-menu, dropdown-menu, context-menu, menubar, the three
  pickers, popover, select, tooltip, hover-card; showcase Overlays tab;
  `e2e/overlays.spec.ts`; `e2e/maestro/nested-overlays.yaml`; README, stability,
  AGENTS, PLAN, this ledger and a patch changeset.
- Checks run and results: `bun run verify` passed on the final tree — format,
  zero-warning lint, typecheck, 134 unit tests, build, 150 kB tarball, both native
  exports, 116 Chromium/WebKit tests with the one existing WebKit autofill skip. After
  the sheet and press-token change, the iOS release build was rebuilt and
  `nested-overlays`, `drawer-lifecycle` and `scroll-ownership` passed again; Android
  was rebuilt and the nested flow rerun — result in the P3-01 evidence. The toggled-off
  browser run that proves the nested tests fail without the host is recorded there too.
- Evidence added: DOM and key-event probes before the fix, contract suite, browser
  matrix, iOS release flows, Android release flow. Library code net: 17 modified files
  at +99/−204 plus two new `lib` files; React Doctor was not run this session.
- Remaining risk or blocker: the Android emulator is barely usable under host load and
  nearly out of storage; the physical-device trace sits at P7-03.
- Next safe action: commit, then P3-02 starting with AlertDialog.

### 2026-11-10 — Phase 2 closed by decision; P3-01 designed

- Outcome: repaired Resume here, which described an uncommitted 4.0.0 tree while the
  repository was at the released 4.1.1. Closed P2-03 on the recorded decision that the
  physical Android trace is Phase 7 release-gate evidence. Started P3-01 with the
  design, state machine and test matrix written before code. Added P7-04 for the
  starter, guidance, compositions, agent skill and upgrade items.
- Changed files: `PLAN.md` (coordinator ownership and device row), `IMPLEMENTATION.md`.
- Checks run and results: `git status --short` clean before edits; `adb devices` lists
  no device; the release APK from 2026-10-18 predates the keyboard dock screen and three
  releases, so a rebuild precedes any device run.
- Evidence added: measured the current overlay hosting — nine of eleven dismissal
  sites use the platform Modal, no host carries a portal root, React Native Web's Modal
  layer is `zIndex: 9999`, and the primitives' BackHandler listeners are suppressed
  inside a Modal. Research confirmed the nested-portal defect is a known ecosystem
  problem and recorded the upstream iOS Modal issue as a risk.
- Remaining risk or blocker: none blocking. The drawer's move onto a Modal host on iOS
  and web has no recorded rationale against it and is settled by the device flows.
- Next safe action: write the failing tests in the P3-01 matrix, then implement
  `lib/overlay-host` and migrate Dialog first.

### 2026-11-09 — Asynchronous UI lifecycles made explicit

- Outcome: audited component and showcase state machines; made theme hydration, image
  loading, toast timer ownership and mutually exclusive showcase routes explicit while
  retaining simple controlled booleans, animation values and one-shot refs where those
  are the correct model. No state-machine dependency or parallel API was added.
- Checks run and results: `bun run verify` passed format, zero-warning lint, all type
  fixtures, 126 unit tests, a 147 kB publishable tarball, both native exports and 108
  Chromium/WebKit tests (107 passed, one existing WebKit autofill skip).
- Evidence added: five focused regressions cover adapter replacement, user choice during
  hydration, Avatar and SmartImage reload phases, and toast deadlines that survive stack
  changes. README, stability evidence, the agent rule and a patch changeset are current.
- Remaining blocker: unchanged P2-03 physical Android trace requirement.
- Next safe action: review and commit this verified delivery, then resume the existing
  P2-03 hardware step.

### 2026-11-09 — Select popover constrained on narrow web viewports

- Outcome: web popovers now match their trigger, respect Radix's collision-available
  bounds, and wrap long option labels instead of expanding off-screen.
- Checks run and results: `bun run verify` passed format, zero-warning lint, all type
  fixtures, 121 unit tests, package distribution checks, both native exports and 108
  Chromium/WebKit tests (107 passed, one existing WebKit autofill skip).
- Evidence added: a 320 px browser regression that measures the trigger, listbox and
  longest option; both README theme recordings were regenerated from the fixed export.
- Remaining blocker: unchanged P2-03 physical Android trace requirement.
- Next safe action: review and commit this verified delivery, then resume the existing
  P2-03 hardware step.

### 2026-11-06 — Composition foundation completed

- Outcome: completed semantic typography, shared surfaces, agent composition guidance,
  compound chat/form boundaries, and optional Markdown/code subpaths without adding
  domain-specific message components.
- Checks run and results: `bun run verify` passed format, zero-warning lint, all type
  fixtures, 121 unit tests, package distribution checks, both native exports and 106
  Chromium/WebKit tests.
- Evidence added: focused consumer-observable contract tests, showcase demos, packed
  subpath verification, Vite/RNW imports, README API guidance and a minor changeset.
- Remaining blocker: unchanged P2-03 physical Android trace requirement.
- Next safe action: review and commit this verified delivery, then resume the existing
  P2-03 hardware step.

### 2026-10-18 — P2-03 blocked on hardware; Expo 58 migration committed

- Outcome: committed the Expo 58 migration as one change and moved P2-03 from `[~]` to
  `[!]`. No task is in progress; the repository is waiting on physical devices, not on
  work. Recorded, without resolving, that the Phase 2 exit wording is satisfied by the
  simulator and emulator release runs while P2-03's own acceptance criteria are not.
- Changed files: `IMPLEMENTATION.md` only. The committed tree is the one the previous
  session verified, unchanged.
- Checks run and results: see below.
- Evidence added: none. This session produced no new evidence by design.
- Attempted and failed, deliberately: completing P2-03 on available hardware. The
  scroll-ownership flow passes against the release APK on the emulator, but `dumpsys
gfxinfo` reports a 4950 ms GPU percentile for both the app and the system launcher,
  which is the emulator's software renderer rather than either application. Recorded in
  P2-03 so the attempt is not repeated.
- Scope narrowed: the blocker is one physical lower-tier Android, not two devices.
  `PLAN.md` names the iOS simulator as this stack's representative iOS device.
- Remaining risk or blocker: P2-03 needs that one Android phone. Until the Phase 2 gate
  question is settled, starting P3-01 would skip a prerequisite.
- Next safe action: attach an Android phone, rerun the two flows, record gfxinfo in
  P2-03. Failing that, settle the gate question explicitly before P3-01.

### 2026-10-18 — React quality and performance-pattern cleanup

- Outcome: resolved all 19 React Doctor findings through state-boundary fixes, drawer
  virtualization, focused hooks/components and shared showcase template composition;
  no rules or files were suppressed.
- Changed files: date-picker sessions, ThemeBridge, DrawerMenu, SmartInput,
  NumericInput, AlertDialog overlay layering, showcase structure, auth templates,
  tests, README and the pending major changeset.
- Checks run and results: React Doctor passed 100/100 with zero findings across 191
  package/showcase files; `nvm exec 24 bun run verify` passed format, zero-warning lint,
  typecheck, 60 unit tests, build, package inspection, both native exports and all 86
  Chromium/WebKit tests.
- Evidence added: virtualized drawer sections, synchronous date draft reset, direct
  controlled theme synchronization and warning-free timer coverage for drawer exits.
- Remaining risk or blocker: real frame-time, startup and memory claims still require
  release traces on representative physical iOS and Android hardware.
- Next safe action: review and commit the clean SDK 58 migration, apply its Changeset
  and publish the major release before upgrading a consuming app.

### 2026-10-18 — Expo SDK 58 stack migration

- Outcome: moved the supported stack to Expo SDK 58, React Native 0.88 and React 19.3;
  adapted public ref contracts and test infrastructure to their stricter APIs.
- Changed files: workspace/package metadata, showcase configuration, package and fixture
  types, Jest/Reanimated setup, public documentation and a major-release changeset.
- Checks run and results: Expo Doctor passed 20/20; `nvm exec 24 bun run verify` passed
  format, zero-warning lint, typecheck, 60 unit tests, build, package inspection, iOS
  and Android exports, and all 86 Chromium/WebKit tests.
- Evidence added: a real packed-tarball consumer check, both production bundle targets,
  browser accessibility/interaction coverage and an explicit Node 22.13+ toolchain
  contract.
- Remaining risk or blocker: the P2-03 physical-device evidence remains blocked on
  representative attached hardware.
- Next safe action: review and commit the migration, apply its Changeset and publish the
  major release before upgrading a consuming app to SDK 58.

### 2026-10-18 — P2-03 release-build interaction evidence

- Outcome: fixed backdrop drag cancellation, completed the iOS/Android release-flow
  matrix and corrected Android-native packaging for two mislabeled showcase images.
- Checks run and results: focused unit suites passed (10 tests); format, lint and
  typecheck passed; package verification, both native exports and all 86 browser tests
  passed; all four Maestro flows passed on both mobile simulators.
- Evidence added: explicit scroll owners, discrete cancellation/lifecycle tests, a
  screen-reader refresh action, RTL exit direction and device-level backdrop/nested
  scroll assertions.
- Remaining blocker: the acceptance contract requires release traces on representative
  physical iOS and Android hardware; neither is attached.
- Next safe action: capture those two traces, document results, mark P2-03 complete and
  advance the single in-progress marker to P3-01.

### 2026-09-27 — P2-02 shared press feedback

- Outcome: completed shared Pressable feedback and migrated Button, including loading.
- Changed files: Pressable and Button implementation/tests, showcase, browser/native
  flows, package peer metadata, README, stability inventory and changesets.
- Checks run and results: unit tests and targeted Chromium/WebKit interaction tests
  passed; Maestro Button activation passed on iOS and Android; React Doctor reported the
  same 19 pre-existing findings and none in the primitive.
- Evidence added: stable geometry under pointer press, keyboard parity, busy/disabled
  semantics, native accessibility activation and a state-free press rendering path.
- Remaining risk or blocker: the full verification gate still needs its final run after
  documentation updates.
- Next safe action: execute P2-03's gesture/scroll ownership inventory and use it to
  scope only the migration-blocking fixes.

### 2026-09-26 — P2-01 motion policy contract

- Outcome: completed the first Phase 2 task and advanced Resume here to P2-02.
- Changed files: motion policy and tests, interaction tokens, root export, showcase,
  test/type fixtures, README, stability inventory and changeset.
- Checks run and results: `bun run verify` passed in full; React Doctor found no new
  warning in touched policy code.
- Additional fix: package verification now streams `attw` stdout to disk so a non-zero
  report cannot be truncated before JSON parsing.
- Remaining risk: no product component consumes the policy yet; P2-02 begins adoption
  with Button.
- Next safe action: inventory press feedback, state the hook/component contract, and
  preserve caller handlers, style callbacks, refs and accessibility while migrating
  Button.

### 2026-09-26 — Execution ledger created

- Added the resumable task graph for Phases 2–7.
- Current implementation starting point is P2-01.
- The working tree also contains the refactor protocol and review cards 09–11.
- Formatting, lint and typecheck passed before this ledger was added; rerun them after
  formatting this file.

### Handoff entry template

```text
### YYYY-MM-DD — TASK-ID short description

- Outcome:
- Changed files:
- Checks run and results:
- Evidence added:
- Remaining risk or blocker:
- Next safe action:
```
