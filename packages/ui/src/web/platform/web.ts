import type { Platform } from './types';

// Browser implementation and the default.
export function createWebPlatform(): Platform {
  const local = {
    get: async (key: string) => localStorage.getItem(key),
    set: async (key: string, value: string) => localStorage.setItem(key, value),
    remove: async (key: string) => localStorage.removeItem(key),
  };

  return {
    name: 'web',

    haptics: {
      // Android Chrome only; iOS Safari has no vibration API.
      impact: async (style = 'light') =>
        vibrate(style === 'heavy' ? 30 : style === 'medium' ? 20 : 10),
      selection: async () => vibrate(5),
      notification: async (type) => vibrate(type === 'error' ? [30, 40, 30] : [15, 30, 15]),
    },

    storage: local,

    secureStore: { ...local, secure: false, backend: 'localStorage' },

    hardwareBack: {
      fallback: (canGoBack) => {
        if (canGoBack) window.history.back();
      },
    },

    keyboard: {
      hide: async () => (document.activeElement as HTMLElement | null)?.blur?.(),
      // No keyboard event on the web; a >150px visual-viewport drop is the usual heuristic.
      onChange: (callback) => {
        const viewport = window.visualViewport;
        if (!viewport) return () => undefined;
        const onResize = () => {
          const height = Math.max(0, window.innerHeight - viewport.height);
          callback({ visible: height > 150, height: height > 150 ? height : 0 });
        };
        viewport.addEventListener('resize', onResize);
        return () => viewport.removeEventListener('resize', onResize);
      },
    },

    statusBar: {
      setStyle: async () => undefined,
      // Tints the toolbar in mobile browsers.
      setBackgroundColor: async (color) => {
        let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'theme-color';
          document.head.append(meta);
        }
        meta.content = color;
      },
    },

    share: {
      get available() {
        return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
      },
      share: async (input) => {
        if (typeof navigator.share !== 'function') return false;
        try {
          await navigator.share(input);
          return true;
        } catch (error) {
          // Dismissing the sheet is an AbortError, not a failure.
          if (error instanceof Error && error.name === 'AbortError') return false;
          throw error;
        }
      },
    },

    deepLinks: {
      onOpen: () => () => undefined,
    },

    network: {
      get online() {
        return typeof navigator === 'undefined' ? true : navigator.onLine;
      },
      onChange: (callback) => {
        const on = () => callback(true);
        const off = () => callback(false);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        return () => {
          window.removeEventListener('online', on);
          window.removeEventListener('offline', off);
        };
      },
    },

    // A page cannot schedule a notification for later without a service worker.
    notifications: {
      requestPermission: async () => false,
      schedule: async () => false,
      cancel: async () => undefined,
      pending: async () => [],
    },
  };
}

function vibrate(pattern: number | number[]): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  return navigator.vibrate(pattern);
}
