# WhileUI Native

> Copy-paste components for React Native. You own the code.

Beautiful, accessible, themeable components built with [Uniwind](https://uniwind.dev) + Tailwind CSS v4.

**Requirements:** React 19+, React Native 0.81+, Expo 52+ (if using Expo). Supports React Native Web.

> **Two tracks, one token layer.** This README documents the React Native track
> (native-first apps such as sidekick-app: Expo for iOS/Android,
> `react-native-web` for web). The DOM track — `@thewhileloop/whileui/web`, for
> web-first apps such as split-loop via Capacitor and Tauri — is documented in
> its own section below. See [ROADMAP.md](./ROADMAP.md).

## Installation

```bash
bun add @thewhileloop/whileui
bun add react@^19.0.0 react-native@^0.81.0 uniwind@^1.0.0 tailwindcss@^4.0.0 react-native-reanimated react-native-safe-area-context react-native-screens
# Only if you use Select, Popover, Tooltip, or HoverCard:
bun add @rn-primitives/portal @rn-primitives/hooks @rn-primitives/slot @rn-primitives/select @rn-primitives/popover @rn-primitives/tooltip @rn-primitives/hover-card
```

Use `npm install` instead of `bun add` if you prefer npm.

### Setup Uniwind (required)

1. **metro.config.js** (wrap with withUniwindConfig):

```js
const { withUniwindConfig } = require('uniwind/metro');

module.exports = withUniwindConfig({
  cssEntryFile: './global.css',
})({
  // your metro config
});
```

> `withUniwindConfig` must be the outermost wrapper. `cssEntryFile` must be a relative path string.

2. **global.css** at app root:

```css
@import 'tailwindcss';
@import 'uniwind';

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
import { PortalHost } from '@thewhileloop/whileui';
import { Button, ButtonText } from '@thewhileloop/whileui';

export default function App() {
  return (
    <>
      {/* Your app content */}
      <PortalHost />
    </>
  );
}
```

> **Note:** If you use Select, Popover, Tooltip, or HoverCard, add `<PortalHost />` at the root of your app (as the last child).

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

- **Auth:** `apps/showcase/templates/auth/` — SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm, VerifyEmailForm, SocialConnections, UserMenu
- **Profile:** `apps/showcase/templates/profile/` — ProfileHeader, SettingsSection, SettingsItem, AccountCard

**To use auth or profile blocks:** Copy the template file(s) from `apps/showcase/templates/` into your app. Customize as needed (error handling, loading state, social auth slot, branding). Each template imports primitives from `@thewhileloop/whileui`.

## Philosophy

- **Copy-Paste Ownership** — Components live in _your_ project. No `node_modules` lock-in.
- **Beautiful by Default** — OKLCH color system, light/dark themes, polished out of the box.
- **Fully Customizable** — Every component uses `tv()` variants and accepts `className` overrides.
- **Accessible** — Proper ARIA roles, keyboard support, controlled/uncontrolled state.
- **Tree-Shakeable** — Only imports what you use. `sideEffects: false`.

## Quick Reference (AI / Code Generation)

- **Full-screen:** `AppShell` + `Header` in `header` + `BottomNav` in `bottomNav` + content in `children`
- **No-jump loading:** keep `AppShell` mounted, set `loading` + `skeleton` (e.g., `PageSkeleton`/`ScreenSkeleton`)
- **Layout:** `Stack` (vertical), `Row` (horizontal) — both support `gap`, `align`, `justify`
- **Auth callbacks:** Auth templates use objects: `onSubmit({ email, password })`, `onSubmit({ firstName, lastName, email, password })`, etc. Copy templates from `apps/showcase/templates/auth/`.
- **PortalHost:** Add `<PortalHost />` at app root for Select, Popover, Tooltip, HoverCard.
- **Uniwind:** `withUniwindConfig` must wrap metro config. `global.css` at app root, imported in `App.tsx`.
- **Reference:** Block props in `packages/ui/src/blocks` (core) and `apps/showcase/templates/` (auth, profile); flow patterns in README "Flow Patterns" section.

## Components

### Primitives

| Component     | Notes                            |
| ------------- | -------------------------------- |
| **Text**      | Themed text with variant support |
| **View**      | Themed view wrapper              |
| **Pressable** | Themed pressable wrapper         |
| **Stack**     | Vertical flex layout with gap    |
| **Row**       | Horizontal flex layout with gap  |
| **Box**       | Flexible container with variants |

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

| Component       | Variants                                          | Notes                                                                           |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Card**        | padding (none, sm, default, lg), unstyled         | Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| **Badge**       | default, secondary, destructive, outline, success | BadgeText sub-component                                                         |
| **Alert**       | default, destructive, success, warning            | AlertTitle & AlertDescription                                                   |
| **Avatar**      | sm, default, lg                                   | AvatarImage + AvatarFallback                                                    |
| **DataRow**     | default, compact                                  | DataRow, DataRowLeft/Center/Right, DataRowLabel/Description/Value               |
| **Separator**   | horizontal, vertical                              | Themed divider                                                                  |
| **Progress**    | sm, default, lg                                   | Value-based progress bar with accessibility                                     |
| **Spinner**     | sm, default, lg                                   | ActivityIndicator wrapper                                                       |
| **Skeleton**    | pulse, shimmer                                    | Loading placeholder (pulse = opacity fade, shimmer = sweep)                     |
| **AspectRatio** | —                                                 | Maintain aspect ratio container                                                 |

### Layout

| Component       | Notes                                    |
| --------------- | ---------------------------------------- |
| **Tabs**        | TabsList, TabsTrigger, TabsContent       |
| **Accordion**   | AccordionItem, AccordionTrigger, Content |
| **Collapsible** | CollapsibleTrigger, CollapsibleContent   |

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

Copy from `apps/showcase/templates/auth/`:

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

| Block                 | Description                                       |
| --------------------- | ------------------------------------------------- |
| **AppShell**          | Layout shell with header/footer/bottomNav slots   |
| **NavigationSidebar** | Sidebar nav with grouped sections and footer slot |
| **Header**            | Top app bar with back/actions                     |
| **BottomNav**         | Tab-style bottom navigation bar                   |
| **FloatingBottomNav** | Elevated bottom nav with safe area support        |
| **TabBar**            | Top tab bar with indicator                        |
| **DrawerMenu**        | Drawer with sections and items                    |

### Layout

| Block                       | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| **ActionBar**               | Sticky bottom action row with safe-area padding                         |
| **ConfirmActionSheet**      | Reusable destructive confirmation sheet                                 |
| **Sheet**                   | Bottom sheet modal with header/content/footer slots                     |
| **FormModalScreen**         | Modal scaffold for forms with loading states                            |
| **ContentSkeleton**         | Page/content placeholder with variants (list, card, generic)            |
| **PageSkeleton**            | Variant-based page layouts (dashboard, list, settings, card, generic)   |
| **ScreenSkeleton**          | Header slot/placeholder + PageSkeleton content in one block             |
| **ErrorBoundary**           | React ErrorBoundary that renders ErrorState by default                  |
| **EmptyState**              | Empty content placeholder                                               |
| **ErrorState**              | Error display with retry                                                |
| **LoadingScreen**           | Full-screen loading indicator                                           |
| **PullToRefreshScrollView** | Themed ScrollView with RefreshControl (useThemeTokens for colors)       |
| **SmartInput**              | Keyboard-aware compose input: left/center/right slots, bar/card variant |
| **OnboardingScreen**        | Onboarding flow screen                                                  |
| **SplashScreen**            | Branded splash (fade/scale/slide variants)                              |
| **MinimalSplash**           | Minimal monochrome splash                                               |
| **BrandedSplash**           | Splash with brand imagery                                               |

### Chat

| Block                 | Description                                      |
| --------------------- | ------------------------------------------------ |
| **Chat**              | AI-style chat: messages, suggestions, SmartInput |
| **ChatMessageBubble** | Message bubble (user/assistant, big/small text)  |
| **ChatSuggestions**   | Suggestion chips when empty                      |

### Profile & Settings (Copy from showcase templates)

Copy from `apps/showcase/templates/profile/`:

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
| **SwipeableItem**    | Swipe actions list item             |
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

| Block          | Description                         |
| -------------- | ----------------------------------- |
| **SmartImage** | Image with aspect ratio and loading |

### Date Picker

| Block                    | Description                                       |
| ------------------------ | ------------------------------------------------- |
| **DatePickerModal**      | Bottom sheet modal with calendar, compact trigger |
| **DatePickerInline**     | Inline calendar for forms or dashboards           |
| **DateRangePickerModal** | Range selection modal with period marking         |

## DOM Track (web, Capacitor, Tauri)

For web-first apps, via Capacitor and Tauri — see [ROADMAP.md](./ROADMAP.md). Same tokens
and the same `variant`/`size` API as the native components above, rendering
plain DOM. No `react-native-web`.

```ts
import { AppShell, Header, DrawerMenu, Button, Card } from '@thewhileloop/whileui/web';
```

| Ported                                                                                                                                                                                                                                            | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `Button`, `ButtonText`, `ButtonIcon`                                                                                                                                                                                                              | ✓      |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                                                                                                 | ✓      |
| `AppShell` — `header`, `footer`, `bottomNav`, `loading` + `skeleton`                                                                                                                                                                              | ✓      |
| `Header`, `HeaderIconButton`, `HeaderBackButton`                                                                                                                                                                                                  | ✓      |
| `DrawerMenu` — sections, `activeKey`, `onSelect`, `header`/`footer` slots                                                                                                                                                                         | ✓      |
| `platform/` — `haptics`, `secureStore`, `hardwareBack`, `keyboard`, `statusBar`, `share`, `deepLinks`. Web fallbacks by default; `installPlatform(createCapacitorPlatform({ App, Haptics, … }))` once at boot. Zero Capacitor deps in the library | ✓      |

Everything else is listed, per category, in the DOM showcase: `cd apps/site && bun run dev` (port 8083). The showcase's own shell is `AppShell` + `Header` + `DrawerMenu`.

**Tokens without a renderer.** `@thewhileloop/whileui/tokens` exports the theme
and visual contracts, the presets, and `deriveThemeColors(base, scheme)` — give it
the 25 base colours an app defines and it returns all 52, using the same ratios
as the default presets. Safe in a build script on either track (no React, RN or
Uniwind imports); `useThemeColors()` uses it too, so a missing `--color-primary-soft`
derives from the app's own primary instead of falling back to the default palette.

**One gotcha.** Visual tokens are emitted unitless (`--ui-radius-md: 14`) because the native track consumes them as numbers. On the DOM every pixel token needs `calc(var(--x) * 1px)`; `packages/ui/src/web/lib/recipes.ts` does this for you.

## Layout Primitives (Stack, Row, Box)

Use `Stack` for vertical layouts, `Row` for horizontal layouts. Both support `gap`, `align`, and `justify` variants.

```tsx
import { Stack, Row, Box } from '@thewhileloop/whileui';

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

| Prop    | Stack/Row                                                           | Values                   |
| ------- | ------------------------------------------------------------------- | ------------------------ |
| gap     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`           | Spacing between children |
| align   | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | Cross-axis alignment     |
| justify | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | Main-axis alignment      |

`Box` provides optional padding and margin variants for consistent spacing.

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
| Chat       | Chat + ChatSuggestions + SmartInput (attach, send). Extensible for images/tags     |
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
cd apps/showcase
bun run dev
# Or: npx expo start --web
```

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
│   └── showcase/              # Expo demo app
│       ├── templates/         # Copy-paste templates (auth, profile)
│       │   ├── auth/
│       │   └── profile/
│       ├── App.tsx            # Component showcase
│       ├── global.css         # Theme variables (OKLCH) — at app root!
│       └── metro.config.js    # Uniwind + monorepo config
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

### Strict Theme Token Contract

The WhileUI token contract is strict for cross-app reuse. Define these in **every** theme variant (`@variant light`, `@variant dark`, and custom variants):

- Required core tokens: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`
- Optional status tokens: `success`, `success-foreground`, `warning`, `warning-foreground`, `info`, `info-foreground`
- Optional effect tokens: `overlay`, `overlay-strong`, `surface-elevated`, `surface-border`, `surface-highlight`, `surface-translucent`, `surface-translucent-border`, `state-hover`, `state-pressed`, `state-disabled`
- Optional interaction/motion tokens: `--ui-press-opacity`, `--ui-press-opacity-strong`, `--ui-disabled-opacity`, `--ui-disabled-opacity-soft`, `--ui-disabled-opacity-subtle`, `--ui-inactive-opacity`, `--ui-motion-fast`, `--ui-motion-normal`, `--ui-motion-slow`, `--ui-drawer-open-duration`, `--ui-drawer-close-duration`, `--ui-blur-intensity-subtle`, `--ui-blur-intensity-medium`, `--ui-blur-intensity-strong`, `--ui-blur-saturation-pct`, `--ui-frosted-highlight-height`, `--ui-frosted-backdrop-blur-intensity`, `--ui-frosted-backdrop-blur-scale`, `--ui-frosted-android-tint-alpha-scale`, `--ui-frosted-android-experimental-blur`, `--ui-drawer-frosted-inset`, `--ui-drawer-frosted-radius`, `--ui-drawer-content-top-padding`
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

### Interaction + Motion Tokens

WhileUI components also read optional `--ui-*` tokens for deeper control of press feedback, disabled states, and motion timing:

```css
@theme {
  --ui-press-opacity: 0.72;
  --ui-press-opacity-strong: 0.9;
  --ui-disabled-opacity: 0.5;
  --ui-disabled-opacity-soft: 0.6;
  --ui-disabled-opacity-subtle: 0.4;
  --ui-inactive-opacity: 0.5;
  --ui-motion-fast: 160;
  --ui-motion-normal: 220;
  --ui-motion-slow: 300;
  --ui-drawer-open-duration: 300;
  --ui-drawer-close-duration: 220;
  --ui-blur-intensity-subtle: 18;
  --ui-blur-intensity-medium: 22;
  --ui-blur-intensity-strong: 28;
  --ui-blur-saturation-pct: 185;
  --ui-frosted-highlight-height: 0;
  --ui-frosted-backdrop-blur-intensity: 14;
  --ui-frosted-backdrop-blur-scale: 0.55;
  --ui-frosted-android-tint-alpha-scale: 1.22;
  --ui-frosted-android-experimental-blur: 1;
  --ui-drawer-frosted-inset: 0;
  --ui-drawer-frosted-radius: 28;
  --ui-drawer-content-top-padding: 0;
}
```

For custom components, use:

```tsx
import { useInteractionTokens, withInteractivePressableStyle } from '@thewhileloop/whileui';
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

Or use the first-party ThemeBridge helper with optional persistence:

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

## Tech Stack

- **Styling**: [Uniwind](https://uniwind.dev) (free tier) + Tailwind CSS v4
- **Variants**: [tailwind-variants](https://www.tailwind-variants.org/) (`tv()`)
- **Merging**: [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Expo**: SDK 54
- **Monorepo**: bun + Turborepo

# API Reference

## Button

```tsx
import { Button, ButtonText, ButtonIcon } from '@thewhileloop/whileui';

<Button variant="default" size="default" disabled={false} onPress={() => {}}>
  <ButtonIcon>
    <Icon />
  </ButtonIcon>
  <ButtonText>Click me</ButtonText>
  <ButtonIcon position="right">
    <Icon />
  </ButtonIcon>
</Button>;
```

| Prop      | Type                                                                          | Default     | Description                 |
| --------- | ----------------------------------------------------------------------------- | ----------- | --------------------------- |
| variant   | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant        |
| size      | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` | Button size                 |
| disabled  | `boolean`                                                                     | `false`     | Disable the button          |
| className | `string`                                                                      | —           | Additional Tailwind classes |

## Input

```tsx
import { Input } from '@thewhileloop/whileui';

<Input placeholder="Email" variant="default" value={value} onChangeText={setValue} />;
```

| Prop                 | Type                   | Default     | Description                                              |
| -------------------- | ---------------------- | ----------- | -------------------------------------------------------- |
| variant              | `'default' \| 'error'` | `'default'` | Input style variant                                      |
| placeholder          | `string`               | —           | Placeholder text                                         |
| placeholderTextColor | `string`               | —           | Hex for placeholder; defaults to theme `mutedForeground` |
| editable             | `boolean`              | `true`      | Whether input is editable                                |

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

| Prop                 | Type                              | Default     | Description                       |
| -------------------- | --------------------------------- | ----------- | --------------------------------- |
| variant              | `'default' \| 'error'`            | `'default'` | Input style                       |
| size                 | `'default' \| 'compact'`          | `'default'` | Density size                      |
| value                | `number \| null`                  | —           | Controlled numeric value          |
| onValueChange        | `(value: number \| null) => void` | —           | Numeric value change callback     |
| placeholderTextColor | `string`                          | —           | Hex for placeholder               |
| prefix / suffix      | `ReactNode`                       | —           | Left/right slots                  |
| showSteppers         | `boolean`                         | `false`     | Show decrement/increment controls |

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

| Prop          | Type                      | Default     | Description                       |
| ------------- | ------------------------- | ----------- | --------------------------------- |
| length        | `number`                  | `6`         | Number of digit cells             |
| value         | `string`                  | —           | Controlled value                  |
| onValueChange | `(value: string) => void` | —           | Called on each digit change       |
| onComplete    | `(code: string) => void`  | —           | Called when all digits are filled |
| variant       | `'default' \| 'error'`    | `'default'` | Error variant triggers shake      |
| size          | `'default' \| 'compact'`  | `'default'` | Cell size                         |
| secure        | `boolean`                 | `false`     | Mask digits with dots             |
| autoFocus     | `boolean`                 | `false`     | Focus first cell on mount         |

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

| Prop    | Type                  | Default     | Description               |
| ------- | --------------------- | ----------- | ------------------------- |
| variant | `'default' \| 'pill'` | `'default'` | Pill = rounded-full items |

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

| Prop          | Type                                                               | Default      | Description                         |
| ------------- | ------------------------------------------------------------------ | ------------ | ----------------------------------- |
| padding       | `'none' \| 'sm' \| 'default' \| 'lg'`                              | `'default'`  | Card interior padding               |
| unstyled      | `boolean`                                                          | `false`      | Remove built-in card surface styles |
| frosted       | `boolean`                                                          | `false`      | Enables frosted tint + blur layer   |
| blurIntensity | `number`                                                           | token preset | Override blur amount directly       |
| blurTintToken | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'card'`     | Tint token used for frosted mode    |

## Badge

```tsx
import { Badge, BadgeText } from '@thewhileloop/whileui';

<Badge variant="default">
  <BadgeText>New</BadgeText>
</Badge>;
```

| Prop    | Type                                                                                         | Default     |
| ------- | -------------------------------------------------------------------------------------------- | ----------- |
| variant | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'success' \| 'warning' \| 'info'` | `'default'` |

## Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@thewhileloop/whileui';

<Alert variant="default">
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Something happened.</AlertDescription>
</Alert>;
```

| Prop    | Type                                                   | Default     |
| ------- | ------------------------------------------------------ | ----------- |
| variant | `'default' \| 'destructive' \| 'success' \| 'warning'` | `'default'` |

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

| Prop          | Type                                                               | Default                | Description                      |
| ------------- | ------------------------------------------------------------------ | ---------------------- | -------------------------------- |
| frosted       | `boolean`                                                          | `false`                | Enables frosted tint + blur      |
| blurIntensity | `number`                                                           | medium preset          | Override blur amount             |
| blurTintToken | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'surfaceTranslucent'` | Tint token used for frosted mode |

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

| Prop          | Type                               | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | ---------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| presentation  | `'modal' \| 'native' \| 'overlay'` | `'modal'` | **`modal`** — themed card in an RN `Modal` (iOS `overFullScreen`). **`native`** — `Alert.alert` on iOS/Android (system UI); use when a second `Modal` won’t stack; ignored on web. **`overlay`** — same themed card as `modal`, but absolutely positioned **inside the parent view** (no second `Modal`). Nest `<AlertDialog>` under your fullscreen sheet’s root so the confirm matches app styling. **Web:** `'native'` is ignored; `overlay` behaves like `modal`. |
| frosted       | `boolean`                          | `false`   | Same as `DialogContent`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| blurIntensity | `number`                           | —         | Same as `DialogContent`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| blurTintToken | `'surfaceElevated' \| …`           | —         | Same as `DialogContent`                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### React Native: stacked modals

If `AlertDialog` is a **sibling** of another fullscreen `Modal`, iOS often fails to show a second `Modal` on top. Prefer **`presentation="overlay"`** and render `<AlertDialog>` **inside** that `Modal` (themed UI, one native modal host). Alternatively use **`presentation="native"`** for a system `Alert.alert` when themed UI is not required.

**Manual QA (iOS + Android):** Fullscreen sheet + `presentation="overlay"` nested in the sheet: themed confirm appears, **Cancel** / **Delete** behave correctly. Optionally repeat with `presentation="native"` for system alert stacking.

## Checkbox

```tsx
import { Checkbox } from '@thewhileloop/whileui';

<Checkbox checked={checked} onCheckedChange={setChecked} />;
```

| Prop            | Type                         | Default |
| --------------- | ---------------------------- | ------- |
| checked         | `boolean`                    | `false` |
| onCheckedChange | `(checked: boolean) => void` | —       |
| disabled        | `boolean`                    | `false` |

## Switch

```tsx
import { Switch } from '@thewhileloop/whileui';

<Switch checked={checked} onCheckedChange={setChecked} />;
```

| Prop            | Type                         | Default |
| --------------- | ---------------------------- | ------- |
| checked         | `boolean`                    | `false` |
| onCheckedChange | `(checked: boolean) => void` | —       |

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

`SelectContent` supports optional frosted props:

| Prop          | Type                                                               | Default       |
| ------------- | ------------------------------------------------------------------ | ------------- |
| frosted       | `boolean`                                                          | `false`       |
| blurIntensity | `number`                                                           | subtle preset |
| blurTintToken | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'popover'`   |

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

| Prop        | Type                     | Default    |
| ----------- | ------------------------ | ---------- |
| type        | `'single' \| 'multiple'` | `'single'` |
| collapsible | `boolean`                | `false`    |

## Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@thewhileloop/whileui';

<Avatar size="default">
  <AvatarImage src="https://..." />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>;
```

| Prop | Type                        | Default     |
| ---- | --------------------------- | ----------- |
| size | `'sm' \| 'default' \| 'lg'` | `'default'` |

## Progress

```tsx
import { Progress } from '@thewhileloop/whileui';

<Progress value={50} size="default" />;
```

| Prop  | Type                        | Default     |
| ----- | --------------------------- | ----------- |
| value | `number`                    | `0`         |
| size  | `'sm' \| 'default' \| 'lg'` | `'default'` |

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

| Prop          | Type                                                               | Default       |
| ------------- | ------------------------------------------------------------------ | ------------- |
| frosted       | `boolean`                                                          | `false`       |
| blurIntensity | `number`                                                           | subtle preset |
| blurTintToken | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'popover'`   |

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

`MenubarContent` supports the same frosted props as `PopoverContent` (default blur preset: medium).

---

# Blocks API

## SignInForm

Copy from `apps/showcase/templates/auth/sign-in-form.tsx`, then:

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

Copy from `apps/showcase/templates/auth/sign-up-form.tsx`, then:

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

| Prop        | Type        | Default | Description                                         |
| ----------- | ----------- | ------- | --------------------------------------------------- |
| `header`    | `ReactNode` | —       | Header slot                                         |
| `footer`    | `ReactNode` | —       | Footer slot                                         |
| `bottomNav` | `ReactNode` | —       | Bottom navigation slot                              |
| `safeArea`  | `boolean`   | `true`  | Wrap in SafeAreaView                                |
| `loading`   | `boolean`   | `false` | Show `skeleton` in content area, keep shell mounted |
| `skeleton`  | `ReactNode` | —       | Content placeholder rendered when `loading=true`    |

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

## SmartInput

Keyboard-aware compose input. `variant`: "bar" (sticky bottom) or "card" (floating). Slots: `leftSlot`, `centerSlot` (intent selector), `rightSlot`. `submitBehavior`: "newline" (default) or "submit"/"blurAndSubmit". Forwards ref to `TextInput`.

```tsx
import { SmartInput, Button, ButtonText } from '@thewhileloop/whileui';

<SmartInput
  value={message}
  onChangeText={setMessage}
  placeholder="Type a message..."
  leftSlot={
    <Button variant="ghost" size="icon">
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

## Chat

AI-style chat: message list, suggestion chips when empty, SmartInput with attach/send slots. Uses semantic tokens; theme via `global.css`. Copy-paste block — edit directly. `renderMessage` for markdown/code, `loadingIndicator` for typing state.

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
  leftSlot={<Button variant="ghost" size="icon"><Icon name="paperclip" /></Button>}
  rightSlot={<Button size="icon" onPress={handleSend}><Icon name="send" /></Button>}
/>;
```

| Prop                     | Type                 | Description                                       |
| ------------------------ | -------------------- | ------------------------------------------------- |
| `messages`               | `ChatMessage[]`      | `{ id, role, content, secondary?, contentSize? }` |
| `value`                  | `string`             | Input value                                       |
| `onChangeText`           | `(text) => void`     | Input change                                      |
| `onSend`                 | `() => void`         | Send handler                                      |
| `suggestions`            | `string[]`           | Chips when empty                                  |
| `leftSlot` / `rightSlot` | `ReactNode`          | Attach, send, etc.                                |
| `exampleMessage`         | `ChatMessage`        | Shown in empty state                              |
| `renderMessage`          | `(msg) => ReactNode` | Custom message (markdown, code, images)           |
| `loadingIndicator`       | `ReactNode`          | Shown when loading (typing dots)                  |
| `inputSafeArea`          | `boolean`            | SmartInput safe-area (default `true`)             |
| `keyboardVerticalOffset` | `number`             | For header offset when keyboard opens             |

## DatePickerModal / DatePickerInline / DateRangePickerModal

Date selection blocks using react-native-calendars. Theme-aware via `useCalendarTheme` (Uniwind light/dark). Optional `theme` prop for custom RN color strings (hex/rgb/hsl/named). `CalendarTheme` maps to react-native-calendars Theme and supports `arrowColor`, `disabledArrowColor`, and optional font keys.

**DatePickerModal** — Compact trigger opens bottom sheet with calendar. Use `DatePickerTrigger` as the trigger content.

**DatePickerInline** — Calendar embedded inline for forms or dashboards.

**DateRangePickerModal** — Range selection with period marking. Use `DateRangePickerTrigger` as the trigger content.

```tsx
import {
  DatePickerModal,
  DatePickerTrigger,
  DatePickerInline,
  DateRangePickerModal,
  DateRangePickerTrigger,
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
```

| Prop                    | Type                                                               | Description                            |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| `value`                 | `string \| null` / `DateRange \| null`                             | Selected date(s) YYYY-MM-DD            |
| `onValueChange`         | `(date) => void`                                                   | Change handler                         |
| `open` / `onOpenChange` | —                                                                  | Modal state (modal variants)           |
| `trigger`               | `ReactNode`                                                        | Custom trigger (modal variants)        |
| `minDate` / `maxDate`   | `string`                                                           | YYYY-MM-DD bounds                      |
| `theme`                 | `CalendarTheme`                                                    | Override calendar colors               |
| `frosted`               | `boolean`                                                          | Enable frosted surface for modal panel |
| `blurIntensity`         | `number`                                                           | Override blur amount                   |
| `blurTintToken`         | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | Tint token for frosted panel           |

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

| Prop            | Type                                                               | Default                |
| --------------- | ------------------------------------------------------------------ | ---------------------- |
| `frosted`       | `boolean`                                                          | `false`                |
| `blurIntensity` | `number`                                                           | medium preset          |
| `blurTintToken` | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'surfaceTranslucent'` |

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

| Prop          | Type                                                               | Default                |
| ------------- | ------------------------------------------------------------------ | ---------------------- |
| open          | `boolean`                                                          | —                      |
| onOpenChange  | `(open: boolean) => void`                                          | —                      |
| maxHeight     | `'half' \| 'full' \| number`                                       | `'full'`               |
| maxWidth      | `number`                                                           | `360`                  |
| frosted       | `boolean`                                                          | `false`                |
| blurIntensity | `number`                                                           | medium preset          |
| blurTintToken | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'surfaceTranslucent'` |

## NavigationSidebar

```tsx
import { NavigationSidebar } from '@thewhileloop/whileui';

<NavigationSidebar
  sections={[
    {
      title: 'Workspace',
      items: [
        { key: 'overview', label: 'Overview', icon: <Icon /> },
        { key: 'billing', label: 'Billing', icon: <Icon />, badge: 2 },
      ],
    },
  ]}
  activeKey="overview"
  onSelect={(key) => {}}
  header={<Text>Acme Inc.</Text>}
  footer={<Text className="text-xs text-muted-foreground">v1.0.0</Text>}
/>;
```

## Header

```tsx
import { Header, HeaderBackButton } from '@thewhileloop/whileui';

<Header
  title="Settings"
  subtitle="Manage preferences"
  leftAction={<HeaderBackButton onPress={() => {}} />}
  rightActions={[{ key: 'search', icon: <Icon />, onPress: () => {} }]}
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

| Prop        | Type                           | Default   |
| ----------- | ------------------------------ | --------- |
| variant     | `'fade' \| 'scale' \| 'slide'` | `'scale'` |
| duration    | `number`                       | `800`     |
| showLoading | `boolean`                      | `false`   |

## ContentSkeleton

Page/content placeholder with layout presets. Use while loading data instead of a spinner when you want to preview the layout.

```tsx
import { ContentSkeleton } from '@thewhileloop/whileui';

<ContentSkeleton variant="list" rows={4} />
<ContentSkeleton variant="card" />
<ContentSkeleton variant="generic" />
```

| Prop    | Type                            | Default  | Description                             |
| ------- | ------------------------------- | -------- | --------------------------------------- |
| variant | `'list' \| 'card' \| 'generic'` | `'list'` | Layout preset                           |
| rows    | `number`                        | `4`      | Number of list rows (list variant only) |

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

| Prop                | Type                                                         | Default                | Description                                   |
| ------------------- | ------------------------------------------------------------ | ---------------------- | --------------------------------------------- |
| `variant`           | `'dashboard' \| 'list' \| 'settings' \| 'card' \| 'generic'` | required               | Layout preset                                 |
| `count`             | `number`                                                     | 3 (list), 4 (settings) | Rows/items for list or settings variant       |
| `padding`           | `'none' \| 'sm' \| 'default' \| 'lg'`                        | `'default'`            | Container padding                             |
| `header`            | `ReactNode`                                                  | —                      | Optional real header slot above content       |
| `headerPlaceholder` | `boolean \| 'compact' \| 'default'`                          | `false`                | Skeleton header when real header is not ready |
| `className`         | `string`                                                     | —                      | Outer container classes                       |

## ScreenSkeleton

Convenience block for loading screens that need both header and content continuity.

```tsx
import { ScreenSkeleton } from '@thewhileloop/whileui';

<ScreenSkeleton variant="dashboard" headerPlaceholder />
<ScreenSkeleton variant="list" count={5} header={<Header title="Projects" />} />
```

| Prop                | Type                                | Default     | Description                           |
| ------------------- | ----------------------------------- | ----------- | ------------------------------------- |
| `variant`           | `PageSkeletonVariant`               | `'generic'` | Skeleton content preset               |
| `count`             | `number`                            | —           | Rows/items for list/settings variants |
| `padding`           | `PageSkeletonPadding`               | `'default'` | Inner content padding                 |
| `header`            | `ReactNode`                         | —           | Real header slot                      |
| `headerPlaceholder` | `boolean \| 'compact' \| 'default'` | `'default'` | Placeholder header                    |

## ErrorBoundary

React ErrorBoundary that catches render errors and renders ErrorState by default.

```tsx
import { ErrorBoundary } from '@thewhileloop/whileui';

<ErrorBoundary onError={(err) => console.error(err)}>
  <App />
</ErrorBoundary>;
```

| Prop     | Type                                       | Description                             |
| -------- | ------------------------------------------ | --------------------------------------- |
| fallback | `ReactNode \| (error, reset) => ReactNode` | Custom fallback; defaults to ErrorState |
| onError  | `(error, errorInfo) => void`               | Called when error is caught             |

## PullToRefreshScrollView

Themed ScrollView with RefreshControl. Uses `useThemeTokens` for spinner color.

```tsx
import { PullToRefreshScrollView } from '@thewhileloop/whileui';

<PullToRefreshScrollView refreshing={refreshing} onRefresh={fetchData} refreshColor="#22c55e">
  {content}
</PullToRefreshScrollView>;
```

| Prop         | Type         | Description                                |
| ------------ | ------------ | ------------------------------------------ |
| refreshing   | `boolean`    | Whether refresh is in progress             |
| onRefresh    | `() => void` | Called when user pulls to refresh          |
| refreshColor | `string`     | Optional hex override; defaults to primary |

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

## ProfileHeader

Copy from `apps/showcase/templates/profile/profile-header.tsx`, then:

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

Copy from `apps/showcase/templates/profile/`, then:

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

| Prop    | Type                         | Default      |
| ------- | ---------------------------- | ------------ |
| variant | `'vertical' \| 'horizontal'` | `'vertical'` |
| loading | `boolean`                    | `false`      |

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

| Prop        | Type         | Description                 |
| ----------- | ------------ | --------------------------- |
| `planName`  | `string`     | Current plan label          |
| `price`     | `string`     | Plan price                  |
| `period`    | `string`     | Billing period label        |
| `expiresAt` | `string`     | Renewal/expiry date text    |
| `isActive`  | `boolean`    | Active/inactive badge state |
| `onManage`  | `() => void` | Manage action               |
| `onUpgrade` | `() => void` | Upgrade action              |
| `loading`   | `boolean`    | Show skeleton placeholder   |

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

| Prop      | Type                                   | Default | Description                    |
| --------- | -------------------------------------- | ------- | ------------------------------ |
| `label`   | `string`                               | —       | Usage label                    |
| `used`    | `number`                               | —       | Used amount                    |
| `limit`   | `number`                               | —       | Quota limit                    |
| `variant` | `'default' \| 'warning' \| 'exceeded'` | auto    | Optional explicit visual state |

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

| Prop            | Type                                                               | Default                |
| --------------- | ------------------------------------------------------------------ | ---------------------- |
| `frosted`       | `boolean`                                                          | `false`                |
| `blurIntensity` | `number`                                                           | medium preset          |
| `blurTintToken` | `'surfaceElevated' \| 'surfaceTranslucent' \| 'card' \| 'popover'` | `'surfaceTranslucent'` |

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
- [ ] Add `loading` to remaining blocks: Header, BottomNav, DrawerMenu, TimelineFeed, SwipeableItem

### Documentation Gaps

- [ ] Add `## API` sections for: Textarea, Toggle, ToggleGroup, Label, Separator, Skeleton, AspectRatio, Collapsible, Text, View, Pressable
- [ ] Add `## API` sections for blocks: FloatingBottomNav, TabBar, FormModalScreen, ErrorState, LoadingScreen, OnboardingScreen, ListItem, NotificationItem, MetricCard, SmartImage, TimelineFeed
- [ ] Build `apps/site/` (docs website) with `registry.ts`, `demos.tsx`, `block-demos.tsx`, `props-data.ts`

### Infrastructure

- [ ] Publish to npm (`@thewhileloop/whileui`)
- [ ] CI: typecheck + format check on PR
- [ ] Automated visual regression tests (screenshot comparison)

## License

MIT — [Source](https://github.com/whileloophq/whileui)
