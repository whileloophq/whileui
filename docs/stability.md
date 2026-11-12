# Stability Inventory

Phase 0 artifact (`PLAN.md` > Phases > Phase 0). Records the maturity of every
component and block family against the evidence that exists today, so no export can
claim a level it has not earned.

**Generated 2026-09-26.** Regenerate by re-running the survey described under
_Method_ below; update it in the same change as anything that adds, removes or promotes
an export.

## Headline

| Measure                             | Count |
| ----------------------------------- | ----- |
| Component and block families        | 93    |
| Shipped in a production application | 30    |
| Showcase demo only, never shipped   | 63    |
| Neither shipped nor demonstrated    | 0     |
| Covered by a contract test          | 27    |
| Qualifying as `stable`              | **0** |
| Qualifying as `candidate`           | 17    |

**Seventeen families are `candidate` as of 2026-11-06** — `Button`, `Input`, `OTPInput`,
`AlertDialog`, `SmartInput`, `KeyboardAwareScreen`, `Pressable`, `PullToRefreshScrollView`,
`DrawerMenu`, `Switch`, `Textarea`, `NumericInput`, `SegmentedControl`, `FormField` and
`DatePickerModal`, `FAB`, and `Text` each have a contract suite and a production call site.
`Sheet`, `MotionProvider`, `ChatConversation`, `TimePickerModal`, `Surface`, `Markdown`,
`CodeBlock`, `Avatar`, `Toast`, and `SmartImage` have suites but no production call site,
so they stay `experimental` with the other 76. `candidate` requires passing contract tests;
`stable` requires the full definition of done, which no family meets until the
accessibility matrix and E2E layers exist. The 30 shipped families are the ones on the shortest
path — they already have the production call site that `stable` demands, and need the
evidence layers underneath it.

## Tier 1 — shipped, awaiting evidence (30)

These have a real production call site. They become `candidate` on contract tests and
`stable` on the full definition of done. Phase 1 test work should start here, and the
Phase 1 exit list is drawn from this tier.

| Family                    | Area       |
| ------------------------- | ---------- |
| `Alert`                   | component  |
| `AlertDialog`             | component  |
| `Badge`                   | component  |
| `FAB`                     | component  |
| `Button`                  | component  |
| `Card`                    | component  |
| `DataRow`                 | component  |
| `FormField`               | component  |
| `Input`                   | component  |
| `NumericInput`            | component  |
| `OTPInput`                | component  |
| `Pressable`               | component  |
| `Progress`                | component  |
| `Row`                     | component  |
| `SegmentedControl`        | component  |
| `Separator`               | component  |
| `Skeleton`                | component  |
| `Spinner`                 | component  |
| `Stack`                   | component  |
| `Switch`                  | component  |
| `Text`                    | component  |
| `Textarea`                | component  |
| `DatePickerModal`         | datepicker |
| `DockedInput`             | layout     |
| `EmptyState`              | layout     |
| `FormModalScreen`         | layout     |
| `KeyboardAwareScreen`     | layout     |
| `PageSkeleton`            | layout     |
| `PullToRefreshScrollView` | layout     |
| `SmartInput`              | layout     |
| `DrawerMenu`              | navigation |

## Tier 2 — showcase demo only (63)

Rendered in the showcase, never used in a shipping screen. A demo proves a component
renders; only a consumer proves it is useful. These stay `experimental` until a
product pulls them, and they should not receive hardening work ahead of Tier 1.

`Accordion`, `AspectRatio`, `Avatar`, `Checkbox`, `CodeBlock`, `Collapsible`, `Container`, `ContextMenu`, `Dialog`, `DropdownMenu`, `HoverCard`, `Label`, `LabeledField`, `Markdown`, `Menubar`, `MotionProvider`, `Pagination`, `SearchField`, `SelectField`, `Popover`, `RadioGroup`, `Select`, `Surface`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`, `Tooltip`, `View`, `ChatConversation`, `ChatMessageBubble`, `CheckoutSummary`, `FeatureGate`, `MetricCard`, `PlanToggle`, `PricingCard`, `ProductCard`, `SubscriptionCard`, `UpgradeBanner`, `UsageBar`, `DateRangePickerModal`, `DatePickerInline`, `TimePickerModal`, `ActionBar`, `AppShell`, `ConfirmActionSheet`, `ContentSkeleton`, `ErrorState`, `KeyboardAwareScrollView`, `LoadingScreen`, `LoadingState`, `ScreenSkeleton`, `Sheet`, `ListItem`, `NotificationItem`, `SectionedList`, `TimelineFeed`, `SmartImage`, `BottomNav`, `FloatingBottomNav`, `Header`, `PageHeader`, `TabBar`, `SplashScreen`

## Tier 3 — neither shipped nor demonstrated (0)

Resolved in Phase 0 on 2026-09-12. Four families were documented in the README with no
showcase demo and no consumer: `Box`, `OnboardingScreen`, `SwipeableItem` and
`NavigationSidebar`. All four were deleted — 520 lines of source plus their README
sections.

`Box` was `<View className="p-3">` behind padding and margin variants, a second way
to do what `View` already did. The other three had no consumer to define their shape.
Deleting `SwipeableItem` also removed the most expensive item in Phase 2, which
existed to migrate a component nothing used.

## Findings from the first six contract suites

40 tests across six families. Two real accessibility defects, both in components already
shipping in production:

- **`Button` set no `accessibilityRole`** — VoiceOver and TalkBack announced it as a
  plain view. Now `button`, or `link` for the link variant.
- **`AlertDialog` did not contain the screen-reader cursor.** No
  `accessibilityViewIsModal`, so on iOS VoiceOver could wander out of a destructive
  confirmation into the screen behind it, and no `alert` role to announce what it was.
  Both added.

`Input`, `OTPInput` and `SmartInput` passed clean, including OTP paste truncation,
non-digit rejection, staying editable once full, and cursor-timer cleanup.

Four items deferred out of that work:

- ~~`useInteractionTokens` hardcodes its fallbacks inline.~~ Closed 2026-10-18. Press,
  disabled, inactive, motion and drawer timing are one table, `INTERACTION_TOKENS`. They
  are not in `visual-token-contract.ts` and nothing reads them from CSS. A generated
  theme was warning for variables it was never going to emit, then using these same
  numbers anyway.
- Uniwind resolves CSS variables from Metro-compiled CSS, which Jest cannot produce, so
  the harness stubs `useCSSVariable`. Visual and color tokens therefore exercise their
  fallback path under test. Real token resolution is proven by the browser and device
  layers, not here. `useInteractionTokens` does not use that hook.
- `KeyboardAwareScreen`'s actual contract — which `KeyboardAvoidingView` behaviour each
  platform gets — is not unit-testable. `KeyboardAvoidingView` consumes the prop rather
  than forwarding it, and RNTL v14 can only query host elements. Its suite covers
  rendering only. Avoidance is `e2e/maestro/keyboard-dock.yaml`; the web dock is
  `e2e/keyboard-dock.spec.ts`.
- ~~`AlertDialog` still has no accessible name.~~ Closed 2026-09-12 — the panel now reads
  its title out of the element tree at render time. Chasing this found the overlay
  containment defect below, which was the real problem underneath it.

## Findings from the first ESLint pass

Type-aware linting landed after the contract suites and found eight defects in one pass,
none of which `tsc` or the tests could see. All fixed:

- **`SelectTrigger` and `SelectItem` dropped a caller's `style` function.** Their props
  accept `style` as a `(state) => ...` callback; the implementation put it straight into
  a style array, where React Native ignores a function. `as any` was hiding the mismatch.
- **`PullToRefreshScrollView` declared `onRefresh: () => void`** while every real handler
  is async, so a rejected refresh became an unhandled rejection. Now
  `() => void | Promise<void>`.
- **`useThemeBridge` could strand an app on its loading gate.** A rejected
  `loadThemeMode` left `hydrated` false forever. Now falls back to the initial mode.
- **`SmartInput` mirrored a controlled `value` into state via an effect**, so the
  rotating placeholder animated for one extra frame over text already typed. Derived now.
- **`ButtonIcon` accepted a `position` prop it discarded.** React Native has no `order`,
  so placement always came from child order. Removed, README corrected.
- **Four `AlertDialog` cleanups read `nativeCopyRef.current`** after the effect had
  possibly moved on. Copied into a local.
- **`React.MutableRefObject` and `React.ElementRef`** are deprecated in React 19 types.
- **A deprecated `useResolvedThemeColors` alias** was still exported with no consumers.

Five `eslint-disable` lines exist, each with a written reason: the registered BlurView
type (props are contravariant, so `any` is correct), two `static-components` false
positives over a module-level cache, a declaration-merge type parameter TypeScript
requires by name, and one timer reset in `SmartInput`.

One gap the pass exposed and left open:

- The disables above are the only places a warning can hide now that the gate runs at
  `--max-warnings 0`. They are worth re-reading whenever the surrounding code changes.

## Overlay accessibility containment — 2026-09-12

Closing the "`AlertDialog` has no accessible name" item found something larger underneath
it. `Pressable` defaults to `accessible: true` (`Pressable.js`: `accessible: accessible
!== false`), and every overlay in the catalog is built from two nested Pressables — a
backdrop that dismisses on tap, and a panel whose only `onPress` stops that dismissal.

On iOS an accessible view is a single accessibility element and its descendants are not
individually reachable. So VoiceOver on an open overlay saw one element — the backdrop —
whose label was the concatenated text of everything inside, and whose activation
dismissed it. **The confirm and cancel buttons of a destructive dialog were unreachable.**

Both Pressables in all seven overlay families now carry `accessible={false}`, and the
backdrops carry `importantForAccessibility="no"`: `AlertDialog`, `Dialog`, `DropdownMenu`,
`ContextMenu`, `Menubar`, `DatePickerModal`, `DateRangePickerModal`.

Fixed alongside it:

- `AlertDialogAction` and `AlertDialogCancel` set no `accessibilityRole` — the same defect
  found in `Button`, in the two controls of a destructive confirmation. Now `button`.
- `AlertDialogTitle` is a `header`, so assistive technology has somewhere to land inside
  the modal, and the panel carries an `accessibilityLabel` read from the title at render
  time (the native-alert copy ref cannot serve this — it is filled by child layout effects
  that run after the render and schedule no other).
- `MenubarLabel`, `DropdownMenuLabel` and `ContextMenuLabel` are section headings that
  announced as plain text. Now `header`.
- `MenubarLabel` had no showcase demo despite being exported. Demoed and documented.

**The containment fix itself is not provable at the unit layer.** RNTL walks the React
tree and finds descendants regardless of an ancestor's `accessible` prop, so a test cannot
tell the broken state from the fixed one — verified by reverting the fix and watching the
suite stay green. The `accessibilityRole` additions are covered (41 tests); the
containment is a native E2E gate, alongside `KeyboardAwareScreen`.

Six of the seven families have no contract suite at all. They are Tier 2 — no production
call site — which is why they were never in the suite queue, and why an audit rather than
a test found this.

## Browser evidence — 2026-09-12

Playwright landed on the exported web bundle in Chromium and WebKit (26 tests), with an
axe scan of every showcase category. It was the first look at what the library actually
produces in a browser, and it paid for itself immediately.

**Library defects found and fixed:**

| Component          | Defect                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `Checkbox`         | No `aria-checked`. React Native Web no longer derives it from `accessibilityState`.           |
| `Switch`           | Same.                                                                                         |
| `SegmentedControl` | Sent `selected` on `role="radio"`, which ARIA does not allow. Now `checked` + `aria-checked`. |
| `Progress`         | `role="progressbar"` with no accessible name — WCAG 4.1.2.                                    |
| `Spinner`          | `ActivityIndicator` renders `role="progressbar"`; same missing name.                          |

That took the catalog from 13 axe violations to 9, with six of ten categories at zero.
The remaining nine are demo markup (unlabelled controls, images without alt), one
contrast failure, and one third-party primitive. They are recorded as per-category
allowances in `e2e/accessibility.spec.ts` — **a ratchet that may only go down.**

**The role sweep — 185 → 20.** The scan's largest finding was that 185 focusable elements
across the showcase had no role. React Native Web renders a `Pressable` without
`accessibilityRole` as `<div tabindex="0">`: reachable by Tab, announced as nothing, and —
because RNW only attaches key handling to real roles — **not activatable by Enter or
Space.** The showcase's own category navigation was in that state; Navigation (33) and
Lists (19) had no roled controls at all.

Roles were added across 29 sites in the library and 5 in the showcase:

| Role                 | Where                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `button`             | Every trigger and close (`Dialog`, `AlertDialog`, `Sheet`, `Collapsible`, `Accordion`, `DropdownMenu`, `ContextMenu`, `Menubar`, `Toast`, `Header`, `DrawerMenu`, the date and time pickers) |
| `menuitem` + `menu`  | `DropdownMenu`, `ContextMenu`, `Menubar` items and their panels                                                                                                                              |
| `tab` + `tablist`    | `Tabs`, `BottomNav`, `TabBar`, `FloatingBottomNav`                                                                                                                                           |
| `radio`              | `RadioGroup` items, with `aria-checked`                                                                                                                                                      |
| conditional `button` | `ListItem` and `NotificationItem` — only when a handler was passed; a static row is not a control                                                                                            |

Two backdrops turned up in the same audit (`ConfirmActionSheet`, `DrawerMenu`) and got
`accessible={false}` rather than a role.

Twenty role-less elements remain, all in showcase demo markup: Forms (7), Lists (6),
Commerce (3), Profile (3), Navigation (1). `e2e/keyboard.spec.ts` asserts zero on the
first screen, so the chrome cannot regress.

**Still not fixed — `Escape` is ignored while a modal animates in.** React Native Web arms the handler
from `onShow`, which fires when the entry animation _ends_ (`ModalContent.js` listens on
`keyup` gated by `active`). A user who hits Escape immediately gets nothing. The suite
waits for animations to settle and says why. Decided 2026-11-10 with the overlay host:
left as platform behaviour, because arming the key earlier means owning Escape ourselves
on every host.

**What this layer still cannot prove:** the iOS accessibility-tree flattening behind the
containment fix above. React Native Web keeps descendants in the DOM regardless of
`accessible`, so the browser cannot distinguish the broken state from the fixed one
either. Confirmed safe here in one respect only — `importantForAccessibility="no"` does
not become `aria-hidden`, so the backdrops do not hide the panels they wrap, and there is
a test pinning that.

## Native evidence — 2026-09-12

Maestro landed on Android (`e2e/maestro/`, `bun run test:native`). Two findings, one of
them about the layer itself.

**`expo-image` was declared an optional peer even though it is not optional.** It is a static
top-level import in `smart-image.tsx` and `product-card.tsx`, and `src/index.ts`
re-exports everything — so any consumer importing from the package root pulls it in. On
native, without it installed and autolinked, the app dies at startup with
`Cannot find native module 'ExpoImage'`. Every other layer passed it: web has a JS
implementation, Jest never touches it, and the packed-tarball check sees it declared.
`frosted-surface.tsx` already has the right pattern for this — a runtime require with a
fallback, which makes `expo-blur` genuinely optional. Fixed 2026-09-27 by making
`expo-image` a required peer, matching the package's root-import behavior.

**`className` is silently dropped on `react-native-safe-area-context`'s `SafeAreaView`.**
It is a native view and Uniwind only wraps React Native's own components. Measured on
device: content rendered at x=0 with `p-4` applied, against a 16dp system inset. Two Tier
1 blocks had it — `AppShell` dropped its entire `className` (including a caller's)
whenever `safeArea` was true, which is the default, and `FormModalScreen` lost its
background. Both fixed by keeping the safe area bare and styling a child.

**The containment fix is proven — on iOS, and only there.** Maestro was added on the
argument that it drives the platform accessibility tree. That holds on iOS and not on
Android, which took two corrections to get right. Measured on a simulator, same screen,
one prop changed:

| With `accessible={false}` | Without it          |
| ------------------------- | ------------------- |
| `Delete workspace?`       | `Delete workspace?` |
| `This will permanently…`  | —                   |
| `Cancel`                  | —                   |
| `Delete`                  | —                   |

VoiceOver could not reach either button of a destructive confirmation. The flow fails
without the fix on iOS and passes with it; on Android it passes either way, because
`accessible` groups for TalkBack but leaves every node in the UIAutomator tree.
**iOS is the gate for accessibility containment**, and the eight overlay families changed
for it now have evidence. Unblocked by moving this machine from Xcode 16.0 to 26.6 —
React Native 0.86 refuses `pod install` below 16.1.

## Found by looking at the running app — 2026-09-12

Three defects a human spotted in a screenshot, none of which any gate caught.

**`Select` threw on web and rendered nothing.** Its style arrays were passed to a
primitive whose web implementation merges through a Slot that spreads `style`. Spreading
an array yields `{ 0: …, 1: … }`, and those numeric keys reach the DOM as indexed style
properties: `Failed to set an indexed property [0] on CSSStyleDeclaration`. The trigger
measured 24px tall with no padding, border or radius. Fixed with `StyleSheet.flatten`,
which `SelectContent` already did — 46px and no errors now. **Pre-existing**: the same
error reproduces on the pre-session build.

The uncomfortable part is why 32 browser tests passed over it. No test touched a Select,
and the axe ratchet only asserts an upper bound — a component that vanishes reports
_fewer_ violations, not more. `e2e/runtime.spec.ts` now asserts no uncaught error on any
category, which is the gate that was missing.

**Four malformed colours in the showcase dark theme.** `oklch(255 255 255 / 0.1)` is RGB
pasted into an OKLCH function: lightness and chroma clamp, and 255 reads as **hue 255°,
which is blue**. `--color-surface-border`, `--color-state-disabled`,
`--color-secondary-active` and `--color-secondary-soft` all rendered blue in a
purple theme. The library's own dark fallbacks were correct; this was app CSS only.

**`Sheet` ignored the top safe-area inset.** `maxHeight=full` is the default and only
`insets.bottom` was applied, so every full-height sheet put its own header under the
status bar. Rounded top corners at full height are gone too — they had nothing behind
them to read against.

**The backdrop stopped partway across the window.** React Native Web's `ImageBackground`
copies `width`/`height` off the outer style onto its inner `Image` — and
`StyleSheet.absoluteFill` carries neither, so the image fell back to the asset's intrinsic
1024×1024 and left a hard vertical seam on any wider window. RNW's own source flags the
cause in a comment: its `Image` overwrites width and height styles. `imageStyle` is
applied last, so the size has to be stated there.

The common thread: all four are things the eye catches instantly and an assertion has
to be written for specifically. Screenshots of the running app are evidence, and this
entry exists so the next person treats them that way.

## Scroll ownership — 2026-09-29

The first Android run of `e2e/maestro/scroll-ownership.yaml` failed, and the failure was
a real defect rather than a bad flow. **A swipe across a `Sheet` or `DrawerMenu` backdrop
closed the overlay.** Both backdrops are full-screen `Pressable`s, and a press stays
alive while the finger stays inside the view — so a drag that started and ended on the
backdrop fired `onPress`. A user reaching for a half-height sheet's content and landing
slightly above it lost the sheet. RNTL cannot see this, because it has no finger
movement; only a device swipe does.

Fixed with `useTapOnly`, which drops a press whose finger moved past the touch slop. The
flow now asserts both halves: a drag on the backdrop leaves the sheet open, and a drag
inside the sheet scrolls its own content to the end.

## Keyboard dock — 2026-10-18

`KeyboardAwareScreen` was unit-tested for render only. The showcase's Smart Input demo
is a 144px clip, so a field inside it never has to clear a keyboard. The flows now drive
a full-screen dock instead.

- `e2e/maestro/keyboard-dock.yaml` — type with the keyboard open, field and send button
  stay visible, the word survives dismissal.
- `e2e/maestro/otp.yaml` — `000000` is rejected, `123456` is accepted, a pasted `1234567`
  is truncated to a verified code, PIN `0000` is accepted. The demo result text stays
  until the next edit so the flow is not racing a timeout.
- `e2e/maestro/keyboard-orientation.yaml` — the same dock in landscape. The showcase
  orientation is `default` so the activity can rotate.
- `e2e/keyboard-dock.spec.ts` — phone and desktop widths. The field is inside the
  viewport, sitting at the bottom, reached by Tab, with a visible focus ring. Web does
  not copy the native keyboard offset.

Large text, RTL, IME composition, autofill, and a VoiceOver/TalkBack pass are still
open. Device results belong in this section once a build that contains the screen has
been run. The browser result belongs here once `keyboard-dock.spec.ts` has been run.

## Keyboard in a native sheet — 2026-11-11

A form in an iOS page sheet kept its focused lower field under the keyboard. The screen
used `KeyboardAwareScreen` around a `ScrollView`, as the README then advised.

`KeyboardAvoidingView` takes the overlap as its layout bottom minus the keyboard's screen
position. Inside the sheet, a probe on the iPhone 17 Pro simulator read `layoutY 61` and
`measureInWindow` `pageY 61`: under the new architecture neither includes the sheet's
distance from the top of the screen, so the padding falls short by that distance.
Measuring the window offset in JavaScript therefore cannot fix it. The native scroll view
can: with `automaticallyAdjustKeyboardInsets` it converts its own frame to window
coordinates when the keyboard frame changes, then scrolls the focused field into view.

- `KeyboardAwareScrollView` is a `ScrollView` with that inset on. `FormModalScreen`,
  `SheetContent` and `PullToRefreshScrollView` turn it on too; `ChatConversation` does
  not, because `Chat` already wraps it in `KeyboardAvoidingView`.
- `keyboard-aware-scroll-view.test.tsx` holds the prop on all four; it fails with the
  old `FormModalScreen` and `SheetContent`.
- Device: the proving product's add sheet, Note field focused, before and after. The
  catalog's Layout tab has "Open form sheet", an eleven-field `pageSheet` form: with the
  inset off its last field is under the keyboard, with it on the field sits on the
  keyboard's top edge (Release build, iPhone 17 Pro simulator).
- Not verified: Android, where the inset prop does nothing and the window is expected
  to resize; `KeyboardAwareScreen` with a docked bar inside a native sheet, which keeps
  the same shortfall.

With the simulator's hardware keyboard connected, focusing a field shows no software
keyboard, so a keyboard flow passes with nothing covered. Check a keyboard result on a
screenshot that shows the keyboard.

## Nested overlay layering — 2026-11-10

Every Modal-hosted overlay now renders through one internal host, `lib/overlay-host`.
The platform `Modal` keeps what it already does well — each one is its own window, so
Android back reaches only the topmost, and React Native Web fires Escape only on the
active Modal, traps Tab and restores focus. The host adds the two things a root-level
portal cannot provide, and it replaced eleven copies of the same Modal configuration.

**A Select, Popover, Tooltip or HoverCard opened inside a Dialog or Sheet rendered in
the wrong place.** Their content portals to the app-root `PortalHost`. On iOS and Android
that host sits under the native Modal window. On web it is the opposite of what the
`zIndex: 9999` in React Native Web's `ModalAnimation` suggests: the Modal's portal root
is `position: relative; z-index: 0`, so a later body sibling paints above it and the
listbox is visible and clickable — but it sits outside the `aria-modal` dialog and its
focus trap, which tells assistive technology to ignore it. Measured in Chromium with a
DOM probe before the fix. The host now renders a named native portal host and a web
container inside the Modal, and the four content components target the nearest host
unless `portalHost` names another. The web regression is `e2e/overlays.spec.ts` > Nested
overlays, which asserts the option is a descendant of the sheet's dialog; the native
regression is `e2e/maestro/nested-overlays.yaml`.

**One Escape closed two layers on web.** Radix dismisses a nested overlay on `keydown`
and calls `preventDefault`; React Native Web's Modal listens on `keyup`, which the
browser still dispatches, so the sheet closed with its listbox. Traced event by event
before the fix. The host watches the keydown while a nested overlay is registered and
drops the Modal's following request. The browser test only sees this after animations
settle: a closing sheet is still visible for 300 ms, and the first version of the test
passed against the defect for that reason.
**Android back closed the Dialog instead of the Popover inside it**, because
`BackHandler` events are not emitted while a Modal is open, so the primitive's own
listener never fires. The host forwards the Modal's request to the topmost registered
nested overlay first. Contract-tested in `lib/overlay-host.test.tsx`; the browser and
device flows prove the key paths.

**`DrawerMenu` was a Modal on Android only.** Outside Android it was a plain overlay view
with no Escape, focus trap or focus return, and git history records no reason. It is now
hosted on every platform; `e2e/overlays.spec.ts` > DrawerMenu asserts Escape, and the
existing drawer flows cover the native lifecycle.

**Found by looking at the running app, same day.** Two defects the owner saw in the iOS
simulator that no gate caught. Pressing a `Menubar` item painted it teal: five sites used
`active:bg-accent`, which is a brand colour, where `Select` already used the subtle
`active:bg-state-pressed` token — menu items, `MenubarTrigger`, `Toggle`'s press state
and `Header` actions now match. Opening a `Sheet` sent a dark layer rising from the bottom:
a `slide` Modal moves its backdrop with its panel. The host now animates nothing, and
`useOverlayPresence` — the drawer's mount-through-exit hook, generalised — fades the
backdrop in place while the panel slides. A sheet test pins the mount-through-exit
lifecycle. The pickers and the three menus still use the host's `slide`; they are
P3-02's to migrate.

**A translucent card went grey on Android.** The showcase theme's `--color-card` is
white at 72% opacity and `Card` carries an `sm` shadow, which the recipe rendered as
`elevation`. Android draws that shadow under the whole view, so it showed through the
card as a grey wash with lighter patches wherever a child covered it. iOS rendered the
same card clean. Reproduced on the emulator from the owner's screenshot. The recipe now
emits an outset `boxShadow`, which the platforms clip outside the border box, and keeps
`elevation` only on Android below 9. `lib/recipes.test.ts` pins both branches.

**Found by running the proving product on 4.2.0, same day.** A `Select` with twenty
options on a navigator-presented modal screen rendered above the screen on iOS, which
answered the audit's open question, but as one column taller than the display, pushed
under the status bar with nothing to scroll. The native primitive's viewport is a
fragment and its positioner only clamps the top edge, so a tall list simply overflows;
web caps it with the available-height variable. `SelectContent` now gives native options
a scroll owner bounded by the overlay insets. `e2e/maestro/select-long-list.yaml` opens
a forty-option list in the showcase and scrolls to the last entry.

Not changed: `AlertDialog`'s `presentation="overlay"` and `"native"` paths, which exist
for a confirmation that must be a sibling of a fullscreen Modal rather than nested inside
it. Recorded upstream risk: facebook/react-native#50152, an iOS invisible layer when a
second Modal opens while a first is closing. Nested hosts are not that sequence; the
nested flow's rapid close-and-reopen step is the check.

## Token hooks derived once — 2026-11-10

Measured before touching anything, as `PLAN.md` requires for hot paths. `useThemeColors`
parsed 104 colour strings and re-derived the palette on every render of every themed
component, and `useVisualTokens` re-parsed 83 values; neither was memoised, and 67
component files call one or both. In Node that is about 0.16 ms per component render,
0.13 ms of it colour parsing; Hermes on a phone is several times slower, so a list
screen re-rendering sixty library components spent tens of milliseconds re-deriving an
unchanged theme. Both hooks now resolve once per distinct CSS snapshot and hand back the
same object until a variable changes; the per-render cost is a 2 µs key join.
`lib/token-hooks.test.tsx` pins the referential stability and the re-derivation. The
device trace that turns this into a frame-time claim still belongs to the Phase 7 gate.

For scale, the proving product's iOS bundle attributed 269 kB of 3.98 MB to this
library plus 108 kB of culori, with all 165 modules shipped regardless of use. That is
startup weight for the Phase 4 budget task, not a snappiness lever.

## Known gap — calendar month arrows on web

`DatePickerInline`, `DatePickerModal` and `DateRangePickerModal` use react-native-calendars,
whose header draws the month arrows as focusable views with no role inside a `slider`. On
web, Tab reaches them and Enter does nothing; swiping and the day cells work. Fixing it
means replacing that header with WhileUI's own. `e2e/interaction-sweep.spec.ts` excludes
exactly these arrows and nothing else; remove the exclusion when the header is replaced.

## Known gap — overlay edge padding on web

`PopoverContent` now defaults its `insets` to safe area plus a margin, so a panel never
sits flush against a screen edge or under a notch. **That works on native only.**

`@rn-primitives/popover`'s web build destructures the prop away — literally
`insets: _insets` — and hands Radix a fixed allowlist of props with no room for
`collisionPadding`. Everything else on the component lands on an inner `View` rather than
on `Popover.Content`, so there is no route through. Measured: a popover opened near the
left edge at 412px still reports `left: 0`.

Closing it means a `.web.tsx` for `PopoverContent` talking to `@radix-ui/react-popover`
directly, which would make that package a real dependency rather than the transitive one
it is today. `PLAN.md` > Platform contract sanctions a platform file for exactly this
case — the native API being absent on the other target — so it is a cost question, not an
architecture one. `DropdownMenu`, `ContextMenu`, `Menubar` and `HoverCard` share the
primitive family and the same limitation.

## Baseline — 2026-09-12

Recorded on the Expo 57 stack after the Phase 0 upgrade. These are the numbers later
phases are measured against.

| Measure                 | Value                                                     |
| ----------------------- | --------------------------------------------------------- |
| Published tarball       | 242 KB, 754 files                                         |
| `dist/` on disk         | 3.3 MB                                                    |
| Showcase web bundle     | 3.1 MB JS + 67 KB CSS                                     |
| Showcase iOS bundle     | 4.6 MB (Hermes)                                           |
| Showcase Android bundle | 4.6 MB (Hermes)                                           |
| Public export subpaths  | `.`, `./components/*`, `./blocks/*`, `./vite`, `./tokens` |

Reproduce with `bun run build`, `npm pack` in `packages/ui`, and
`bunx expo export --platform web` / `--platform ios --platform android` in
`apps/showcase/catalog`.

**Not yet recorded:** React Doctor findings and release-build interaction traces. Both
need tooling and a device that Phase 1 sets up; they are Phase 1 exit items, not
Phase 0 blockers.

## Method

- **Families**, not symbols: the public exports collapse to 83 families once
  `*Props` types and compound parts are grouped with their parent.
- **Shipped** = at least one export imported from `@thewhileloop/whileui` in a
  production application's source. The applications themselves are listed in
  `CONSUMERS.md`, which is local.
- **Demo** = at least one export referenced in `apps/showcase/catalog`.
- **Tests** = files matching `*.test.*` in `packages/ui`. Six families have one.
