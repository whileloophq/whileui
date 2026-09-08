// Capability contract. The web implementation is the default; a host adapter is
// installed at boot. Every method resolves on every host — an unsupported
// capability is a no-op that reports `false`, never a throw.

export type Host = 'web' | 'capacitor' | 'tauri';

// ─── Haptics ─────────────────────────────────────────────────

export type ImpactStyle = 'light' | 'medium' | 'heavy';
export type NotificationType = 'success' | 'warning' | 'error';

export interface Haptics {
  /** `true` if the host actually produced feedback. */
  impact(style?: ImpactStyle): Promise<boolean>;
  selection(): Promise<boolean>;
  notification(type: NotificationType): Promise<boolean>;
}

// ─── Storage ─────────────────────────────────────────────────

export interface SecureStore {
  /** `false` for localStorage and Capacitor Preferences; `true` only for a Keychain/Keystore backend. */
  readonly secure: boolean;
  readonly backend: string;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

// ─── Hardware back ───────────────────────────────────────────

/** Return `true` to consume the press. */
export type BackHandler = () => boolean | void;

export interface HardwareBackHost {
  /** Runs when no handler consumed the press. */
  fallback(canGoBack: boolean): void;
  /** Wire the host's back event to the dispatcher. Returns a disconnect. */
  connect?(dispatch: (canGoBack: boolean) => void): () => void;
}

// ─── Keyboard ────────────────────────────────────────────────

export interface KeyboardState {
  visible: boolean;
  /** Pixels; 0 when hidden or unknown. */
  height: number;
}

export interface Keyboard {
  hide(): Promise<void>;
  onChange(callback: (state: KeyboardState) => void): () => void;
}

// ─── Status bar ──────────────────────────────────────────────

/** The app's theme, not the bar's text: `'dark'` UI wants light bar text. */
export type StatusBarStyle = 'light' | 'dark';

export interface StatusBar {
  setStyle(style: StatusBarStyle): Promise<void>;
  setBackgroundColor(color: string): Promise<void>;
}

// ─── Share ───────────────────────────────────────────────────

export interface ShareInput {
  title?: string;
  text?: string;
  url?: string;
}

export interface Share {
  readonly available: boolean;
  /** `true` if the sheet was shown and not dismissed. */
  share(input: ShareInput): Promise<boolean>;
}

// ─── Deep links ──────────────────────────────────────────────

export interface DeepLinks {
  /** Never fires on the web — the URL is already in `location`. */
  onOpen(callback: (url: string) => void): () => void;
}

// ─── Platform ────────────────────────────────────────────────

export interface Platform {
  readonly name: Host;
  readonly haptics: Haptics;
  readonly secureStore: SecureStore;
  readonly hardwareBack: HardwareBackHost;
  readonly keyboard: Keyboard;
  readonly statusBar: StatusBar;
  readonly share: Share;
  readonly deepLinks: DeepLinks;
}
