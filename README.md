# WhileUI Native

> Copy-paste components for React Native. You own the code.

Beautiful, accessible, themeable components built with [Uniwind](https://uniwind.dev) + Tailwind CSS v4.

**Requirements:** React 19.3+, React Native 0.88+, Expo 58+ (if using Expo). Supports React Native Web.

WhileUI has one renderer: React Native. iOS, Android and React Native Web are all
production targets — iOS and Android set the interaction baseline. See
[ROADMAP.md](./ROADMAP.md) for the product boundary and extraction rules, and
[PLAN.md](./PLAN.md) for the supported stack and production contracts.

## See it in action

The same app code on an iPhone simulator, an Android emulator and the web, running the
same tour side by side.

**The catalog** — every component and block, in light and dark
([`apps/showcase/catalog`](apps/showcase/catalog)):

<p align="center">
  <img src="./docs/assets/whileui-catalog.gif" width="760" alt="The WhileUI component catalog running side by side on iPhone, Android and web: scrolling the components, switching from light to dark theme, and opening the Controls tab" />
</p>

**Clayhouse** — a made-up ceramics studio app built only from WhileUI, with its own theme
and fonts ([`apps/showcase/clayhouse`](apps/showcase/clayhouse)):

<p align="center">
  <img src="./docs/assets/whileui-clayhouse.gif" width="760" alt="Clayhouse, a made-up ceramics studio app, running side by side on iPhone, Android and web: a live kiln temperature and firing curve, the glaze library, switching to night mode, and the member screen" />
</p>

## Installation

```bash
bun add @thewhileloop/whileui
bun add react@^19.3.0 react-native@^0.88.0 uniwind@^1.12.2 tailwindcss@^4.0.0 react-native-reanimated react-native-safe-area-context react-native-screens
# Only if you use Select, Popover, Tooltip, or HoverCard:
bun add @rn-primitives/portal @rn-primitives/hooks @rn-primitives/slot @rn-primitives/select @rn-primitives/popover @rn-primitives/tooltip @rn-primitives/hover-card
# Only if you import @thewhileloop/whileui/markdown:
bun add markdown-it
```

Use `npm install` instead of `bun add` if you prefer npm.

### Setup Uniwind (required)

1. **metro.config.js** (wrap with `withWhileUIMetro`):

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withWhileUIMetro } = require('@thewhileloop/whileui/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withWhileUIMetro(config, {
  cssEntryFile: './global.css',
});
```

> `withWhileUIMetro` calls Uniwind's `withUniwindConfig(config, options)` for you — same
> options, config first, `cssEntryFile` a relative path — and keeps `expo-asset`,
> `expo-font` and `@expo/vector-icons` on the real `react-native`. Without that, Uniwind's
> import rewrite leaves every icon glyph silently missing on iOS and Android while web
> renders fine. Pass `exemptFromUniwindRewrite: ['pkg']` for any other package that
> imports a `react-native` export Uniwind's wrapper lacks. It must be the outermost wrapper.

2. **global.css** at app root:

```css
@import 'tailwindcss';
@import 'uniwind';

/* Required when WhileUI is installed from npm. Tailwind does not scan
   node_modules, so without this its class names are never detected and every
   component renders unstyled. */
@source './node_modules/@thewhileloop/whileui/dist';

/* WhileUI Noir theme - copy this or create your own */
@layer theme {
  :root {
    @variant light {
      --color-background: oklch(1 0 0);
      --color-foreground: oklch(0.1316 0.0041 17.69);
      --color-card: oklch(1 0 0);
      --color-card-foreground: oklch(0.1316 0.0041 17.69);
      --color-primary: oklch(0.1316 0.0041 17.69);
      --color-primary-foreground: oklch(0.98 0 0);
      --color-secondary: oklch(0.9598 0.0017 17.69);
      --color-secondary-foreground: oklch(0.1316 0.0041 17.69);
      --color-muted: oklch(0.9598 0.0017 17.69);
      --color-muted-foreground: oklch(0.5415 0.0135 17.69);
      --color-accent: oklch(0.9598 0.0017 17.69);
      --color-accent-foreground: oklch(0.1316 0.0041 17.69);
      --color-destructive: oklch(0.5 0.19 27);
      --color-destructive-foreground: oklch(0.98 0 0);
      --color-border: oklch(0.9039 0.0034 17.69);
      --color-input: oklch(0.9039 0.0034 17.69);
      --color-ring: oklch(0.1316 0.0041 17.69);
      --color-success: oklch(0.59 0.16 145);
      --color-success-foreground: oklch(0.98 0 0);
      --color-warning: oklch(0.75 0.18 85);
      --color-warning-foreground: oklch(0.1316 0.0041 17.69);
      --color-info: oklch(0.65 0.15 245);
      --color-info-foreground: oklch(0.98 0 0);
    }

    @variant dark {
      --color-background: oklch(0.1316 0.0041 17.69);
      --color-foreground: oklch(0.98 0 0);
      --color-card: oklch(0.1316 0.0041 17.69);
      --color-card-foreground: oklch(0.98 0 0);
      --color-primary: oklch(0.98 0 0);
      --color-primary-foreground: oklch(0.1316 0.0041 17.69);
      --color-secondary: oklch(0.2104 0.0084 17.69);
      --color-secondary-foreground: oklch(0.98 0 0);
      --color-muted: oklch(0.2104 0.0084 17.69);
      --color-muted-foreground: oklch(0.6961 0.0174 17.69);
      --color-accent: oklch(0.2104 0.0084 17.69);
      --color-accent-foreground: oklch(0.98 0 0);
      --color-destructive: oklch(0.45 0.18 27);
      --color-destructive-foreground: oklch(0.98 0 0);
      --color-border: oklch(0.2104 0.0084 17.69);
      --color-input: oklch(0.2104 0.0084 17.69);
      --color-ring: oklch(0.8267 0.0206 17.69);
      --color-success: oklch(0.59 0.16 145);
      --color-success-foreground: oklch(0.98 0 0);
      --color-warning: oklch(0.75 0.18 85);
      --color-warning-foreground: oklch(0.1316 0.0041 17.69);
      --color-info: oklch(0.65 0.15 245);
      --color-info-foreground: oklch(0.98 0 0);
    }
  }
}
```

3. **App.tsx**:

```tsx
import './global.css';
import { MotionProvider, PortalHost } from '@thewhileloop/whileui';
import { Button, ButtonText } from '@thewhileloop/whileui';

export default function App() {
  return (
    <MotionProvider>
      {/* Your app content */}
      <PortalHost />
    </MotionProvider>
  );
}
```

> **Note:** If you use Select, Popover, Tooltip, or HoverCard, add `<PortalHost />` at the root of your app (as the last child).

Inside a Dialog, AlertDialog, Sheet, ConfirmActionSheet, DrawerMenu, menu or picker, those
four render into that overlay's own layer automatically, so a Select in a sheet opens above
the sheet. Android back and Escape on web close the innermost open layer first. Pass
`portalHost` on their content only to target a `PortalHost` you placed yourself, such as
inside a navigation-presented modal screen that WhileUI does not host.

### Vite + React Native Web + WhileUI setup

Use the WhileUI Vite compatibility helper when your app includes portal-based primitives.

1. Install Vite + RN web basics:

```bash
bun add react-dom react-native-web
bun add -d vite @vitejs/plugin-react
```

2. `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { withWhileUIViteCompat } from '@thewhileloop/whileui/vite';

export default defineConfig(withWhileUIViteCompat({ plugins: [react()] }));
```

3. Keep `PortalHost` at app root when using Select/Popover/Tooltip/HoverCard.

Troubleshooting:

| Symptom                                                  | Likely cause                                              | Fix                                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Unexpected token <` from `@rn-primitives/*/dist/*.mjs`  | rn-primitives ships raw JSX in dist for some packages     | Use `withWhileUIViteCompat(...)` in `vite.config.ts`                                                |
| `className` rejected on RN primitives in consumer TS app | RN `className` augmentation not loaded from package entry | Import components from `@thewhileloop/whileui` (or side-effect import the package entry before use) |
| Theme token resolves differently on native/web           | Missing `--app-color-*` fallback for non-RN-native values | Add `--app-color-*` fallbacks in `global.css` for any `oklch(...)` token used by native APIs        |

## Usage

```tsx
import {
  Button,
  ButtonText,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Text,
} from '@thewhileloop/whileui';

function MyScreen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Email" />
        <Button className="mt-4">
          <ButtonText>Continue</ButtonText>
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Blocks Strategy: Core vs Templates

**Core package** exports:

- **Primitives** — Button, Input, Card, Text, etc.
- **Generic layout blocks** — EmptyState, ErrorState, LoadingScreen, ContentSkeleton, PageSkeleton, ScreenSkeleton
- **Layout infrastructure** — FormModalScreen, ConfirmActionSheet, SmartInput, ActionBar
- **Navigation, Chat, Lists, Commerce, Media, DatePicker** — Blocks that rarely need app-specific customization

**Opinionated blocks** (auth, profile) are **copy-paste templates** in the showcase app:

- **Auth:** `apps/showcase/catalog/templates/auth/` — SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm, VerifyEmailForm, SocialConnections, UserMenu
- **Profile:** `apps/showcase/catalog/templates/profile/` — ProfileHeader, SettingsSection, SettingsItem, AccountCard

**To use auth or profile blocks:** Copy the template file(s) from `apps/showcase/catalog/templates/` into your app. Customize as needed (error handling, loading state, social auth slot, branding). Each template imports primitives from `@thewhileloop/whileui`.

## Philosophy

- **Copy-Paste Ownership** — Components live in _your_ project. No `node_modules` lock-in.
- **Beautiful by Default** — OKLCH color system, light/dark themes, polished out of the box.
- **Fully Customizable** — Every component uses `tv()` variants and accepts `className` overrides.
- **Accessible** — Proper ARIA roles, keyboard support, controlled/uncontrolled state.
- **Tree-Shakeable** — Only imports what you use. `sideEffects: false`.

## AI agents

Every release ships its docs for agents inside the package, so an agent reads the docs for
the version you have installed, not whatever a website currently shows:

- `node_modules/@thewhileloop/whileui/dist/agent/llms.txt` — rules, composition grammar
  and every component in one page. `llms-components.txt` adds each API section;
  `llms-full.txt` is this README.
- [`@thewhileloop/whileui-mcp`](packages/mcp/README.md) serves the same catalog over MCP
  (`list_components`, `get_component_docs`, `get_theme_tokens`, `get_guide`):

  ```bash
  claude mcp add whileui -- npx -y @thewhileloop/whileui-mcp
  ```

- A [skill](skills/whileui/SKILL.md) for Claude Code, Cursor, Codex and other agents
  that load skills: setup traps, how to compose and theme, and how to check a screen. It
  points at the installed docs rather than copying them, and the build fails if it names
  an API, MCP tool or file that no longer exists. Install it with
  `npx skills add whileloophq/whileui`, or copy `skills/whileui` into your agent's skills
  folder (for Claude Code, `.claude/skills/`).

The docs and catalog are generated from this README at build time, and the build fails if
a component named here is not exported.

## Quick Reference (AI / Code Generation)

- **Full-screen:** `AppShell` + `Header` in `header` + `BottomNav` in `bottomNav` + content in `children`
- **No-jump loading:** keep `AppShell` mounted, set `loading` + `skeleton` (e.g., `PageSkeleton`/`ScreenSkeleton`)
- **Layout:** `Stack` (vertical), `Row` (horizontal) — both support `gap`, `align`, `justify`
- **Auth callbacks:** Auth templates use objects: `onSubmit({ email, password })`, `onSubmit({ firstName, lastName, email, password })`, etc. Copy templates from `apps/showcase/catalog/templates/auth/`.
- **PortalHost:** Add `<PortalHost />` at app root for Select, Popover, Tooltip, HoverCard.
  Inside any WhileUI overlay they render into that overlay's layer without configuration.
- **Motion:** Wrap the root in `<MotionProvider>`; use `useMotionPolicy()` for semantic
  durations, the responsive spring, and reduced-motion behavior.
- **Metro:** `withWhileUIMetro(config, { cssEntryFile: './global.css' })` from
  `@thewhileloop/whileui/metro` — wraps Uniwind and keeps icon fonts loading on device.
  `global.css` at app root, imported in `App.tsx`. Installing from npm also needs
  `@source './node_modules/@thewhileloop/whileui/dist';` or every component renders unstyled.
- **States:** `LoadingState`, `EmptyState` and `ErrorState` share one shape; `ErrorState`
  takes `onRetry`. `Text variant="eyebrow"` is the muted section label above a title.
- **Reference:** Block props in `packages/ui/src/blocks` (core) and `apps/showcase/catalog/templates/` (auth, profile); flow patterns in README "Flow Patterns" section.

### Composition grammar

- Start with one page canvas and flat sections. Add a `Surface` only when grouping or
  elevation communicates something; do not wrap every section in a card.
- Use `level="base"` for grouped content, `raised` for selectable or floating regions,
  and `overlay` for content above the page. Avoid nesting more than one surfaced level.
- Express hierarchy through `Text` variants before custom font-size classes. Keep one
  primary action per region and constrain long-form content with `Container`.
- Forms use `FormField`; its disabled and invalid state flows into `Input`, `Textarea`,
  `NumericInput`, and `Select`. Pass a control prop only to override that inherited state.
- Chat mechanics belong to `ChatConversation` + `SmartInput`. Message payloads, tools,
  reasoning, approvals, sources, and action rows are application-owned compositions.
- Import Markdown and code rendering from their optional subpaths. Do not make the root
  package pay for content rendering when the screen does not use it.

## Components

### Primitives

| Component     | Notes                                            |
| ------------- | ------------------------------------------------ |
| **Text**      | Themed text with variant support                 |
| **Surface**   | Token-backed base, raised, and overlay container |
| **View**      | Themed view wrapper                              |
| **Pressable** | Themed pressable wrapper                         |
| **Stack**     | Vertical flex layout with gap                    |
| **Row**       | Horizontal flex layout with gap                  |

### Root Providers

| Provider           | Notes                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| **MotionProvider** | System reduced motion, explicit preview modes, and deterministic testing |

### Form Controls

| Component            | Variants                                              | Notes                                                                                         |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Button**           | default, destructive, outline, secondary, ghost, link | 4 sizes, ButtonText & ButtonIcon sub-components                                               |
| **Input**            | default, error                                        | TextInput wrapper with themed styling                                                         |
| **NumericInput**     | default, error                                        | Numeric input with prefix/suffix slots, optional steppers, and compact size                   |
| **OTPInput**         | default, error; default, compact                      | Verification code input with auto-focus, paste, secure mask, loading skeleton, error shake    |
| **FormField**        | default, compact                                      | Compound API: FormField, FormLabel, FormControl, FormHint, FormMessage                        |
| **LabeledField**     | default, compact                                      | Field wrapper with label/helper/error plus left/right slots                                   |
| **Textarea**         | —                                                     | Multi-line text input                                                                         |
| **Checkbox**         | —                                                     | Controlled/uncontrolled, accessibility roles                                                  |
| **Switch**           | —                                                     | Controlled/uncontrolled, accessibility roles                                                  |
| **RadioGroup**       | —                                                     | RadioGroup + RadioGroupItem                                                                   |
| **Select**           | —                                                     | Uses `SelectOption` type `{value, label}`. Includes SelectGroup, SelectLabel, SelectSeparator |
| **Label**            | —                                                     | Form field label                                                                              |
| **SegmentedControl** | default, pill; single select                          | SegmentedControl, SegmentedControlItem, SegmentedControlItemText with wrapping layout support |
| **Toggle**           | default, outline                                      | ToggleText sub-component                                                                      |
| **ToggleGroup**      | single, multiple                                      | Group of toggle items                                                                         |

### Display

| Component       | Variants                                                | Notes                                                                           |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Card**        | padding (none, sm, default, lg), unstyled               | Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **Surface**     | level (base, raised, overlay)                           | Shared radius, padding, border, shadow, and optional frosted treatment          |
| **Badge**       | default, secondary, destructive, outline, success       | BadgeText sub-component                                                         |
| **FAB**         | default, secondary, destructive, surface; sm/default/lg | Floating action button. `label` required; pass your own icon as children        |
| **Alert**       | default, destructive, success, warning                  | AlertTitle & AlertDescription                                                   |
| **Avatar**      | sm, default, lg                                         | AvatarImage + AvatarFallback                                                    |
| **DataRow**     | default, compact                                        | DataRow, DataRowLeft/Center/Right, DataRowLabel/Description/Value               |
| **Separator**   | horizontal, vertical                                    | Themed divider                                                                  |
| **Progress**    | sm, default, lg                                         | Value-based progress bar with accessibility                                     |
| **Spinner**     | sm, default, lg                                         | ActivityIndicator wrapper                                                       |
| **Skeleton**    | pulse, shimmer                                          | Loading placeholder (pulse = opacity fade, shimmer = sweep)                     |
| **AspectRatio** | —                                                       | Maintain aspect ratio container                                                 |

### Layout

| Component       | Notes                                    |
| --------------- | ---------------------------------------- |
| **Tabs**        | TabsList, TabsTrigger, TabsContent       |
| **Accordion**   | AccordionItem, AccordionTrigger, Content |
| **Collapsible** | CollapsibleTrigger, CollapsibleContent   |
| **Container**   | Centred content column with a max width  |

### Overlays & Menus

| Component        | Notes                                                |
| ---------------- | ---------------------------------------------------- |
| **Dialog**       | Modal dialog with Header, Footer, Title, Description |
| **AlertDialog**  | Confirmation dialog with Action/Cancel buttons       |
| **Popover**      | Position-aware popover (requires PortalHost)         |
| **Tooltip**      | Position-aware tooltip (requires PortalHost)         |
| **DropdownMenu** | DropdownMenuTrigger, Content, Item, Label, Separator |
| **ContextMenu**  | Long-press context menu                              |
| **HoverCard**    | Position-aware hover card (requires PortalHost)      |
| **Menubar**      | Horizontal menu bar                                  |

### Feedback

| Component | Notes                                          |
| --------- | ---------------------------------------------- |
| **Toast** | ToastProvider, ToastContainer, useToast() hook |

## Blocks (Pre-built Screens)

### Auth (Copy from showcase templates)

Copy from `apps/showcase/catalog/templates/auth/`:

| Block                  | File                       | Description                           |
| ---------------------- | -------------------------- | ------------------------------------- |
| **SignInForm**         | `sign-in-form.tsx`         | Email/password sign in with callbacks |
| **SignUpForm**         | `sign-up-form.tsx`         | Registration form with callbacks      |
| **ForgotPasswordForm** | `forgot-password-form.tsx` | Password reset request                |
| **ResetPasswordForm**  | `reset-password-form.tsx`  | Set new password                      |
| **VerifyEmailForm**    | `verify-email-form.tsx`    | Email verification code input         |
| **SocialConnections**  | `social-connections.tsx`   | OAuth provider buttons                |
| **UserMenu**           | `user-menu.tsx`            | Profile dropdown for auth flows       |

### Navigation

| Block                 | Description                                     |
| --------------------- | ----------------------------------------------- |
| **AppShell**          | Layout shell with header/footer/bottomNav slots |
| **Header**            | Top app bar with back/actions                   |
| **BottomNav**         | Tab-style bottom navigation bar                 |
| **FloatingBottomNav** | Elevated bottom nav with safe area support      |
| **TabBar**            | Top tab bar with indicator                      |
| **DrawerMenu**        | Drawer with sections and items                  |

### Layout

| Block                       | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| **ActionBar**               | Sticky bottom action row with safe-area padding                       |
| **ConfirmActionSheet**      | Reusable destructive confirmation sheet                               |
| **Sheet**                   | Bottom sheet modal with header/content/footer slots                   |
| **FormModalScreen**         | Modal scaffold for forms with loading states                          |
| **ContentSkeleton**         | Page/content placeholder with variants (list, card, generic)          |
| **PageSkeleton**            | Variant-based page layouts (dashboard, list, settings, card, generic) |
| **ScreenSkeleton**          | Header slot/placeholder + PageSkeleton content in one block           |
| **ErrorBoundary**           | React ErrorBoundary that renders ErrorState by default                |
| **EmptyState**              | Empty content placeholder                                             |
| **ErrorState**              | Error display with retry                                              |
| **LoadingState**            | In-flow loading placeholder for a section still fetching              |
| **LoadingScreen**           | Full-screen loading indicator                                         |
| **PullToRefreshScrollView** | Themed ScrollView with RefreshControl (useThemeTokens for colors)     |
| **KeyboardAwareScreen**     | One screen-level keyboard policy for bottom-docked controls           |
| **DockedInput**             | Safe-area-aware bottom dock that reports its complete height          |
| **SmartInput**              | Compose input with slots, variants, and optional rotating examples    |
| **SplashScreen**            | Branded splash (fade/scale/slide variants)                            |
| **MinimalSplash**           | Minimal monochrome splash                                             |
| **BrandedSplash**           | Splash with brand imagery                                             |

### Chat

| Block                 | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| **Chat**              | Opinionated messages, suggestions, and SmartInput composition   |
| **ChatConversation**  | Constrained conversation viewport that follows streaming output |
| **ChatMessageBubble** | Message bubble (user/assistant, big/small text)                 |
| **ChatSuggestions**   | Suggestion chips when empty                                     |

### Profile & Settings (Copy from showcase templates)

Copy from `apps/showcase/catalog/templates/profile/`:

| Block               | File                   | Description                         |
| ------------------- | ---------------------- | ----------------------------------- |
| **ProfileHeader**   | `profile-header.tsx`   | Profile header with stats           |
| **AccountCard**     | `account-card.tsx`     | Account summary card                |
| **SettingsSection** | `settings-section.tsx` | Section header with optional action |
| **SettingsItem**    | `settings-item.tsx`    | Row for toggles/links/settings      |

### Lists

| Block                | Description                         |
| -------------------- | ----------------------------------- |
| **ListItem**         | Title/subtitle row                  |
| **NotificationItem** | Notification row with metadata      |
| **TimelineFeed**     | Vertical feed with connecting lines |

### Commerce

| Block                | Description                                   |
| -------------------- | --------------------------------------------- |
| **ProductCard**      | Product card with badge/media                 |
| **PricingCard**      | Pricing tiers with feature list               |
| **CheckoutSummary**  | Cart summary with line items                  |
| **MetricCard**       | Stats/progress card for dashboards            |
| **SubscriptionCard** | Current plan card with manage/upgrade actions |
| **FeatureGate**      | Locked feature state with upgrade CTA         |
| **UsageBar**         | Quota meter with warning/exceeded states      |
| **PlanToggle**       | Monthly vs annual plan switcher               |
| **UpgradeBanner**    | Inline upgrade banner with action/dismiss     |

### Media

| Block          | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| **SmartImage** | Image with explicit loading, loaded, fallback, and error lifecycle |

### Date Picker

| Block                    | Description                                       |
| ------------------------ | ------------------------------------------------- |
| **DatePickerModal**      | Bottom sheet modal with calendar, compact trigger |
| **DatePickerInline**     | Inline calendar for forms or dashboards           |
| **DateRangePickerModal** | Range selection modal with period marking         |
| **TimePickerModal**      | Hour and minute wheels in the same bottom sheet   |

**Tokens without a renderer.** `@thewhileloop/whileui/tokens` exports the theme
and visual contracts, the presets, and `deriveThemeColors(base, scheme)` — give it
the 25 base colours an app defines and it returns all 52, using the same ratios
as the default presets. Safe in a build script (no React, RN or Uniwind
imports); `useThemeColors()` uses it too, so a missing `--color-primary-soft`
derives from the app's own primary instead of falling back to the default palette.

**Building a product preset.** Use `createThemePreset` rather than a `ThemePreset`
literal — it takes the 25 base colours per scheme and derives the rest:

```ts
import { createThemePreset, themePresetToCss } from '@thewhileloop/whileui/tokens';

const preset = createThemePreset({
  name: 'acme',
  description: 'Acme brand palette.',
  light: { background: '...', foreground: '...', primary: '...' /* 25 base keys */ },
  dark: { background: '...', foreground: '...', primary: '...' },
  visual: { radiusLg: 12 }, // optional, partial
});

writeFileSync('theme.generated.css', themePresetToCss(preset));
```

The literal form asks for all 52 colours per scheme, including every active variant,
soft variant, overlay, surface, interaction state and shadow. Those are exactly what
`deriveThemeColors` computes, so hand-writing them produces a second derivation that
drifts from the library's. Override a derived value by assigning to the result.

`WHILEUI_PRESET_SOFT` is the airy default. `WHILEUI_PRESET_ATELIER` is the stronger
product preset: tighter geometry, opaque surfaces, firmer borders, real shadows, and no
blur. Use it as the acceptance check that a screen still has enough visual weight when
the soft treatment is removed.

### FAB

One primary action, raised above the content. It owns no icon dependency — pass the
glyph as children and colour it from `useIconColors()`, because icon libraries need a
concrete colour rather than a class.

```tsx
import { FAB, useIconColors } from '@thewhileloop/whileui';
import { Feather } from '@expo/vector-icons';

const icons = useIconColors();

<FAB label="New group" onPress={create}>
  <Feather name="plus" size={24} color={icons.primaryForeground} />
</FAB>;
```

| Prop        | Type                                             | Default    | Notes                                   |
| ----------- | ------------------------------------------------ | ---------- | --------------------------------------- |
| `label`     | `string`                                         | —          | Required. The accessible name           |
| `variant`   | `default \| secondary \| destructive \| surface` | `default`  |                                         |
| `size`      | `sm \| default \| lg`                            | `default`  | 48 / 56 / 64 — all clear touch minimums |
| `placement` | `floating \| floating-left \| inline`            | `floating` | `inline` lets the caller position it    |

`FABGroup` stacks secondary actions above one. Sizes start at 48dp, so a FAB never
needs `hitSlop`.

## Layout Primitives (Stack, Row)

Use `Stack` for vertical layouts, `Row` for horizontal layouts. Both support `gap`, `align`, and `justify` variants.

```tsx
import { Stack, Row } from '@thewhileloop/whileui';

<Stack gap="lg">
  <Text>Title</Text>
  <Row gap="md" justify="between">
    <Button>
      <ButtonText>Cancel</ButtonText>
    </Button>
    <Button>
      <ButtonText>Save</ButtonText>
    </Button>
  </Row>
</Stack>;
```

<!-- api:Row -->

| Prop      | Type                                                                | Default    | Description |
| --------- | ------------------------------------------------------------------- | ---------- | ----------- |
| className | `string`                                                            | —          |             |
| gap       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`           | `'md'`     |             |
| align     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'center'` |             |
| justify   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`  |             |

Also accepts the props of `ViewProps`.
<!-- /api:Row -->

### Container

Caps content width and centres it. Phone-first layouts stretch to the viewport, which
is right at 390px and wrong at 1600px — line lengths become unreadable and related
controls drift apart.

```tsx
<Container size="lg">{children}</Container>
```

<!-- api:Container -->

| Prop      | Type                                     | Default | Description |
| --------- | ---------------------------------------- | ------- | ----------- |
| className | `string`                                 | —       |             |
| size      | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`  |             |
| fill      | `boolean`                                | `false` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Container -->

No platform branch, and none is needed: every size is wider than any phone, so on iOS
and Android the cap never engages and it renders as a plain full-width `View`. The same
component is a no-op on native and the whole fix on desktop.

For a scroll view, put the column on the content container so the scrollbar stays at
the window edge:

```tsx
<ScrollView contentContainerClassName="w-full max-w-5xl self-center" />
```

## Full-Screen Composition

Standard pattern: `AppShell` with `header`, scrollable `children`, and `bottomNav`.

```tsx
import { AppShell, Header, BottomNav, ScrollView } from '@thewhileloop/whileui';

<AppShell
  header={<Header title="Home" rightActions={[...]} />}
  bottomNav={
    <BottomNav
      items={[...]}
      activeKey="home"
      onSelect={(key) => setTab(key)}
    />
  }
>
  <ScrollView className="flex-1 p-4">
    {/* Screen content */}
  </ScrollView>
</AppShell>
```

### Flow Patterns

| Flow       | Blocks                                                                             |
| ---------- | ---------------------------------------------------------------------------------- |
| Auth       | SignInForm → SignUpForm → ForgotPasswordForm → VerifyEmailForm → ResetPasswordForm |
| Forms      | FormField + Input/NumericInput/LabeledField + DatePickerModal + FormModalScreen    |
| Settings   | ProfileHeader + SettingsSection + SettingsItem (+ FormModalScreen for edits)       |
| E-commerce | ProductCard list → CheckoutSummary + ActionBar                                     |
| Chat       | Chat, or ChatConversation + SmartInput for custom message/tool/source compositions |
| App shell  | AppShell + Header + BottomNav + content                                            |
| Loading    | AppShell (`loading`) + PageSkeleton/ScreenSkeleton (keep header mounted)           |

### Component-Level Loading

Many blocks accept a `loading` prop that renders a skeleton placeholder matching the component's own shape. No separate skeleton component needed — the block knows its own layout.

```tsx
<ProductCard loading title="" price="" />
<ListItem loading title="" />
<NotificationItem loading title="" message="" time="" />
<MetricCard loading label="" value="" />
<SubscriptionCard loading planName="" price="" />
<PricingCard loading name="" price="" features={[]} />
```

Blocks with `loading` support: ProductCard, ListItem, NotificationItem, MetricCard, SubscriptionCard, PricingCard, AppShell, Chat, FormModalScreen, CheckoutSummary.

Block props: see TypeScript interfaces in `packages/ui/src/blocks`.

## Quick Start

```bash
bun install
bun run build                     # the apps resolve the library from packages/ui/dist
cd apps/showcase/catalog && bun run dev     # every component and block, port 8082
cd apps/showcase/clayhouse && bun run dev   # a made-up app built from them, port 8084
```

The showcase is two independent Expo apps. `catalog` demonstrates each component on its
own. `clayhouse` is a made-up ceramics studio app that puts the same components to work on
one believable job, with its own theme and fonts; it shows what a consumer builds, not new
API.

## Project Structure

```
whileui/
├── packages/
│   └── ui/
│       └── src/
│           ├── components/    # All components (copy these!)
│           │   ├── button/
│           │   ├── card/
│           │   ├── form-field/
│           │   ├── numeric-input/
│           │   ├── segmented-control/
│           │   ├── data-row/
│           │   ├── dialog/
│           │   └── ...
│           ├── blocks/        # Pre-built screens (core only)
│           │   ├── chat/
│           │   ├── navigation/
│           │   ├── layout/
│           │   ├── lists/
│           │   ├── commerce/
│           │   ├── splash/
│           │   └── media/
│           ├── lib/           # Utilities
│           │   ├── cn.ts      # clsx + tailwind-merge
│           │   ├── tv.ts      # tailwind-variants re-export
│           │   ├── font-context.ts
│           │   └── theme-bridge.ts
│           └── index.ts       # Barrel export
├── apps/
│   └── showcase/
│       ├── catalog/           # Expo app: every component and block
│       │   ├── templates/     # Copy-paste templates (auth, profile)
│       │   ├── App.tsx
│       │   ├── global.css     # Theme variables (OKLCH) — at app root!
│       │   └── metro.config.js
│       └── clayhouse/         # Expo app: a made-up studio app built on WhileUI
└── package.json               # bun monorepo root
```

## Theming

Themes are defined in `global.css` using CSS variables with OKLCH colors:

```css
@variant light {
  --color-primary: oklch(0.6 0.2 160);
  --color-background: oklch(1 0 0);
  /* ... */
}

@variant dark {
  --color-primary: oklch(0.6 0.2 160);
  --color-background: oklch(0.145 0 0);
  /* ... */
}
```

### Theme from seed colours

`themeFromSeeds` builds a complete light and dark theme from three colours and checks
nothing it derives is hard to read. Seeds are kept as given; muted text, the text on each
filled colour and the status colours are tuned to WCAG AA.

```ts
import { checkThemeContrast, themeFromSeeds, themePresetToCss } from '@thewhileloop/whileui/tokens';

const theme = themeFromSeeds({
  name: 'studio',
  description: 'Bone paper and burnt amber',
  light: { background: '#f0ede9', foreground: '#13161c', primary: '#b65400' },
  // optional: `dark` seeds (otherwise a dark page with the brand lifted to read on it),
  // `overrides` for any base colour, `visual` for radius and density tokens
});

checkThemeContrast(theme.light).filter((c) => !c.pass);
// [{ pair: 'primary on background', ratio: 4.23, min: 4.5, pass: false }, …]
const css = themePresetToCss(theme); // paste into global.css
```

`checkThemeContrast` works on any palette, including a hand-written one: it checks every
text pairing the components render at 4.5:1 and the focus ring at 3:1, with translucent
colours blended onto the page first. A failing seed is reported, never changed — a brand
colour is a brand decision.

### Strict Theme Token Contract

The WhileUI token contract is strict for cross-app reuse. Define these in **every** theme variant (`@variant light`, `@variant dark`, and custom variants):

- Required core tokens: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`
- Optional status tokens: `success`, `success-foreground`, `warning`, `warning-foreground`, `info`, `info-foreground`
- Optional effect tokens: `overlay`, `overlay-strong`, `surface-elevated`, `surface-border`, `surface-highlight`, `surface-translucent`, `surface-translucent-border`, `state-hover`, `state-pressed`, `state-disabled`
- Optional visual tokens, generated from a preset: `--ui-blur-intensity-subtle`, `--ui-blur-intensity-medium`, `--ui-blur-intensity-strong`, `--ui-blur-saturation-pct`, `--ui-frosted-highlight-height`, `--ui-frosted-backdrop-blur-intensity`, `--ui-frosted-backdrop-blur-scale`, `--ui-frosted-android-tint-alpha-scale`, `--ui-frosted-android-experimental-blur`, `--ui-drawer-frosted-inset`, `--ui-drawer-frosted-radius`, `--ui-drawer-content-top-padding`
- Optional scale tokens: spacing (`--spacing`, `--spacing-*`), typography (`--text-*`, `--leading-*`, `--tracking-*`), radius (`--radius-*`), elevation (`--shadow-*`)

Minimal contract example:

```css
@layer theme {
  :root {
    @variant light {
      --color-background: oklch(1 0 0);
      --color-foreground: oklch(0.15 0 0);
      --color-card: oklch(1 0 0);
      --color-card-foreground: oklch(0.15 0 0);
      --color-popover: oklch(1 0 0);
      --color-popover-foreground: oklch(0.15 0 0);
      --color-primary: oklch(0.2 0 0);
      --color-primary-foreground: oklch(0.98 0 0);
      --color-secondary: oklch(0.95 0 0);
      --color-secondary-foreground: oklch(0.15 0 0);
      --color-muted: oklch(0.95 0 0);
      --color-muted-foreground: oklch(0.45 0 0);
      --color-accent: oklch(0.9 0.05 180);
      --color-accent-foreground: oklch(0.15 0 0);
      --color-destructive: oklch(0.58 0.2 26);
      --color-destructive-foreground: oklch(0.98 0 0);
      --color-border: oklch(0.9 0 0);
      --color-input: oklch(0.92 0 0);
      --color-ring: oklch(0.22 0 0);
    }
  }
}
```

Switch themes at runtime via Uniwind:

```tsx
import { Uniwind } from 'uniwind';

Uniwind.setTheme('dark'); // or 'light' or 'system'
```

### Frosted / Translucent Theme

Some apps want a frosted or translucent look for floating panels (modals, sheets, toolbars). WhileUI stays neutral — no "glass" in core token names. Apps that want this effect opt in by overriding surface tokens in their theme.

**Option A — Override in existing light/dark:** In your `@variant light` and `@variant dark` blocks, set surface tokens to semi-transparent values:

```css
@variant light {
  /* ... other tokens ... */
  --color-surface-elevated: oklch(0.98 0.01 95 / 0.4);
  --color-surface-border: oklch(1 0 0 / 0.25);
  --color-surface-highlight: oklch(1 0 0 / 0.4);
}
```

**Option B — Separate frosted theme:** Register `extraThemes: ['frosted']` and define `:root.frosted` with the same structure as your base theme, but with translucent surface values. Then `Uniwind.setTheme('frosted')` when desired.

**Optional:** Add `expo-blur` and register its `BlurView` once at app startup for full frosted blur. For tint-only (no blur), translucent surface tokens are sufficient.

**Android note:** frosted panels usually need denser tint than iOS/web. WhileUI now scales frosted tint alpha on Android with `--ui-frosted-android-tint-alpha-scale` (default `1.18`). Set it to `1` to match other platforms exactly, or raise it if your Android surfaces still feel washed out.

```tsx
import { BlurView } from 'expo-blur';
import { registerFrostedBlurView } from '@thewhileloop/whileui';

registerFrostedBlurView(BlurView);
```

Optional generic tokens: `surface-translucent`, `surface-translucent-border` — use them if you need a distinct token from `surface-elevated` for overlay panels.

Built-in overlays and cards support opt-in frosted mode via:

- `frosted?: boolean`
- `blurIntensity?: number`
- `blurTintToken?: 'surfaceElevated' | 'surfaceTranslucent' | 'card' | 'popover'`

Default blur presets map to CSS visual tokens:

- subtle: `--ui-blur-intensity-subtle` (default `18`)
- medium: `--ui-blur-intensity-medium` (default `22`)
- strong: `--ui-blur-intensity-strong` (default `28`)

Additional frosted tuning tokens:

- `--ui-blur-saturation-pct` (web fallback saturation multiplier)
- `--ui-frosted-highlight-height` (top highlight strip height in px, set `0` to disable hard top sheen)
- `--ui-frosted-backdrop-blur-intensity` (default backdrop blur amount)
- `--ui-frosted-backdrop-blur-scale` (ratio used when component blur is overridden)
- `--ui-frosted-android-tint-alpha-scale` (Android-only alpha multiplier applied to frosted tint and backdrop layers)
- `--ui-frosted-android-experimental-blur` (`1` enables `expo-blur` Android experimental path)
- `--ui-drawer-frosted-inset` (floating inset for frosted drawer shells)
- `--ui-drawer-frosted-radius` (drawer corner radius in px)
- `--ui-drawer-content-top-padding` (drawer content top spacing baseline)

### Theme Colors for RN Primitives

Some React Native APIs require native color strings (hex/rgb/hsl/rgba/named). Use `useThemeColors` or `useIconColors` to read from your `global.css` theme. If your theme uses `oklch(...)`, add `--app-color-*` fallbacks — `useThemeColors` will use them when `--color-*` is not RN-native.

```tsx
import { useThemeColors, useIconColors } from '@thewhileloop/whileui';
import { Feather } from '@expo/vector-icons';

// Full palette (core semantic colors + status + overlay/effect tokens)
const colors = useThemeColors();

// Shorthand for icons: foreground, muted, primary, primaryForeground, accent, destructive
const iconColors = useIconColors();

<Feather name="heart" size={20} color={iconColors.muted} />
<Spinner color={colors.foreground} />  // Spinner defaults to this when color not passed
```

- **useThemeColors** / **useThemeTokens** — Returns RN-safe color strings (hex/rgb/rgba) for semantic tokens (`background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, status colors) plus effect tokens (`overlay`, `overlayStrong`, `surfaceElevated`, `surfaceTranslucent`, `surfaceTranslucentBorder`, etc.). Falls back to `--app-color-*` when `--color-*` is missing/non-RN-native.
- **useIconColors** — Subset for icons. Maps `muted` → `mutedForeground` (readable on backgrounds).

Input, Textarea, NumericInput, SmartInput, Spinner, and LoadingScreen default to theme colors when you omit `placeholderTextColor` or `spinnerColor`.

### Interaction and motion

Press opacity, disabled opacity, motion durations, the responsive spring, and the drawer
open and close durations are package constants on `INTERACTION_TOKENS`. They are not CSS
variables and they do not change with a preset. Delete any `--ui-press-*`,
`--ui-disabled-*`, `--ui-inactive-opacity`, `--ui-motion-*`, or `--ui-drawer-open-duration`
/ `--ui-drawer-close-duration` declarations from a theme: nothing reads them.

For a custom control, read that table:

```tsx
import { useInteractionTokens, withInteractivePressableStyle } from '@thewhileloop/whileui';
```

Wrap the application in `MotionProvider` to coordinate system reduced motion, an explicit
preview mode, and deterministic animation-free tests. The provider is optional. Without
it `useMotionPolicy` reports the durations and spring from `INTERACTION_TOKENS`, and
Reanimated follows the system setting. `reduced` preserves non-spatial feedback while asking Reanimated to skip motion;
`disabled` also resolves semantic durations to zero.

```tsx
import { MotionProvider, useMotionPolicy } from '@thewhileloop/whileui';

<MotionProvider mode="system">{/* application */}</MotionProvider>;

const motion = useMotionPolicy();
motion.durations.normal;
motion.springs.responsive;
```

Optional RN fallback tokens (hex/rgb/hsl/named):

```css
@layer theme {
  :root {
    @variant light {
      --app-color-primary: #000000;
      --app-color-primary-foreground: #ffffff;
      --app-color-foreground: #000000;
      --app-color-background: #ffffff;
      --app-color-card: #ffffff;
      --app-color-card-foreground: #000000;
      --app-color-popover: #ffffff;
      --app-color-popover-foreground: #000000;
      --app-color-secondary: #f5f5f5;
      --app-color-secondary-foreground: #171717;
      --app-color-muted: #f5f5f5;
      --app-color-muted-foreground: #737373;
      --app-color-border: #e5e5e5;
      --app-color-input: #e5e5e5;
      --app-color-ring: #94a3b8;
      --app-color-accent: #22c55e;
      --app-color-accent-foreground: #0a0a0a;
      --app-color-destructive: #dc2626;
      --app-color-destructive-foreground: #ffffff;
      --app-color-success: #16a34a;
      --app-color-success-foreground: #ffffff;
      --app-color-warning: #f59e0b;
      --app-color-warning-foreground: #111827;
      --app-color-info: #3b82f6;
      --app-color-info-foreground: #ffffff;
      --app-color-overlay: rgba(0, 0, 0, 0.4);
      --app-color-overlay-strong: rgba(0, 0, 0, 0.55);
      --app-color-surface-elevated: #ffffff;
      --app-color-surface-translucent: rgba(255, 255, 255, 0.5);
      --app-color-surface-translucent-border: rgba(255, 255, 255, 0.18);
      --app-color-surface-border: rgba(255, 255, 255, 0.3);
      --app-color-surface-highlight: rgba(255, 255, 255, 0.3);
      --app-color-state-hover: rgba(0, 0, 0, 0.05);
      --app-color-state-pressed: rgba(0, 0, 0, 0.12);
      --app-color-state-disabled: rgba(0, 0, 0, 0.4);
    }
    @variant dark {
      --app-color-primary: #ffffff;
      --app-color-primary-foreground: #000000;
      --app-color-foreground: #ffffff;
      --app-color-background: #000000;
      --app-color-card: #0f0f10;
      --app-color-card-foreground: #ffffff;
      --app-color-popover: #121214;
      --app-color-popover-foreground: #ffffff;
      --app-color-secondary: #2e2e2e;
      --app-color-secondary-foreground: #ffffff;
      --app-color-muted: #2e2e2e;
      --app-color-muted-foreground: #999999;
      --app-color-border: #3d3d3d;
      --app-color-input: #3d3d3d;
      --app-color-ring: #7c889a;
      --app-color-accent: #22c55e;
      --app-color-accent-foreground: #0a0a0a;
      --app-color-destructive: #dc2626;
      --app-color-destructive-foreground: #ffffff;
      --app-color-success: #22c55e;
      --app-color-success-foreground: #0a0a0a;
      --app-color-warning: #fbbf24;
      --app-color-warning-foreground: #111827;
      --app-color-info: #60a5fa;
      --app-color-info-foreground: #111827;
      --app-color-overlay: rgba(0, 0, 0, 0.5);
      --app-color-overlay-strong: rgba(0, 0, 0, 0.7);
      --app-color-surface-elevated: #111315;
      --app-color-surface-translucent: rgba(17, 19, 21, 0.45);
      --app-color-surface-translucent-border: rgba(255, 255, 255, 0.18);
      --app-color-surface-border: rgba(255, 255, 255, 0.18);
      --app-color-surface-highlight: rgba(255, 255, 255, 0.18);
      --app-color-state-hover: rgba(255, 255, 255, 0.08);
      --app-color-state-pressed: rgba(255, 255, 255, 0.15);
      --app-color-state-disabled: rgba(255, 255, 255, 0.4);
    }
  }
}
```

Or use the first-party theme bridge with optional persistence. The hook owns theme
state and exposes event-driven setters:

```tsx
import { useThemeBridge, type ThemeBridgeAdapter } from '@thewhileloop/whileui';

const adapter: ThemeBridgeAdapter = {
  loadThemeMode: async () => 'system',
  saveThemeMode: async (mode) => {
    await storage.setItem('theme-mode', mode);
  },
};

const { mode, resolvedTheme, setMode, cycleMode } = useThemeBridge({ adapter });
```

The bridge loads a new adapter before saving into it. If a user changes the mode while
storage is still loading, that explicit choice wins over the late persisted value.

When another store already owns the mode, mount the controlled bridge once near the
application root. Change `mode` in the owning event handler; the bridge applies and
persists it without mirroring state back through a callback effect.

```tsx
import { ThemeBridge } from '@thewhileloop/whileui';

<ThemeBridge mode={mode} adapter={adapter} />;
```

## Focus rings

Every interactive component draws a themed focus ring on web. It uses `:focus-visible`,
so it appears for keyboard users and not after a mouse click, and it is driven by the
`--color-ring` token — restyle it with your theme, not with component overrides.

Use the same treatment on your own controls:

```tsx
import { focusRing, focusRingInset, cn } from '@thewhileloop/whileui';

<Pressable className={cn('rounded-full px-4 py-2', focusRing)} onPress={onPress}>
  <Text>Custom control</Text>
</Pressable>;
```

| Export           | Use for                                                                         |
| ---------------- | ------------------------------------------------------------------------------- |
| `focusRing`      | Standalone controls — buttons, inputs, cards, nav items                         |
| `focusRingInset` | Controls flush inside a track, where an offset ring would clip (segments, tabs) |

**Do not use a bare `outline-none`.** It removes the browser's indicator and leaves
keyboard users with nothing, which fails WCAG 2.4.7. `focusRing` removes the default and
supplies a themed replacement in the same class. The one exemption is a visually hidden
input, where a visible proxy shows the focus instead — `OTPInput` does this with its
blinking cursor.

## Tech Stack

- **Styling**: [Uniwind](https://uniwind.dev) (free tier) + Tailwind CSS v4
- **Variants**: [tailwind-variants](https://www.tailwind-variants.org/) (`tv()`)
- **Merging**: [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Expo**: SDK 54
- **Monorepo**: bun + Turborepo

# API Reference

## Pressable

```tsx
import { Pressable, Text } from '@thewhileloop/whileui';

<Pressable
  accessibilityRole="button"
  feedback="strong"
  disabledFeedback="default"
  loading={false}
  onPress={() => {}}
>
  <Text>Open</Text>
</Pressable>;
```

`Pressable` preserves React Native's event, ref, accessibility, and function-style
`style` contracts. Feedback changes opacity without changing layout. Native press state
comes directly from React Native; web adds a motion-policy-aware opacity transition.

<!-- api:Pressable -->

| Prop             | Type              | Default     | Description                                                                 |
| ---------------- | ----------------- | ----------- | --------------------------------------------------------------------------- |
| className        | `string`          | —           | Additional Tailwind classes.                                                |
| feedback         | `PressedVariant`  | `'none'`    | Semantic press feedback. `none` preserves a plain React Native Pressable.   |
| disabledFeedback | `DisabledVariant` | `'default'` | Opacity used while the control is unavailable.                              |
| loading          | `boolean`         | `false`     | Loading controls are busy and non-interactive, just like disabled controls. |

Also accepts the props of React Native's `PressableProps`.
<!-- /api:Pressable -->

## Button

```tsx
import { Button, ButtonText, ButtonIcon } from '@thewhileloop/whileui';

<Button variant="default" size="default" disabled={false} loading={false} onPress={() => {}}>
  <ButtonIcon>
    <Icon />
  </ButtonIcon>
  <ButtonText>Click me</ButtonText>
  {/* Placement is child order — a trailing ButtonIcon renders after the label. */}
  <ButtonIcon>
    <Icon />
  </ButtonIcon>
</Button>;
```

<!-- api:Button -->

| Prop             | Type                                                                          | Default     | Description                                                             |
| ---------------- | ----------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| children         | `React.ReactNode`                                                             | —           |                                                                         |
| className        | `string`                                                                      | —           | Additional Tailwind classes.                                            |
| disabled         | `boolean`                                                                     | `false`     | Disable the button.                                                     |
| loading          | `boolean`                                                                     | `false`     | Shows a centered spinner, exposes busy state, and prevents interaction. |
| disabledFeedback | `DisabledVariant`                                                             | —           | Opacity used while the control is unavailable.                          |
| size             | `'sm' \| 'lg' \| 'default' \| 'icon'`                                         | `'default'` |                                                                         |
| variant          | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |                                                                         |

Also accepts the props of `PressableProps`.
<!-- /api:Button -->

## Text

`Text` maps semantic roles to the active visual typography tokens; custom font-size
classes are unnecessary for normal hierarchy. `heading` also sets
`accessibilityRole="header"` unless the caller supplies another role.

<!-- api:Text -->

| Prop      | Type                                                                                                       | Default     | Description |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----------- | ----------- |
| className | `string`                                                                                                   | —           |             |
| size      | `'base' \| 'xs' \| 'sm' \| 'lg' \| 'xl' \| '2xl' \| '3xl'`                                                 | —           |             |
| variant   | `'default' \| 'heading' \| 'title' \| 'subtitle' \| 'body' \| 'caption' \| 'label' \| 'eyebrow' \| 'code'` | `'default'` |             |

Also accepts the props of React Native's `TextProps`.
<!-- /api:Text -->

## Input

```tsx
import { Input } from '@thewhileloop/whileui';

<Input placeholder="Email" variant="default" value={value} onChangeText={setValue} />;
```

On web, filled Input, Textarea, NumericInput, and SmartInput surfaces preserve their
themed background, foreground, and caret when the browser autofills them.

<!-- api:Input -->

| Prop           | Type                              | Default     | Description |
| -------------- | --------------------------------- | ----------- | ----------- |
| aria-invalid   | `boolean`                         | —           |             |
| className      | `string`                          | —           |             |
| prefix         | `React.ReactNode`                 | —           |             |
| suffix         | `React.ReactNode`                 | —           |             |
| inputClassName | `string`                          | —           |             |
| variant        | `'default' \| 'error' \| 'plain'` | `'default'` |             |

Also accepts the props of `TextInputProps`.
<!-- /api:Input -->

## NumericInput

```tsx
import { NumericInput } from '@thewhileloop/whileui';

<NumericInput
  value={amount}
  onValueChange={setAmount}
  prefix={<Text className="text-muted-foreground">$</Text>}
  suffix={<Text className="text-muted-foreground">USD</Text>}
  min={0}
  step={0.5}
  showSteppers
  size="compact"
/>;
```

<!-- api:NumericInput -->

| Prop           | Type                              | Default     | Description                                                                                                            |
| -------------- | --------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| aria-invalid   | `boolean`                         | —           |                                                                                                                        |
| className      | `string`                          | —           |                                                                                                                        |
| inputClassName | `string`                          | —           |                                                                                                                        |
| prefix         | `React.ReactNode`                 | —           |                                                                                                                        |
| suffix         | `React.ReactNode`                 | —           |                                                                                                                        |
| value          | `number \| null`                  | —           | Controlled numeric value.                                                                                              |
| defaultValue   | `number`                          | —           |                                                                                                                        |
| onValueChange  | `(value: number \| null) => void` | —           | Numeric value change callback.                                                                                         |
| min            | `number`                          | —           |                                                                                                                        |
| max            | `number`                          | —           |                                                                                                                        |
| step           | `number`                          | `1`         |                                                                                                                        |
| showSteppers   | `boolean`                         | `false`     | Show decrement/increment controls.                                                                                     |
| unstyled       | `boolean`                         | `false`     | Drop the field shell (border, background, radius, padding) for embedding inside another field shell like LabeledField. |
| size           | `'default' \| 'compact'`          | `'default'` |                                                                                                                        |
| variant        | `'default' \| 'error'`            | `'default'` |                                                                                                                        |

Also accepts the props of `TextInputProps`.
<!-- /api:NumericInput -->

## OTPInput

```tsx
import { OTPInput } from '@thewhileloop/whileui';

<OTPInput
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => verify(code)}
  length={6}
  variant="default"
/>;
```

<!-- api:OTPInput -->

| Prop          | Type                      | Default     | Description                        |
| ------------- | ------------------------- | ----------- | ---------------------------------- |
| length        | `number`                  | `6`         | Number of digit cells.             |
| value         | `string`                  | —           | Controlled value.                  |
| onValueChange | `(value: string) => void` | —           | Called on each digit change.       |
| onComplete    | `(code: string) => void`  | —           | Called when all digits are filled. |
| variant       | `'default' \| 'error'`    | `'default'` | Error variant triggers shake.      |
| size          | `'default' \| 'compact'`  | `'default'` | Cell size.                         |
| secure        | `boolean`                 | `false`     | Mask digits with dots.             |
| disabled      | `boolean`                 | `false`     |                                    |
| autoFocus     | `boolean`                 | `false`     | Focus first cell on mount.         |
| className     | `string`                  | —           |                                    |

Also accepts the props of `ViewProps`.
<!-- /api:OTPInput -->

## FormField

```tsx
import {
  FormField,
  FormLabel,
  FormControl,
  FormHint,
  FormMessage,
  Input,
} from '@thewhileloop/whileui';

<FormField required invalid={Boolean(error)}>
  <FormLabel>Email</FormLabel>
  <FormControl>
    <Input placeholder="you@example.com" />
  </FormControl>
  {error ? <FormMessage>{error}</FormMessage> : <FormHint>We'll never share your email.</FormHint>}
</FormField>;
```

`invalid` and `disabled` are inherited by `Input`, `Textarea`, `NumericInput`, and
`Select`. An explicit control prop wins. `useFormFieldState()` exposes the same state for
custom controls; labels, hints, messages, density, and required indicators remain part
of the compound field rather than each input.

`FormLabel` names the `Input`, `Textarea` or `NumericInput` beside it for assistive
technology (`aria-labelledby` on web and Android; `useFormFieldState().labelId` gives a
custom control the same id). A label passed to the control itself wins.

## Surface

```tsx
import { Surface } from '@thewhileloop/whileui';

<Surface level="raised" padding="default">
  {/* grouped content */}
</Surface>;
```

<!-- api:Surface -->

| Prop          | Type                           | Default             | Description                          |
| ------------- | ------------------------------ | ------------------- | ------------------------------------ |
| level         | `SurfaceLevel`                 | `'base'`            | Semantic background and depth tier.  |
| padding       | `SurfacePaddingSize`           | `'default'`         | Token-backed interior spacing.       |
| radius        | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'xl'`              | Token-backed corner radius.          |
| bordered      | `boolean`                      | `true`              | Draw the theme hairline border.      |
| shadow        | `ShadowTier`                   | —                   | Override the level's depth.          |
| className     | `string`                       | —                   |                                      |
| frosted       | `boolean`                      | `false`             | Enable the optional frosted overlay. |
| blurIntensity | `number`                       | subtle preset       | Override blur amount directly.       |
| blurTintToken | `FrostedTintToken`             | `LEVEL_TINT[level]` | Tint token used for frosted mode.    |

Also accepts the props of `ViewProps`.
<!-- /api:Surface -->

## LabeledField

```tsx
import { LabeledField, LabeledFieldControl, Input } from '@thewhileloop/whileui';

<LabeledField
  label="Username"
  hint="3-20 characters"
  leftSlot={<Icon />}
  rightSlot={
    <Button size="sm">
      <ButtonText>Check</ButtonText>
    </Button>
  }
>
  <LabeledFieldControl>
    <Input className="border-0 bg-transparent px-0" />
  </LabeledFieldControl>
</LabeledField>;
```

## SegmentedControl

```tsx
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemText,
} from '@thewhileloop/whileui';

<SegmentedControl value={unit} onValueChange={setUnit} variant="pill" wrap>
  <SegmentedControlItem value="metric">
    <SegmentedControlItemText>Metric</SegmentedControlItemText>
  </SegmentedControlItem>
  <SegmentedControlItem value="imperial">
    <SegmentedControlItemText>Imperial</SegmentedControlItemText>
  </SegmentedControlItem>
</SegmentedControl>;
```

<!-- api:SegmentedControl -->

| Prop          | Type                      | Default     | Description                |
| ------------- | ------------------------- | ----------- | -------------------------- |
| value         | `string`                  | —           |                            |
| defaultValue  | `string`                  | `''`        |                            |
| onValueChange | `(value: string) => void` | —           |                            |
| variant       | `'default' \| 'pill'`     | `'default'` | Pill = rounded-full items. |
| wrap          | `boolean \| 'auto'`       | `true`      |                            |
| size          | `'default' \| 'compact'`  | `'default'` |                            |
| disabled      | `boolean`                 | `false`     |                            |
| className     | `string`                  | —           |                            |

Also accepts the props of `ViewProps`.
<!-- /api:SegmentedControl -->

## DataRow

```tsx
import {
  DataRow,
  DataRowLeft,
  DataRowCenter,
  DataRowRight,
  DataRowLabel,
  DataRowDescription,
  DataRowValue,
  Avatar,
  AvatarFallback,
} from '@thewhileloop/whileui';

<DataRow>
  <DataRowLeft>
    <Avatar size="sm">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  </DataRowLeft>
  <DataRowCenter>
    <DataRowLabel>Jane Doe</DataRowLabel>
    <DataRowDescription>Product Designer</DataRowDescription>
  </DataRowCenter>
  <DataRowRight>
    <DataRowValue>Owner</DataRowValue>
  </DataRowRight>
</DataRow>;
```

## Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@thewhileloop/whileui';

<Card padding="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Footer */}</CardFooter>
</Card>;

<Card unstyled padding="none" className="rounded-xl border border-border bg-card">
  {/* advanced custom layouts */}
</Card>;
```

<!-- api:Card -->

| Prop          | Type                                  | Default     | Description                                             |
| ------------- | ------------------------------------- | ----------- | ------------------------------------------------------- |
| shadow        | `ShadowTier`                          | `'sm'`      | Elevation tier; 'sm' by default, 'none' for flat cards. |
| className     | `string`                              | —           |                                                         |
| padding       | `'none' \| 'sm' \| 'lg' \| 'default'` | `'default'` |                                                         |
| unstyled      | `boolean`                             | `false`     |                                                         |
| frosted       | `boolean`                             | `false`     | Enable the optional frosted overlay.                    |
| blurIntensity | `number`                              | —           | Override blur amount directly.                          |
| blurTintToken | `FrostedTintToken`                    | —           | Tint token used for frosted mode.                       |

Also accepts the props of `ViewProps`.
<!-- /api:Card -->

## Badge

```tsx
import { Badge, BadgeText } from '@thewhileloop/whileui';

<Badge variant="default">
  <BadgeText>New</BadgeText>
</Badge>;
```

<!-- api:Badge -->

| Prop      | Type                                                                                                                                                                                                | Default     | Description |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- |
| className | `string`                                                                                                                                                                                            | —           |             |
| variant   | `'default' \| 'soft' \| 'destructive' \| 'outline' \| 'secondary' \| 'success' \| 'warning' \| 'info' \| 'soft-secondary' \| 'soft-destructive' \| 'soft-success' \| 'soft-warning' \| 'soft-info'` | `'default'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Badge -->

## Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@thewhileloop/whileui';

<Alert variant="default">
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Something happened.</AlertDescription>
</Alert>;
```

<!-- api:Alert -->

| Prop      | Type                                                             | Default     | Description |
| --------- | ---------------------------------------------------------------- | ----------- | ----------- |
| className | `string`                                                         | —           |             |
| variant   | `'default' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Alert -->

## Dialog

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@thewhileloop/whileui';

<Dialog>
  <DialogTrigger asChild>
    <Button>
      <ButtonText>Open</ButtonText>
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <DialogClose asChild>
        <Button>
          <ButtonText>Close</ButtonText>
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

`DialogContent` supports frosted props:

<!-- api:DialogContent -->

| Prop          | Type               | Default                | Description                          |
| ------------- | ------------------ | ---------------------- | ------------------------------------ |
| className     | `string`           | —                      |                                      |
| frosted       | `boolean`          | `false`                | Enable the optional frosted overlay. |
| blurIntensity | `number`           | medium preset          | Override blur amount directly.       |
| blurTintToken | `FrostedTintToken` | `'surfaceTranslucent'` | Tint token used for frosted mode.    |

Also accepts the props of `ViewProps`.
<!-- /api:DialogContent -->

## AlertDialog

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@thewhileloop/whileui';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      <ButtonText>Delete</ButtonText>
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>;
```

`AlertDialogContent` supports the same frosted props as `DialogContent`.

<!-- api:AlertDialogContent -->

| Prop          | Type                      | Default                | Description                                                                                                                                                                                                                          |
| ------------- | ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| className     | `string`                  | —                      |                                                                                                                                                                                                                                      |
| presentation  | `AlertDialogPresentation` | `'modal'`              | `modal` — RN `Modal` + themed card (default). `native` — `Alert.alert` on iOS/Android (system chrome); ignored on web. `overlay` — same themed card as `modal`, but absolute fill inside the parent view (nest inside your `Modal`). |
| frosted       | `boolean`                 | `false`                | Enable the optional frosted overlay.                                                                                                                                                                                                 |
| blurIntensity | `number`                  | medium preset          | Override blur amount directly.                                                                                                                                                                                                       |
| blurTintToken | `FrostedTintToken`        | `'surfaceTranslucent'` | Tint token used for frosted mode.                                                                                                                                                                                                    |

Also accepts the props of `ViewProps`.
<!-- /api:AlertDialogContent -->

### React Native: stacked modals

Render a confirmation **inside** the overlay it belongs to. An `AlertDialog` or `Dialog`
nested in a `Sheet` opens above it, and Android back or Escape closes the confirmation
before the sheet. If `AlertDialog` must be a **sibling** of another fullscreen `Modal`, iOS
often fails to show a second `Modal` on top; use **`presentation="overlay"`** inside that
`Modal`, or **`presentation="native"`** for a system `Alert.alert` when themed UI is not
required.

## Checkbox

```tsx
import { Checkbox } from '@thewhileloop/whileui';

<Checkbox checked={checked} onCheckedChange={setChecked} />;
```

<!-- api:Checkbox -->

| Prop            | Type                         | Default | Description |
| --------------- | ---------------------------- | ------- | ----------- |
| checked         | `boolean`                    | —       |             |
| defaultChecked  | `boolean`                    | `false` |             |
| onCheckedChange | `(checked: boolean) => void` | —       |             |
| disabled        | `boolean`                    | `false` |             |
| className       | `string`                     | —       |             |

Also accepts the props of `ViewProps`.
<!-- /api:Checkbox -->

## Switch

```tsx
import { Switch } from '@thewhileloop/whileui';

<Switch checked={checked} onCheckedChange={setChecked} />;
```

<!-- api:Switch -->

| Prop            | Type                         | Default | Description |
| --------------- | ---------------------------- | ------- | ----------- |
| checked         | `boolean`                    | —       |             |
| defaultChecked  | `boolean`                    | `false` |             |
| onCheckedChange | `(checked: boolean) => void` | —       |             |
| disabled        | `boolean`                    | `false` |             |
| className       | `string`                     | —       |             |

Also accepts the props of `ViewProps`.
<!-- /api:Switch -->

## RadioGroup

```tsx
import { RadioGroup, RadioGroupItem } from '@thewhileloop/whileui';

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>;
```

## Select

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@thewhileloop/whileui';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent frosted blurIntensity={24} blurTintToken="surfaceTranslucent">
    <SelectItem label="Option 1" value="1" />
    <SelectItem label="Option 2" value="2" />
  </SelectContent>
</Select>;
```

Focused and pressed options use the subtle interaction-state tokens; the primary token
marks the selected indicator without replacing the option's foreground colour. Long
selected values stay on one line and truncate without displacing the trigger chevron.
For popover presentation on web, the options panel matches the trigger width, caps
itself to the collision-available viewport, and wraps long option labels inside it.

`SelectContent` supports optional frosted props:

<!-- api:SelectContent -->

| Prop          | Type                                                               | Default       | Description                          |
| ------------- | ------------------------------------------------------------------ | ------------- | ------------------------------------ |
| className     | `string`                                                           | —             |                                      |
| portalHost    | `string`                                                           | —             |                                      |
| insets        | `{ top?: number; bottom?: number; left?: number; right?: number }` | —             |                                      |
| frosted       | `boolean`                                                          | `false`       | Enable the optional frosted overlay. |
| blurIntensity | `number`                                                           | subtle preset | Override blur amount directly.       |
| blurTintToken | `FrostedTintToken`                                                 | `'popover'`   | Tint token used for frosted mode.    |

Also accepts the props of the underlying primitive.
<!-- /api:SelectContent -->

`SelectContent` keeps its listbox inside the safe area by default; pass `insets` only to
change that margin. A list taller than the screen scrolls inside the listbox on every
platform. Inside a Dialog, Sheet or other WhileUI overlay it renders in that
overlay's layer automatically. Option values must be non-empty strings: the web
primitive rejects `""`, so model "none" as an explicit value such as `'none'`.

## Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@thewhileloop/whileui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">
      <Text>Tab 1</Text>
    </TabsTrigger>
    <TabsTrigger value="tab2">
      <Text>Tab 2</Text>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">{/* Content 1 */}</TabsContent>
  <TabsContent value="tab2">{/* Content 2 */}</TabsContent>
</Tabs>;
```

## Accordion

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@thewhileloop/whileui';

<Accordion type="single" collapsible>
  <AccordionItem value="item1">
    <AccordionTrigger>
      <Text>Section 1</Text>
    </AccordionTrigger>
    <AccordionContent>
      <Text>Content 1</Text>
    </AccordionContent>
  </AccordionItem>
</Accordion>;
```

<!-- api:Accordion -->

| Prop         | Type                 | Default    | Description |
| ------------ | -------------------- | ---------- | ----------- |
| type         | `AccordionType`      | `'single'` |             |
| defaultValue | `string \| string[]` | —          |             |
| collapsible  | `boolean`            | `true`     |             |
| className    | `string`             | —          |             |

Also accepts the props of `ViewProps`.
<!-- /api:Accordion -->

## Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@thewhileloop/whileui';

<Avatar size="default">
  <AvatarImage source={{ uri: 'https://...' }} />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>;
```

<!-- api:Avatar -->

| Prop      | Type                                | Default     | Description |
| --------- | ----------------------------------- | ----------- | ----------- |
| className | `string`                            | —           |             |
| size      | `'sm' \| 'lg' \| 'xl' \| 'default'` | `'default'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Avatar -->

`AvatarImage` keeps `AvatarFallback` visible while loading or after an error. Its
`onLoadingStatusChange` callback reports `'loading'`, `'loaded'`, and `'error'`, including
when a changed source begins loading, while the standard image event callbacks still run.

## Progress

```tsx
import { Progress } from '@thewhileloop/whileui';

<Progress value={50} size="default" />;
```

<!-- api:Progress -->

| Prop               | Type                        | Default     | Description |
| ------------------ | --------------------------- | ----------- | ----------- |
| value              | `number`                    | `0`         |             |
| indicatorClassName | `string`                    | —           |             |
| className          | `string`                    | —           |             |
| size               | `'sm' \| 'lg' \| 'default'` | `'default'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Progress -->

## Toast

```tsx
import { ToastProvider, ToastContainer, useToast } from '@thewhileloop/whileui';

// Wrap app
<ToastProvider>
  <App />
  <ToastContainer position="top" />
</ToastProvider>;

// Use in component
const { toast } = useToast();
toast({ title: 'Success', description: 'Saved!', variant: 'success' });
```

| Toast Options | Type                                      |
| ------------- | ----------------------------------------- |
| title         | `string`                                  |
| description   | `string`                                  |
| variant       | `'default' \| 'success' \| 'destructive'` |
| duration      | `number` (ms)                             |

Each toast owns its duration from the moment it appears; adding or dismissing another
toast does not restart timers already in progress.

Every variant sits on the theme's `popover` surface; `success` and `destructive` mark the
toast with a status dot and tinted border rather than a solid fill. The stack is capped
at `max-w-md` and centred, which never engages on a phone. A toast is announced politely
to screen readers without taking focus, and its slide-in follows the motion policy.

## Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@thewhileloop/whileui';

<Popover>
  <PopoverTrigger asChild>
    <Button>
      <ButtonText>Open</ButtonText>
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Text>Popover content</Text>
  </PopoverContent>
</Popover>;
```

`PopoverContent` supports frosted props:

<!-- api:PopoverContent -->

| Prop          | Type                     | Default       | Description                                                                                           |
| ------------- | ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------- |
| className     | `string`                 | —             |                                                                                                       |
| portalHost    | `string`                 | —             |                                                                                                       |
| insets        | `Partial<OverlayInsets>` | —             | Collision padding. Defaults to safe area plus a margin so the panel never sits flush against an edge. |
| frosted       | `boolean`                | `false`       | Enable the optional frosted overlay.                                                                  |
| blurIntensity | `number`                 | subtle preset | Override blur amount directly.                                                                        |
| blurTintToken | `FrostedTintToken`       | `'popover'`   | Tint token used for frosted mode.                                                                     |

Also accepts the props of the underlying primitive.
<!-- /api:PopoverContent -->

## DropdownMenu

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@thewhileloop/whileui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>
      <ButtonText>Menu</ButtonText>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Text>Edit</Text>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Text>Delete</Text>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

`DropdownMenuContent`, `ContextMenuContent`, and `MenubarContent` support the same frosted props as `PopoverContent` (default blur preset: medium).

## HoverCard

`HoverCardContent` supports the same frosted props as `PopoverContent` (default blur preset: subtle).

## ContextMenu

`ContextMenuContent` supports the same frosted props as `PopoverContent` (default blur preset: medium).

## Menubar

```tsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarLabel,
  MenubarItem,
  MenubarSeparator,
} from '@thewhileloop/whileui';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>
      <Text className="text-foreground text-sm">File</Text>
    </MenubarTrigger>
    <MenubarContent>
      <MenubarLabel>Project</MenubarLabel>
      <MenubarItem>
        <Text className="text-foreground">New Project</Text>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        <Text className="text-foreground">Export</Text>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>;
```

`MenubarLabel` is a non-interactive section heading. It takes a string or elements, and
announces as a heading to assistive technology — as do `DropdownMenuLabel` and
`ContextMenuLabel`.

`MenubarContent` supports the same frosted props as `PopoverContent` (default blur preset: medium).

---

# Blocks API

## SignInForm

Copy `sign-in-form.tsx` and its sibling `auth-form-footer.tsx` from
`apps/showcase/catalog/templates/auth/`, then:

```tsx
import { SignInForm } from './templates/auth'; // or your path

<SignInForm
  onSubmit={({ email, password }) => signIn(email, password)}
  onForgotPassword={() => navigate('ForgotPassword')}
  onSignUp={() => navigate('SignUp')}
  onGooglePress={() => signInWithGoogle()}
  onApplePress={() => signInWithApple()}
/>;
```

| Prop             | Type                                  | Description                  |
| ---------------- | ------------------------------------- | ---------------------------- |
| onSubmit         | `(data: { email, password }) => void` | Called on sign-in submit     |
| onForgotPassword | `() => void`                          | Called when "Forgot?" tapped |
| onSignUp         | `() => void`                          | Called when "Sign Up" tapped |
| onGooglePress    | `() => void`                          | Called when Google tapped    |
| onApplePress     | `() => void`                          | Called when Apple tapped     |

## SignUpForm

Copy `sign-up-form.tsx` and its sibling `auth-form-footer.tsx` from
`apps/showcase/catalog/templates/auth/`, then:

```tsx
import { SignUpForm } from './templates/auth'; // or your path

<SignUpForm
  onSubmit={({ firstName, lastName, email, password }) =>
    signUp(firstName, lastName, email, password)
  }
  onSignIn={() => navigate('SignIn')}
  onGooglePress={() => signInWithGoogle()}
  onApplePress={() => signInWithApple()}
/>;
```

| Prop          | Type                                                       | Description                  |
| ------------- | ---------------------------------------------------------- | ---------------------------- |
| onSubmit      | `(data: { firstName, lastName, email, password }) => void` | Called on registration       |
| onSignIn      | `() => void`                                               | Called when "Sign In" tapped |
| onGooglePress | `() => void`                                               | Called when Google tapped    |
| onApplePress  | `() => void`                                               | Called when Apple tapped     |

## BottomNav

```tsx
import { BottomNav } from '@thewhileloop/whileui';

<BottomNav
  items={[
    { key: 'home', label: 'Home', icon: <Icon /> },
    { key: 'profile', label: 'Profile', icon: <Icon />, badge: 3 },
  ]}
  activeKey="home"
  onSelect={(key) => {}}
/>;
```

## AppShell

Layout shell for full-screen pages. Keep shell chrome mounted and swap only content via `loading` + `skeleton`.

```tsx
import { AppShell, PageSkeleton } from '@thewhileloop/whileui';

<AppShell
  header={<Header title="Settings" />}
  bottomNav={<BottomNav items={[...]} activeKey="settings" onSelect={setTab} />}
  loading={loading}
  skeleton={<PageSkeleton variant="settings" headerPlaceholder />}
>
  <ScrollView className="flex-1 p-4">{/* Content */}</ScrollView>
</AppShell>;
```

<!-- api:AppShell -->

| Prop      | Type              | Default | Description                                               |
| --------- | ----------------- | ------- | --------------------------------------------------------- |
| header    | `React.ReactNode` | —       | Header slot.                                              |
| footer    | `React.ReactNode` | —       | Footer slot.                                              |
| bottomNav | `React.ReactNode` | —       | Bottom navigation slot.                                   |
| safeArea  | `boolean`         | `true`  | Wrap in SafeAreaView.                                     |
| loading   | `boolean`         | `false` | Keep shell mounted while swapping content with skeleton.  |
| skeleton  | `React.ReactNode` | —       | Optional custom loading placeholder for the content area. |
| className | `string`          | —       |                                                           |

Also accepts the props of `ViewProps`.
<!-- /api:AppShell -->

## ActionBar

```tsx
import { ActionBar, Button, ButtonText } from '@thewhileloop/whileui';

<ActionBar>
  <Button variant="outline" className="flex-1">
    <ButtonText>Cancel</ButtonText>
  </Button>
  <Button className="flex-1">
    <ButtonText>Save</ButtonText>
  </Button>
</ActionBar>;
```

## KeyboardAwareScreen and DockedInput

Use one keyboard-aware root for the screen, then place the composer in a bottom dock. Feed the dock height into the scroll content inset so the last item remains visible.

```tsx
import { DockedInput, KeyboardAwareScreen, SmartInput } from '@thewhileloop/whileui';

<KeyboardAwareScreen>
  <ScrollView contentContainerStyle={{ paddingBottom: inputHeight }} />
  <DockedInput onHeightChange={setInputHeight}>
    <SmartInput variant="card" safeArea={false} />
  </DockedInput>
</KeyboardAwareScreen>;
```

## SmartInput

Compose input for use inline or inside `DockedInput`. `variant`: "bar" or "card". Slots: `leftSlot`, `centerSlot` (intent selector), `rightSlot`. `submitBehavior`: "newline" (default) or "submit"/"blurAndSubmit". `placeholderExamples` animates rotating prompts and respects the platform reduced-motion setting. Forwards ref to `TextInput`.

```tsx
import { SmartInput, Button, ButtonText } from '@thewhileloop/whileui';

<SmartInput
  value={message}
  onChangeText={setMessage}
  placeholderExamples={['Log breakfast', 'Add a 30 minute walk', 'Set weight to 72 kg']}
  leftSlot={
    <Button variant="ghost" size="icon" accessibilityLabel="Add">
      <Icon name="add" />
    </Button>
  }
  rightSlot={
    <Button size="icon" onPress={handleSend}>
      <ButtonText>Send</ButtonText>
    </Button>
  }
/>;
```

## ChatConversation / Chat

`ChatConversation` is the low-level viewport for custom conversation screens. Its content stays constrained on wide windows, follows new or streaming output while the reader is near the bottom, and stops following after the reader scrolls upward. Compose it with `SmartInput`; the application owns message data, streaming, tools, approvals, and sources.

It is a `ScrollView` for a bounded active transcript. Paginate or window historical messages; use a virtualized list when the full history can grow without a bound.

```tsx
import { ChatConversation, SmartInput, View } from '@thewhileloop/whileui';

<View className="flex-1">
  <ChatConversation contentContainerClassName="gap-4 px-4 py-6">
    {messages.map((message) => (
      <ProductMessage key={message.id} message={message} />
    ))}
  </ChatConversation>
  <SmartInput
    value={value}
    onChangeText={setValue}
    onSubmitEditing={send}
    submitBehavior="submit"
    leftSlot={<AttachButton />}
    centerSlot={<ModelSelect />}
    rightSlot={<SendButton />}
  />
</View>;
```

`Chat` is the opinionated convenience composition: message bubbles, suggestion chips, and `SmartInput` with attach/send slots. It uses semantic tokens; theme via `global.css`. Use `renderMessage` for markdown, code, tool calls, reasoning, or sources, and `loadingIndicator` for streaming feedback.

```tsx
import { Chat, type ChatMessage } from '@thewhileloop/whileui';

const [messages, setMessages] = useState<ChatMessage[]>([...]);
const [value, setValue] = useState('');

<Chat
  messages={messages}
  value={value}
  onChangeText={setValue}
  onSend={() => { /* append user msg, clear input */ }}
  placeholder="Message..."
  suggestions={['Summarize this', 'Explain simply', 'Translate']}
  onSuggestionPress={(text) => setValue(text)}
  emptyTitle="How can I help?"
  emptyDescription="Ask anything."
  leftSlot={<Button variant="ghost" size="icon" accessibilityLabel="Attach"><Icon name="paperclip" /></Button>}
  rightSlot={<Button size="icon" accessibilityLabel="Send" onPress={handleSend}><Icon name="send" /></Button>}
/>;
```

<!-- api:Chat -->

| Prop                    | Type                                        | Default             | Description                                                                              |
| ----------------------- | ------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| messages (required)     | `ChatMessage[]`                             | —                   | Messages to show, each `{ id, role, content, secondary?, contentSize? }`.                |
| value (required)        | `string`                                    | —                   | Input value.                                                                             |
| onChangeText (required) | `(text: string) => void`                    | —                   | Input change.                                                                            |
| onSend (required)       | `() => void`                                | —                   | Send handler.                                                                            |
| placeholder             | `string`                                    | `'Message...'`      |                                                                                          |
| suggestions             | `string[]`                                  | `EMPTY_SUGGESTIONS` | Chips when empty.                                                                        |
| onSuggestionPress       | `(text: string) => void`                    | —                   |                                                                                          |
| leftSlot                | `React.ReactNode`                           | —                   |                                                                                          |
| rightSlot               | `React.ReactNode`                           | —                   |                                                                                          |
| loading                 | `boolean`                                   | `false`             |                                                                                          |
| header                  | `React.ReactNode`                           | —                   |                                                                                          |
| emptyTitle              | `string`                                    | —                   |                                                                                          |
| emptyDescription        | `string`                                    | —                   |                                                                                          |
| exampleMessage          | `ChatMessage`                               | —                   | Example message shown in empty state so users see the bubble UI.                         |
| renderMessage           | `(message: ChatMessage) => React.ReactNode` | —                   | Custom message renderer (markdown, code, images). Falls back to ChatMessageBubble.       |
| loadingIndicator        | `React.ReactNode`                           | —                   | Shown at bottom when loading (typing indicator).                                         |
| inputSafeArea           | `boolean`                                   | `true`              | Passed to SmartInput. Use false when Chat is in a contained demo.                        |
| keyboardVerticalOffset  | `number`                                    | `0`                 | Offset for KeyboardAvoidingView when Chat has a header (e.g. StatusBar + header height). |
| className               | `string`                                    | —                   |                                                                                          |
| messagesClassName       | `string`                                    | —                   |                                                                                          |

<!-- /api:Chat -->

`ChatConversation` extends React Native `ScrollViewProps`, forwards its ref, and adds `contentContainerClassName` to style the constrained inner column. Caller `onScroll` and `onContentSizeChange` callbacks are preserved.

### Optional Markdown and code

These are explicit subpaths so the root package remains independent of a Markdown
parser. Install `markdown-it` only in applications that render Markdown.

```tsx
import { Markdown } from '@thewhileloop/whileui/markdown';
import { CodeBlock } from '@thewhileloop/whileui/code';

<Markdown onLinkPress={openLink}>{assistantText}</Markdown>
<CodeBlock code={source} language="TypeScript" actions={<CopyButton />} />
```

`Markdown` supports headings, paragraphs, emphasis, links, lists, quotes, rules, inline
code, and fenced code. It never opens links or writes to the clipboard itself:
`onLinkPress` and `codeActions` keep those capabilities in the application. `CodeBlock`
is dependency-free and accepts an application-owned `actions` slot.

## SmartImage

```tsx
import { SmartImage } from '@thewhileloop/whileui';

<SmartImage
  source={{ uri: imageUrl }}
  fallbackSource={{ uri: fallbackUrl }}
  alt="Product preview"
  className="h-48 w-full"
/>;
```

<!-- api:SmartImage -->

| Prop              | Type                                               | Default   | Description |
| ----------------- | -------------------------------------------------- | --------- | ----------- |
| className         | `string`                                           | —         |             |
| source (required) | `ImageProps['source']`                             | —         |             |
| alt (required)    | `string`                                           | —         |             |
| skeleton          | `boolean`                                          | `true`    |             |
| skeletonClassName | `string`                                           | —         |             |
| transition        | `number`                                           | `200`     |             |
| onLoad            | `() => void`                                       | —         |             |
| onError           | `() => void`                                       | —         |             |
| fallbackSource    | `ImageProps['source']`                             | —         |             |
| radius            | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`    |             |
| objectFit         | `'fill' \| 'cover' \| 'contain' \| 'scale-down'`   | `'cover'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:SmartImage -->

The skeleton returns whenever the primary image starts loading again. A failed primary
source switches to `fallbackSource` when supplied without re-entering a primary/fallback
loop.

## DatePickerModal / DatePickerInline / DateRangePickerModal / TimePickerModal

Date selection blocks using react-native-calendars. Theme-aware via `useCalendarTheme` (Uniwind light/dark). Optional `theme` prop for custom RN color strings (hex/rgb/hsl/named). `CalendarTheme` maps to react-native-calendars Theme and supports `arrowColor`, `disabledArrowColor`, and optional font keys.

**DatePickerModal** — Compact trigger opens bottom sheet with calendar. Use `DatePickerTrigger` as the trigger content.

**DatePickerInline** — Calendar embedded inline for forms or dashboards.

**DateRangePickerModal** — Range selection with period marking. Use `DateRangePickerTrigger` as the trigger content.

**TimePickerModal** — Hour and minute wheels (plus AM/PM under a 12-hour `hourCycle`) in the same bottom sheet, so a form's date and time fields open the same way. `value` is always `HH:MM` in 24-hour form. Each wheel is one `adjustable` element for assistive tech and the keyboard. Use `TimePickerTrigger` as the trigger content.

```tsx
import {
  DatePickerModal,
  DatePickerTrigger,
  DatePickerInline,
  DateRangePickerModal,
  DateRangePickerTrigger,
  TimePickerModal,
  TimePickerTrigger,
  type DateRange,
} from '@thewhileloop/whileui';

// Single date (modal)
const [date, setDate] = useState<string | null>(null);
const [open, setOpen] = useState(false);

<DatePickerModal
  value={date}
  onValueChange={setDate}
  open={open}
  onOpenChange={setOpen}
  trigger={<DatePickerTrigger value={date} placeholder="Pick a date" />}
  title="Select date"
/>;

// Inline calendar
<DatePickerInline value={date} onValueChange={setDate} />;

// Date range (modal)
const [range, setRange] = useState<DateRange | null>(null);

<DateRangePickerModal
  value={range}
  onValueChange={setRange}
  open={rangeOpen}
  onOpenChange={setRangeOpen}
  trigger={<DateRangePickerTrigger value={range} placeholder="Pick range" />}
/>;

// Time (modal) — "HH:MM", 24-hour, whatever the wheels show
const [time, setTime] = useState<string | null>(null);

<TimePickerModal
  value={time}
  onValueChange={setTime}
  open={timeOpen}
  onOpenChange={setTimeOpen}
  minuteStep={5}
  trigger={<TimePickerTrigger value={time} placeholder="Pick a time" />}
/>;
```

<!-- api:DatePickerModal -->

| Prop                    | Type                             | Default                | Description                                               |
| ----------------------- | -------------------------------- | ---------------------- | --------------------------------------------------------- |
| value                   | `string \| null`                 | —                      | Controlled: selected date in YYYY-MM-DD                   |
| onValueChange           | `(date: string \| null) => void` | —                      | Controlled: change handler                                |
| open (required)         | `boolean`                        | —                      | Modal open state                                          |
| onOpenChange (required) | `(open: boolean) => void`        | —                      | Modal open change handler                                 |
| minDate                 | `string`                         | —                      | Minimum selectable date YYYY-MM-DD                        |
| maxDate                 | `string`                         | —                      | Maximum selectable date YYYY-MM-DD                        |
| theme                   | `CalendarTheme`                  | —                      | Override calendar theme (RN color strings)                |
| trigger                 | `React.ReactNode`                | —                      | Trigger element. If not provided, no trigger is rendered. |
| title                   | `string`                         | `'Select date'`        | Title shown in modal header                               |
| confirmLabel            | `string`                         | `'Done'`               | Button label for confirm                                  |
| className               | `string`                         | —                      |                                                           |
| frosted                 | `boolean`                        | `false`                | Enable the optional frosted overlay.                      |
| blurIntensity           | `number`                         | medium preset          | Override blur amount directly.                            |
| blurTintToken           | `FrostedTintToken`               | `'surfaceTranslucent'` | Tint token used for frosted mode.                         |

<!-- /api:DatePickerModal -->

## ConfirmActionSheet

```tsx
import { ConfirmActionSheet } from '@thewhileloop/whileui';

<ConfirmActionSheet
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={() => deleteProject()}
/>;
```

<!-- api:ConfirmActionSheet -->

| Prop                    | Type                         | Default                | Description                          |
| ----------------------- | ---------------------------- | ---------------------- | ------------------------------------ |
| open (required)         | `boolean`                    | —                      |                                      |
| onOpenChange (required) | `(open: boolean) => void`    | —                      |                                      |
| title (required)        | `string`                     | —                      |                                      |
| description             | `string`                     | —                      |                                      |
| actions                 | `ConfirmActionSheetAction[]` | —                      |                                      |
| confirmLabel            | `string`                     | `'Confirm'`            |                                      |
| cancelLabel             | `string`                     | `'Cancel'`             |                                      |
| onConfirm               | `() => void`                 | —                      |                                      |
| onCancel                | `() => void`                 | —                      |                                      |
| destructive             | `boolean`                    | `true`                 |                                      |
| className               | `string`                     | —                      |                                      |
| frosted                 | `boolean`                    | `false`                | Enable the optional frosted overlay. |
| blurIntensity           | `number`                     | medium preset          | Override blur amount directly.       |
| blurTintToken           | `FrostedTintToken`           | `'surfaceTranslucent'` | Tint token used for frosted mode.    |

Also accepts the props of `ViewProps`.
<!-- /api:ConfirmActionSheet -->

## Sheet

Bottom sheet modal with slide animation. Slots: `SheetHeader`, `SheetContent`, `SheetFooter`, `SheetClose`.

```tsx
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetFooter,
  SheetClose,
  Button,
  ButtonText,
} from '@thewhileloop/whileui';

<Sheet open={open} onOpenChange={setOpen} maxHeight="half">
  <SheetHeader title="Settings" description="Adjust preferences" />
  <SheetContent>{/* Scrollable body */}</SheetContent>
  <SheetFooter>
    <SheetClose asChild>
      <Button>
        <ButtonText>Save</ButtonText>
      </Button>
    </SheetClose>
  </SheetFooter>
</Sheet>;
```

<!-- api:Sheet -->

| Prop                    | Type                         | Default                | Description                                                 |
| ----------------------- | ---------------------------- | ---------------------- | ----------------------------------------------------------- |
| open (required)         | `boolean`                    | —                      |                                                             |
| onOpenChange (required) | `(open: boolean) => void`    | —                      |                                                             |
| children (required)     | `React.ReactNode`            | —                      |                                                             |
| maxHeight               | `'half' \| 'full' \| number` | `'full'`               | Max height: 'half' \| 'full' \| number (px). Default 'full' |
| maxWidth                | `number`                     | —                      | Web: max width. Default ~360 for mobile-first.              |
| frosted                 | `boolean`                    | `false`                | Enable the optional frosted overlay.                        |
| blurIntensity           | `number`                     | medium preset          | Override blur amount directly.                              |
| blurTintToken           | `FrostedTintToken`           | `'surfaceTranslucent'` | Tint token used for frosted mode.                           |

<!-- /api:Sheet -->

`SheetContent` is a `ScrollView` and accepts its props. It enables nested scrolling and
keeps taps on inputs while the keyboard is open (`keyboardShouldPersistTaps="handled"`).
Your `contentContainerStyle` is merged after the default padding. Tapping the backdrop
closes the sheet; a drag across the backdrop does not, so a missed scroll never dismisses
it. There is no drag-to-dismiss: close with the backdrop, Android back, Escape on web or
`SheetClose`. A Select, Popover or confirmation Dialog placed inside the sheet opens above
it, and back or Escape closes that inner layer before the sheet.

## Header

```tsx
import { Header, HeaderBackButton } from '@thewhileloop/whileui';

<Header
  title="Settings"
  subtitle="Manage preferences"
  leftAction={<HeaderBackButton onPress={() => {}} />}
  rightActions={[
    { key: 'search', icon: <Icon />, onPress: () => {}, accessibilityLabel: 'Search' },
  ]}
/>;
```

## SplashScreen

```tsx
import { SplashScreen } from '@thewhileloop/whileui';

<SplashScreen
  logo={<MyLogo />}
  appName="MyApp"
  tagline="Your tagline"
  variant="scale"
  duration={1500}
  showLoading
  onAnimationComplete={() => {}}
/>;
```

<!-- api:SplashScreen -->

| Prop                | Type                           | Default   | Description                                     |
| ------------------- | ------------------------------ | --------- | ----------------------------------------------- |
| appName             | `string`                       | —         | App name displayed below logo                   |
| tagline             | `string`                       | —         | Tagline displayed below app name                |
| logo                | `React.ReactNode`              | —         | Logo element (icon, image, or custom component) |
| variant             | `'fade' \| 'scale' \| 'slide'` | `'scale'` | Animation variant                               |
| duration            | `number`                       | `800`     | Animation duration in ms                        |
| onAnimationComplete | `() => void`                   | —         | Callback when animation completes               |
| showLoading         | `boolean`                      | `false`   | Whether to show loading indicator               |
| loadingText         | `string`                       | —         | Loading text                                    |
| className           | `string`                       | —         |                                                 |

Also accepts the props of `ViewProps`.
<!-- /api:SplashScreen -->

## ContentSkeleton

Page/content placeholder with layout presets. Use while loading data instead of a spinner when you want to preview the layout.

```tsx
import { ContentSkeleton } from '@thewhileloop/whileui';

<ContentSkeleton variant="list" rows={4} />
<ContentSkeleton variant="card" />
<ContentSkeleton variant="generic" />
```

<!-- api:ContentSkeleton -->

| Prop      | Type                            | Default  | Description                                                                                                |
| --------- | ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| variant   | `'list' \| 'card' \| 'generic'` | `'list'` | Layout preset. `list` = avatar + lines rows, `card` = card with image/body, `generic` = simple page lines. |
| rows      | `number`                        | `4`      | Number of list rows (list variant only). Default 4.                                                        |
| className | `string`                        | —        |                                                                                                            |

Also accepts the props of `ViewProps`.
<!-- /api:ContentSkeleton -->

## PageSkeleton

Variant-based page layouts for loading states. Replaces app-specific skeletons with presets for dashboard, list, settings, card, and generic pages.

```tsx
import { PageSkeleton } from '@thewhileloop/whileui';

<PageSkeleton variant="dashboard" />
<PageSkeleton variant="list" count={5} />
<PageSkeleton variant="settings" count={6} />
<PageSkeleton variant="card" />
<PageSkeleton variant="generic" />
<PageSkeleton variant="dashboard" headerPlaceholder />
<PageSkeleton variant="list" header={<Header title="Loading..." />} />
<PageSkeleton variant="list" padding="none" className="flex-1" />
```

<!-- api:PageSkeleton -->

| Prop               | Type                                       | Default     | Description                                                         |
| ------------------ | ------------------------------------------ | ----------- | ------------------------------------------------------------------- |
| variant (required) | `PageSkeletonVariant`                      | —           | Layout preset.                                                      |
| count              | `number`                                   | `3`         | Rows/items for list (default 3) or settings (default 4) variant.    |
| padding            | `PageSkeletonPadding`                      | `'default'` | Container padding.                                                  |
| header             | `ReactNode`                                | —           | Optional header slot rendered above skeleton content.               |
| headerPlaceholder  | `boolean \| PageSkeletonHeaderPlaceholder` | `false`     | Optional placeholder header (when no real header is available yet). |
| className          | `string`                                   | —           |                                                                     |

Also accepts the props of `ViewProps`.
<!-- /api:PageSkeleton -->

## ScreenSkeleton

Convenience block for loading screens that need both header and content continuity.

```tsx
import { ScreenSkeleton } from '@thewhileloop/whileui';

<ScreenSkeleton variant="dashboard" headerPlaceholder />
<ScreenSkeleton variant="list" count={5} header={<Header title="Projects" />} />
```

<!-- api:ScreenSkeleton -->

| Prop              | Type                                       | Default     | Description                            |
| ----------------- | ------------------------------------------ | ----------- | -------------------------------------- |
| variant           | `PageSkeletonVariant`                      | `'generic'` | Skeleton content preset.               |
| count             | `number`                                   | —           | Rows/items for list/settings variants. |
| padding           | `PageSkeletonPadding`                      | `'default'` | Inner content padding.                 |
| header            | `ReactNode`                                | —           | Real header slot.                      |
| headerPlaceholder | `boolean \| PageSkeletonHeaderPlaceholder` | `'default'` | Placeholder header.                    |
| className         | `string`                                   | —           |                                        |

Also accepts the props of `ViewProps`.
<!-- /api:ScreenSkeleton -->

## ErrorBoundary

React ErrorBoundary that catches render errors and renders ErrorState by default.

```tsx
import { ErrorBoundary } from '@thewhileloop/whileui';

<ErrorBoundary onError={(err) => console.error(err)}>
  <App />
</ErrorBoundary>;
```

<!-- api:ErrorBoundary -->

| Prop                | Type                                                            | Default | Description                                        |
| ------------------- | --------------------------------------------------------------- | ------- | -------------------------------------------------- |
| children (required) | `ReactNode`                                                     | —       |                                                    |
| fallback            | `ReactNode \| ((error: Error, reset: () => void) => ReactNode)` | —       | Custom fallback. If not provided, uses ErrorState. |
| onError             | `(error: Error, errorInfo: ErrorInfo) => void`                  | —       | Called when error is caught.                       |

<!-- /api:ErrorBoundary -->

## PullToRefreshScrollView

Themed ScrollView with RefreshControl. Uses `useThemeTokens` for spinner color.

```tsx
import { PullToRefreshScrollView } from '@thewhileloop/whileui';

<PullToRefreshScrollView refreshing={refreshing} onRefresh={fetchData} refreshColor="#22c55e">
  {content}
</PullToRefreshScrollView>;
```

<!-- api:PullToRefreshScrollView -->

| Prop                  | Type                          | Default | Description                                                                                                                                                                                                     |
| --------------------- | ----------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| refreshing (required) | `boolean`                     | —       | Whether refresh is in progress.                                                                                                                                                                                 |
| onRefresh (required)  | `() => void \| Promise<void>` | —       | Refreshing is almost always async, so the signature says so. Nothing here awaits it — the spinner is driven by `refreshing`, which the owner controls — so a handler that can reject must catch its own errors. |
| refreshColor          | `string`                      | —       | Override tint/colors. Defaults to theme primary.                                                                                                                                                                |
| className             | `string`                      | —       |                                                                                                                                                                                                                 |

Also accepts the props of `ScrollViewProps`.
<!-- /api:PullToRefreshScrollView -->

The scroll view owns the refresh gesture; don't pass `refreshControl`. It bounces even
when content is shorter than the screen, so a short list can still be pulled. Screen
reader users get the same refresh as a **Refresh** accessibility action, since they
cannot pull. It is ignored while `refreshing` is true, and any `accessibilityActions` you
pass are kept.

## EmptyState

```tsx
import { EmptyState } from '@thewhileloop/whileui';

<EmptyState
  icon={<Icon />}
  title="No items"
  description="Add your first item."
  action={{ label: 'Add Item', onPress: () => {} }}
/>;
```

## LoadingState

```tsx
import { LoadingState } from '@thewhileloop/whileui';

<LoadingState label="Loading activity" />;
```

The in-flow counterpart of `EmptyState` and `ErrorState` for a section that is still
fetching. The spinner is named for assistive technology by `label` (default "Loading").

<!-- api:LoadingState -->

| Prop      | Type                        | Default     | Description                                                                    |
| --------- | --------------------------- | ----------- | ------------------------------------------------------------------------------ |
| label     | `string`                    | —           | Read by assistive technology as the spinner's name; shown under it when given. |
| size      | `'sm' \| 'default' \| 'lg'` | `'default'` |                                                                                |
| className | `string`                    | —           |                                                                                |

Also accepts the props of `ViewProps`.
<!-- /api:LoadingState -->

## ProfileHeader

Copy from `apps/showcase/catalog/templates/profile/profile-header.tsx`, then:

```tsx
import { ProfileHeader } from './templates/profile'; // or your path

<ProfileHeader
  name="John Doe"
  username="johndoe"
  bio="Designer & Developer"
  avatarFallback="JD"
  avatarUrl="https://..."
  verified
  stats={[
    { label: 'Followers', value: '1.2K' },
    { label: 'Following', value: 234 },
  ]}
  action={{ label: 'Edit Profile', onPress: () => {} }}
/>;
```

## SettingsSection / SettingsItem

Copy from `apps/showcase/catalog/templates/profile/`, then:

```tsx
import { SettingsSection, SettingsItem } from './templates/profile'; // or your path

<SettingsSection title="Preferences">
  <SettingsItem
    icon={<Icon />}
    label="Notifications"
    type="toggle"
    toggleValue={enabled}
    onToggle={setEnabled}
  />
  <SettingsItem icon={<Icon />} label="Privacy" value="Public" onPress={() => {}} />
  <SettingsItem icon={<Icon />} label="Sign Out" type="action" destructive />
</SettingsSection>;
```

## ProductCard

```tsx
import { ProductCard } from '@thewhileloop/whileui';

<ProductCard
  title="Product Name"
  price="$99"
  originalPrice="$129"
  badge="-23%"
  rating={4.5}
  reviewCount={128}
  variant="vertical"
  onPress={() => {}}
/>;
```

<!-- api:ProductCard -->

| Prop             | Type                         | Default      | Description                                     |
| ---------------- | ---------------------------- | ------------ | ----------------------------------------------- |
| imageUrl         | `string`                     | —            |                                                 |
| title (required) | `string`                     | —            |                                                 |
| description      | `string`                     | —            |                                                 |
| price (required) | `string`                     | —            |                                                 |
| originalPrice    | `string`                     | —            |                                                 |
| badge            | `string`                     | —            |                                                 |
| rating           | `number`                     | —            |                                                 |
| reviewCount      | `number`                     | —            |                                                 |
| inStock          | `boolean`                    | `true`       |                                                 |
| variant          | `'vertical' \| 'horizontal'` | `'vertical'` |                                                 |
| loading          | `boolean`                    | `false`      | Show a skeleton placeholder instead of content. |
| className        | `string`                     | —            |                                                 |

Also accepts the props of `PressableProps`.
<!-- /api:ProductCard -->

## PricingCard

```tsx
import { PricingCard } from '@thewhileloop/whileui';

<PricingCard
  name="Pro"
  description="For teams"
  price="$29"
  period="/month"
  badge="Popular"
  highlighted
  features={[
    { label: 'Unlimited users', included: true },
    { label: 'Priority support', included: true },
    { label: 'Custom domain', included: false },
  ]}
  onPress={() => {}}
/>;
```

## SubscriptionCard

```tsx
import { SubscriptionCard } from '@thewhileloop/whileui';

<SubscriptionCard
  planName="Pro"
  price="$29"
  period="/month"
  expiresAt="April 18, 2026"
  isActive
  onManage={() => {}}
  onUpgrade={() => {}}
/>;
```

<!-- api:SubscriptionCard -->

| Prop                | Type         | Default         | Description                                     |
| ------------------- | ------------ | --------------- | ----------------------------------------------- |
| planName (required) | `string`     | —               | Current plan label.                             |
| price (required)    | `string`     | —               | Plan price.                                     |
| period              | `string`     | `'/month'`      | Billing period label.                           |
| expiresAt           | `string`     | —               | Renewal/expiry date text.                       |
| isActive            | `boolean`    | `true`          | Active/inactive badge state.                    |
| onManage            | `() => void` | —               | Manage action.                                  |
| onUpgrade           | `() => void` | —               | Upgrade action.                                 |
| manageLabel         | `string`     | `'Manage plan'` |                                                 |
| upgradeLabel        | `string`     | `'Upgrade'`     |                                                 |
| loading             | `boolean`    | `false`         | Show a skeleton placeholder instead of content. |
| className           | `string`     | —               |                                                 |

Also accepts the props of `ViewProps`.
<!-- /api:SubscriptionCard -->

## FeatureGate

```tsx
import { FeatureGate } from '@thewhileloop/whileui';

<FeatureGate
  title="Advanced export is locked"
  description="Upgrade to unlock 4K export."
  buttonLabel="Upgrade"
  onUpgrade={() => {}}
/>;
```

Use `children` to show dimmed preview content with an overlay CTA.

## UsageBar

```tsx
import { UsageBar } from '@thewhileloop/whileui';

<UsageBar label="AI generations" used={8} limit={20} />;
```

<!-- api:UsageBar -->

| Prop             | Type              | Default | Description                     |
| ---------------- | ----------------- | ------- | ------------------------------- |
| label (required) | `string`          | —       | Usage label.                    |
| used (required)  | `number`          | —       | Used amount.                    |
| limit (required) | `number`          | —       | Quota limit.                    |
| variant          | `UsageBarVariant` | —       | Optional explicit visual state. |
| className        | `string`          | —       |                                 |

Also accepts the props of `ViewProps`.
<!-- /api:UsageBar -->

## PlanToggle

```tsx
import { PlanToggle } from '@thewhileloop/whileui';

<PlanToggle
  selected="monthly"
  monthlyLabel="Monthly"
  annualLabel="Annual"
  annualDiscount="Save 20%"
  onChange={(next) => {}}
/>;
```

## UpgradeBanner

```tsx
import { UpgradeBanner } from '@thewhileloop/whileui';

<UpgradeBanner
  message="Unlock unlimited exports with Pro."
  actionLabel="See plans"
  onAction={() => {}}
  onDismiss={() => {}}
/>;
```

## DrawerMenu

```tsx
import { DrawerMenu } from '@thewhileloop/whileui';

<DrawerMenu
  visible={open}
  onClose={() => setOpen(false)}
  sections={[
    {
      title: 'Menu',
      items: [
        { key: 'home', label: 'Home', icon: <Icon /> },
        { key: 'settings', label: 'Settings', icon: <Icon /> },
      ],
    },
  ]}
  activeKey="home"
  onSelect={(key) => {}}
  header={<View>...</View>}
  footer={<Text>v1.0</Text>}
/>;
```

<!-- api:DrawerMenu -->

| Prop                | Type                    | Default                | Description                                                 |
| ------------------- | ----------------------- | ---------------------- | ----------------------------------------------------------- |
| visible (required)  | `boolean`               | —                      |                                                             |
| onClose (required)  | `() => void`            | —                      |                                                             |
| sections (required) | `DrawerMenuSection[]`   | —                      |                                                             |
| activeKey           | `string`                | —                      |                                                             |
| onSelect            | `(key: string) => void` | —                      |                                                             |
| header              | `React.ReactNode`       | —                      |                                                             |
| footer              | `React.ReactNode`       | —                      |                                                             |
| maxWidth            | `number`                | —                      | Max width in px. On web, defaults to 360 when not provided. |
| className           | `string`                | —                      |                                                             |
| style               | `StyleProp<ViewStyle>`  | —                      |                                                             |
| frosted             | `boolean`               | `false`                | Enable the optional frosted overlay.                        |
| blurIntensity       | `number`                | medium preset          | Override blur amount directly.                              |
| blurTintToken       | `FrostedTintToken`      | `'surfaceTranslucent'` | Tint token used for frosted mode.                           |

<!-- /api:DrawerMenu -->

Closes from the backdrop, an item, Android back or Escape on web. It is hosted in a modal
on every platform, so keyboard focus stays inside it while it is open.

## More components

The rest of the catalog: what each is for and the props its type declares.

### View

Themed view wrapper

```tsx
import { View } from '@thewhileloop/whileui';
```

<!-- api:View -->

| Prop      | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| className | `string` | —       |             |

Also accepts the props of React Native's `ViewProps`.
<!-- /api:View -->

### Stack

Vertical flex layout with gap

```tsx
import { Stack } from '@thewhileloop/whileui';
```

<!-- api:Stack -->

| Prop      | Type                                                                | Default     | Description |
| --------- | ------------------------------------------------------------------- | ----------- | ----------- |
| className | `string`                                                            | —           |             |
| gap       | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`           | `'md'`      |             |
| align     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'stretch'` |             |
| justify   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`   |             |

Also accepts the props of `ViewProps`.
<!-- /api:Stack -->

### MotionProvider

System reduced motion, explicit preview modes, and deterministic testing

```tsx
import { MotionProvider } from '@thewhileloop/whileui';
```

<!-- api:MotionProvider -->

| Prop                | Type              | Default    | Description |
| ------------------- | ----------------- | ---------- | ----------- |
| children (required) | `React.ReactNode` | —          |             |
| mode                | `MotionMode`      | `'system'` |             |

<!-- /api:MotionProvider -->

### Textarea

Multi-line text input

```tsx
import { Textarea } from '@thewhileloop/whileui';
```

<!-- api:Textarea -->

| Prop         | Type                        | Default     | Description |
| ------------ | --------------------------- | ----------- | ----------- |
| aria-invalid | `boolean`                   | —           |             |
| className    | `string`                    | —           |             |
| size         | `'sm' \| 'lg' \| 'default'` | `'default'` |             |

Also accepts the props of `TextInputProps`.
<!-- /api:Textarea -->

### Label

Form field label

```tsx
import { Label } from '@thewhileloop/whileui';
```

<!-- api:Label -->

| Prop      | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| className | `string` | —       |             |

Also accepts the props of `TextProps`.
<!-- /api:Label -->

### Toggle

ToggleText sub-component

```tsx
import { Toggle } from '@thewhileloop/whileui';
```

<!-- api:Toggle -->

| Prop            | Type                                             | Default     | Description |
| --------------- | ------------------------------------------------ | ----------- | ----------- |
| pressed         | `boolean`                                        | `false`     |             |
| defaultPressed  | `boolean`                                        | `false`     |             |
| onPressedChange | `(pressed: boolean) => void`                     | —           |             |
| variant         | `VariantProps<typeof toggleVariants>['variant']` | `'default'` |             |
| size            | `VariantProps<typeof toggleVariants>['size']`    | `'default'` |             |
| className       | `string`                                         | —           |             |
| children        | `React.ReactNode`                                | —           |             |

Also accepts the props of `PressableProps`.
<!-- /api:Toggle -->

### ToggleGroup

Group of toggle items

```tsx
import { ToggleGroup } from '@thewhileloop/whileui';
```

<!-- api:ToggleGroup -->

| Prop          | Type                                  | Default     | Description |
| ------------- | ------------------------------------- | ----------- | ----------- |
| type          | `ToggleGroupType`                     | `'single'`  |             |
| defaultValue  | `string \| string[]`                  | —           |             |
| value         | `string \| string[]`                  | —           |             |
| onValueChange | `(value: string \| string[]) => void` | —           |             |
| variant       | `'default' \| 'outline'`              | `'default'` |             |
| size          | `'default' \| 'sm' \| 'lg'`           | `'default'` |             |
| className     | `string`                              | —           |             |

Also accepts the props of `ViewProps`.
<!-- /api:ToggleGroup -->

### Separator

Themed divider

```tsx
import { Separator } from '@thewhileloop/whileui';
```

<!-- api:Separator -->

| Prop        | Type                         | Default        | Description |
| ----------- | ---------------------------- | -------------- | ----------- |
| orientation | `'horizontal' \| 'vertical'` | `'horizontal'` |             |
| className   | `string`                     | —              |             |

Also accepts the props of `ViewProps`.
<!-- /api:Separator -->

### Spinner

ActivityIndicator wrapper

```tsx
import { Spinner } from '@thewhileloop/whileui';
```

<!-- api:Spinner -->

| Prop      | Type                        | Default     | Description |
| --------- | --------------------------- | ----------- | ----------- |
| className | `string`                    | —           |             |
| size      | `'sm' \| 'lg' \| 'default'` | `'default'` |             |

Also accepts the props of `ActivityIndicatorProps`.
<!-- /api:Spinner -->

### Skeleton

Loading placeholder (pulse = opacity fade, shimmer = sweep)

```tsx
import { Skeleton } from '@thewhileloop/whileui';
```

<!-- api:Skeleton -->

| Prop      | Type                   | Default   | Description |
| --------- | ---------------------- | --------- | ----------- |
| className | `string`               | —         |             |
| variant   | `'pulse' \| 'shimmer'` | `'pulse'` |             |

Also accepts the props of `ViewProps`.
<!-- /api:Skeleton -->

### AspectRatio

Maintain aspect ratio container

```tsx
import { AspectRatio } from '@thewhileloop/whileui';
```

<!-- api:AspectRatio -->

| Prop      | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| ratio     | `number` | `1`     |             |
| className | `string` | —       |             |

Also accepts the props of `ViewProps`.
<!-- /api:AspectRatio -->

### Collapsible

CollapsibleTrigger, CollapsibleContent

```tsx
import { Collapsible } from '@thewhileloop/whileui';
```

<!-- api:Collapsible -->

| Prop         | Type                      | Default | Description |
| ------------ | ------------------------- | ------- | ----------- |
| defaultOpen  | `boolean`                 | `false` |             |
| open         | `boolean`                 | —       |             |
| onOpenChange | `(open: boolean) => void` | —       |             |
| disabled     | `boolean`                 | `false` |             |
| className    | `string`                  | —       |             |

Also accepts the props of `ViewProps`.
<!-- /api:Collapsible -->

### Tooltip

Position-aware tooltip (requires PortalHost)

```tsx
import { Tooltip } from '@thewhileloop/whileui';
```

<!-- api:Tooltip -->

| Prop                    | Type                      | Default | Description |
| ----------------------- | ------------------------- | ------- | ----------- |
| onOpenChange            | `(open: boolean) => void` | —       |             |
| delayDuration           | `number`                  | —       |             |
| skipDelayDuration       | `number`                  | —       |             |
| disableHoverableContent | `boolean`                 | —       |             |
| children (required)     | `React.ReactNode`         | —       |             |

<!-- /api:Tooltip -->

### FloatingBottomNav

Elevated bottom nav with safe area support

```tsx
import { FloatingBottomNav } from '@thewhileloop/whileui';
```

<!-- api:FloatingBottomNav -->

| Prop                 | Type                      | Default | Description |
| -------------------- | ------------------------- | ------- | ----------- |
| items (required)     | `FloatingBottomNavItem[]` | —       |             |
| activeKey (required) | `string`                  | —       |             |
| onSelect (required)  | `(key: string) => void`   | —       |             |
| className            | `string`                  | —       |             |

Also accepts the props of `ViewProps`.
<!-- /api:FloatingBottomNav -->

### TabBar

Top tab bar with indicator

```tsx
import { TabBar } from '@thewhileloop/whileui';
```

<!-- api:TabBar -->

| Prop                 | Type                                  | Default     | Description |
| -------------------- | ------------------------------------- | ----------- | ----------- |
| items (required)     | `TabBarItem[]`                        | —           |             |
| activeKey (required) | `string`                              | —           |             |
| onSelect (required)  | `(key: string) => void`               | —           |             |
| variant              | `'default' \| 'pills' \| 'underline'` | `'default'` |             |
| scrollable           | `boolean`                             | `false`     |             |
| className            | `string`                              | —           |             |

Also accepts the props of `ViewProps`.
<!-- /api:TabBar -->

### FormModalScreen

Modal scaffold for forms with loading states

```tsx
import { FormModalScreen } from '@thewhileloop/whileui';
```

<!-- api:FormModalScreen -->

| Prop                | Type              | Default       | Description                                                                               |
| ------------------- | ----------------- | ------------- | ----------------------------------------------------------------------------------------- |
| className           | `string`          | —             |                                                                                           |
| title (required)    | `string`          | —             |                                                                                           |
| subtitle            | `string`          | —             |                                                                                           |
| leftSlot            | `React.ReactNode` | —             |                                                                                           |
| rightSlot           | `React.ReactNode` | —             |                                                                                           |
| onClose             | `() => void`      | —             |                                                                                           |
| loading             | `boolean`         | `false`       |                                                                                           |
| saving              | `boolean`         | `false`       |                                                                                           |
| savingText          | `string`          | `'Saving...'` |                                                                                           |
| loadingSpinnerColor | `string`          | —             | Hex color for spinner in loading state. ActivityIndicator requires hex.                   |
| savingSpinnerColor  | `string`          | —             | Hex color for spinner in saving banner. Defaults to platform (Android blue) when not set. |
| scrollEnabled       | `boolean`         | `true`        |                                                                                           |
| children (required) | `React.ReactNode` | —             |                                                                                           |

Also accepts the props of `ViewProps`.
<!-- /api:FormModalScreen -->

### ErrorState

Error display with retry

```tsx
import { ErrorState } from '@thewhileloop/whileui';
```

<!-- api:ErrorState -->

| Prop        | Type              | Default                  | Description |
| ----------- | ----------------- | ------------------------ | ----------- |
| icon        | `React.ReactNode` | —                        |             |
| title       | `string`          | `'Something went wrong'` |             |
| description | `string`          | —                        |             |
| error       | `Error \| string` | —                        |             |
| onRetry     | `() => void`      | —                        |             |
| retryLabel  | `string`          | `'Try again'`            |             |
| className   | `string`          | —                        |             |

Also accepts the props of `ViewProps`.
<!-- /api:ErrorState -->

### LoadingScreen

Full-screen loading indicator

```tsx
import { LoadingScreen } from '@thewhileloop/whileui';
```

<!-- api:LoadingScreen -->

| Prop         | Type                   | Default | Description                                            |
| ------------ | ---------------------- | ------- | ------------------------------------------------------ |
| message      | `string`               | —       |                                                        |
| size         | `'sm' \| 'md' \| 'lg'` | `'md'`  |                                                        |
| spinnerColor | `string`               | —       | Hex color for spinner. ActivityIndicator requires hex. |
| className    | `string`               | —       |                                                        |

Also accepts the props of `ViewProps`.
<!-- /api:LoadingScreen -->

### MinimalSplash

Minimal monochrome splash

```tsx
import { MinimalSplash } from '@thewhileloop/whileui';
```

<!-- api:MinimalSplash -->

| Prop                | Type              | Default | Description                                     |
| ------------------- | ----------------- | ------- | ----------------------------------------------- |
| className           | `string`          | —       |                                                 |
| appName             | `string`          | —       | App name displayed below logo                   |
| tagline             | `string`          | —       | Tagline displayed below app name                |
| logo                | `React.ReactNode` | —       | Logo element (icon, image, or custom component) |
| duration            | `number`          | `800`   | Animation duration in ms                        |
| onAnimationComplete | `() => void`      | —       | Callback when animation completes               |
| showLoading         | `boolean`         | `false` | Whether to show loading indicator               |
| loadingText         | `string`          | —       | Loading text                                    |

Also accepts the props of `SplashScreenProps`.
<!-- /api:MinimalSplash -->

### BrandedSplash

Splash with brand imagery

```tsx
import { BrandedSplash } from '@thewhileloop/whileui';
```

<!-- api:BrandedSplash -->

| Prop                | Type              | Default | Description                                     |
| ------------------- | ----------------- | ------- | ----------------------------------------------- |
| className           | `string`          | —       |                                                 |
| appName             | `string`          | —       | App name displayed below logo                   |
| tagline             | `string`          | —       | Tagline displayed below app name                |
| logo                | `React.ReactNode` | —       | Logo element (icon, image, or custom component) |
| duration            | `number`          | `800`   | Animation duration in ms                        |
| onAnimationComplete | `() => void`      | —       | Callback when animation completes               |
| loadingText         | `string`          | —       | Loading text                                    |

Also accepts the props of `SplashScreenProps`.
<!-- /api:BrandedSplash -->

### ChatMessageBubble

One message in a `Chat`, rendered on its own when a screen composes the conversation itself.

```tsx
import { ChatMessageBubble } from '@thewhileloop/whileui';
```

<!-- api:ChatMessageBubble -->

| Prop               | Type          | Default | Description                                                     |
| ------------------ | ------------- | ------- | --------------------------------------------------------------- |
| message (required) | `ChatMessage` | —       | The message to render; its `role` decides alignment and colour. |
| contentClassName   | `string`      | —       | Classes for the bubble's content wrapper.                       |

<!-- /api:ChatMessageBubble -->

### ChatSuggestions

Suggestion chips when empty

```tsx
import { ChatSuggestions } from '@thewhileloop/whileui';
```

<!-- api:ChatSuggestions -->

| Prop                   | Type                     | Default             | Description |
| ---------------------- | ------------------------ | ------------------- | ----------- |
| suggestions (required) | `string[]`               | `EMPTY_SUGGESTIONS` |             |
| onSelect (required)    | `(text: string) => void` | —                   |             |
| className              | `string`                 | —                   |             |

<!-- /api:ChatSuggestions -->

### ListItem

Title/subtitle row

```tsx
import { ListItem } from '@thewhileloop/whileui';
```

<!-- api:ListItem -->

| Prop             | Type              | Default | Description                                     |
| ---------------- | ----------------- | ------- | ----------------------------------------------- |
| icon             | `React.ReactNode` | —       |                                                 |
| title (required) | `string`          | —       |                                                 |
| subtitle         | `string`          | —       |                                                 |
| description      | `string`          | —       |                                                 |
| rightIcon        | `React.ReactNode` | —       |                                                 |
| rightText        | `string`          | —       |                                                 |
| action           | `React.ReactNode` | —       |                                                 |
| showBorder       | `boolean`         | `true`  |                                                 |
| compact          | `boolean`         | `false` |                                                 |
| loading          | `boolean`         | `false` | Show a skeleton placeholder instead of content. |
| className        | `string`          | —       |                                                 |

Also accepts the props of `PressableProps`.
<!-- /api:ListItem -->

### NotificationItem

Notification row with metadata

```tsx
import { NotificationItem } from '@thewhileloop/whileui';
```

<!-- api:NotificationItem -->

| Prop               | Type              | Default | Description                                     |
| ------------------ | ----------------- | ------- | ----------------------------------------------- |
| icon               | `React.ReactNode` | —       |                                                 |
| avatarUrl          | `string`          | —       |                                                 |
| avatarFallback     | `string`          | —       |                                                 |
| title (required)   | `string`          | —       |                                                 |
| message (required) | `string`          | —       |                                                 |
| time (required)    | `string`          | —       |                                                 |
| read               | `boolean`         | `false` |                                                 |
| showDot            | `boolean`         | `true`  |                                                 |
| loading            | `boolean`         | `false` | Show a skeleton placeholder instead of content. |
| className          | `string`          | —       |                                                 |

Also accepts the props of `PressableProps`.
<!-- /api:NotificationItem -->

### TimelineFeed

Vertical feed with connecting lines

```tsx
import { TimelineFeed } from '@thewhileloop/whileui';
```

<!-- api:TimelineFeed -->

| Prop             | Type             | Default | Description |
| ---------------- | ---------------- | ------- | ----------- |
| className        | `string`         | —       |             |
| items (required) | `TimelineItem[]` | —       |             |
| showConnector    | `boolean`        | `true`  |             |

Also accepts the props of `ViewProps`.
<!-- /api:TimelineFeed -->

### CheckoutSummary

Cart summary with line items

```tsx
import { CheckoutSummary } from '@thewhileloop/whileui';
```

<!-- api:CheckoutSummary -->

| Prop                | Type                 | Default      | Description |
| ------------------- | -------------------- | ------------ | ----------- |
| items (required)    | `CheckoutLineItem[]` | —            |             |
| subtotal (required) | `string`             | —            |             |
| shipping            | `string`             | —            |             |
| tax                 | `string`             | —            |             |
| discount            | `string`             | —            |             |
| total (required)    | `string`             | —            |             |
| buttonLabel         | `string`             | `'Checkout'` |             |
| onCheckout          | `() => void`         | —            |             |
| loading             | `boolean`            | `false`      |             |
| className           | `string`             | —            |             |

Also accepts the props of `ViewProps`.
<!-- /api:CheckoutSummary -->

### MetricCard

Stats/progress card for dashboards

```tsx
import { MetricCard } from '@thewhileloop/whileui';
```

<!-- api:MetricCard -->

| Prop             | Type                                 | Default     | Description                                     |
| ---------------- | ------------------------------------ | ----------- | ----------------------------------------------- |
| className        | `string`                             | —           |                                                 |
| label (required) | `string`                             | —           |                                                 |
| value (required) | `string \| number`                   | —           |                                                 |
| subtitle         | `string`                             | —           |                                                 |
| progress         | `number`                             | —           |                                                 |
| segments         | `{ value: number; color: string }[]` | —           |                                                 |
| icon             | `React.ReactNode`                    | —           |                                                 |
| loading          | `boolean`                            | `false`     | Show a skeleton placeholder instead of content. |
| variant          | `'default' \| 'outlined'`            | `'default'` |                                                 |

Also accepts the props of `ViewProps`.
<!-- /api:MetricCard -->

## Roadmap

Tracked work items for future releases.

### New Components

- [ ] **Chip / Tag** — selectable, dismissible, multi-select with `tv()` variants, loading skeleton
- [ ] **Rating / Stars** — interactive + read-only, half-star precision, swipe gesture, pairs with ProductCard
- [ ] **Slider** — single + range (two thumbs), step marks, labels, Reanimated gesture, haptic on snap
- [ ] **Carousel** — Reanimated-powered, auto-play, pagination dots, snap-to-item
- [ ] **FAB (Floating Action Button)** — expandable action menu, Reanimated spring, auto-hide on scroll
- [ ] **Combobox** — searchable select with keyboard navigation, empty state, async loading
- [ ] **Data Table** — sortable headers, skeleton loading rows, row actions, responsive stacking
- [ ] **Banner** — dismissible info/warning/success/destructive bar with icon + action, auto-dismiss timer
- [ ] **Pagination** — compact (dots) + expanded (numbers) variants, edge-aware ellipsis, 44px touch targets
- [ ] **Inline Calendar** — standalone calendar view reusing DatePicker logic, range selection

### Component-Level Loading (`loading` prop)

- [x] ProductCard, ListItem, NotificationItem, MetricCard, SubscriptionCard, PricingCard
- [x] AppShell, Chat, FormModalScreen, CheckoutSummary (already had `loading`)
- [ ] Add `loading` to remaining blocks: Header, BottomNav, DrawerMenu, TimelineFeed

### Documentation Gaps

- [ ] Add `## API` sections for: Textarea, Toggle, ToggleGroup, Label, Separator, Skeleton, AspectRatio, Collapsible, Text, View
- [ ] Add `## API` sections for blocks: FloatingBottomNav, TabBar, FormModalScreen, ErrorState, LoadingScreen, ListItem, NotificationItem, MetricCard, TimelineFeed

### Infrastructure

- [ ] Publish to npm (`@thewhileloop/whileui`)
- [ ] CI: typecheck + format check on PR
- [ ] Automated visual regression tests (screenshot comparison)

## License

MIT — [Source](https://github.com/whileloophq/whileui)
