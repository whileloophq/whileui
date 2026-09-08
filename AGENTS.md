# Agent Rules — WhileUI

Rules for AI agents and contributors editing this codebase. Follow every rule. No exceptions on docs.

**Read `ROADMAP.md` first.** It states what each track is for, what this
package owns versus delegates, and why. These rules are how; the roadmap is why.
Where the two disagree, the roadmap wins and these rules are stale — fix them.

## Two tracks

- **DOM** — the track every current app is on or moving to: sidekick-app
  (migrating from Expo, 2026-09) and split-loop. Browser, Capacitor mobile,
  Tauri desktop; one build, no per-target UI branching.
- **React Native** — no active consumer once sidekick-app finishes migrating.
  Kept for a native-first app if one appears; not developed speculatively.

Both share the token layer. Same names and variants where a component exists on
both; the DOM track is never held back for the native one. Rules marked **[RN]**
apply only to the native track. Everything else — tokens, `tv()` variants, UI
standards, touch targets, press feedback — applies to both.

## Map and commands

Bun workspace (`bun@1.3.9`). Never run `yarn` here.

| Path                                     | What                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `packages/ui/src/components/`, `blocks/` | React Native track                                                                                    |
| `packages/ui/src/web/`                   | DOM track: `components/`, `blocks/`, `platform/`, `lib/recipes.ts`                                    |
| `packages/ui/src/lib/`                   | Shared. Token contracts, presets, `theme-derive`, `cn`, `tv` are renderer-free; the rest are RN hooks |
| `packages/ui/src/tokens.ts`              | Renderer-free entry → `@thewhileloop/whileui/tokens`                                                  |
| `apps/showcase/`                         | Expo showcase (RN track), port 8082                                                                   |
| `apps/site/`                             | Vite showcase (DOM track), port 8083. `scripts/gen-theme.ts` generates its theme CSS                  |
| `ROADMAP.md`, `TODO.md`                  | Direction, task list. `TODO.md` is gitignored — local only                                            |

```bash
bun install
bun run typecheck             # all workspaces via turbo; packages/ui checks both tsconfigs
bun run build                 # packages/ui: tsc -p tsconfig.json && tsc -p tsconfig.web.json
cd apps/site && bun run dev   # DOM showcase (runs gen:theme first)
cd apps/showcase && bun run dev
bunx react-doctor .           # run in apps/site after significant changes
```

A consumer on a local link resolves `packages/ui/dist/` — rebuild after edits.

## Core Rules

- Use **latest stable versions** of packages. Ask if unsure.
- Run `bun format && bun typecheck` after changes. Fix errors before completing.
- Run `bunx react-doctor .` after significant changes to catch performance, security, correctness, and dead code issues. Fix errors (score 75+ = healthy).
- **Docs are mandatory** — README is the source of truth. Incomplete doc updates = task incomplete. Never leave docs stale.
- **Avoid deprecated APIs** — Check for deprecation warnings, use recommended replacements. If a package marks an API deprecated, find the new import path or alternative.
- Don't bloat the codebase.

### Attribution

This repo is public and MIT. Reading another project to understand how it solves
something is normal and encouraged. Copying its code is a licensing act.

- **Reimplementing from understanding** — no attribution needed.
- **Adapting code from an MIT project** (shadcn/ui, Konsta, Radix, and most of
  this ecosystem) — keep the copyright notice. A `/* Adapted from <project> —
<url>, MIT */` header on the file is enough, and note it in the PR.
- **Anything not MIT/Apache/BSD** — do not adapt without checking the licence
  first.

Describe other projects **accurately and without disparagement**. State what a
project is optimised for and why our tradeoff differs; do not claim a limitation
that has not been verified against its source. Absence from someone's docs is
not evidence of absence in their code. This applies to commit messages and issue
comments as much as to docs — everything here is public and permanent.

## Documentation

**Rule:** When you add, remove, or change a component or block, you MUST update README in the same change. Do not defer. Incomplete doc updates = task incomplete.

**Docs:** README only. Components table, blocks table, API Reference, Flow Patterns, Quick Reference.

**Cross-references:** Fix broken links.

### When Adding a Component (all required)

1. Export from `packages/ui/src/components/<name>/index.ts` and `packages/ui/src/index.ts`
2. Add to `README.md` components table
3. Add to README API Reference if notable props
4. Add a demo to the showcase for that track — `apps/site` (DOM) or `apps/showcase` (RN)

**Do not skip steps 2–4.** Missing doc or showcase entry = incomplete.

### When Adding a Block (all required)

1. Export from `packages/ui/src/blocks/<category>/index.ts` and `packages/ui/src/index.ts`
2. Add to `README.md` blocks table
3. Add to README Blocks API section with key props
4. Add a demo to the showcase for that track — `apps/site` (DOM) or `apps/showcase` (RN)
5. If new flow: add to README Flow Patterns table

**Do not skip steps 2–4.** Missing doc or showcase entry = incomplete.

### When Extracting From an App

A block extracted from an app is not done until the app imports it. In the same
change, switch the app's call site to the block — or add a dated entry to that
app's backlog. The showcase demo proves the block renders; only a consumer
proves it is used. Four commerce blocks were built for sidekick's paywall and
never imported; that is the failure this rule exists to prevent.

### When Changing Props or Removing

- **Props:** Update README API section, Blocks API, and demo code
- **Removing:** Remove from README (all sections) and the showcase. No orphan references

> **Note.** Earlier revisions of this file also required entries in
> `apps/site/lib/registry.ts`, `demos.tsx`, `block-demos.tsx` and
> `props-data.ts`. `apps/site` was removed from the repo and those steps were
> unfollowable. If a docs site returns, restore the steps here in the same
> change — do not leave a checklist pointing at paths that do not exist.

## Uniwind Configuration **[RN]**

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

All visual properties are controlled via design tokens. To redesign the theme, modify `global.css` only — no component changes needed.

| Token Category     | Example Variables                                     | Controls                                 |
| ------------------ | ----------------------------------------------------- | ---------------------------------------- |
| **Spacing**        | `--spacing`, `--spacing-1` through `--spacing-96`     | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`      |
| **Typography**     | `--text-xs` through `--text-6xl`                      | `text-sm`, `text-base`, `text-xl`, etc.  |
| **Letter Spacing** | `--tracking-tighter` through `--tracking-widest`      | `tracking-tight`, `tracking-wide`        |
| **Line Height**    | `--leading-none` through `--leading-loose`            | `leading-none`, `leading-tight`          |
| **Border Radius**  | `--radius-none` through `--radius-full`               | `rounded-sm`, `rounded-lg`, `rounded-xl` |
| **Shadows**        | `--shadow-sm` through `--shadow-2xl`, `--shadow-none` | `shadow-sm`, `shadow-lg`, `shadow-xl`    |
| **Font**           | `--font-sans`                                         | Base font family                         |

### Theme Color Tokens (per `@variant`)

Required in both `light` and `dark` (and any custom theme):

- `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`
- `success`, `warning`, `info` (status colors)
- Each token needs `*-foreground` variant for text on that background

### Font Weight Mapping **[RN]**

On the DOM track this is a non-issue: use `font-weight` normally with a variable
or multi-weight webfont. The rest of this section is the native track only.

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

### React Native Limitations **[RN]**

- SafeAreaView: use `react-native-safe-area-context` (RN's deprecated)
- **CSS box-shadow**: Not supported. Use `shadow-sm/md/lg` classes (soft shadows) or stacked Views for hard-edge 3D effects (NeoPOP style)
- **Icon colors**: `@expo/vector-icons` requires hex values, not CSS classes. Use `useIconColors()` from the UI package (reads from global.css via `useCSSVariable`)
- **Other RN primitives requiring hex**: Spinner defaults to `useThemeColors().foreground`. Input, Textarea, NumericInput, SmartInput default `placeholderTextColor` to `mutedForeground`. Add optional override props when needed.
- **Custom fonts on Android**: Pass only `fontFamily` in style—never `fontWeight`. Passing both triggers `setTypeface(_, BOLD)` and synthetic bold, distorting B/D/P/R. Use `FontProvider` + `useResolveFontFamily` (Text, ButtonText, Label).

### Responsive & Multi-Target

Web, Capacitor mobile and Tauri desktop are all a WebView rendering the same
build. **Never branch the UI on target.** There is no "mobile version" of a
component — there is a narrow viewport and a wide one.

- **Breakpoints, not platforms.** Use CSS media queries / Tailwind variants for
  layout that changes with width (`app-shell` picks `bottom-nav` under `lg`,
  `navigation-sidebar` at or above it). Do not detect the host to decide layout.
- **Overlays** (drawers, modals, sheets): sensible defaults with room to
  override — e.g. drawers cap around 360px. Provide `maxWidth` / `width` props.
  The library has smart defaults; apps opt in to overrides.
- **Capability, not renderer.** Anything that differs by host is a _device
  capability_ (haptics, secure storage, share, filesystem, status bar, keyboard),
  and belongs behind `platform/` — never inline in a component. A component must
  not know whether it is inside Capacitor.
- **Touch and pointer both.** Every interactive element gets a 44px touch target
  _and_ a hover state. The same build serves a phone and a desktop.

**[RN]** On the native track the old guidance still holds: `Platform.OS`
for behaviour that truly differs, `useWindowDimensions` for breakpoints, and the
Uniwind `web:` variant for per-platform styling.

## UI Standards

- Overlays (Dialog, Popover, Menus): `rounded-lg`
- Controls (Button, Input, Select): `h-10`
- Cards: `rounded-xl`

### Touch Targets (Fitts's Law)

- **Minimum 44px** for mobile touch targets — even if visually smaller
- Icon-only buttons: `h-11 w-11` (44px)
- Small buttons: `h-9` minimum (36px visual, use `hitSlop` if needed)

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
- **Small touch targets:** Components under 44px (e.g. Checkbox h-5, Radio h-5, Switch h-7) need `hitSlop` so effective touch area ≥ 44px.
- **Browser focus outline on inputs:** Always add `outline-none` to `TextInput` className. Without it, browsers render a blue/black outline on focus that doubles up with the component's `border-border`.
- **DOM track fails typecheck with `Cannot find name 'document'` / `KeyboardEvent` has no `.key`:** Symptom: anything under `src/web/` that touches a DOM global. Cause: `packages/ui/tsconfig.json` has no DOM lib and resolves globals from React Native's ambient types. Fix: `src/web/` is compiled by `tsconfig.web.json` (DOM lib, `src/web` roots) and excluded from the main project; `build` and `typecheck` run both. Do **not** add `"DOM"` to the main tsconfig — it collides with RN's `fetch`/`FormData` declarations.
- **`interface X extends HTMLAttributes<…>` "incorrectly extends":** a prop name collides with a DOM attribute of a different type — `onSelect` (React event handler) is the usual one. `Omit` it explicitly and say why in a comment.

### Blocks vs components

- **Blocks** = copy-paste compositions. No themeability props needed — people edit the block code directly. Use semantic tokens; theme via `global.css`.
- **Components** = imported dependencies. Must be themeable (semantic classes, `*Variants` for extension).

### Where to put new things

| What                  | Path                                               | Notes                                                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component (DOM)**   | `packages/ui/src/web/components/<name>.tsx`        | DOM track. Export from `packages/ui/src/web/index.ts`. Demo in `apps/site`                                                                                                                                                                |
| **Component (RN)**    | `packages/ui/src/components/<name>/`               | Native track. Export from `index.ts`, re-export in `packages/ui/src/index.ts`. Demo in `apps/showcase`                                                                                                                                    |
| **DOM recipe**        | `packages/ui/src/web/lib/recipes.ts`               | Token geometry as CSS `var()`. Mirror of `lib/recipes.ts` — keep the two in step. Pixel tokens are unitless: `calc(var(--x) * 1px)`                                                                                                       |
| **Block (DOM)**       | `packages/ui/src/web/blocks/<category>/<name>.tsx` | DOM track. Same slots/props as the RN block where one exists. Export from `packages/ui/src/web/index.ts`. Demo in `apps/site` — the showcase's own shell is `AppShell` + `Header` + `DrawerMenu`                                          |
| **Block (RN)**        | `packages/ui/src/blocks/<category>/`               | Categories: `layout`, `navigation`, `chat`, `lists`, `commerce`, `media`, `datepicker`, `splash`                                                                                                                                          |
| **Auth/Profile**      | `apps/showcase/templates/auth/` or `profile/`      | Copy-paste templates; NOT in core package. Import primitives from `@thewhileloop/whileui`                                                                                                                                                 |
| **Shared hook/util**  | `packages/ui/src/lib/`                             | Theme helpers, cn, portal, tv, font-context                                                                                                                                                                                               |
| **Tokens/contract**   | `packages/ui/src/lib/`                             | `theme-contract`, `visual-token-contract`, `theme-presets`. **Keep these free of any renderer import** — they are the portable core                                                                                                       |
| **Device capability** | `packages/ui/src/web/platform/`                    | **Hardware back**, storage, keyboard, status bar, deep links, haptics, share, filesystem. One interface, per-host impls. Never inline in a component. See the mandatory-set table in ROADMAP.md — an app must not be able to forget these |

## Custom Themes (Starter Kits)

Create reusable theme presets that can be switched at runtime:

### 1. Register in metro.config.js

```js
// metro.config.js
module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  extraThemes: ['noir', 'minimalist', 'brand-accent'],
});
```

### 2. Define theme in global.css

```css
@layer theme {
  :root.noir,
  .noir {
    @variant light {
      --color-background: oklch(1 0 0);
      --color-foreground: oklch(0 0 0);
      --color-primary: oklch(0 0 0);
      /* ... other variables */
      --radius-sm: 0px;
      --radius-md: 0px;
    }
    @variant dark {
      /* dark mode variables */
    }
  }
}
```

### 3. Switch at runtime

```tsx
import { Uniwind } from 'uniwind';

// Switch to custom theme
Uniwind.setTheme('noir');

// Switch back to default light/dark
Uniwind.setTheme('light');
Uniwind.setTheme('dark');
```

### Frosted / translucent surfaces

Apps that want a frosted or translucent look for floating panels (modals, sheets, toolbars) can override surface tokens in their theme with semi-transparent values, e.g. `--color-surface-elevated: oklch(0.98 0.01 95 / 0.4)`. Optional tokens: `surface-translucent`, `surface-translucent-border`. No "glass" in core names. See README Theming > Frosted / Translucent Theme.

- **Android translucent surfaces:** Frosted panels usually need denser tint than iOS/web. Tune `--ui-frosted-android-tint-alpha-scale` (default `1.18`) before making Android-only component overrides.

### Required Theme Variables

All themes must define these variables for components to work:

- `--color-background`, `--color-foreground`
- `--color-card`, `--color-card-foreground`
- `--color-primary`, `--color-primary-foreground`
- `--color-secondary`, `--color-secondary-foreground`
- `--color-accent`, `--color-accent-foreground`
- `--color-muted`, `--color-muted-foreground`
- `--color-destructive`, `--color-destructive-foreground`
- `--color-border`, `--color-input`, `--color-ring`
- `--color-success`, `--color-success-foreground`
- `--color-warning`, `--color-warning-foreground`
- `--color-info`, `--color-info-foreground`
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`
