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
| Component and block families        | 82    |
| Shipped in a production application | 30    |
| Showcase demo only, never shipped   | 52    |
| Neither shipped nor demonstrated    | 0     |
| Covered by a contract test          | 11    |
| Qualifying as `stable`              | **0** |
| Qualifying as `candidate`           | 9     |

**Nine families are `candidate` as of 2026-09-29** — `Button`, `Input`, `OTPInput`,
`AlertDialog`, `SmartInput`, `KeyboardAwareScreen`, `Pressable`, `PullToRefreshScrollView`
and `DrawerMenu` each have a contract suite and a production call site. `Sheet` and
`MotionProvider` have suites but no production call site, so they stay `experimental`
with the other 71. `candidate` requires passing contract tests;
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

## Tier 2 — showcase demo only (52)

Rendered in the showcase, never used in a shipping screen. A demo proves a component
renders; only a consumer proves it is useful. These stay `experimental` until a
product pulls them, and they should not receive hardening work ahead of Tier 1.

`Accordion`, `AspectRatio`, `Avatar`, `Checkbox`, `Collapsible`, `Container`, `ContextMenu`, `Dialog`, `DropdownMenu`, `HoverCard`, `Label`, `LabeledField`, `Menubar`, `MotionProvider`, `Popover`, `RadioGroup`, `Select`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`, `Tooltip`, `View`, `ChatMessageBubble`, `CheckoutSummary`, `FeatureGate`, `MetricCard`, `PlanToggle`, `PricingCard`, `ProductCard`, `SubscriptionCard`, `UpgradeBanner`, `UsageBar`, `DateRangePickerModal`, `DatePickerInline`, `ActionBar`, `AppShell`, `ConfirmActionSheet`, `ContentSkeleton`, `ErrorState`, `LoadingScreen`, `ScreenSkeleton`, `Sheet`, `ListItem`, `NotificationItem`, `TimelineFeed`, `SmartImage`, `BottomNav`, `FloatingBottomNav`, `Header`, `TabBar`, `SplashScreen`

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

- `useInteractionTokens` hardcodes its fallbacks inline (`0.82`, `0.92`, `140`) instead
  of declaring them in `visual-token-contract.ts` like every other `--ui-*` token. Two
  sources of truth for the same values — a Phase 4 token item.
- Uniwind resolves CSS variables from Metro-compiled CSS, which Jest cannot produce, so
  the harness stubs `useCSSVariable`. Components therefore exercise their fallback path
  under test. Real token resolution is proven by the browser and device layers, not here.
- `KeyboardAwareScreen`'s actual contract — which `KeyboardAvoidingView` behaviour each
  platform gets — is not unit-testable. `KeyboardAvoidingView` consumes the prop rather
  than forwarding it, and RNTL v14 can only query host elements. Its suite covers
  rendering only; keyboard avoidance is a native E2E gate.
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

| Role                 | Where                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `button`             | Every trigger and close (`Dialog`, `AlertDialog`, `Sheet`, `Collapsible`, `Accordion`, `DropdownMenu`, `ContextMenu`, `Menubar`, `Toast`, `Header`, `DrawerMenu`, both date pickers) |
| `menuitem` + `menu`  | `DropdownMenu`, `ContextMenu`, `Menubar` items and their panels                                                                                                                      |
| `tab` + `tablist`    | `Tabs`, `BottomNav`, `TabBar`, `FloatingBottomNav`                                                                                                                                   |
| `radio`              | `RadioGroup` items, with `aria-checked`                                                                                                                                              |
| conditional `button` | `ListItem` and `NotificationItem` — only when a handler was passed; a static row is not a control                                                                                    |

Two backdrops turned up in the same audit (`ConfirmActionSheet`, `DrawerMenu`) and got
`accessible={false}` rather than a role.

Twenty role-less elements remain, all in showcase demo markup: Forms (7), Lists (6),
Commerce (3), Profile (3), Navigation (1). `e2e/keyboard.spec.ts` asserts zero on the
first screen, so the chrome cannot regress.

**Still not fixed — `Escape` is ignored while a modal animates in.** React Native Web arms the handler
from `onShow`, which fires when the entry animation _ends_ (`ModalContent.js` listens on
`keyup` gated by `active`). A user who hits Escape immediately gets nothing. The suite
waits for animations to settle and says why; whether to work around it is a Phase 3
overlay-coordinator decision.

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
`apps/showcase`.

**Not yet recorded:** React Doctor findings and release-build interaction traces. Both
need tooling and a device that Phase 1 sets up; they are Phase 1 exit items, not
Phase 0 blockers.

## Method

- **Families**, not symbols: the public exports collapse to 80 families once
  `*Props` types and compound parts are grouped with their parent.
- **Shipped** = at least one export imported from `@thewhileloop/whileui` in a
  production application's source. The applications themselves are listed in
  `CONSUMERS.md`, which is local.
- **Demo** = at least one export referenced in `apps/showcase`.
- **Tests** = files matching `*.test.*` in `packages/ui`. Six families have one.
