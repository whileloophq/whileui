import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { statusBar, storage } from '../platform';

// Owns the `.dark` class on <html>, persists the mode through platform.storage,
// follows the OS in `system`, and keeps the status bar and theme-color in step.
// index.html should read the same key before first paint to avoid a flash.

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)');
const resolve = (mode: ThemeMode): ResolvedTheme =>
  mode === 'system' ? (systemQuery().matches ? 'dark' : 'light') : mode;
const isMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  storageKey = 'whileui.theme',
  defaultMode = 'system',
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    void storage.get(storageKey).then((stored) => {
      if (isMode(stored)) setModeState(stored);
    });
  }, [storageKey]);

  useEffect(() => {
    const apply = () => {
      const next = resolve(mode);
      document.documentElement.classList.toggle('dark', next === 'dark');
      setResolved(next);
      const ignore = () => {};
      statusBar.setStyle(next).catch(ignore);
      const background = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background')
        .trim();
      if (background) statusBar.setBackgroundColor(background).catch(ignore);
    };
    apply();
    if (mode !== 'system') return;
    const query = systemQuery();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [mode]);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      void storage.set(storageKey, next);
    },
    [storageKey]
  );

  const toggle = useCallback(
    () => setMode(resolve(mode) === 'dark' ? 'light' : 'dark'),
    [mode, setMode]
  );

  const value = useMemo(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requires a <ThemeProvider>');
  return context;
}
