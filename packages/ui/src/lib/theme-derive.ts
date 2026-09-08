import { converter, formatRgb, parse } from 'culori';
import type { ThemeColors } from './theme-contract';

// Fills the derived tokens (soft, active, state, surface, overlay) from the base
// palette an app defines, using the ratios of the default presets. Renderer-free.
// A brand should never show whileui's default purple because it left out
// `--color-primary-soft`.

export const THEME_BASE_TOKEN_KEYS = [
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'muted',
  'mutedForeground',
  'border',
  'input',
  'ring',
  'destructive',
  'destructiveForeground',
  'success',
  'successForeground',
  'warning',
  'warningForeground',
  'info',
  'infoForeground',
] as const satisfies readonly (keyof ThemeColors)[];

export type ThemeBaseColors = Pick<ThemeColors, (typeof THEME_BASE_TOKEN_KEYS)[number]>;

const toOklch = converter('oklch');

function alpha(color: string, value: number): string {
  const parsed = parse(color);
  return parsed ? (formatRgb({ ...parsed, alpha: value }) ?? color) : color;
}

function shiftLightness(color: string, delta: number): string {
  const parsed = parse(color);
  if (!parsed) return color;
  const c = toOklch(parsed);
  return formatRgb({ ...c, l: Math.min(1, Math.max(0, c.l + delta)) }) ?? color;
}

export function deriveThemeColors(
  base: ThemeBaseColors,
  scheme: 'light' | 'dark' = 'light'
): ThemeColors {
  const dark = scheme === 'dark';
  const active = (color: string) => shiftLightness(color, dark ? 0.06 : -0.06);
  const ink = dark ? '#000000' : base.foreground;
  const sheen = dark ? '#ffffff' : base.card;

  return {
    ...base,
    primarySoft: alpha(base.primary, 0.13),
    primarySoftSubtle: alpha(base.primary, 0.07),
    secondarySoft: alpha(base.secondary, 0.16),
    secondaryActive: alpha(base.secondary, 0.18),
    mutedSoft: alpha(base.muted, 0.05),
    destructiveSoft: alpha(base.destructive, 0.12),
    destructiveSoftBorder: alpha(base.destructive, 0.3),
    successSoft: alpha(base.success, 0.12),
    successSoftBorder: alpha(base.success, 0.3),
    warningSoft: alpha(base.warning, 0.14),
    warningSoftBorder: alpha(base.warning, 0.34),
    infoSoft: alpha(base.info, 0.12),
    infoSoftBorder: alpha(base.info, 0.3),
    stateHover: alpha(base.primary, 0.06),
    statePressed: alpha(base.primary, 0.12),
    stateDisabled: alpha(base.mutedForeground, 0.28),
    overlay: alpha(ink, dark ? 0.5 : 0.14),
    overlayStrong: alpha(ink, dark ? 0.68 : 0.22),
    surfaceElevated: alpha(base.card, dark ? 0.8 : 0.88),
    surfaceTranslucent: alpha(base.card, dark ? 0.58 : 0.62),
    surfaceTranslucentBorder: alpha(sheen, dark ? 0.12 : 0.42),
    surfaceBorder: base.border,
    surfaceHighlight: alpha(sheen, dark ? 0.07 : 0.74),
    shadow: ink,
    primaryActive: active(base.primary),
    destructiveActive: active(base.destructive),
    placeholder: base.mutedForeground,
  };
}
