# @thewhileloop/whileui

## 4.5.0

### Minor Changes

- b1f31fb: New `KeyboardAwareScrollView`: the scroll root for a form. On iOS it insets its content
  by whatever the keyboard covers and scrolls the focused field above it, measured natively
  in window coordinates. `FormModalScreen`, `SheetContent` and `PullToRefreshScrollView` now
  do the same by default; pass `automaticallyAdjustKeyboardInsets={false}` to the last two to
  opt out.

  If a form sits in a `ScrollView` inside `KeyboardAwareScreen`, replace both with one
  `KeyboardAwareScrollView`. `KeyboardAvoidingView`, which `KeyboardAwareScreen` wraps,
  cannot see where iOS placed a native sheet, so in a `pageSheet` modal the lower fields
  stayed under the keyboard. Do not nest the two. `KeyboardAwareScreen` remains the root for
  a screen with controls docked to its bottom edge.

## 4.4.2

### Patch Changes

- 7905442: `Checkbox` draws a check mark when checked. It drew a smaller filled square inside the
  box, which read as a radio button, or as unchecked, rather than as a tick. No change at
  call sites. The README also now says that `KeyboardAwareScreen` does not scroll, so a
  form inside it needs a `ScrollView`.

## 4.4.1

### Patch Changes

- 7b6f35b: `ToastContainer` clears the safe area at its edge: below the status bar and Dynamic Island
  at the top, above the home indicator at the bottom. It sat flush with the screen edge, so
  apps padded it by hand, each by a guess, and a fixed margin left the toast under the
  Dynamic Island on newer iPhones. Remove any safe-area padding you added to it.

## 4.4.0

### Minor Changes

- 8f28463: `fabClearance(size?)` returns the bottom padding a scrolling screen needs so a floating
  `FAB` never covers its last row: the FAB's 24pt inset, its height and a 16pt gap. Lists
  behind a FAB had nothing to measure against, and their final amount or button sat under
  it. Add `contentContainerStyle={{ paddingBottom: fabClearance() }}` to those lists.
- 8f28463: `SegmentedControl` takes `wrap="scroll"`: one row, each segment as wide as its label,
  scrolling sideways when they do not fit. Four or five word-length labels do not fit a
  phone, and the alternatives were wrapping onto two rows or squeezing the text, so apps
  wrapped the control in their own `ScrollView` and overrode every segment with
  `flex-none`. Replace that with `wrap="scroll"`.
- 8f28463: `useThemeBridge` returns `toggleTheme`, which switches to the opposite of the theme on
  screen. A sun/moon button wired to `cycleMode` needed two taps on first use: the cycle goes
  light → dark → system, so from `system` its first step was to `light`, the theme already
  showing. Use `toggleTheme` for a two-state button and keep `cycleMode` for a control that
  shows all three modes. The hook is now documented under Theming in the README.

### Patch Changes

- 8f28463: `Input`, `Textarea`, `NumericInput` and `SmartInput` draw the caret and text selection in
  the theme's primary colour on iOS and Android, instead of the platform blue that ignored
  every theme. Android keeps a translucent highlight so selected text stays readable. A
  `selectionColor` or `cursorColor` you pass still wins.
- 8f28463: `Select` and `Popover` close the on-screen keyboard when they open. Both draw in a portal
  rather than a Modal, so iOS and Android left the keyboard up and it covered the lower half
  of the options: a category picker opened while typing a description showed only the first
  few choices. Once the keyboard has gone the trigger is measured again, so the panel stays
  anchored on screens that move with the keyboard. Nothing to change at call sites.

## 4.3.0

### Minor Changes

- 4019cba: The package now ships docs for AI agents in `dist/agent/`: `llms.txt` (rules, composition
  grammar and every component), `llms-components.txt` (each component's API section),
  `llms-full.txt` (the README) and `catalog.json` (the same data, structured, exported as
  `@thewhileloop/whileui/agent/catalog.json`). They are generated from the README at build
  time, so an agent always reads the docs for the installed version. Nothing changes for
  existing call sites.
- a6c9935: `Alert` takes `announce` for alerts that appear in response to an action, such as a failed
  submit. Android and the web already read an appearing alert through its live region; iOS
  has none, so `announce` speaks the alert's title and description once when it appears.
  It is off by default, so alerts that are part of a screen's content are not read aloud on
  every visit.
- 40ae57d: The built-in presets now pass WCAG AA: 4.5:1 for text, 3:1 for the focus ring. The Soft
  preset is also the runtime fallback palette, so this changes what an unthemed component
  shows.

  | Preset · mode   | Token                            | Was                                  | Now       |
  | --------------- | -------------------------------- | ------------------------------------ | --------- |
  | Soft · light    | `ring`                           | `rgba(61, 139, 255, 0.34)`           | `#3d8bff` |
  | Soft · light    | `destructive`                    | `#f66151`                            | `#d03d31` |
  | Soft · light    | `destructiveActive`              | `#e0503f`                            | `#bb261d` |
  | Soft · light    | `success`                        | `#13a86d`                            | `#00864d` |
  | Soft · light    | `info`                           | `#3d8bff`                            | `#2070e1` |
  | Soft · dark     | `ring`                           | `rgba(127, 240, 197, 0.36)`          | `#7ff0c5` |
  | Atelier · light | `primary`, `ring`                | `#b4552d`, `rgba(180, 85, 45, 0.45)` | `#af5028` |
  | Atelier · light | `mutedForeground`, `placeholder` | `#7a6a58`                            | `#716150` |
  | Atelier · dark  | `ring`                           | `rgba(232, 147, 95, 0.45)`           | `#e8935f` |

  The soft tints and borders of the changed colours follow them. A translucent ring was the
  main cause: blended onto the page it measured 1.45–2.67:1, too faint for keyboard users to
  find. To keep an old value, override that token in your theme. A unit test now keeps every
  built-in preset passing.

- 3e99a15: Add `themeFromSeeds` and `checkThemeContrast` (from the root and from
  `@thewhileloop/whileui/tokens`). `themeFromSeeds` builds a full
  light and dark theme from a background, foreground and primary colour, tuning only the
  colours it derives so they meet WCAG AA; the seeds are kept as given, and `overrides`
  replaces any base colour. `checkThemeContrast` reports every text and focus-ring pairing
  of any palette. Nothing changes for existing themes.
- cbc0cee: `Toast` now looks like the rest of the theme. Every variant renders on the `popover`
  surface; `success` and `destructive` show a status dot and tinted border instead of
  filling the whole toast with the status colour. The description uses `muted-foreground` —
  it previously referenced `success-foreground-muted` and `destructive-foreground-muted`,
  which are not theme tokens, so it was never styled.

  `ToastContainer` caps the stack at `max-w-md` and centres it, so a toast on a wide browser
  window is a notice rather than a full-width banner. Phones are unaffected.

  Toasts are now announced to screen readers without taking focus: through a polite live
  region on Android and the web, and with `AccessibilityInfo.announceForAccessibility` on
  iOS, which has no live regions. The dismiss control is a 44 px target on every platform
  with a focus ring, and the entry animation is skipped when the motion policy disables
  animation.

  No call-site change is needed. `toastVariants` is still exported for extending the variant
  styles.

### Patch Changes

- d1a1f74: Every component's props now carry doc comments, so editors show them on hover, and
  `ChatMessageBubbleProps` is exported. The README's API tables are generated from the
  props types, and 27 components that had no API section now have one.
- 0932050: The icons in `EmptyState`, `ErrorState`, `FeatureGate` and `MetricCard` are decorative and
  are now hidden from screen readers. An icon font glyph is text, so it was read inside the
  block's description. No call-site change is needed.
- cbc0cee: Icons inside buttons and navigation no longer leak into the spoken label on iOS. React Native
  builds a pressable's VoiceOver label by joining every child's text, and an icon font glyph is
  text, so a `Button` with a `ButtonIcon` was read as ", Download". `ButtonIcon` and the icon
  slots of `BottomNav`, `TabBar`, `FloatingBottomNav`, `DrawerMenu`, `ListItem` and
  `NotificationItem` are now marked `aria-hidden`. No call-site change is needed.
- cbc0cee: `FloatingBottomNav` now gives every tab an accessible name. Inactive tabs render only their icon, so VoiceOver, TalkBack and browser screen readers announced them as an unnamed "tab". Each tab now carries its `label` as `accessibilityLabel`. No call-site change is needed.
- 0932050: A `FormLabel` now names the `Input`, `Textarea` or `NumericInput` in its `FormField` on the
  web and Android (`aria-labelledby`). A `NumericInput` in a form had no accessible name on
  the web, and an `Input` was only named by its placeholder. A label you set yourself
  (`accessibilityLabel`, `aria-label`, `aria-labelledby` or `accessibilityLabelledBy`)
  still wins. A required field sets `aria-required` on the control, and the asterisk is no
  longer read as part of the label on any platform. iOS has no labelled-by, so VoiceOver
  reads the visible label just before the field. No call-site change is needed.
- 0932050: `SmartImage` now exposes its image to screen readers under its `alt` text on every
  platform. On the web `expo-image` dropped `alt` (its renderer reads only
  `accessibilityLabel`), and on iOS and Android an image is skipped unless it is marked
  accessible. An empty `alt` keeps a decorative image hidden. No call-site change is needed.

## 4.2.3

### Patch Changes

- 7d46dfa: `withWhileUIMetro` matches Windows paths, so the icon-font exemption also applies on
  Windows machines, and throws a message naming `cssEntryFile` when called without options.
  `Sheet` and `DrawerMenu` no longer report a second close when back or Escape arrives during
  their exit animation.

## 4.2.2

### Patch Changes

- b2db3f7: Theme colours, icon colours and visual tokens are now derived once per distinct theme
  snapshot and shared, instead of every component parsing 104 colour strings and 83 token
  values on every render. The hooks return the same object until a CSS variable changes,
  so callers can memoise on them. No API change.

## 4.2.1

### Patch Changes

- aa73036: On iOS and Android a `Select` whose options are taller than the screen now scrolls inside
  the listbox, bounded by the safe-area insets, instead of rendering one column that runs
  under the status bar with nothing to scroll. Web already capped the height.

## 4.2.0

### Minor Changes

- 20fb957: Fixes pulled from the first consuming application. `withWhileUIMetro` from
  `@thewhileloop/whileui/metro` wraps Uniwind's Metro config and keeps `expo-asset`,
  `expo-font` and `@expo/vector-icons` on the real `react-native`, so icon fonts load on
  device without every app copying the resolver exemption. `Alert` is an `alert` live
  region by default. `HeaderAction` accepts `accessibilityLabel` so icon-only actions have
  a name. `SelectContent` keeps its listbox inside the safe area by default. `Text` gains an
  `eyebrow` variant for the muted label above a title. `LoadingState` joins `EmptyState`
  and `ErrorState` as the in-flow placeholder for a section still fetching.

## 4.1.2

### Patch Changes

- 7c82096: Host every Modal-based overlay through one internal host so nested overlays layer and
  dismiss correctly. A Select, Popover, Tooltip or HoverCard opened inside a Dialog,
  AlertDialog, Sheet, ConfirmActionSheet, DrawerMenu, menu or picker now renders above that
  overlay on iOS, Android and web instead of beneath it; `portalHost` is only needed for a
  host you place yourself. Android back and web Escape close the innermost open layer first,
  and one Escape press no longer closes both a popover and the dialog around it. `DrawerMenu`
  is hosted in a modal on every platform, so it closes on Escape and keeps keyboard focus
  inside on web. `Sheet` fades its backdrop in place while the panel slides, instead of
  sliding the dim layer up with it, and stays mounted through its exit animation. Menu
  items, `MenubarTrigger`, `Toggle` and `Header` actions press with the subtle
  `state-pressed` token instead of the theme's accent colour. The shadow recipe emits an
  outset `boxShadow` instead of `elevation` and the legacy `shadow*` props, so a shadow
  no longer shows through a translucent surface on Android; Android below 9 keeps
  `elevation`. `DialogTitle` is now a heading. No public prop changed.

## 4.1.1

### Patch Changes

- ab026bb: Keep web Select popovers within the viewport by matching the trigger width, respecting the collision-available size, and wrapping long option labels inside the panel.
- ab026bb: Make asynchronous UI phases explicit: theme persistence now reads a replacement adapter before writing and preserves user choices made during hydration, AvatarImage and SmartImage restore loading fallbacks when a source starts loading, and existing toast timers no longer restart when the stack changes.

## 4.1.0

### Minor Changes

- 0a1061d: Add a clean composition foundation: semantic token-backed `Text`, the shared `Surface`
  primitive, inherited compound form state, and `ChatConversation` for responsive streaming
  content. `Card` now uses `Surface` internally. Optional `code` and `markdown` subpaths keep
  rich assistant content out of the root bundle; applications using Markdown install the
  optional `markdown-it` peer and continue to own links, clipboard actions, tools, sources,
  and message state.

### Patch Changes

- 0a1061d: Keep filled text-entry controls on their themed background, foreground, and caret colours
  when a web browser autofills them.
- 0a1061d: Use subtle interaction-state tokens for focused and pressed Select options, keeping
  strong accent colours from overwhelming an open menu while retaining a primary selected
  indicator. Long selected values now truncate on one line without wrapping into or
  displacing the trigger chevron.

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
