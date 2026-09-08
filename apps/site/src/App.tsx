import { useState } from 'react';
import {
  AppShell,
  DrawerMenu,
  Header,
  HeaderIconButton,
  haptics,
  useTheme,
} from '@thewhileloop/whileui/web';
import { Glyph } from './sections';
import { CATEGORIES, DRAWER_SECTIONS, Tab, type CategoryKey } from './tabs';

// The DOM showcase: an app built with the library, shell from the library,
// matching `apps/showcase/App.tsx`. The category chip strip stays local until a
// second consumer wants `scroll-tabs`. No bottom dock — BottomNav and TabBar
// are demoed as components, not used as chrome.

const GUTTER = 'mx-auto w-full max-w-4xl';

const MENU = 'M3 6h18M3 12h18M3 18h18';
const SUN =
  'M12 8a4 4 0 100 8 4 4 0 100-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4';
const MOON = 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z';

export default function App() {
  const [active, setActive] = useState<CategoryKey>('primitives');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { resolved, toggle } = useTheme();
  const dark = resolved === 'dark';

  const go = (key: string) => {
    void haptics.selection();
    setActive(key as CategoryKey);
    setDrawerOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <AppShell
      contentClassName={`${GUTTER} px-5 py-6`}
      header={
        <Header
          title="WhileUI"
          subtitle="Beautiful components, one renderer"
          contentClassName={GUTTER}
          leftAction={
            <HeaderIconButton label="Open menu" onClick={() => setDrawerOpen(true)}>
              <Glyph d={MENU} />
            </HeaderIconButton>
          }
          rightActions={[
            {
              key: 'theme',
              label: dark ? 'Switch to light' : 'Switch to dark',
              icon: <Glyph d={dark ? SUN : MOON} />,
              tone: 'secondary',
              onPress: toggle,
            },
          ]}
        >
          <div
            className="overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ paddingInline: 'calc(var(--ui-control-padding-x-default) * 1px)' }}
          >
            <div className="flex w-max items-center gap-1.5">
              {CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => go(category.key)}
                  aria-current={active === category.key ? 'page' : undefined}
                  className={`min-h-10 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    active === category.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </Header>
      }
    >
      <Tab category={active} />

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeKey={active}
        onSelect={go}
        sections={DRAWER_SECTIONS.map((section) => ({
          title: section.title,
          items: section.items.map((key) => ({
            key,
            label: CATEGORIES.find((c) => c.key === key)?.label ?? key,
          })),
        }))}
        header={
          <div className="px-5 py-6">
            <p className="text-lg font-bold text-foreground">WhileUI</p>
            <p className="text-sm text-muted-foreground">DOM track</p>
          </div>
        }
        footer={
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Same tokens as the native showcase. No react-native-web.
            </p>
          </div>
        }
      />
    </AppShell>
  );
}
