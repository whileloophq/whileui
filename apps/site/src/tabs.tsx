import { useEffect, useRef, useState } from 'react';
import {
  Button,
  ButtonText,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DrawerMenu,
  Header,
  HeaderBackButton,
  currentPlatform,
  detectHost,
  haptics,
  hardwareBack,
  keyboard,
  secureStore,
  share,
  statusBar,
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

      <SectionGroup label="Still to port" />
      <Pending
        items={[
          'text',
          'row',
          'stack',
          'box',
          'view',
          'separator',
          'skeleton',
          'spinner',
          'avatar',
          'progress',
          'alert',
          'label',
          'badge',
          'aspect-ratio',
          'pressable',
        ]}
      />
    </>
  );
}

const PENDING: Record<Exclude<CategoryKey, 'primitives'>, string[]> = {
  controls: [
    'input',
    'textarea',
    'checkbox',
    'radio-group',
    'switch',
    'toggle',
    'toggle-group',
    'select',
    'segmented-control',
    'numeric-input',
    'otp-input',
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
    'page-skeleton',
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
  const [intercept, setIntercept] = useState(false);
  const [color, setColor] = useState('#4457ff');

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
  if (category === 'navigation') return <NavigationTab />;
  if (category === 'platform') return <PlatformTab />;
  return (
    <>
      <SectionGroup label={CATEGORIES.find((c) => c.key === category)?.label ?? category} />
      <Pending items={PENDING[category]} />
    </>
  );
}
