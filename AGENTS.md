# Agent Rules — WhileUI

Rules for AI agents and contributors editing this codebase. Follow every rule. No exceptions on docs.

**Read `ROADMAP.md` and `PLAN.md` first.** The roadmap states what this package
owns versus delegates, and why. `PLAN.md` states the supported stack, the
platform and accessibility contracts, what evidence a change owes, and the phase
sequence. These rules are how. Where they disagree with either document, those
documents win and these rules are stale — fix them.

## One renderer, three targets

Why React Native is the only renderer, and why iOS, Android and web are all production
targets, is `ROADMAP.md` > Active renderer. The rule when editing: do not add a parallel
DOM or Capacitor implementation.

One public contract, not one implementation. A `.native.tsx` / `.web.tsx` split
is correct when the browser has a different semantic primitive, when the native
API is mocked on web (`KeyboardAvoidingView`, `BackHandler`, `Keyboard`) or
absent (`RefreshControl`), or when accessible behaviour would otherwise regress.
It is not correct to shorten a file or to ship a different visual design — use
Uniwind's `ios:` / `android:` / `web:` / `native:` selectors for that.

## Map and commands

Bun workspace (`bun@1.3.9`). Never run `yarn` here.

| Path                                     | What                                                           |
| ---------------------------------------- | -------------------------------------------------------------- |
| `packages/ui/src/components/`, `blocks/` | React Native components and application-shaped blocks          |
| `packages/ui/src/lib/`                   | Token contracts, recipes, theme helpers and React Native hooks |
| `packages/ui/src/tokens.ts`              | Renderer-free entry → `@thewhileloop/whileui/tokens`           |
| `apps/showcase/`                         | Expo showcase, port 8082                                       |
| `fixtures/`                              | Consumer smoke fixtures — type-smoke, vite-smoke (RNW)         |
| `eslint.config.mjs`                      | One flat config for every workspace, fixture and config file   |
| `e2e/`                                   | Playwright specs, config and axe scan — browser evidence       |
| `e2e/maestro/`                           | Native flows — the platform accessibility tree                 |
| `scripts/verify-package.mjs`             | Packs and inspects the tarball a consumer would install        |
| `docs/review-perspectives/`              | Per-PR review cards; `/review-perspectives` runs them          |
| `docs/stability.md`                      | Maturity of every family and the evidence behind it            |
| `ROADMAP.md`, `PLAN.md`                  | Direction; production foundation plan and phases               |
| `IMPLEMENTATION.md`                      | Resumable task ledger, evidence and next safe action           |
| `TODO.md`, `CONSUMERS.md`                | Task list; consuming apps and their flows. Gitignored — local  |

```bash
bun install
bun run typecheck             # all workspaces via turbo; includes test files
bun run lint                  # one root pass, type-aware, --max-warnings 0
bun run test                  # jest-expo + RNTL contract suites
bun run test:web              # Playwright + axe on the exported bundle (Chromium, WebKit)
bun run verify                # every gate, in order, ~80s — run before pushing
bun run verify:package        # pack a tarball and check what a consumer would install
bun run test:native           # Maestro flows against a built app (see e2e/maestro)
bun run build                 # package build; excludes tests from dist
cd apps/showcase && bun run dev
cd apps/showcase && bunx expo export --platform web   # proves it bundles
```

A consumer on a local link resolves `packages/ui/dist/` — rebuild after edits.

## Core Rules

- **Match the pinned stack** in `PLAN.md` > Supported stack. For anything the Expo SDK bundles, use the SDK's pinned version, not npm `latest`. For everything else, latest stable. Ask if unsure.
- Run `bun run format && bun run lint && bun run typecheck` after changes. Fix errors before completing.
- **Run `bun run verify` before pushing.** There is no CI — no server runs these gates for you, so a skipped run means the gate did not happen. It chains format, lint, typecheck, unit tests, build, the iOS and Android exports and the browser suite in about 70 seconds.
- **`--max-warnings 0` is deliberate** — there is no warning backlog and there should never be one. A rule that fires on something legitimate gets either a config option that describes the legitimate case, or an `eslint-disable-next-line` with a `--` reason explaining why the rule is wrong _here_. Never a bare disable, never a file-wide one, and never a rule switched off globally to clear a single site.
- **Docs are mandatory** — README is the source of truth. Incomplete doc updates = task incomplete. Never leave docs stale.
- **Avoid deprecated APIs** — Check for deprecation warnings, use recommended replacements. If a package marks an API deprecated, find the new import path or alternative.
- Don't bloat the codebase.

### Testing interactive components

Each layer proves something the one below cannot; the table is `PLAN.md` > Evidence
model. What it means in practice: `jest-expo` + RNTL cannot prove OS keyboards, Android
back, portal layering, gesture arbitration or real focus, so a change touching any of
those owes evidence from Maestro, Playwright or a named showcase step. Every fixed
defect owes a regression test at the layer that found it.

### Public repo hygiene

This repo is public. Tracked files describe the **library**, never our products.

- Do not name a consuming application, its screens, its business model or its
  file paths in any tracked file. Write "the proving product" or "a consuming
  app" instead.
- Product specifics — which apps consume WhileUI, pull order, acceptance flows,
  migration sequences — live in `CONSUMERS.md`, which is gitignored.
- A rule is only allowed in `PLAN.md` or `AGENTS.md` if it is stated generically
  enough to apply to any consumer. If it needs a product's name to make sense, it
  belongs in `CONSUMERS.md`.
- The same applies to commit messages, PR bodies and issue comments. Everything
  here is public and permanent.

### Attribution

This repo is public and MIT. Reading another project to understand how it solves
something is normal and encouraged. Copying its code is a licensing act.

- **Reimplementing from understanding** — no attribution needed.
- **Adapting code from an MIT project** (most of this ecosystem) — keep the
  copyright notice. A `/* Adapted from <project> — <url>, MIT */` header on the
  file is enough, and note it in the PR.
- **Anything not MIT/Apache/BSD** — do not adapt without checking the licence
  first.

**Never publish a claim about another project's code that you have not verified
against its source.** "Library X has no tests", "X is slow", "X doesn't handle
Y" — if you have not read their code and confirmed it, it does not go in a
tracked file. Absence from someone's docs is not evidence of absence in their
code. Where a project is named, describe it accurately and without disparagement:
what it is optimised for, and why our tradeoff differs.

Read other projects freely — that is how this one gets better. Just keep the
evaluation out of our docs. Not to hide it, but because a decision record should
stand on its own reasoning: "one styling foundation, because a second one doubles
the token and debugging model" is complete, stays true, and does not go stale the
moment someone else ships a release. Comparisons age badly and invite argument we
gain nothing from.

This applies to commit messages and issue comments as much as to docs —
everything here is public and permanent.

## Releasing

`@thewhileloop/whileui` is published to npm and our own apps install it from there, so
a publishing mistake is a product bug. Versions are managed with Changesets.

1. **Write a changeset in the same change as the code.** `bun run changeset`, pick the
   bump, describe it for someone upgrading — what changed, what they must do, why. A
   `major` entry that does not say what to fix at the call site is not finished.
2. **Run `bun run verify`.** It is the whole gate, including `verify:package`, which
   packs a real tarball and checks what a consumer would actually install.
3. **`bun run release:version`** applies pending changesets: bumps the version and
   writes `CHANGELOG.md`. Review the diff — this is the last point the bump is cheap to
   change.
4. **`bun run release`** re-verifies, then publishes.

Notes:

- **Breaking changes are cheap, not invisible.** We own every consumer, so refactor
  freely — but a product pinning an older version has to be able to read why.
- The changelog is public. Same rule as commit messages: describe the library, never a
  consuming product.
- Bump the version only through Changesets. Hand-editing `version` loses the changelog
  entry that explains it.

## Documentation

**Rule:** When you add, remove, or change a component or block, you MUST update README in the same change. Do not defer. Incomplete doc updates = task incomplete.

**Docs:** README only. Components table, blocks table, API Reference, Flow Patterns, Quick Reference.

**Cross-references:** Fix broken links.

### When Adding a Component or Block (all required)

1. Export from its own `index.ts` — `packages/ui/src/components/<name>/` or
   `packages/ui/src/blocks/<category>/` — and re-export from `packages/ui/src/index.ts`
2. Add it to the README components or blocks table
3. Document its props — README API Reference for a component, Blocks API for a block
4. Add a demo to `apps/showcase`
5. Declare its maturity level (`PLAN.md` > Maturity and lifecycle). Anything new starts
   `experimental`; a showcase demo alone never makes it `stable`
6. A block that introduces a new flow also goes in the README Flow Patterns table

**Do not skip steps 2–4.** Missing doc or showcase entry = incomplete.

### When Extracting From an App

A block extracted from an app is not done until the app imports it. In the same
change, switch the app's call site to the block — or add a dated entry to that
app's backlog. The showcase demo proves the block renders; only a consumer
proves it is used. Four commerce blocks were once built for a consuming app and
never imported; that is the failure this rule exists to prevent.

### When Changing Props or Removing

- **Props:** Update README API section, Blocks API, and demo code
- **Removing:** Remove from README (all sections) and the showcase. No orphan references

## Uniwind Configuration

- `global.css` at **app root** (not `src/`) — Tailwind scans from its location
- `withUniwindConfig` must be **outermost** wrapper in `metro.config.js`
- Import `global.css` in `App.tsx` (not `index.ts`) for HMR
- `cssEntryFile` must be **relative path string** (`'./global.css'`)
- Monorepos: use `@source '../../packages/ui/src';` in CSS
- Docs: https://docs.uniwind.dev/llms-full.txt

## Theme System

- Use `useUniwind()` + `Uniwind.setTheme()` — NOT local React state
- Components use semantic classes (`bg-background`, `text-foreground`) — no theme code in UI library
- Custom themes: register in `metro.config.js` with `extraThemes`, define in `global.css` using `@variant`
- **OKLCH color format**: Use `oklch(L C H)` for all color values (better perceptual uniformity)
- Theme colors MUST be wrapped in `@layer theme { :root { @variant light/dark { ... } } }`

### Design Tokens (in `@theme` block of `global.css`)

All visual properties are controlled via design tokens. To redesign the theme, modify
`global.css` only — no component changes needed. The token categories and the utilities
they drive are documented in README > Theming.

The TypeScript contracts (`theme-contract.ts`, `visual-token-contract.ts`, `theme-derive.ts`, `theme-presets.ts`) are canonical for token **names, types and derivation**. An app's CSS variable block is generated from a preset via `themePresetToCss` into a `theme.generated.css` it imports; generated files are never hand-edited. An app's own `@theme` scale, fonts and custom variants stay hand-authored — we generate the contract, not the design.

### Theme Color Tokens (per `@variant`)

`theme-contract.ts` is the canonical list — every token, in both `light` and `dark` and
any custom theme. Read it there rather than from a copy that goes stale. Each colour
token needs its `*-foreground` pair for text on that background.

### Font Weight Mapping

React Native requires explicit font-family per weight. When changing fonts, update BOTH `--font-sans` in `@theme` AND the `.font-*` CSS classes in `global.css`.

Apps using custom fonts must wrap the app in `FontProvider` with a `FontFamilyMap` (see `font-context.ts`). Text, ButtonText, and Label use `useResolveFontFamily()` to apply the correct font via the `style` prop and strip font-weight classes from `className` so Uniwind doesn't override. **Do not pass `fontWeight`** in the style—with discrete font files (e.g. Nunito_700Bold), the family name encodes weight. Passing `fontWeight` on Android triggers synthetic bold and distorts B, D, P, R.

## Component Patterns

### Variant API with tv()

All components use `tailwind-variants` for styling:

```tsx
const buttonVariants = tv({
  base: 'rounded-md font-medium',
  variants: {
    variant: { default: 'bg-primary', outline: 'border' },
    size: { sm: 'h-8', md: 'h-10' },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});
```

Export `*Variants` for consumers who want to extend styles.

### Text Children Handling

Components accepting children must handle both strings and elements:

```tsx
{
  typeof children === 'string' ? <Text className="...">{children}</Text> : children;
}
```

Applies to: AvatarFallback, DropdownMenuLabel, AlertDialogAction/Cancel, etc.

### Context-Based Variant Inheritance

Parent components (Button, Badge, Toggle) provide Context so child text components auto-inherit `variant`:

```tsx
const ButtonContext = createContext({ variant: 'default', size: 'default' });
// ButtonText uses useContext(ButtonContext)
```

### asChild Gotchas

- `cloneElement` doesn't work with complex components (Context.Provider wrappers)
- Don't use `asChild` with `View` — it lacks `onPress`/`onLongPress`
- Prefer wrapping children in Pressable over cloneElement injection

### React Native Limitations

- SafeAreaView: use `react-native-safe-area-context` (RN's deprecated)
- **CSS box-shadow**: Not supported. Use `shadow-sm/md/lg` classes (soft shadows) or stacked Views for hard-edge 3D effects (NeoPOP style)
- **Icon colors**: `@expo/vector-icons` requires hex values, not CSS classes. Use `useIconColors()` from the UI package (reads from global.css via `useCSSVariable`)
- **Other RN primitives requiring hex**: Spinner defaults to `useThemeColors().foreground`. Input, Textarea, NumericInput, SmartInput default `placeholderTextColor` to `mutedForeground`. Add optional override props when needed.
- **Custom fonts on Android**: Pass only `fontFamily` in style—never `fontWeight`. Passing both triggers `setTypeface(_, BOLD)` and synthetic bold, distorting B/D/P/R. Use `FontProvider` + `useResolveFontFamily` (Text, ButtonText, Label).

### Content width is nobody's job by default

A phone-first layout stretches to whatever the viewport is. That is right at 390px and
wrong at 1512px — line lengths run away and related controls drift apart. Nothing owned
this until `Container`, so every screen in every app had the bug.

- Screens get `<Container size="lg">`; forms and auth get `sm`.
- A **scroll view puts the column on its content container**, not on itself —
  `contentContainerClassName="w-full max-w-5xl self-center"` — otherwise the scrollbar
  floats in the middle of the column instead of sitting at the window edge.
- **Prefer a constraint that is inert on the other platform over a platform branch.**
  Every `Container` size is wider than any phone, so the cap never engages on iOS or
  Android and it renders as a plain `View`. One component, no `.native` / `.web` split,
  no `Platform.OS`. Reach for this before reaching for a seam.

### Responsive & Multi-Target

Use `Platform.OS` only for behaviour that truly differs,
`useWindowDimensions` for responsive layout, and the Uniwind `web:` variant for
web-specific styling. Web is a production target, not a preview: it needs
visible focus, keyboard operation and hover that never replaces the shared
interaction.

## UI Standards

- Overlays (Dialog, Popover, Menus): `rounded-lg`
- Controls (Button, Input, Select): `h-10`
- Cards: `rounded-xl`

### Touch Targets

Per-platform minimums and the drag-alternative rule live in `PLAN.md` > Accessibility
and input contract. What that contract means in this codebase:

- Keep the visual size; reach the minimum with `hitSlop` or padding.
- Icon-only buttons: `h-11 w-11` (44px) plus `hitSlop` to clear 48dp on Android.
- Small buttons: `h-9` minimum (36px visual) — `hitSlop` is mandatory, not optional.

### Preventing Layout Shift

- **Never toggle font-weight** for active/inactive states — causes width jump
- Use **color-only differentiation** (e.g., `text-primary` vs `text-muted-foreground`)
- Keep `font-medium` constant across states

### Press Feedback

- Always provide tactile feedback on interactive elements
- Buttons: `active:bg-*/90` (slight darken)
- Nav items: `active:opacity-70`
- Floating elements: `active:scale-95`

## Self-Improvement

Add to this file when you discover:

- Configuration gotchas (one-liner under relevant section)
- Reusable patterns (with minimal code example)
- Root causes of bugs (symptom → cause → fix)

**Keep entries concise. Consolidate similar issues. Delete outdated rules.**

### Core component robustness

- **Android font B/D distorted:** Symptom: bold/semibold custom fonts render B, D, P, R incorrectly on Android only. Cause: passing `fontWeight` with `fontFamily` triggers synthetic bold. Fix: use `FontProvider` + `useResolveFontFamily` (applies only `fontFamily` via style, strips font-weight from `className`).
- **Text/label line-height:** Avoid `leading-none` — clips ascenders (P, h, l). Use `leading-tight` or `leading-snug` for labels.
- **Form-like visibility:** Use `border-border bg-muted` (not `border-input bg-background`) for inputs, selects, labeled fields — ensures visibility on light themes.
- **Small touch targets:** Components under the platform minimum (e.g. Checkbox h-5, Radio h-5, Switch h-7) need `hitSlop` so the effective area clears 44pt on iOS and 48dp on Android.
- **Focus indicators: use `focusRing`, never bare `outline-none`.** Import it from `lib/focus-ring` (it is exported publicly too). The old rule here said to add `outline-none` to kill the browser's doubled-up outline — and taken literally it produced components with **no focus indicator at all**, a WCAG 2.4.7 AA failure that axe cannot detect. `focusRing` removes the default _and_ draws a themed `:focus-visible` ring in one class. `focusRingInset` is the same without the offset, for controls sitting flush inside a track (segments, tabs). `:focus-visible`, not `:focus`, so a mouse click does not leave a ring behind. A visually hidden input is the one exemption — its visible proxy must show the focus instead, as `OTPInput` does with its cursor.
- **Pressable has no default role:** Symptom: a custom control is announced as a plain view by VoiceOver/TalkBack, and `getByRole('button')` fails. Cause: `Pressable` sets no `accessibilityRole`. Fix: set it explicitly before spreading `{...props}` so callers can still override.
- **A Pressable used as a container hides everything inside it:** Symptom: VoiceOver reaches an overlay as one element and cannot focus the buttons within. Cause: `Pressable` defaults to `accessible: true`, and on iOS an accessible view is a single accessibility element whose descendants are not individually reachable. Every backdrop and panel built from `Pressable` — tap-to-dismiss backdrops, panels whose only `onPress` is `stopPropagation` — hits this. Fix: `accessible={false}` on both, plus `importantForAccessibility="no"` on the backdrop. **Only iOS catches it.** RNTL finds descendants regardless of an ancestor's `accessible` prop; React Native Web keeps them in the DOM; Android leaves every node in the UIAutomator tree. On iOS the descendants vanish from the accessibility tree entirely — `e2e/maestro/alert-dialog.yaml` fails without the fix and passes with it. Run `maestro --platform ios test e2e/maestro` when touching an overlay container.
- **A full-screen `Pressable` backdrop treats a swipe as a tap:** Symptom: scrolling a half-height sheet closes it. Cause: a press stays alive while the finger stays inside the view's bounds, and a backdrop's bounds are the whole screen. Fix: `useTapOnly` from `lib/tap-only`, which drops a press whose finger moved past the touch slop. Found by Maestro on Android; RNTL cannot see it.
- **Section headings need `accessibilityRole="header"`:** Dialog titles and menu section labels announce as plain text without it, and rotor navigation cannot find them.
- **No role means no keyboard on web:** React Native Web renders a `Pressable` without `accessibilityRole` as `<div tabindex="0">` — Tab reaches it, but Enter and Space do nothing, because RNW only attaches key handling to real roles. A missing role is a keyboard-operability bug, not just an announcement one.
- **React Native Web dropped `accessibilityState` → `aria-*` derivation:** `accessibilityState={{ checked }}` no longer emits `aria-checked`, so `role="checkbox"`, `"switch"` and `"radio"` fail ARIA validation. Set `aria-checked` as well; React Native maps the `aria-` form on native, so one prop serves both.
- **`Escape` does nothing while a modal animates in:** RNW arms the handler from `onShow`, which fires when the entry animation ends. Tests must wait for animations to settle; users just press it again.

### Tooling gotchas

- **Generated nested worktrees must not enter repository-wide gates:** Local orchestration can place a second checkout under `.delta/`; without explicit formatter, ESLint and Git ignores, the root pass scans two TypeScript project roots and fails before linting source. Keep `.delta/` excluded and never treat it as package code.
- **A linked consumer on a different React Native version silently loses Uniwind's `className` props from our types:** Symptom: the app accepts `contentContainerClassName` on a bare `ScrollView` but rejects it on a WhileUI component whose props `extend ScrollViewProps` — with no hint that a version is involved. Cause: Uniwind adds those props by augmenting `react-native` (`declare module 'react-native'`), and an augmentation attaches to the copy of `react-native` that resolves from the augmenting file. A `link:`ed package sits outside the app, so its `.d.ts` resolves the _library's_ `react-native`, which the app's Uniwind never touched. Two copies, two `ScrollViewProps`. Measured: app on 0.81.5 and library on 0.86.3 reproduced it; aligning both to 0.86.3 fixed it with no code change. This is what `PLAN.md` > Supported stack exists to prevent — a product that lags the library's stack gets type errors that look like library bugs.
- **TypeScript 6 no longer auto-includes `@types/*`:** Symptom: every `describe`, `it` and `expect` becomes `Cannot find name` the moment the SDK bump pulls in TS 6, while `@types/jest` is installed and correct. Fix: name them — `"types": ["jest", "node"]`. Measured: 132 errors → 0. A workspace that only consumes the library's _source_ should instead `exclude` its `*.test.tsx` rather than take a jest dependency it has no other use for.
- **A workspace `typescript` pin shadows the root one, and a stale copy survives `bun install`:** `packages/ui` and `apps/showcase` each declared their own `typescript`, so bumping the root changed nothing — `bunx tsc --version` still reported the old one. Worse, after the pins were corrected, `bun install` reported "no changes" while `node_modules/typescript` still held the old version, because the lockfile no longer referenced it and bun does not clean what it does not track. Check the effective version with `bunx tsc --version` **in each workspace**, and `rm -rf` the stale directory if it disagrees with the lockfile.
- **A child's stdout is truncated at 64 kB when it exits non-zero:** Symptom: `verify:package` dies with `SyntaxError: Unterminated string in JSON at position 65536`, which reads like a broken tool. Node's default `maxBuffer` is the first cause; raising it was not enough for `attw`, whose report arrives on `error.stdout` of a failing `bunx` child and was still cut at 64 kB. Fix: redirect the child's stdout to a file and read that. Any helper that parses a large report from a command that exits non-zero needs this.
- **`bun run test` hangs before a single suite starts:** Symptom: jest sits at zero CPU with a `watchman --version` child in an uninterruptible wait; `kill -9` and `watchman shutdown-server` do nothing. The jest config sets `watchman: false` so the gate cannot depend on the daemon. If you see the hang anyway, a reboot clears the daemon.
- **`"type": "module"` breaks `.js` configs:** `jest.config.js` and `babel.config.js` are parsed as ESM and fail on `module.exports`. Use `.cjs`.
- **SDK bumps must carry non-bundled packages too:** Expo pins what it bundles, but `uniwind`, `tailwindcss` and similar are on their own. Leaving one behind breaks Metro (`Invariant Violation: Unexpectedly escaped traversal`) while typecheck stays green. After any SDK bump, run an actual `expo export` — `tsc` does not exercise the bundler.
- **RN 0.86 removed `StyleSheet.absoluteFillObject`:** Use `StyleSheet.absoluteFill`, which is now the same plain (frozen) style object.
- **React Native 0.86 requires Xcode ≥ 16.1:** `pod install` raises `Please upgrade XCode` below that (`react-native/scripts/cocoapods/helpers.rb`, `min_xcode_version_supported`). An iOS native build is impossible on an older toolchain — nothing in the library can work around it.
- **`className` is silently dropped on `react-native-safe-area-context`'s `SafeAreaView`:** it is a native view, and Uniwind only wraps React Native's own components. Symptom: padding, background and any caller `className` simply do not apply — measured as literal zero padding on device. Fix: keep the safe area bare (`style={{ flex: 1 }}`) and put every class on a child `View`. Uniwind exports its own `SafeAreaView`, but it wraps React Native's deprecated one, so it is not the answer.
- **`ImageBackground` + `absoluteFill` does not fill on web:** React Native Web copies `width`/`height` from the outer style onto the inner `Image`, and `absoluteFill` carries neither — the image renders at its intrinsic size and leaves a visible seam where it ends. Put `width: '100%', height: '100%'` in `imageStyle`, which is applied last.
- **Android release packaging validates an image's bytes against its extension:** Expo's JS export can accept JPEG data named `.png`, but AAPT rejects it during `assembleRelease`. Keep the filename extension aligned with the actual encoding and include a native release build in asset-change evidence.
- **Native projects are generated, not tracked:** `apps/*/ios` and `apps/*/android` come from `expo prebuild` and are gitignored. The showcase stays a managed Expo app; never hand-edit them.
- **React 19 deprecated `React.MutableRefObject` and `React.ElementRef`:** Use `React.RefObject<T>` (its `current` is mutable now) and `React.ComponentRef<typeof X>`. `no-deprecated` catches both.
- **`eslint-plugin-react` does not support ESLint 10** (peer caps at `^9.7`), and its rules are mostly DOM JSX anyway. `react-hooks` `recommended-latest` plus type-aware `typescript-eslint` covers what matters here.
- **ESLint config lives at the root only.** Adding a per-package config or a turbo `lint` task splits the rule set and leaves `fixtures/` and root config files unlinted.

### Patterns the lint rules enforce

- **`as any` on a style prop hides a real bug.** A `Pressable`-backed component's `style` may be `(state) => ...`. Dropping a caller's function into a style array makes React Native silently ignore it. Resolve it inside a state callback instead — see `select.tsx`.
- **Never mirror a controlled prop into state via an effect.** `useEffect(() => setX(prop), [prop])` costs a frame where the UI shows the old value. Derive it: `const x = prop !== undefined ? prop : internalX`. `react-hooks/set-state-in-effect` catches this.
- **To latch state on a prop change, adjust during render, not in an effect.** `if (prev !== next) { setPrev(next); ... }` commits in the same render; an effect commits one frame late, which an entrance animation notices.
- **Copy `ref.current` into a local at the top of an effect** if the cleanup reads it. By cleanup time the ref may point somewhere else.
- **An async callback prop must say so in its type:** `onRefresh: () => void | Promise<void>`, not `() => void`. The narrow type accepts an async function and silently discards its rejection.

### Blocks vs components

- **Blocks** = copy-paste compositions. No themeability props needed — people edit the block code directly. Use semantic tokens; theme via `global.css`.
- **Components** = imported dependencies. Must be themeable (semantic classes, `*Variants` for extension).

### Where to put new things

| What                 | Path                                          | Notes                                                                                                                               |
| -------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Component**        | `packages/ui/src/components/<name>/`          | Export from `index.ts`, re-export in `packages/ui/src/index.ts`. Demo in `apps/showcase`                                            |
| **Block**            | `packages/ui/src/blocks/<category>/`          | Categories: `layout`, `navigation`, `chat`, `lists`, `commerce`, `media`, `datepicker`, `splash`                                    |
| **Auth/Profile**     | `apps/showcase/templates/auth/` or `profile/` | Copy-paste templates; NOT in core package. Import primitives from `@thewhileloop/whileui`                                           |
| **Shared hook/util** | `packages/ui/src/lib/`                        | Theme helpers, cn, portal, tv, font-context                                                                                         |
| **Tokens/contract**  | `packages/ui/src/lib/`                        | `theme-contract`, `visual-token-contract`, `theme-presets`. **Keep these free of any renderer import** — they are the portable core |

## Custom Themes (Starter Kits)

Registering an `extraThemes` entry in `metro.config.js`, defining it under
`@layer theme` in `global.css`, and switching with `Uniwind.setTheme()` are documented
step by step in README > Theming, along with frosted/translucent surfaces. The required
token list is `theme-contract.ts`. Two rules that are easy to miss:

- A custom theme must define **every** token in the contract, or components fall back to
  unstyled values at runtime with no build error.
- **Android translucent surfaces** usually need denser tint than iOS or web. Tune
  `--ui-frosted-android-tint-alpha-scale` (default `1.18`) before reaching for an
  Android-only component override.
