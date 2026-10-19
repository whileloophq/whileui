# @thewhileloop/whileui

## 4.0.0

### Major Changes

- e9a77b2: Press, disabled, and motion timing are no longer CSS variables.

  `useInteractionTokens` now always returns `INTERACTION_TOKENS`. A generated theme never
  emitted these names, and reading them made Uniwind warn at startup before falling back
  to the same numbers.

  Delete these from any theme that set them. Nothing reads them anymore:

  - `--ui-press-opacity`, `--ui-press-opacity-strong`
  - `--ui-disabled-opacity`, `--ui-disabled-opacity-soft`, `--ui-disabled-opacity-subtle`
  - `--ui-inactive-opacity`
  - `--ui-motion-fast`, `--ui-motion-normal`, `--ui-motion-slow`
  - `--ui-motion-spring-damping`, `--ui-motion-spring-stiffness`, `--ui-motion-spring-mass`
  - `--ui-drawer-open-duration`, `--ui-drawer-close-duration`

  `MotionProvider` still selects system, reduced, full, or disabled motion. It no longer
  applies `--ui-motion-*` overrides. To change a duration or a press opacity, edit
  `INTERACTION_TOKENS`; a preset cannot.

### Minor Changes

- 9d9e186: Add `FAB` and `FABGroup`, a floating action button.

  Pulled by a consuming app that had written its own: a primary action raised above the
  content is the shape most product screens end up needing, and every app re-deriving the
  size, the shadow and the accessible name is how they drift apart.

  ```tsx
  <FAB label="New group" onPress={create}>
    <Feather name="plus" size={24} color={icons.primaryForeground} />
  </FAB>
  ```

  `label` is required, because a FAB is an icon with no text and would otherwise announce
  as an unlabelled button. Sizes are 48 / 56 / 64, all of which clear the iOS 44pt and
  Android 48dp minimums on their own, so a FAB never needs `hitSlop`. `placement` defaults
  to floating bottom-right and can be set to `inline` for callers that position it
  themselves.

  It owns no icon dependency: the glyph is children, coloured from `useIconColors()`,
  because icon libraries need a concrete colour rather than a class.

- e9a77b2: Add `createThemePreset`, which builds a theme preset from the 25 base colours and
  derives the other 27.

  `ThemePreset.visual` has always been `Partial`, but `light` and `dark` are the full
  52-key `ThemeColors`. Writing the literal therefore asks an author for every active
  variant, soft variant, overlay, surface, interaction state and shadow — the values
  `deriveThemeColors` already computes from the palette — and nothing in the type points
  at that helper. The predictable outcome is a hand-written derivation that drifts from
  the library's own; the bundled Atelier preset is 110 lines for this reason.

  ```ts
  const preset = createThemePreset({
    name: 'acme',
    description: 'Acme brand palette.',
    light: lightBaseColors, // 25 keys
    dark: darkBaseColors,
    visual: { radiusLg: 12 }, // optional
  });
  ```

  Nothing is removed: `ThemePreset` keeps its shape, and existing literals still compile.
  Override a derived value by assigning to the returned preset.

- b275324: Add `TimePickerModal` and `TimePickerTrigger`, the time half of `DatePickerModal`.

  A form with a date field almost always has a time field beside it, and until now that
  second field was a typed `HH:MM` box — a consuming app shipped exactly that. The picker
  is two wheels (three with AM/PM) in the same bottom sheet as the date picker, so both
  fields open the same way.

  ```tsx
  <TimePickerModal
    value={time}
    onValueChange={setTime}
    open={open}
    onOpenChange={setOpen}
    trigger={<TimePickerTrigger value={time} placeholder="Pick a time" />}
  />
  ```

  `value` is always `HH:MM` in 24-hour form; `hourCycle` chooses the wheels (12-hour with
  AM/PM, or 24-hour) and defaults to the device locale's clock. `minuteStep` coarsens the
  minute wheel. Each wheel is one `adjustable` element for VoiceOver, TalkBack and the
  keyboard, so sixty minute rows never become sixty tab stops.

### Patch Changes

- 9667ee7: Correct the Uniwind setup instructions in the README, which did not work as written.

  - `withUniwindConfig` was shown curried — `withUniwindConfig(options)(config)`. Its real
    signature is `withUniwindConfig(config, options)`, so the documented form throws while
    wiring up Metro. If you copied it, pass the config first.
  - The `global.css` example omitted `@source './node_modules/@thewhileloop/whileui/dist';`.
    Tailwind does not scan `node_modules`, so without that line this package's class names
    are never detected and every component renders unstyled, with no error to explain it.
    Add it to any app that installs WhileUI from npm.

  No runtime code changed.

## 3.0.0

### Major Changes

- 86bd26c: Move the supported runtime to Expo 58, React Native 0.88 and React 19.3. Consumers must
  upgrade those packages together with the matching Gesture Handler, Reanimated,
  Worklets, safe-area and screens versions before installing this release. Ref types now
  use React Native's public strict-API instance types so generated declarations remain
  portable on the Expo 58 stack. `ThemeBridge` no longer accepts the redundant
  `onModeChange` prop; use the controlled `mode` prop or `useThemeBridge` when the caller
  needs to observe and change theme state.

  Date-picker draft state now resets at the session boundary without an effect-delayed
  frame, drawer sections are virtualized, and complex input/render paths are split into
  focused hooks and components without changing their public behavior.

## 2.0.0

### Major Changes

- 22e57f7: Make scrolling inside `Sheet`, `DrawerMenu` and `PullToRefreshScrollView` predictable.
  - **A drag across a `Sheet` or `DrawerMenu` backdrop no longer closes it.** The backdrop
    is a full-screen `Pressable`, and a press stays alive while the finger stays inside it,
    so any swipe that started and ended on the backdrop counted as a tap. A user trying to
    scroll a half-height sheet would dismiss it instead. Only a tap closes it now.
  - `SheetContent` accepts `ScrollView` props, enables nested scrolling, keeps taps on
    inputs with the keyboard open, and merges your `contentContainerStyle` after its own
    padding.
  - `DrawerMenu` scrolls its sections instead of clipping a long menu, slides in from the
    right under RTL, and follows the motion policy for its timing.
  - `PullToRefreshScrollView` bounces on short content so it can still be pulled, no
    longer accepts a competing `refreshControl`, and offers a **Refresh** accessibility
    action so screen reader users can refresh without dragging.

  Nothing to change at call sites unless you passed `refreshControl`. Remove it; the
  component owns that control.

- 01729de: Remove two pieces of public API that did nothing.
  - `ButtonIcon` no longer accepts `position`. React Native has no `order`, so placement
    always came from where the icon sat among the button's children — the prop was
    destructured and discarded. Remove it from call sites; nothing about the rendering
    changes.
  - `useResolvedThemeColors` is gone. It was an alias of `useThemeColors`, marked
    `@deprecated`, and had no callers. Use `useThemeColors` or `useThemeTokens`.

### Minor Changes

- 1a91537: Add `MotionProvider` and `useMotionPolicy`: one policy for system reduced motion, explicit
  `reduced` and `full` overrides, and a deterministic `disabled` mode for tests.

  The provider is optional. Without it, `useMotionPolicy` returns the default policy — the
  token defaults, with Reanimated following the system setting — so existing apps keep
  working. Wrap the root in `<MotionProvider>` to have `--ui-motion-*` overrides and the
  non-Reanimated reduced-motion paths (web transitions, drawer timing) honoured too.

- 01729de: Give every interactive component a visible focus indicator on web.

  Several components removed the browser's focus outline with `outline-none` and replaced
  it with nothing — `Input`, `Textarea`, `NumericInput` and `SmartInput` among them — so a
  keyboard user tabbing to them saw no focus at all. That is a WCAG 2.4.7 (Focus Visible,
  AA) failure, and an automated accessibility scan cannot detect it.
  - New `focusRing` and `focusRingInset` exports, applied across `Button`, `Input`,
    `Textarea`, `NumericInput`, `SmartInput`, `Select`, `Checkbox`, `Switch`, `RadioGroup`,
    `SegmentedControl`, `Toggle`, `ToggleGroup` and `Tabs`. Use them on your own controls
    instead of a bare `outline-none`.
  - Driven by `--color-ring` and scoped to `:focus-visible`, so the ring follows your theme
    and does not appear after a mouse click.
  - `focusRingInset` drops the offset for controls sitting flush inside a track, where an
    offset ring would be clipped.

  Tabbing the whole showcase is now asserted in the browser suite.

- 1a91537: Add shared, motion-aware press feedback to `Pressable` and migrate `Button` and
  `PlanToggle` to it.
  - `Pressable` takes `feedback` (`none` | `default` | `strong`, default `none`) for the
    pressed opacity and `disabledFeedback` (default `default`) for the resting opacity while
    disabled or loading. A disabled `Pressable` is now dimmed by default; pass
    `disabledFeedback="none"` to keep it at full opacity.
  - `loading` on `Pressable` and `Button` is one busy, disabled state: it blocks input,
    exposes `busy` and `disabled` to assistive technology, and on `Button` shows a spinner
    without changing the control's size or accessible name.
  - Feedback changes opacity only, never layout. Native reads React Native's press state
    directly; web adds a CSS opacity transition that follows the motion policy.

- 01729de: Make the catalog reachable by screen reader and keyboard.

  `Pressable` carries no `accessibilityRole` of its own, and React Native Web renders a
  role-less `Pressable` as a `div` with `tabindex` — focusable, announced as nothing, and
  **not activatable by Enter or Space**. That described most interactive elements here.
  - Roles added across 29 components and blocks: `button` on every trigger and close,
    `menuitem` on menu items (with `menu` on their panels, which ARIA requires),
    `tab`/`tablist` on `Tabs`, `BottomNav`, `TabBar` and `FloatingBottomNav`, `radio` on
    `RadioGroup` items. `ListItem` and `NotificationItem` take a `button` role only when
    given a press handler — a static row is not a control.
  - `Checkbox`, `Switch` and `SegmentedControl` now set `aria-checked`. React Native Web
    no longer derives it from `accessibilityState`, so assistive technology could not tell
    a checked control from an unchecked one. `SegmentedControl` was also sending
    `selected`, which ARIA does not allow on `role="radio"`.
  - Overlays no longer swallow their own contents. Backdrops and panels built from
    `Pressable` were accessibility elements, and on iOS an accessibility element hides its
    descendants — VoiceOver reached an open dialog as a single "dismiss" target and could
    not get to the buttons inside it. Fixed in `AlertDialog`, `Dialog`, `Sheet`,
    `DropdownMenu`, `ContextMenu`, `Menubar`, `ConfirmActionSheet`, `DrawerMenu` and both
    date-picker modals.
  - `AlertDialog` announces as an `alert`, names itself from its title, keeps VoiceOver
    inside the panel, and marks its title as a heading. Menu section labels are headings
    too.
  - `Progress` and `Spinner` carry a default `accessibilityLabel`; a `progressbar` with no
    name fails WCAG 4.1.2. Override it with what is actually loading.

- c8c9409: Add `Container`, a centred content column with a maximum width.

  Phone-first layouts stretch to whatever the viewport is. That is correct at 390px and
  wrong at 1600px: line lengths become unreadable and related controls drift apart. Web is
  a production target here, so every screen owed a fix and nothing in the package owned
  content width — `AppShell` had no width handling at all.

  ```tsx
  <Container size="lg">{children}</Container>
  ```

  `sm` for forms and auth, `md` (default) for most screens, `lg` for dashboards, `xl` for
  wide tables, `full` to opt out. `fill` adds `flex-1` for a container used as a screen
  root.

  There is no platform branch and none is needed: every size is wider than any phone, so
  on iOS and Android the cap never engages and it renders as a plain full-width `View`.
  The same component is a no-op on native and the whole fix on desktop.

  For a scroll view, put the column on the content container instead, so the scrollbar
  stays at the window edge:

  ```tsx
  <ScrollView contentContainerClassName="w-full max-w-5xl self-center" />
  ```

### Patch Changes

- 01729de: Fix four defects found by type-aware linting.
  - `SelectTrigger` and `SelectItem` dropped a caller's `style` function. Their props
    accept `style` as a `(state) => ...` callback, but the implementation put it into a
    style array, where React Native ignores a function. Resolved inside a state callback
    now.
  - `useThemeBridge` could leave an app on its loading gate forever: a rejected
    `loadThemeMode` never set `hydrated`. It now falls back to the initial mode.
  - `SmartInput` mirrored a controlled `value` into state through an effect, so the
    rotating placeholder animated for one extra frame over text the user had already
    typed. It is derived now.
  - `AlertDialog` read `nativeCopyRef.current` in effect cleanups that may have run after
    the ref moved on.

  `PullToRefreshScrollView` also declares `onRefresh: () => void | Promise<void>`. Every
  real handler is async, and the narrower type silently accepted one and discarded its
  rejection. Nothing awaits it — drive the spinner with `refreshing` and catch your own
  errors.

- 1a91537: Require `expo-image`, which is statically used by root-exported media and commerce components. This prevents consumers from installing a configuration that passes package checks but crashes when the native module is unavailable.
- 01729de: Nothing changed in the library here, but the showcase theme carried a defect worth
  knowing about if you copied its tokens: `--color-popover` had an alpha channel, so every
  overlay drawn on it — `Select`, `Popover`, `DropdownMenu`, `ContextMenu`, `Menubar`,
  `HoverCard` — let page content read straight through it.

  A popover floats over arbitrary content, unlike a card, which sits over the page's own
  backdrop. It has to be opaque. Translucent surfaces belong to
  `--color-surface-translucent` and the `frosted` props, which draw a blur behind
  themselves to stay readable.

- 01729de: Halve the published package. `src/` is not shipped, so every source map pointed at files
  no consumer has — 302 of the 604 files in the tarball. Maps are no longer emitted:
  604 → 304 files, 203 kB → 122 kB.
- 01729de: Fix `SelectValue` rendering unstyled text on web.

  Neither `className` nor `style` reached the rendered element. The web build of
  `@rn-primitives/select` wraps a Radix span in a `Slot.Text`, which drops React Native
  props — so the value and placeholder fell back to the user-agent default black. On a dark
  theme that measured 1.2:1 against the surface, which is unreadable.

  `SelectValue` now sets the colour on a wrapper and lets it inherit, which reaches the
  text on both platforms. Measured at 6.5:1 after the fix.

- 1a91537: Declare React Native Gesture Handler as a peer so future gesture-driven components use
  the supported native interaction foundation without changing the package contract later.
- b138394: Build the published types with TypeScript 6.

  Expo SDK 57 pins `typescript@~6.0.3`, and the rule in `AGENTS.md` is that the SDK's pin
  wins for anything it bundles. The library was still emitting `dist/*.d.ts` from 5.9,
  which meant the types a consumer installed were produced by a different compiler than
  the one their app typechecks with.

  Nothing in the public API changed. If you are on the supported stack you need to do
  nothing; `expo install --fix` already moves you to TS 6.

  Two things to know if you hit the migration yourself:
  - TypeScript 6 no longer includes `@types/*` packages automatically. Name them in
    `compilerOptions.types` (`["jest", "node"]`) or every test global becomes
    `Cannot find name`.
  - A workspace-level `typescript` pin overrides the root one, and a stale copy under
    `node_modules` survives an install that reports no changes. Confirm with
    `bunx tsc --version` inside the workspace, not at the root.
