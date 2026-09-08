import type { Platform } from './types';
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
//   import { Preferences } from '@capacitor/preferences';
//   import { Share } from '@capacitor/share';
//   import { StatusBar } from '@capacitor/status-bar';
//   installPlatform(createCapacitorPlatform({ App, Haptics, Keyboard, Preferences, Share, StatusBar }));

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
  Haptics?: {
    impact(options: { style: 'LIGHT' | 'MEDIUM' | 'HEAVY' }): Promise<void>;
    selectionChanged?(): Promise<void>;
    notification?(options: { type: 'SUCCESS' | 'WARNING' | 'ERROR' }): Promise<void>;
  };
  /** `@capacitor/preferences` — unencrypted. Prefer `secureStorage` for tokens. */
  Preferences?: {
    get(options: { key: string }): Promise<{ value: string | null }>;
    set(options: { key: string; value: string }): Promise<void>;
    remove(options: { key: string }): Promise<void>;
  };
  /** A Keychain/Keystore-backed store. Wins over `Preferences`. */
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
}

export function createCapacitorPlatform(deps: CapacitorDeps): Platform {
  const web = createWebPlatform();
  const { App, Haptics, Preferences, secureStorage, Keyboard, StatusBar, Share } = deps;

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

    secureStore: secureStorage
      ? {
          secure: true,
          backend: secureStorage.name,
          get: (key) => secureStorage.get(key),
          set: (key, value) => secureStorage.set(key, value),
          remove: (key) => secureStorage.remove(key),
        }
      : Preferences
        ? {
            secure: false,
            backend: 'Capacitor Preferences (unencrypted)',
            get: async (key) => (await Preferences.get({ key })).value,
            set: (key, value) => Preferences.set({ key, value }),
            remove: (key) => Preferences.remove({ key }),
          }
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
            // Android only; iOS draws the bar over the WebView.
            if (StatusBar.setBackgroundColor) await StatusBar.setBackgroundColor({ color });
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
  };
}

function subscribe(handle: MaybePromise<Handle>): () => void {
  return () => {
    void Promise.resolve(handle).then((h) => h.remove());
  };
}
