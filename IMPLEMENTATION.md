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
Current phase: Phase 2 — Interaction engine
Current task: none in progress. P2-03 is blocked on hardware; P3-01 is unstarted and
  its prerequisite is disputed — see the Phase 2 gate note in P2-03
Status: blocked
Branch: main
Last verified commit: the Expo 58 migration commit (`git log -1`)
Working tree at handoff: clean
Last command run: nvm exec 24 bun run verify
Last command result: passed — format, lint, typecheck, 60 unit tests, build, packed
  tarball, iOS and Android exports, 86 Chromium/WebKit tests
Next safe action: attach one lower-tier physical Android, install the release APK and
  run scroll-ownership.yaml and drawer-lifecycle.yaml against it, recording dumpsys
  gfxinfo in P2-03, which then closes. No iOS hardware is required — the simulator is
  this stack's representative iOS device. If no Android phone is reachable, decide
  explicitly whether the Phase 2 exit is met without it, record that decision in P2-03,
  and only then start P3-01
Blockers: P2-03 needs drawer and sheet release traces from one physical lower-tier
  Android. None attached; the emulator was measured and cannot substitute. Nothing else
  in the repository is waiting on a decision
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
3. Run the applicable cards in `docs/review-perspectives/`.
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

### [!] P2-03 — Gesture and scroll-ownership audit

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

**Follow-up, not a blocker:** nested scrolling under forced RTL on a device. Forcing RTL
needs a showcase switch that restarts the app.

## Phase 3 — Overlays and keyboard

Phase exit: the local critical acceptance flow passes Maestro on iOS and Android and
Playwright in Chromium and WebKit.

### [ ] P3-01 — Overlay coordinator contract

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

**Notes/evidence:** Not started.

### [ ] P3-02 — Migrate Tier 1 overlays

**Goal:** move the product-used overlay families to the coordinator one family at a
time without widening their public APIs.

**Prerequisites:** P3-01.

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
`DockedInput` (`apps/showcase/keyboard-dock-screen.tsx`). `e2e/maestro/keyboard-dock.yaml`
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

**Notes/evidence:** Not started.

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

**Acceptance evidence:** changesets applied; `bun run verify`; release-device matrix;
manual screen-reader, RTL and large-text checks; telemetry tied to the released version.

**Review cards:** 03, 07, 08.

**Notes/evidence:** Not started.

## Deferred unless a reopen gate passes

- Tamagui or another styling-foundation replacement. Use the five-part reopen gate in
  `PLAN.md`; if it passes, replace Uniwind completely rather than running both.
- A parallel React DOM library or Capacitor component implementation.
- Native macOS or Windows variants without a funded product and test matrix.
- Bare React Native, an N-1 Expo matrix or compatibility machinery for hypothetical
  external consumers.
- Phase 6B public registry UX before the internal registry is proven twice.

## Handoff log

Append one concise entry per work session. Keep the newest entry first and remove detail
that has been incorporated into a completed task's Evidence section.

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
