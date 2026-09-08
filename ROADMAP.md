# WhileUI: one design system, two renderers

## The one idea

WhileUI exists so that starting an app is choosing a shell, not choosing a
stack. Everything below follows from that.

The library is therefore judged on one question: **when a new app needs a
screen, how much of that screen already exists?** Primitives barely move that
number — a Button saves ten minutes. App-shaped compositions move it a lot — an
app shell with navigation, a sheet, a settings list and an empty state save a
day. That is why `blocks/` is the centre of this package and not a convenience
folder beside it.

## What changed

WhileUI was built React Native first, on Uniwind, with the web reached through
`react-native-web`. The web path still exists and still works
(`createWhileUIViteCompatConfig` in `packages/ui/src/vite.ts`).

But not every app is native-first. split-loop is a web app that reaches the
stores through a shell — a WebView, not a native renderer — and for an app like
that a React-Native-first library is indirection: it carries `react-native-web`
for portability it never exercises and loses semantic HTML to get it.

So there are two tracks sharing one token layer:

- **DOM** — every current app: sidekick-app (migrating off Expo, 2026-09) and
  split-loop. Browser, Capacitor for iOS/Android, Tauri for desktop; one build.
  Mac is Tauri, or the iOS Capacitor build offered on Apple-silicon Macs.
- **React Native** — no active consumer once sidekick-app has migrated. Kept
  for a native-first app if one appears; not developed speculatively.

New components are built on the DOM track. A native version follows only when a
native consumer needs it.

## Three targets, one renderer

This is the fact the architecture rests on:

| Target  | Host                            | Renders |
| ------- | ------------------------------- | ------- |
| Web     | Browser                         | DOM     |
| Mobile  | Capacitor (WKWebView / Android) | DOM     |
| Desktop | Tauri (WebView2 / WebKit)       | DOM     |

All three run the same build. "One library across web, mobile and desktop" is
not an achievement to engineer — it is what falls out of dropping the second
renderer. There is no conditional rendering in the UI layer, ever.

What genuinely differs between hosts is **device capability**, not UI. That
belongs behind one thin adapter (see `platform/` below) and nowhere else.

## What WhileUI owns, and what it delegates

Owning a layer means maintaining it forever. Only own the layers where nothing
better exists.

| Layer                                       | Owner                                         |
| ------------------------------------------- | --------------------------------------------- |
| Tokens, themes, recipes, visual contract    | **WhileUI**                                   |
| Presentational primitives                   | **WhileUI**                                   |
| Behavioural primitives                      | **WhileUI** wrapping Radix                    |
| Blocks — app-shaped compositions            | **WhileUI** (the differentiator)              |
| Nav chrome — headers, tab bars, drawers     | **WhileUI** (see "system chrome" below)       |
| Capability adapter, incl. the mandatory set | **WhileUI** (`platform/`)                     |
| Animation                                   | Motion                                        |
| Page transitions and swipe-back             | `@capgo/capacitor-transitions`                |
| Device capability                           | Capacitor / Tauri plugins, behind `platform/` |

Three notes on that table.

**We already delegate the behavioural primitives.** The package depends on
`@rn-primitives/portal`, `select`, `popover`, `tooltip` and `hover-card`, and
rn-primitives is a Radix port. Moving the DOM track onto Radix itself is the
same architectural decision, using the original instead of the port. Focus
trapping, aria wiring, roving focus, scroll locking and collision detection are
years of edge cases; we do not rediscover them.

**shadcn is not a dependency and never becomes one.** It is copy-paste. It is
useful as reference for how a Radix component is usually wired, and that is all.
Building on it would mean adopting a token vocabulary we already have.

**We do not hand the system our chrome.** `@capgo/capacitor-native-navigation`
will render a genuine UIKit navigation bar and tab bar, and we deliberately do
not use it. System-owned means system-styled: the two most visible pieces of an
app would stop being driven by our tokens and start looking like stock iOS. An
app built on WhileUI would then be brand-consistent everywhere except its header
and its tab bar, which is the outcome the whole token system exists to prevent.

Page transitions are the opposite case, and worth separating carefully.
`@capgo/capacitor-transitions` supplies _behaviour_, not chrome — push and pop
animation plus the iOS edge-swipe-back gesture — and touches nothing we style.
Without it, tapping into a detail screen swaps content with no motion and
swiping from the left edge does nothing at all, because a Capacitor WebView has
no browser chrome to fall back on. iOS users swipe back reflexively. Treat it as
part of the baseline for any app with drill-down navigation, not as polish.

## The niche, stated plainly

The two closest neighbours answer different questions than we do. Worth being
precise about how, rather than dismissive — both are good at their own job.

**shadcn/ui** is a copy-paste primitive set aimed mainly at desktop web. We
borrow its token vocabulary on purpose — `primary`, `foreground`, `card`,
`muted`, `border`, `ring`, `destructive` are its names, kept so that anyone
fluent in one is fluent in the other.

**Konsta UI** ships mobile components with pixel-perfect iOS and Material
themes built from the platform design guidelines. That is precisely its value:
an app that _should_ look like a stock platform app gets one in an afternoon.
Ours is the opposite goal — a token system a brand drives — so the two are not
really competing.

What neither has assembled is the **mobile-shaped, token-driven** layer: an app
shell, a bottom nav, a sheet that drags and settles, a swipeable list item,
pull-to-refresh, a timeline feed, settings rows. WhileUI already has all of
those on the native track. That is the gap, and it is the reason this package
is worth maintaining at all.

Konsta is worth _studying_ for mechanics — how a sheet settles, how iOS and
Material variants diverge. Study, do not copy: see the attribution rule in
`AGENTS.md` before adapting code from any project.

## Package architecture

One package, subpath exports, which is already how this package is built.

```
@thewhileloop/whileui              DOM. Web-first apps.
  ├── /                            components + blocks
  ├── /tokens                      theme contract, presets, recipes — no React
  ├── /platform                    capability adapter, auto-detects host
  ├── /platform/web
  ├── /platform/capacitor
  ├── /platform/tauri
  └── /vite                        Vite config helper

@thewhileloop/whileui-native       React Native. No active consumer; kept.
```

Radix and Motion are peer dependencies **wrapped by WhileUI**, so an app never
imports them directly. That is what makes "the only UI import" literally true
for app code:

```tsx
import { AppShell, BottomNav, Card, Button } from '@thewhileloop/whileui';
import { haptics, secureStore } from '@thewhileloop/whileui/platform';

haptics.impact('light'); // buzzes under Capacitor, no-op in a browser
await secureStore.set('token', t); // Keychain, Tauri store, or localStorage
```

The shell is configuration, not code: `vite build` for web, `+ cap sync` for
mobile, `+ cargo tauri build` for desktop.

### The core is already portable

About 1,570 lines of `packages/ui/src/lib/` carry no React Native import at all:
`visual-token-contract.ts` (690), `theme-contract.ts` (552),
`theme-presets.ts` (266), plus `cn`, `tv` and `compose-event-handlers`. These are
plain data and class strings.

`themePresetToCss()` already emits a ready-to-paste Tailwind 4 `@theme` block
with `@variant light` / `@variant dark` — meaning the theme system needs no work
to serve a DOM app. It was renderer-agnostic before we decided it should be.

The files that look RN-bound mostly are not. `recipes.ts` imports only
`import type { TextStyle, ViewStyle }` — a type-only import. `visual-tokens.ts`,
`theme-colors.ts` and `interaction-tokens.ts` are thin hooks that read CSS
variables, which is easier on the web than on native, not harder.

## The work, in four groups

Ordered by how mechanical it is. None of it should be done speculatively — see
"How work gets pulled" below.

**Group A — presentational.** `button`, `card`, `badge`, `text`, `row`, `stack`,
`box`, `view`, `separator`, `skeleton`, `spinner`, `avatar`, `progress`, `alert`,
`label`, `aspect-ratio`, `pressable`.

A mechanical port. The `tv()` variant blocks, the `*Context` inheritance pattern
and the token lookups all transfer verbatim; only the JSX changes — `Pressable`
to `button`, `Text` to `span`, `View` to `div`. Roughly 20 lines per component.
Do **not** pull in shadcn for these; it would be more work and would break API
parity with the native track.

**Group B — behavioural.** `dialog`, `alert-dialog`, `select`, `popover`,
`dropdown-menu`, `context-menu`, `menubar`, `tooltip`, `hover-card`, `accordion`,
`collapsible`, `tabs`, `toast`, `toggle-group`, `radio-group`, `checkbox`.

Same variants and API, with Radix underneath instead of rn-primitives.

**Group C — blocks.** The differentiator, and the only group where there is no
prior art to lean on. `app-shell`, `bottom-nav`, `floating-bottom-nav`, `header`,
`sheet`, `confirm-action-sheet`, `empty-state`, `error-state`, `list-item`,
`swipeable-item`, `timeline-feed`, `pull-to-refresh-scroll-view`, the skeletons.

**Group D — `platform/`.** Three implementations behind one interface, host
detected via `Capacitor.isNativePlatform()`, `window.__TAURI__`, else web.

The point of this layer is not tidiness, it is that **a new app must not be able
to forget the mandatory set**. Every item below is something an app is broken
without, and every one of them is easy to miss until a reviewer or a user finds
it. Wiring them per app is how you ship the same bug five times.

| Capability               | Capacitor                           | Why it is mandatory                                                                         |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| **Hardware back**        | `@capacitor/app` `backButton`       | **Android closes the app instead of navigating back if unhandled.** No web fallback exists. |
| Secure storage           | `@capacitor/preferences` / Keychain | Auth tokens. WebView `localStorage` is evictable.                                           |
| Keyboard                 | `@capacitor/keyboard`               | Without it the viewport resizes rather than animating, and inputs hide behind the keyboard. |
| Status bar and safe area | `@capacitor/status-bar`             | Content sits under the clock and the home indicator otherwise.                              |
| Deep links               | `@capacitor/app` `appUrlOpen`       | Invite and share URLs have to open in the app.                                              |
| Haptics                  | `@capacitor/haptics`                | Not strictly required; the cheapest native-feel win available.                              |
| Share, filesystem        | `@capacitor/share`, `filesystem`    | Any export or share-image flow.                                                             |

Each falls back sensibly on the web — hardware back becomes browser back,
secure storage becomes `localStorage`, haptics becomes a no-op — so an app
written against `platform/` runs unmodified in a browser.

Larger than the ~200 lines first estimated, because the back-button and deep-link
handlers have to co-operate with the router rather than just proxy a call.

## Known gaps

Known before this direction was set, plus what it surfaces:

- **FAB** — Konsta has one, we do not. Every app with a primary create action
  needs it.
- **Searchbar** — long asked for by sidekick. Needs to be a real component, not a
  styled input.
- **`blocks/auth/` and `blocks/profile/` are empty directories.** The templates
  live unexported in `apps/showcase/templates/`. Decide: export or delete the
  empty dirs.
- **`PageSkeleton` renders content-only**, so headers pop in on load. Affects
  every screen of every consuming app. Highest-value fix on the list.
- **No chart primitives.**
- **Desktop is not free.** Components carry over; keyboard shortcuts, menu bars,
  window state, hover affordances and denser layouts are design work that does
  not.

## Non-goals

- **A pixel-perfect iOS or Material skin.** That is Konsta's product. Ours is a
  token system a brand can drive.
- **Forced API parity between the tracks.** Same names and variants where a
  component exists on both — that part is cheap, variants are strings. Beyond
  that, neither track waits for the other.
- **A second renderer abstraction.** No `Platform.select` in the DOM track, no
  universal primitive layer. `react-strict-dom` may make this worth revisiting
  in a few years — until then, two tracks that share tokens is the whole design.
- **Owning animation, transitions or device access.** Delegated, per the table
  above.

## How work gets pulled

Nothing in Groups A–D gets built speculatively. Each piece is pulled into
existence by a real screen in a real app that needs it — the loop the native track
already describes as _build in the app first, extract once proven_.

The first consumer is sidekick-app, being rebuilt from Expo to React DOM behind
a Capacitor shell, screen by screen. Its screens pull:

| sidekick-app screen   | Pulls into existence                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `auth/`               | `Input`, `OTPInput`, `Alert`, `Spinner`, `Separator`, `SocialConnections`                |
| dashboard             | `SmartInput` (typewriter placeholder), `Progress`, `PageSkeleton`, `Badge`, `MetricCard` |
| `SideNav`, `Header`   | `DrawerMenu`, `Header` — exist; plus `ThemeToggle`                                       |
| `ActivityDetailSheet` | `Sheet`, `Textarea`, `AlertDialog`                                                       |
| history, settings     | `Switch`, `Select`, `SegmentedControl`, `DataRow`, `DatePickerModal`, chart primitives   |
| `_layout`             | `ErrorBoundary`, `AppProvider`, `platform/` (secure store, push, haptics)                |

split-loop follows, behind its own Capacitor shell. Its screens:

| Split-Loop screen | Pulls into existence                                |
| ----------------- | --------------------------------------------------- |
| `Account.tsx`     | `settings-section`, `settings-item`, `account-card` |
| `Activity.tsx`    | `timeline-feed`                                     |
| `Workspace.tsx`   | `app-shell`, `bottom-nav`, FAB                      |
| `AuthForm.tsx`    | auth templates, `otp-input`                         |
| `QuickAdd.tsx`    | `sheet`, `numeric-input`, keyboard adapter          |
| `ui.tsx`          | Group A, `Searchbar`                                |

Extract `@thewhileloop/whileui/tokens` when the **second** app needs it, not
before.
