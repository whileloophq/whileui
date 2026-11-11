// A full theme from a few seed colours, plus a contrast check for any palette.
// Renderer-free: safe in build scripts and for agents generating themes.
//
// Seeds are never altered: a brand colour is a brand decision, so when it fails
// contrast the check reports it instead. Only derived colours (muted text, the text on
// each filled colour, status colours) are tuned to meet WCAG.

import { blend, converter, formatHex, parse, wcagContrast } from 'culori';
import type { ThemeColors } from './theme-contract';
import { type ThemeBaseColors } from './theme-derive';
import { createThemePreset, type ThemePreset } from './theme-presets';
import type { VisualTokens } from './visual-token-contract';

export interface ThemeSeeds {
  /** Page background. */
  background: string;
  /** Body text. */
  foreground: string;
  /** Brand colour: primary buttons, links, focus ring. */
  primary: string;
  /** Second voice for highlights and selected states. Derived from `primary` if left out. */
  accent?: string;
}

const toOklch = converter('oklch');

/** WCAG 2.x contrast ratio between two CSS colours, 1–21. */
function contrastRatio(a: string, b: string): number {
  return wcagContrast(a, b);
}

function oklch(color: string) {
  const parsed = parse(color);
  if (!parsed) throw new Error(`Not a CSS colour: "${color}"`);
  return toOklch(parsed);
}

const hex = (l: number, c: number, h: number) =>
  formatHex({ mode: 'oklch', l: Math.min(1, Math.max(0, l)), c, h });

/** Mix `a` toward `b` by `t` in OKLCH lightness and chroma, keeping `a`'s hue. */
function toward(a: string, b: string, t: number): string {
  const x = oklch(a);
  const y = oklch(b);
  return hex(x.l + (y.l - x.l) * t, (x.c ?? 0) + ((y.c ?? 0) - (x.c ?? 0)) * t, x.h ?? y.h ?? 0);
}

/** Move `color` away from `against` in lightness until it reaches `min` contrast. */
function ensureContrast(color: string, against: string, min: number): string {
  const c = oklch(color);
  const darker = oklch(against).l > 0.5;
  for (let l = c.l; l >= 0 && l <= 1; l += darker ? -0.01 : 0.01) {
    const candidate = hex(l, c.c ?? 0, c.h ?? 0);
    if (contrastRatio(candidate, against) >= min) return candidate;
  }
  return darker ? '#000000' : '#ffffff';
}

/** Black or white tinted toward the theme, whichever reads better on `fill`. */
function onFill(fill: string, seeds: Pick<ThemeSeeds, 'background' | 'foreground'>): string {
  const light =
    oklch(seeds.background).l > oklch(seeds.foreground).l ? seeds.background : seeds.foreground;
  const dark = light === seeds.background ? seeds.foreground : seeds.background;
  return contrastRatio(light, fill) >= contrastRatio(dark, fill) ? light : dark;
}

// Status hues stay recognisable across brands; only their lightness adapts to the page.
const STATUS_HUES = { destructive: 27, success: 150, warning: 75, info: 240 } as const;

/** The 25 base colours a theme needs, derived from its seeds. */
function themeBaseFromSeeds(seeds: ThemeSeeds): ThemeBaseColors {
  const { background, foreground, primary } = seeds;
  const dark = oklch(background).l < 0.5;
  const accent = seeds.accent ?? toward(primary, background, 0.82);
  const surface = toward(background, foreground, dark ? 0.06 : 0.025);
  const muted = toward(background, foreground, dark ? 0.1 : 0.06);
  const status = (hue: number) =>
    ensureContrast(hex(dark ? 0.72 : 0.55, 0.15, hue), background, 4.5);

  const destructive = status(STATUS_HUES.destructive);
  const success = status(STATUS_HUES.success);
  const warning = status(STATUS_HUES.warning);
  const info = status(STATUS_HUES.info);
  const fills = { background, foreground };

  return {
    background,
    foreground,
    card: surface,
    cardForeground: foreground,
    popover: surface,
    popoverForeground: foreground,
    primary,
    primaryForeground: onFill(primary, fills),
    secondary: muted,
    secondaryForeground: foreground,
    accent,
    accentForeground: onFill(accent, fills),
    muted,
    mutedForeground: ensureContrast(toward(foreground, background, 0.42), muted, 4.5),
    border: toward(background, foreground, dark ? 0.16 : 0.13),
    input: muted,
    ring: primary,
    destructive,
    destructiveForeground: onFill(destructive, fills),
    success,
    successForeground: onFill(success, fills),
    warning,
    warningForeground: onFill(warning, fills),
    info,
    infoForeground: onFill(info, fills),
  };
}

/**
 * A complete preset from seeds. `light` is required; `dark` defaults to a dark page with
 * the same brand colours. `overrides` replaces any base colour before the rest is
 * derived, so nothing is out of reach; derived tokens can be adjusted on the result.
 */
export function themeFromSeeds(input: {
  name: string;
  description: string;
  light: ThemeSeeds;
  dark?: ThemeSeeds;
  overrides?: { light?: Partial<ThemeBaseColors>; dark?: Partial<ThemeBaseColors> };
  visual?: Partial<VisualTokens>;
}): ThemePreset {
  const { light } = input;
  const page = oklch(light.background);
  const darkPage = hex(0.17, Math.min(page.c ?? 0, 0.02), page.h ?? 0);
  // Generated, not supplied, so brand colours may be lifted until they read on a dark page.
  const dark = input.dark ?? {
    background: darkPage,
    foreground: hex(0.94, Math.min(page.c ?? 0, 0.015), page.h ?? 0),
    primary: ensureContrast(light.primary, darkPage, 4.5),
    accent: light.accent && ensureContrast(light.accent, darkPage, 3),
  };
  return createThemePreset({
    name: input.name,
    description: input.description,
    light: { ...themeBaseFromSeeds(light), ...input.overrides?.light },
    dark: { ...themeBaseFromSeeds(dark), ...input.overrides?.dark },
    visual: input.visual,
  });
}

export interface ContrastCheck {
  /** "foreground on background" */
  pair: string;
  ratio: number;
  /** 4.5 for text, 3 for focus rings and other non-text UI (WCAG 1.4.3, 1.4.11). */
  min: number;
  pass: boolean;
}

const TEXT_PAIRS: [keyof ThemeColors, keyof ThemeColors][] = [
  ['foreground', 'background'],
  ['cardForeground', 'card'],
  ['popoverForeground', 'popover'],
  ['mutedForeground', 'background'],
  ['mutedForeground', 'muted'],
  ['primaryForeground', 'primary'],
  ['secondaryForeground', 'secondary'],
  ['accentForeground', 'accent'],
  ['destructiveForeground', 'destructive'],
  ['successForeground', 'success'],
  ['warningForeground', 'warning'],
  ['infoForeground', 'info'],
  ['primary', 'background'],
  ['destructive', 'background'],
];

const UI_PAIRS: [keyof ThemeColors, keyof ThemeColors][] = [['ring', 'background']];

/** A translucent colour as it actually renders: blended onto the page. */
function onPage(color: string, page: string): string {
  const parsed = parse(color);
  if (!parsed || (parsed.alpha ?? 1) >= 1) return color;
  return formatHex(blend([page, parsed], 'normal'));
}

/** Every text and focus-ring pairing the components render, checked against WCAG AA. */
export function checkThemeContrast(colors: ThemeColors): ContrastCheck[] {
  const check = ([fg, bg]: [keyof ThemeColors, keyof ThemeColors], min: number) => {
    const background = onPage(colors[bg], colors.background);
    const ratio = Math.round(contrastRatio(onPage(colors[fg], background), background) * 100) / 100;
    return { pair: `${fg} on ${bg}`, ratio, min, pass: ratio >= min };
  };
  return [...TEXT_PAIRS.map((p) => check(p, 4.5)), ...UI_PAIRS.map((p) => check(p, 3))];
}
