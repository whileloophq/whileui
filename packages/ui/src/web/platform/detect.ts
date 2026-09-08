import type { Host } from './types';

// Which shell we are inside. Informational: the installed platform is whatever
// `installPlatform()` received. The showcase compares the two.
export function detectHost(): Host {
  if (typeof window === 'undefined') return 'web';
  const w = window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  };
  if (w.Capacitor?.isNativePlatform?.()) return 'capacitor';
  if (w.__TAURI__ !== undefined || w.__TAURI_INTERNALS__ !== undefined) return 'tauri';
  return 'web';
}
