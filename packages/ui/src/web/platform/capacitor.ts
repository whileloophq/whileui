import { formatHex, parse } from 'culori';
import type { LocalNotification, Platform } from './types';
import { createWebPlatform } from './web';

// Capacitor implementation with no Capacitor dependency: the app passes in the
// plugin modules it installed, once, at boot. Dependency types are structural
// (method shorthand → bivariant) so the library has no type dependency either.
// Every dep is optional and falls back to the web behaviour; the mandatory set
// is `App`, `Keyboard`, `StatusBar` and a storage backend.
//
//   import { App } from '@capacitor/app';
//   import { Haptics } from '@capacitor/haptics';
//   import { Keyboard } from '@capacitor/keyboard';
//   import { LocalNotifications } from '@capacitor/local-notifications';
//   import { Network } from '@capacitor/network';
//   import { Preferences } from '@capacitor/preferences';
//   import { Share } from '@capacitor/share';
//   import { StatusBar } from '@capacitor/status-bar';
//   installPlatform(createCapacitorPlatform({ App, Haptics, Keyboard, LocalNotifications, Network, Preferences, Share, StatusBar }));

// Capacitor 5+ returns a Promise from addListener; earlier versions were sync.
type Handle = { remove(): Promise<void> | void };
type MaybePromise<T> = T | Promise<T>;

export interface CapacitorDeps {
  /** `@capacitor/app` — hardware back, deep links, exit/minimise. */
  App?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addListener(
      eventName: 'backButton' | 'appUrlOpen',
      listener: (event: any) => void
    ): MaybePromise<Handle>;
    exitApp(): Promise<void>;
    minimizeApp?(): Promise<void>;
  };
  // Optionality has to match the real plugin, not just the value type. A string
  // enum member is assignable to its literal ('LIGHT' satisfies `ImpactStyle`),
  // but `@capacitor/haptics` declares `style?:`, and `ImpactStyle | undefined`
  // does not satisfy a required field — so a required option here rejects the
  // actual plugin. `StatusBar.setStyle` keeps its required `style` because the
  // plugin declares it required.
  Haptics?: {
    impact(options?: { style?: 'LIGHT' | 'MEDIUM' | 'HEAVY' }): Promise<void>;
    selectionChanged?(): Promise<void>;
    notification?(options?: { type?: 'SUCCESS' | 'WARNING' | 'ERROR' }): Promise<void>;
  };
  /** `@capacitor/preferences` — key-value storage. Unencrypted: also the
   *  `secureStore` fallback unless `secureStorage` is given. */
  Preferences?: {
    get(options: { key: string }): Promise<{ value: string | null }>;
    set(options: { key: string; value: string }): Promise<void>;
    remove(options: { key: string }): Promise<void>;
  };
  /** A Keychain/Keystore-backed store. Wins over `Preferences` for `secureStore`. */
  secureStorage?: {
    name: string;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
  };
  Keyboard?: {
    hide(): Promise<void>;
    addListener(
      eventName: 'keyboardWillShow' | 'keyboardWillHide',
      listener: (info?: { keyboardHeight?: number }) => void
    ): MaybePromise<Handle>;
  };
  StatusBar?: {
    setStyle(options: { style: 'LIGHT' | 'DARK' | 'DEFAULT' }): Promise<void>;
    setBackgroundColor?(options: { color: string }): Promise<void>;
  };
  Share?: {
    share(options: { title?: string; text?: string; url?: string }): Promise<unknown>;
  };
  /** `@capacitor/network`. */
  Network?: {
    getStatus(): Promise<{ connected: boolean }>;
    addListener(
      eventName: 'networkStatusChange',
      listener: (status: { connected: boolean }) => void
    ): MaybePromise<Handle>;
  };
  /** `@capacitor/local-notifications`. */
  LocalNotifications?: {
    requestPermissions(): Promise<{ display: string }>;
    schedule(options: {
      notifications: Array<{
        id: number;
        title: string;
        body: string;
        schedule?: {
          at?: Date;
          on?: { hour: number; minute: number };
          repeats?: boolean;
          allowWhileIdle?: boolean;
        };
      }>;
    }): Promise<unknown>;
    cancel(options: { notifications: Array<{ id: number }> }): Promise<void>;
    getPending(): Promise<{ notifications: Array<{ id: number }> }>;
  };
}

export function createCapacitorPlatform(deps: CapacitorDeps): Platform {
  const web = createWebPlatform();
  const {
    App,
    Haptics,
    Preferences,
    secureStorage,
    Keyboard,
    StatusBar,
    Share,
    Network,
    LocalNotifications,
  } = deps;

  const preferences = Preferences
    ? {
        get: async (key: string) => (await Preferences.get({ key })).value,
        set: (key: string, value: string) => Preferences.set({ key, value }),
        remove: (key: string) => Preferences.remove({ key }),
      }
    : null;

  let online = true;
  if (Network) void Network.getStatus().then((s) => (online = s.connected));

  return {
    name: 'capacitor',

    haptics: Haptics
      ? {
          impact: async (style = 'light') => {
            await Haptics.impact({ style: style.toUpperCase() as 'LIGHT' | 'MEDIUM' | 'HEAVY' });
            return true;
          },
          selection: async () => {
            if (!Haptics.selectionChanged) return false;
            await Haptics.selectionChanged();
            return true;
          },
          notification: async (type) => {
            if (!Haptics.notification) return false;
            await Haptics.notification({
              type: type.toUpperCase() as 'SUCCESS' | 'WARNING' | 'ERROR',
            });
            return true;
          },
        }
      : web.haptics,

    storage: preferences ?? web.storage,

    secureStore: secureStorage
      ? {
          secure: true,
          backend: secureStorage.name,
          get: (key) => secureStorage.get(key),
          set: (key, value) => secureStorage.set(key, value),
          remove: (key) => secureStorage.remove(key),
        }
      : preferences
        ? { ...preferences, secure: false, backend: 'Capacitor Preferences (unencrypted)' }
        : web.secureStore,

    hardwareBack: {
      // Android convention at the root is to leave; minimise keeps state.
      fallback: (canGoBack) => {
        if (canGoBack) {
          window.history.back();
          return;
        }
        if (App?.minimizeApp) void App.minimizeApp();
        else void App?.exitApp();
      },
      connect: App
        ? (dispatch) =>
            subscribe(
              App.addListener('backButton', (event: { canGoBack: boolean }) =>
                dispatch(event.canGoBack)
              )
            )
        : undefined,
    },

    keyboard: Keyboard
      ? {
          hide: () => Keyboard.hide(),
          onChange: (callback) => {
            const offShow = subscribe(
              Keyboard.addListener('keyboardWillShow', (info) =>
                callback({ visible: true, height: info?.keyboardHeight ?? 0 })
              )
            );
            const offHide = subscribe(
              Keyboard.addListener('keyboardWillHide', () =>
                callback({ visible: false, height: 0 })
              )
            );
            return () => {
              offShow();
              offHide();
            };
          },
        }
      : web.keyboard,

    statusBar: StatusBar
      ? {
          // Capacitor's `Style` names the background, same as ours — no inversion.
          setStyle: (style) => StatusBar.setStyle({ style: style === 'dark' ? 'DARK' : 'LIGHT' }),
          setBackgroundColor: async (color) => {
            // Android only; iOS draws the bar over the WebView. The plugin takes
            // hex and nothing else, while a caller reading a Tailwind v4 token
            // hands over `oklch(...)` — so convert here, where the constraint
            // lives, rather than making every caller know about it.
            const hex = toHex(color);
            if (hex && StatusBar.setBackgroundColor) {
              await StatusBar.setBackgroundColor({ color: hex });
            }
            await web.statusBar.setBackgroundColor(color);
          },
        }
      : web.statusBar,

    share: Share
      ? {
          available: true,
          share: async (input) => {
            try {
              await Share.share(input);
              return true;
            } catch {
              // Rejects when the sheet is dismissed.
              return false;
            }
          },
        }
      : web.share,

    deepLinks: App
      ? {
          onOpen: (callback) =>
            subscribe(
              App.addListener('appUrlOpen', (event: { url: string }) => callback(event.url))
            ),
        }
      : web.deepLinks,

    network: Network
      ? {
          get online() {
            return online;
          },
          onChange: (callback) =>
            subscribe(
              Network.addListener('networkStatusChange', (status) => {
                online = status.connected;
                callback(status.connected);
              })
            ),
        }
      : web.network,

    notifications: LocalNotifications
      ? {
          requestPermission: async () =>
            (await LocalNotifications.requestPermissions()).display === 'granted',
          schedule: async (items) => {
            await LocalNotifications.schedule({
              notifications: items.map(toCapacitorNotification),
            });
            return true;
          },
          cancel: (ids) => LocalNotifications.cancel({ notifications: ids.map((id) => ({ id })) }),
          pending: async () =>
            (await LocalNotifications.getPending()).notifications.map((n) => n.id),
        }
      : web.notifications,
  };
}

function toCapacitorNotification(n: LocalNotification) {
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    schedule: n.daily
      ? { on: n.daily, repeats: true, allowWhileIdle: true }
      : n.at
        ? { at: n.at }
        : undefined,
  };
}

/** Any CSS colour to `#rrggbb`, or null if it cannot be read. */
function toHex(color: string): string | null {
  const parsed = parse(color);
  return parsed ? formatHex(parsed) : null;
}

function subscribe(handle: MaybePromise<Handle>): () => void {
  return () => {
    void Promise.resolve(handle).then((h) => h.remove());
  };
}
