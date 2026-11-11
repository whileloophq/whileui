import { createElement, useCallback, useEffect, useMemo, useReducer } from 'react';
import { Uniwind, useUniwind } from 'uniwind';

export type ThemeMode = 'light' | 'dark' | 'system';

type MaybePromise<T> = T | Promise<T>;

export interface ThemeBridgeAdapter {
  loadThemeMode: () => MaybePromise<ThemeMode | null | undefined>;
  saveThemeMode: (mode: ThemeMode) => MaybePromise<void>;
}

export interface ThemeBridgeProps {
  mode?: ThemeMode;
  initialMode?: ThemeMode;
  adapter?: ThemeBridgeAdapter;
}

export interface UseThemeBridgeOptions {
  initialMode?: ThemeMode;
  adapter?: ThemeBridgeAdapter;
}

export interface UseThemeBridgeResult {
  /** The chosen mode, `system` included. */
  mode: ThemeMode;
  /** The theme on screen: `light`, `dark`, or a registered custom theme. */
  resolvedTheme: string;
  setMode: (mode: ThemeMode) => void;
  /**
   * Steps light → dark → system. For a control that shows all three modes; a two-state
   * sun/moon button wants `toggleTheme`, because a step into `system` that resolves to
   * the theme already on screen looks like a tap that did nothing.
   */
  cycleMode: () => void;
  /** Switches to the opposite of the theme on screen: dark from light, light from anything else. */
  toggleTheme: () => void;
}

const modeCycle: ThemeMode[] = ['light', 'dark', 'system'];

type ThemeBridgeState = {
  status: 'hydrating' | 'ready';
  mode: ThemeMode;
  adapter: ThemeBridgeAdapter | undefined;
  initialMode: ThemeMode;
};

type ThemeBridgeAction =
  | { type: 'hydrate'; adapter: ThemeBridgeAdapter | undefined; initialMode: ThemeMode }
  | {
      type: 'hydrated';
      adapter: ThemeBridgeAdapter;
      initialMode: ThemeMode;
      mode: ThemeMode;
    }
  | { type: 'select'; mode: ThemeMode }
  | { type: 'cycle' };

function themeBridgeReducer(state: ThemeBridgeState, action: ThemeBridgeAction): ThemeBridgeState {
  if (action.type === 'cycle') {
    return {
      ...state,
      status: 'ready',
      mode: modeCycle[(modeCycle.indexOf(state.mode) + 1) % modeCycle.length],
    };
  }

  if (action.type === 'select') {
    return { ...state, status: 'ready', mode: action.mode };
  }

  if (action.type === 'hydrate') {
    if (
      state.adapter === action.adapter &&
      state.initialMode === action.initialMode &&
      state.status === (action.adapter ? 'hydrating' : 'ready')
    ) {
      return state;
    }
    return {
      status: action.adapter ? 'hydrating' : 'ready',
      mode: state.mode,
      adapter: action.adapter,
      initialMode: action.initialMode,
    };
  }

  if (
    state.status !== 'hydrating' ||
    state.adapter !== action.adapter ||
    state.initialMode !== action.initialMode
  ) {
    return state;
  }
  return { ...state, status: 'ready', mode: action.mode };
}

export function applyThemeMode(mode: ThemeMode) {
  (Uniwind.setTheme as (theme: ThemeMode) => void)(mode);
}

export async function resolveThemeMode(
  adapter?: ThemeBridgeAdapter,
  fallback: ThemeMode = 'system'
): Promise<ThemeMode> {
  if (!adapter) {
    return fallback;
  }

  const persisted = await adapter.loadThemeMode();
  if (persisted === 'light' || persisted === 'dark' || persisted === 'system') {
    return persisted;
  }

  return fallback;
}

export async function syncThemeMode(mode: ThemeMode, adapter?: ThemeBridgeAdapter) {
  applyThemeMode(mode);
  if (adapter) {
    await adapter.saveThemeMode(mode);
  }
  return mode;
}

export function useThemeBridge({
  initialMode = 'system',
  adapter,
}: UseThemeBridgeOptions = {}): UseThemeBridgeResult {
  const { theme } = useUniwind();
  const [state, dispatch] = useReducer(themeBridgeReducer, {
    status: adapter ? 'hydrating' : 'ready',
    mode: initialMode,
    adapter,
    initialMode,
  });

  useEffect(() => {
    let mounted = true;
    dispatch({ type: 'hydrate', adapter, initialMode });

    if (!adapter) {
      return;
    }

    // `loadThemeMode` is the consumer's storage. If it rejects — a corrupt store, a
    // keychain prompt the user dismissed — the app must still render in the initial
    // mode rather than remaining in the hydrating phase forever.
    void (async () => {
      let next: ThemeMode;
      try {
        next = await resolveThemeMode(adapter, initialMode);
      } catch {
        next = initialMode;
      }
      if (!mounted) {
        return;
      }
      dispatch({ type: 'hydrated', adapter, initialMode, mode: next });
    })();

    return () => {
      mounted = false;
    };
  }, [adapter, initialMode]);

  useEffect(() => {
    if (
      state.status !== 'ready' ||
      state.adapter !== adapter ||
      state.initialMode !== initialMode
    ) {
      return;
    }

    applyThemeMode(state.mode);
    if (adapter) {
      void adapter.saveThemeMode(state.mode);
    }
  }, [adapter, initialMode, state]);

  const setMode = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'select', mode });
  }, []);

  const cycleMode = useCallback(() => dispatch({ type: 'cycle' }), []);

  const toggleTheme = useCallback(
    () => dispatch({ type: 'select', mode: theme === 'light' ? 'dark' : 'light' }),
    [theme]
  );

  return useMemo(
    () => ({
      mode: state.mode,
      resolvedTheme: theme,
      setMode,
      cycleMode,
      toggleTheme,
    }),
    [cycleMode, setMode, state.mode, theme, toggleTheme]
  );
}

function ControlledThemeBridge({
  mode,
  adapter,
}: {
  mode: ThemeMode;
  adapter?: ThemeBridgeAdapter;
}) {
  useEffect(() => {
    void syncThemeMode(mode, adapter);
  }, [adapter, mode]);

  return null;
}

function UncontrolledThemeBridge({
  initialMode,
  adapter,
}: Pick<ThemeBridgeProps, 'initialMode' | 'adapter'>) {
  useThemeBridge({ initialMode, adapter });
  return null;
}

export function ThemeBridge({ mode, initialMode = 'system', adapter }: ThemeBridgeProps) {
  return mode === undefined
    ? createElement(UncontrolledThemeBridge, { initialMode, adapter })
    : createElement(ControlledThemeBridge, { mode, adapter });
}
