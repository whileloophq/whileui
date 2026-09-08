import type {
  BackHandler,
  DeepLinks,
  Haptics,
  Keyboard,
  Network,
  Notifications,
  Platform,
  SecureStore,
  Share,
  StatusBar,
  Storage,
} from './types';
import { createWebPlatform } from './web';

export * from './types';
export { detectHost } from './detect';
export { createWebPlatform } from './web';
export { createCapacitorPlatform, type CapacitorDeps } from './capacitor';

// The installed platform, behind proxy handles so imports work before
// `installPlatform()` runs and never hold a stale implementation.

let current: Platform = createWebPlatform();
let disconnectBack: (() => void) | undefined;

export function installPlatform(platform: Platform): void {
  disconnectBack?.();
  current = platform;
  disconnectBack = platform.hardwareBack.connect?.(dispatchBack);
}

export function currentPlatform(): Platform {
  return current;
}

// ─── Hardware back ───────────────────────────────────────────

// Newest-first; the first handler to return `true` consumes the press. A sheet
// registers on open and releases on close, so back unwinds the UI in order.
const backHandlers: BackHandler[] = [];

function dispatchBack(canGoBack: boolean): void {
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    if (backHandlers[i]() === true) return;
  }
  current.hardwareBack.fallback(canGoBack);
}

export const hardwareBack = {
  /** Register an interceptor. Returns its unsubscribe. */
  onBack(handler: BackHandler): () => void {
    backHandlers.push(handler);
    return () => {
      const index = backHandlers.lastIndexOf(handler);
      if (index >= 0) backHandlers.splice(index, 1);
    };
  },
  /** Run the back sequence as if the key were pressed. */
  trigger(): void {
    dispatchBack(window.history.length > 1);
  },
  get depth(): number {
    return backHandlers.length;
  },
};

// ─── Proxies ─────────────────────────────────────────────────

export const haptics: Haptics = {
  impact: (style) => current.haptics.impact(style),
  selection: () => current.haptics.selection(),
  notification: (type) => current.haptics.notification(type),
};

export const storage: Storage = {
  get: (key) => current.storage.get(key),
  set: (key, value) => current.storage.set(key, value),
  remove: (key) => current.storage.remove(key),
};

export const secureStore: SecureStore = {
  get secure() {
    return current.secureStore.secure;
  },
  get backend() {
    return current.secureStore.backend;
  },
  get: (key) => current.secureStore.get(key),
  set: (key, value) => current.secureStore.set(key, value),
  remove: (key) => current.secureStore.remove(key),
};

export const keyboard: Keyboard = {
  hide: () => current.keyboard.hide(),
  onChange: (callback) => current.keyboard.onChange(callback),
};

export const statusBar: StatusBar = {
  setStyle: (style) => current.statusBar.setStyle(style),
  setBackgroundColor: (color) => current.statusBar.setBackgroundColor(color),
};

export const share: Share = {
  get available() {
    return current.share.available;
  },
  share: (input) => current.share.share(input),
};

export const deepLinks: DeepLinks = {
  onOpen: (callback) => current.deepLinks.onOpen(callback),
};

export const network: Network = {
  get online() {
    return current.network.online;
  },
  onChange: (callback) => current.network.onChange(callback),
};

export const notifications: Notifications = {
  requestPermission: () => current.notifications.requestPermission(),
  schedule: (items) => current.notifications.schedule(items),
  cancel: (ids) => current.notifications.cancel(ids),
  pending: () => current.notifications.pending(),
};
