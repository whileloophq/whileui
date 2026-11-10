import { useCSSVariable } from 'uniwind';
import { useUniwind } from 'uniwind';
import { formatHex, formatRgb, parse } from 'culori';
import {
  WHILEUI_DARK_THEME_COLORS,
  WHILEUI_LIGHT_THEME_COLORS,
  THEME_TOKEN_SPECS,
  THEME_TOKEN_VARIABLES,
  type ThemeColors,
} from './theme-contract';
import { deriveThemeColors, THEME_BASE_TOKEN_KEYS, type ThemeBaseColors } from './theme-derive';
export type { ThemeColors } from './theme-contract';

import { Platform } from 'react-native';

function parseThemeColor(value: string | number | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;

  const s = String(value).trim();
  if (!s) return undefined;

  if (s.startsWith('#') || s.startsWith('rgb') || s.startsWith('hsl')) {
    return s;
  }

  try {
    const parsed = parse(s);
    if (parsed) {
      const alpha = typeof parsed.alpha === 'number' ? parsed.alpha : 1;
      if (alpha < 1) {
        const rgba = formatRgb(parsed);
        if (rgba) return rgba;
      }
      const hex = formatHex(parsed);
      if (hex) return hex;
      const rgb = formatRgb(parsed);
      if (rgb) return rgb;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function resolveThemeToken(
  cssValue: string | number | undefined,
  appValue: string | number | undefined
): string | undefined {
  if (Platform.OS === 'android') {
    return parseThemeColor(appValue) ?? parseThemeColor(cssValue);
  }
  return parseThemeColor(cssValue) ?? parseThemeColor(appValue);
}

// Every themed component calls this hook on every render, and parsing 104 colour
// strings plus deriving the palette cost about 0.16 ms per call in Node, several times
// that under Hermes. The inputs only change with the theme, so the result is derived
// once per distinct snapshot and shared: the same object comes back until the CSS
// variables change, which also keeps it stable for downstream memoisation.
const resolvedThemeColors = new Map<string, ThemeColors>();
const RESOLVED_THEME_LIMIT = 8;

export function useThemeColors(): ThemeColors {
  const { theme } = useUniwind();
  const values = useCSSVariable(THEME_TOKEN_VARIABLES);
  const scheme = theme === 'dark' ? 'dark' : 'light';
  const key = `${scheme}\u0001${values.join('\u0001')}`;
  const cached = resolvedThemeColors.get(key);
  if (cached) return cached;

  const resolved = resolveThemeColors(values, scheme);
  if (resolvedThemeColors.size >= RESOLVED_THEME_LIMIT) {
    resolvedThemeColors.delete(resolvedThemeColors.keys().next().value as string);
  }
  resolvedThemeColors.set(key, resolved);
  return resolved;
}

function resolveThemeColors(
  values: ReadonlyArray<string | number | undefined>,
  scheme: 'light' | 'dark'
): ThemeColors {
  const fallbackPalette =
    scheme === 'dark' ? WHILEUI_DARK_THEME_COLORS : WHILEUI_LIGHT_THEME_COLORS;

  const defined: Partial<Record<keyof ThemeColors, string>> = {};
  let index = 0;
  for (const token of THEME_TOKEN_SPECS) {
    const value = resolveThemeToken(values[index++], values[index++]);
    if (value) defined[token.key] = value;
  }

  // Tokens the app left out are derived from its own base palette, not taken
  // from the default one — a missing soft tint must not turn the brand purple.
  const base = {} as Record<string, string>;
  for (const key of THEME_BASE_TOKEN_KEYS) base[key] = defined[key] ?? fallbackPalette[key];
  const derived = deriveThemeColors(base as ThemeBaseColors, scheme);

  return { ...derived, ...defined, placeholder: derived.placeholder } as ThemeColors;
}

export interface IconColors {
  foreground: string;
  muted: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  warning: string;
  success: string;
  info: string;
  destructive: string;
}

const iconColorsByTheme = new WeakMap<ThemeColors, IconColors>();

/** Icon colors derived from theme. For @expo/vector-icons which need hex values. */
export function useIconColors(): IconColors {
  const c = useThemeColors();
  const cached = iconColorsByTheme.get(c);
  if (cached) return cached;
  const icons: IconColors = {
    foreground: c.foreground,
    muted: c.mutedForeground,
    primary: c.primary,
    primaryForeground: c.primaryForeground,
    accent: c.accent,
    warning: c.warning,
    success: c.success,
    info: c.info,
    destructive: c.destructive,
  };
  iconColorsByTheme.set(c, icons);
  return icons;
}

/** Alias for useThemeColors. Returns RN-safe color strings (hex/rgb/rgba) for RefreshControl, LinearGradient, charts. */
export const useThemeTokens = useThemeColors;
