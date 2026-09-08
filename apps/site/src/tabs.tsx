import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DrawerMenu,
  GoogleSignInButton,
  Header,
  HeaderBackButton,
  Input,
  OTPInput,
  PageSkeleton,
  Separator,
  Skeleton,
  Spinner,
  currentPlatform,
  detectHost,
  haptics,
  hardwareBack,
  keyboard,
  network,
  notifications,
  secureStore,
  share,
  statusBar,
  storage,
} from '@thewhileloop/whileui/web';
import { Glyph, Pending, Section, SectionGroup } from './sections';

// Category tabs, keyed like `apps/showcase/App.tsx`. Empty categories list what
// they are waiting on — the port's progress board.

export type CategoryKey =
  | 'primitives'
  | 'controls'
  | 'overlays'
  | 'forms'
  | 'auth'
  | 'navigation'
  | 'layout'
  | 'chat'
  | 'profile'
  | 'lists'
  | 'commerce'
  | 'platform';

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'primitives', label: 'All Components' },
  { key: 'controls', label: 'Controls' },
  { key: 'overlays', label: 'Overlays' },
  { key: 'forms', label: 'Forms' },
  { key: 'auth', label: 'Auth' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'layout', label: 'Layout' },
  { key: 'chat', label: 'Chat' },
  { key: 'profile', label: 'Profile' },
  { key: 'lists', label: 'Lists' },
  { key: 'commerce', label: 'Commerce' },
  { key: 'platform', label: 'Platform' },
];

// Drawer grouping, matching the native showcase. Components vs Blocks is the
// library's own distinction (AGENTS.md).
export const DRAWER_SECTIONS: { title: string; items: CategoryKey[] }[] = [
  { title: 'Components', items: ['primitives', 'controls', 'overlays', 'forms'] },
  {
    title: 'Blocks',
    items: ['auth', 'navigation', 'layout', 'chat', 'profile', 'lists', 'commerce'],
  },
  // DOM-track only; RN has Platform built in.
  { title: 'Platform', items: ['platform'] },
];

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const;
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const;

function PrimitivesTab() {
  return (
    <>
      <SectionGroup label="Group A — presentational" />

      <Section title="Button" subtitle="Geometry from --ui-control-* tokens; default height 44px.">
        <div className="flex flex-col gap-3">
          {BUTTON_SIZES.map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-muted-foreground">{size}</span>
              {BUTTON_VARIANTS.map((variant) => (
                <Button key={variant} variant={variant} size={size}>
                  <ButtonText>{variant}</ButtonText>
                </Button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">off</span>
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} disabled>
                <ButtonText>{variant}</ButtonText>
              </Button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Button — full width" subtitle="The commonest mobile shape.">
        <Button className="w-full" size="lg">
          <ButtonText>Add expense</ButtonText>
        </Button>
        <Button className="w-full" variant="ghost">
          <ButtonText>Cancel</ButtonText>
        </Button>
      </Section>

      <Section
        title="Card"
        subtitle="Padding and radius from --ui-surface-padding-* and --ui-radius-xl."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>padding default, shadow sm</CardDescription>
            </CardHeader>
          </Card>
          <Card padding="lg" shadow="lg">
            <CardHeader>
              <CardTitle>Large</CardTitle>
              <CardDescription>padding lg, shadow lg</CardDescription>
            </CardHeader>
          </Card>
          <Card padding="sm" shadow="none">
            <CardHeader>
              <CardTitle>Flat</CardTitle>
              <CardDescription>padding sm, shadow none</CardDescription>
            </CardHeader>
          </Card>
          <Card unstyled>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                unstyled — no border, background or radius
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Composed" subtitle="What a block is made of.">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Delete this group?</CardTitle>
            <CardDescription>
              Every expense in it stays on the ledger. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button variant="destructive">
              <ButtonText>Delete</ButtonText>
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Alert" subtitle="Soft-tinted variants; the icon slot lays itself out.">
        <div className="flex flex-col gap-3">
          <Alert>
            <AlertTitle>Nothing is wrong</AlertTitle>
            <AlertDescription>The default variant carries no tint.</AlertDescription>
          </Alert>
          <Alert variant="warning" icon={<Glyph d={WARNING} className="text-warning" />}>
            <AlertDescription>That code has expired. Ask for a new one.</AlertDescription>
          </Alert>
          <Alert variant="destructive" icon={<Glyph d={WARNING} className="text-destructive" />}>
            <AlertDescription>We could not reach the server.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertDescription>Saved.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertDescription>Rates were frozen when the expense was entered.</AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section
        title="Separator"
        subtitle="With a label it becomes the divider above social sign-in."
      >
        <div className="flex flex-col gap-4">
          <Separator />
          <Separator label="or" />
          <div className="flex h-10 items-center gap-4">
            <span className="text-sm text-muted-foreground">left</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">right</span>
          </div>
        </div>
      </Section>

      <Section title="Spinner" subtitle="Inherits currentColor, so it is legible on any button.">
        <div className="flex flex-wrap items-center gap-4">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <Button>
            <Spinner size="sm" />
            <ButtonText>Signing in</ButtonText>
          </Button>
        </div>
      </Section>

      <Section title="Skeleton" subtitle="Pulse only on the DOM track — see the source for why.">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </Section>

      <SectionGroup label="Still to port" />
      <Pending
        items={[
          'text',
          'row',
          'stack',
          'box',
          'view',
          'avatar',
          'progress',
          'label',
          'badge',
          'aspect-ratio',
          'pressable',
        ]}
      />
    </>
  );
}

function ControlsTab() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <>
      <SectionGroup label="Group A — controls" />

      <Section title="Input" subtitle="Prefix and suffix slots; geometry from the field recipe.">
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            prefix={<Glyph d={ENVELOPE} className="text-muted-foreground" />}
          />
          <Input
            placeholder="Password"
            type="password"
            prefix={<Glyph d={LOCK} className="text-muted-foreground" />}
          />
          <Input
            placeholder="Amount"
            suffix={<span className="text-sm text-muted-foreground">SGD</span>}
          />
          <Input variant="error" placeholder="That address is not valid" />
          <Input placeholder="Disabled" disabled />
        </div>
      </Section>

      <Section
        title="OTPInput"
        subtitle="Cells are presentation; one transparent field over them takes the typing and the OS code suggestion."
      >
        <div className="flex flex-col gap-4">
          <OTPInput value={code} onValueChange={setCode} />
          <OTPInput size="compact" value={code} onValueChange={setCode} secure />
          <OTPInput variant="error" value={code} onValueChange={setCode} />
          <p className="text-xs text-muted-foreground">
            Typed: <span className="font-mono">{code || '—'}</span>
          </p>
        </div>
      </Section>

      <SectionGroup label="Still to port" />
      <Pending items={PENDING.controls} />
    </>
  );
}

function AuthTab() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SectionGroup label="Group C — auth" />

      <Section
        title="GoogleSignInButton"
        subtitle="Google's branding fixes the colours, so it stays white in dark mode. The plugin call is the app's."
      >
        <div className="flex max-w-sm flex-col gap-3">
          <GoogleSignInButton
            loading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1200);
            }}
          />
          <GoogleSignInButton disabled label="Sign in with Google" />
        </div>
      </Section>

      <SectionGroup label="Still to port" />
      <Pending items={PENDING.auth} />
    </>
  );
}

function LayoutTab() {
  const [variant, setVariant] = useState<'dashboard' | 'list' | 'settings' | 'card' | 'generic'>(
    'list'
  );

  return (
    <>
      <SectionGroup label="Group C — layout" />

      <Section
        title="PageSkeleton"
        subtitle="The shape of the screen that is loading, not a spinner in the middle of it."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {(['dashboard', 'list', 'settings', 'card', 'generic'] as const).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={variant === key ? 'default' : 'outline'}
              onClick={() => setVariant(key)}
            >
              <ButtonText>{key}</ButtonText>
            </Button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <PageSkeleton variant={variant} headerPlaceholder />
        </div>
      </Section>

      <SectionGroup label="Still to port" />
      <Pending items={PENDING.layout} />
    </>
  );
}

const PENDING: Record<Exclude<CategoryKey, 'primitives'>, string[]> = {
  controls: [
    'textarea',
    'checkbox',
    'radio-group',
    'switch',
    'toggle',
    'toggle-group',
    'select',
    'segmented-control',
    'numeric-input',
  ],
  overlays: [
    'dialog',
    'alert-dialog',
    'popover',
    'dropdown-menu',
    'context-menu',
    'menubar',
    'tooltip',
    'hover-card',
    'toast',
    'sheet',
    'confirm-action-sheet',
  ],
  forms: ['form-field', 'labeled-field', 'smart-input', 'form-modal-screen'],
  auth: ['sign-in-form', 'sign-up-form', 'verify-email-form', 'social-connections', 'user-menu'],
  navigation: ['bottom-nav', 'floating-bottom-nav', 'tab-bar', 'navigation-sidebar', 'FAB (new)'],
  layout: [
    'empty-state',
    'error-state',
    'loading-screen',
    'content-skeleton',
    'action-bar',
    'onboarding-screen',
  ],
  chat: ['chat'],
  profile: ['profile-header', 'account-card', 'settings-section', 'settings-item'],
  lists: ['list-item', 'notification-item', 'swipeable-item', 'timeline-feed'],
  commerce: [
    'pricing-card',
    'checkout-summary',
    'product-card',
    'metric-card',
    'subscription-card',
    'usage-bar',
  ],
  platform: ['tauri adapter'],
};

const INBOX =
  'M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z';
const SEND = 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z';
const ARCHIVE = 'M21 8v13H3V8M1 3h22v5H1zM10 12h4';
const MORE = 'M12 5v.01M12 12v.01M12 19v.01';
const WARNING =
  'M12 9v4M12 17v.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z';
const ENVELOPE = 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6';
const LOCK =
  'M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2zM8 11V7a4 4 0 018 0v4';

function NavigationTab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SectionGroup label="Group C — blocks" />

      <Section
        title="AppShell + Header + DrawerMenu"
        subtitle="This showcase's own chrome — header, hamburger, drawer — is the library's."
      >
        <Card padding="sm">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Open the menu (top left) to see <span className="font-mono">DrawerMenu</span> with
              sections and an active item. Resize the window: nothing changes, because there is
              nothing to change — one build, no host detection.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Header"
        subtitle="Non-sticky so it sits in the flow. HeaderBackButton defaults to history.back()."
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <Header
            sticky={false}
            title="Flat 302"
            subtitle="4 members"
            leftAction={<HeaderBackButton onClick={() => undefined} />}
            rightActions={[
              {
                key: 'more',
                label: 'More',
                icon: <Glyph d={MORE} />,
                tone: 'ghost',
                onPress: () => undefined,
              },
            ]}
          />
        </div>
      </Section>

      <Section
        title="DrawerMenu — icons, badges, destructive"
        subtitle="Props the shell doesn't exercise: icons, badges (cap 99+), destructive."
      >
        <Button variant="outline" onClick={() => setOpen(true)}>
          <ButtonText>Open demo drawer</ButtonText>
        </Button>
        <DrawerMenu
          visible={open}
          onClose={() => setOpen(false)}
          activeKey="inbox"
          onSelect={() => setOpen(false)}
          sections={[
            {
              title: 'Mail',
              items: [
                { key: 'inbox', label: 'Inbox', icon: <Glyph d={INBOX} />, badge: 12 },
                { key: 'sent', label: 'Sent', icon: <Glyph d={SEND} /> },
                { key: 'archive', label: 'Archive', icon: <Glyph d={ARCHIVE} />, badge: 120 },
              ],
            },
            { items: [{ key: 'signout', label: 'Sign out', destructive: true }] },
          ]}
          header={
            <div className="px-5 py-6">
              <p className="text-lg font-bold text-foreground">Demo</p>
              <p className="text-sm text-muted-foreground">Escape or tap outside to close</p>
            </div>
          }
        />
      </Section>

      <SectionGroup label="Still to port" />
      <Pending items={PENDING.navigation} />
    </>
  );
}

// Every capability, exercised. In a browser these are the web fallbacks; under
// Capacitor the same tab reports the real hardware.
function PlatformTab() {
  const detected = detectHost();
  const installed = currentPlatform().name;
  const mismatch = detected !== 'web' && installed === 'web';

  // Lines can repeat, so entries carry an id.
  const [log, setLog] = useState<{ id: number; line: string }[]>([]);
  const nextId = useRef(0);
  const note = (line: string) =>
    setLog((prev) => [{ id: nextId.current++, line }, ...prev].slice(0, 8));

  const storeKey = 'whileui.demo';
  const [storeValue, setStoreValue] = useState('');
  const [plainValue, setPlainValue] = useState('');
  const [intercept, setIntercept] = useState(false);
  const [color, setColor] = useState('#4457ff');
  const [online, setOnline] = useState(network.online);

  useEffect(() => network.onChange(setOnline), []);

  // Demo interceptor; real components register on open and release on close.
  useEffect(() => {
    if (!intercept) return;
    return hardwareBack.onBack(() => {
      note('back: intercepted by demo handler (returned true)');
      return true;
    });
  }, [intercept]);

  return (
    <>
      <SectionGroup label="Group D — platform/" />

      <Section
        title="Host"
        subtitle="Detected from the window vs. what installPlatform() received."
      >
        <Card padding="sm">
          <CardContent className="flex flex-col gap-1 font-mono text-sm">
            <p>
              detected: <span className="text-foreground">{detected}</span>
            </p>
            <p>
              installed: <span className="text-foreground">{installed}</span>
            </p>
            {mismatch && (
              <p className="text-destructive">
                Running inside {detected} but no adapter installed — everything below is a web
                fallback. Call installPlatform() at boot.
              </p>
            )}
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Hardware back"
        subtitle="Handlers run newest-first; the first to return true consumes the press."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={intercept ? 'default' : 'outline'}
            onClick={() => setIntercept((v) => !v)}
          >
            <ButtonText>{intercept ? 'Interceptor on' : 'Interceptor off'}</ButtonText>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const before = hardwareBack.depth;
              hardwareBack.trigger();
              if (!intercept)
                note(
                  `back: fell through to host fallback (${before} handlers, history.length=${window.history.length})`
                );
            }}
          >
            <ButtonText>Trigger back</ButtonText>
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            depth {hardwareBack.depth}
          </span>
        </div>
      </Section>

      <Section
        title="Haptics"
        subtitle="Resolves true only if the host buzzed. iOS Safari has no API and reports false."
      >
        <div className="flex flex-wrap gap-2">
          {(['light', 'medium', 'heavy'] as const).map((style) => (
            <Button
              key={style}
              variant="outline"
              size="sm"
              onClick={() =>
                void haptics.impact(style).then((ok) => note(`haptics.impact(${style}) → ${ok}`))
              }
            >
              <ButtonText>{style}</ButtonText>
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              void haptics
                .notification('success')
                .then((ok) => note(`haptics.notification → ${ok}`))
            }
          >
            <ButtonText>notification</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Secure store"
        subtitle={`Backend: ${secureStore.backend} — secure: ${String(secureStore.secure)}.`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={storeValue}
            onChange={(event) => setStoreValue(event.target.value)}
            placeholder="value"
            className="min-h-11 flex-1 rounded-xl border border-border bg-muted px-3 text-sm text-foreground outline-none focus:border-ring"
            style={{ minWidth: 160 }}
          />
          <Button
            size="sm"
            onClick={() =>
              void secureStore.set(storeKey, storeValue).then(() => note(`set ${storeKey}`))
            }
          >
            <ButtonText>Save</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void secureStore.get(storeKey).then((value) => {
                setStoreValue(value ?? '');
                note(`get ${storeKey} → ${JSON.stringify(value)}`);
              })
            }
          >
            <ButtonText>Load</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              void secureStore.remove(storeKey).then(() => {
                setStoreValue('');
                note(`remove ${storeKey}`);
              })
            }
          >
            <ButtonText>Clear</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Storage"
        subtitle="Unencrypted key-value: localStorage on the web, Preferences under Capacitor. Where a theme choice lives."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="flex-1"
            style={{ minWidth: 160 }}
            placeholder="value"
            value={plainValue}
            onChange={(event) => setPlainValue(event.target.value)}
          />
          <Button
            size="sm"
            onClick={() => void storage.set(storeKey, plainValue).then(() => note(`storage.set`))}
          >
            <ButtonText>Save</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void storage.get(storeKey).then((value) => {
                setPlainValue(value ?? '');
                note(`storage.get → ${JSON.stringify(value)}`);
              })
            }
          >
            <ButtonText>Load</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Network"
        subtitle="Turn the wifi off: the badge follows, because onChange fires from the host."
      >
        <div className="flex items-center gap-3">
          <span
            className={
              online
                ? 'rounded-full bg-success-soft px-3 py-1 text-sm font-medium text-success'
                : 'rounded-full bg-destructive-soft px-3 py-1 text-sm font-medium text-destructive'
            }
          >
            {online ? 'online' : 'offline'}
          </span>
          <span className="text-sm text-muted-foreground">network.online</span>
        </div>
      </Section>

      <Section
        title="Notifications"
        subtitle="Local and scheduled only. The web asks the browser; Capacitor schedules on the device."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void notifications
                .requestPermission()
                .then((granted) => note(`requestPermission → ${granted}`))
            }
          >
            <ButtonText>Ask permission</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void notifications
                .schedule([
                  {
                    id: 1,
                    title: 'WhileUI',
                    body: 'Scheduled ten seconds ago.',
                    at: new Date(Date.now() + 10_000),
                  },
                ])
                .then(() => note('scheduled #1 in 10s'))
            }
          >
            <ButtonText>Schedule</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void notifications.cancel([1]).then(() => note('cancelled #1'))}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              void notifications.pending().then((ids) => note(`pending → [${ids.join(', ')}]`))
            }
          >
            <ButtonText>Pending</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Keyboard"
        subtitle="Focus the field on a phone, then Hide. On the web, hide is a blur."
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            placeholder="tap to raise the keyboard"
            className="min-h-11 flex-1 rounded-xl border border-border bg-muted px-3 text-sm text-foreground outline-none focus:border-ring"
            style={{ minWidth: 160 }}
          />
          <Button
            size="sm"
            variant="outline"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => void keyboard.hide().then(() => note('keyboard.hide()'))}
          >
            <ButtonText>Hide</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Status bar"
        subtitle="Web: writes the theme-color meta. Capacitor: also sets the real bar."
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="size-11 cursor-pointer rounded-xl border border-border bg-muted"
            aria-label="Status bar colour"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void statusBar
                .setBackgroundColor(color)
                .then(() => note(`statusBar.setBackgroundColor(${color})`))
            }
          >
            <ButtonText>Apply</ButtonText>
          </Button>
        </div>
      </Section>

      <Section
        title="Share"
        subtitle={`share.available: ${String(share.available)}. Dismissing resolves false.`}
      >
        <Button
          variant="outline"
          disabled={!share.available}
          onClick={() =>
            void share
              .share({ title: 'WhileUI', text: 'DOM track showcase', url: location.href })
              .then((ok) => note(`share → ${ok}`))
          }
        >
          <ButtonText>Share this page</ButtonText>
        </Button>
      </Section>

      <Section title="Log" subtitle="Most recent first.">
        <Card padding="sm">
          <CardContent>
            {log.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing yet — press something above.</p>
            ) : (
              <ul className="flex flex-col gap-1 font-mono text-xs text-foreground">
                {log.map((entry) => (
                  <li key={entry.id}>{entry.line}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Section>

      <SectionGroup label="Still to build" />
      <Pending items={PENDING.platform} />
    </>
  );
}

/** A component, not a render function, so a tab switch reconciles as one element swap. */
export function Tab({ category }: { category: CategoryKey }) {
  if (category === 'primitives') return <PrimitivesTab />;
  if (category === 'controls') return <ControlsTab />;
  if (category === 'auth') return <AuthTab />;
  if (category === 'layout') return <LayoutTab />;
  if (category === 'navigation') return <NavigationTab />;
  if (category === 'platform') return <PlatformTab />;
  return (
    <>
      <SectionGroup label={CATEGORIES.find((c) => c.key === category)?.label ?? category} />
      <Pending items={PENDING[category]} />
    </>
  );
}
