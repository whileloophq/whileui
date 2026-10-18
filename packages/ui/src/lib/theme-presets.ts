import {
  THEME_TOKEN_SPECS,
  WHILEUI_DARK_THEME_COLORS,
  WHILEUI_LIGHT_THEME_COLORS,
  type ThemeColors,
} from './theme-contract';
import { deriveThemeColors, type ThemeBaseColors } from './theme-derive';
import { VISUAL_TOKEN_SPECS, type VisualTokens } from './visual-token-contract';

/**
 * Canonical full-package theme presets.
 * A preset pairs a color palette (light + dark) with visual token overrides
 * (shape, density, depth, typography). Switching presets should make the
 * whole package feel like a different product — that is the acceptance test
 * for the token system.
 */

export interface ThemePreset {
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
  /** Visual token overrides; unset keys keep contract fallbacks. */
  visual: Partial<VisualTokens>;
}

/**
 * Build a preset from the 25 base colors, deriving the other 27.
 *
 * Prefer this to writing a `ThemePreset` literal. `visual` has always been
 * `Partial`, but `light` and `dark` are the full 52-key `ThemeColors`, so the
 * literal form asks an author for every active variant, soft variant, overlay,
 * surface, interaction state and shadow — values `deriveThemeColors` already
 * computes from the palette. Nothing in the literal's type points at that helper,
 * and the predictable result is a hand-written derivation that drifts from the
 * library's own. The Atelier preset below is 110 lines for this reason.
 *
 * Override a derived value by spreading the result:
 *
 * ```ts
 * const preset = createThemePreset({ name, description, light, dark });
 * preset.dark.overlay = 'rgba(0, 0, 0, 0.9)';
 * ```
 */
export function createThemePreset(input: {
  name: string;
  description: string;
  light: ThemeBaseColors;
  dark: ThemeBaseColors;
  visual?: Partial<VisualTokens>;
}): ThemePreset {
  return {
    name: input.name,
    description: input.description,
    light: deriveThemeColors(input.light, 'light'),
    dark: deriveThemeColors(input.dark, 'dark'),
    visual: input.visual ?? {},
  };
}

// Rounded, airy, frosted. Matches the contract fallbacks.

export const WHILEUI_PRESET_SOFT: ThemePreset = {
  name: 'soft',
  description: 'Rounded, airy, frosted surfaces with generous padding.',
  light: WHILEUI_LIGHT_THEME_COLORS,
  dark: WHILEUI_DARK_THEME_COLORS,
  visual: {},
};

// Compact geometry, hairline-plus borders, real drop shadows, warm ink.

const ATELIER_LIGHT: ThemeColors = {
  primary: '#b4552d',
  primaryForeground: '#fdf6ee',
  foreground: '#2b2118',
  background: '#f6efe4',
  card: '#fbf7ef',
  cardForeground: '#2b2118',
  popover: '#fffdf8',
  popoverForeground: '#2b2118',
  secondary: 'rgba(43, 33, 24, 0.06)',
  secondaryForeground: '#4a3a2a',
  muted: 'rgba(43, 33, 24, 0.05)',
  mutedForeground: '#7a6a58',
  border: 'rgba(43, 33, 24, 0.22)',
  input: '#fffdf8',
  ring: 'rgba(180, 85, 45, 0.45)',
  accent: '#1f6f54',
  accentForeground: '#f0faf5',
  destructive: '#b3261e',
  destructiveForeground: '#fdf3f2',
  success: '#1f6f54',
  successForeground: '#f0faf5',
  warning: '#c07b12',
  warningForeground: '#2b1c02',
  info: '#2f5d9e',
  infoForeground: '#f2f7fe',
  overlay: 'rgba(31, 22, 12, 0.30)',
  overlayStrong: 'rgba(31, 22, 12, 0.48)',
  surfaceElevated: '#fffdf8',
  surfaceTranslucent: 'rgba(251, 247, 239, 0.92)',
  surfaceTranslucentBorder: 'rgba(43, 33, 24, 0.16)',
  surfaceBorder: 'rgba(43, 33, 24, 0.22)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.65)',
  stateHover: 'rgba(180, 85, 45, 0.07)',
  statePressed: 'rgba(180, 85, 45, 0.14)',
  stateDisabled: 'rgba(122, 106, 88, 0.30)',
  shadow: '#3a2c1c',
  primaryActive: '#96431f',
  secondaryActive: 'rgba(43, 33, 24, 0.12)',
  destructiveActive: '#8f1d17',
  primarySoft: 'rgba(180, 85, 45, 0.12)',
  primarySoftSubtle: 'rgba(180, 85, 45, 0.06)',
  secondarySoft: 'rgba(31, 111, 84, 0.10)',
  mutedSoft: 'rgba(43, 33, 24, 0.04)',
  destructiveSoft: 'rgba(179, 38, 30, 0.10)',
  destructiveSoftBorder: 'rgba(179, 38, 30, 0.32)',
  successSoft: 'rgba(31, 111, 84, 0.10)',
  successSoftBorder: 'rgba(31, 111, 84, 0.32)',
  warningSoft: 'rgba(192, 123, 18, 0.12)',
  warningSoftBorder: 'rgba(192, 123, 18, 0.36)',
  infoSoft: 'rgba(47, 93, 158, 0.10)',
  infoSoftBorder: 'rgba(47, 93, 158, 0.32)',
  placeholder: '#7a6a58',
};

const ATELIER_DARK: ThemeColors = {
  primary: '#e8935f',
  primaryForeground: '#241207',
  foreground: '#efe6d8',
  background: '#191410',
  card: '#221c16',
  cardForeground: '#efe6d8',
  popover: '#282019',
  popoverForeground: '#efe6d8',
  secondary: 'rgba(239, 230, 216, 0.07)',
  secondaryForeground: '#d8c9b4',
  muted: 'rgba(239, 230, 216, 0.06)',
  mutedForeground: '#a3937d',
  border: 'rgba(239, 230, 216, 0.18)',
  input: '#211a14',
  ring: 'rgba(232, 147, 95, 0.45)',
  accent: '#6fd0a8',
  accentForeground: '#0b2419',
  destructive: '#e5695f',
  destructiveForeground: '#2b0b08',
  success: '#6fd0a8',
  successForeground: '#0b2419',
  warning: '#e5b155',
  warningForeground: '#2a1c02',
  info: '#82aae0',
  infoForeground: '#0a1930',
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayStrong: 'rgba(0, 0, 0, 0.72)',
  surfaceElevated: '#2a221b',
  surfaceTranslucent: 'rgba(34, 28, 22, 0.92)',
  surfaceTranslucentBorder: 'rgba(239, 230, 216, 0.14)',
  surfaceBorder: 'rgba(239, 230, 216, 0.18)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.05)',
  stateHover: 'rgba(232, 147, 95, 0.09)',
  statePressed: 'rgba(232, 147, 95, 0.18)',
  stateDisabled: 'rgba(163, 147, 125, 0.28)',
  shadow: '#000000',
  primaryActive: '#f0a878',
  secondaryActive: 'rgba(239, 230, 216, 0.12)',
  destructiveActive: '#ef8078',
  primarySoft: 'rgba(232, 147, 95, 0.16)',
  primarySoftSubtle: 'rgba(232, 147, 95, 0.09)',
  secondarySoft: 'rgba(111, 208, 168, 0.10)',
  mutedSoft: 'rgba(239, 230, 216, 0.04)',
  destructiveSoft: 'rgba(229, 105, 95, 0.16)',
  destructiveSoftBorder: 'rgba(229, 105, 95, 0.38)',
  successSoft: 'rgba(111, 208, 168, 0.14)',
  successSoftBorder: 'rgba(111, 208, 168, 0.36)',
  warningSoft: 'rgba(229, 177, 85, 0.14)',
  warningSoftBorder: 'rgba(229, 177, 85, 0.38)',
  infoSoft: 'rgba(130, 170, 224, 0.14)',
  infoSoftBorder: 'rgba(130, 170, 224, 0.36)',
  placeholder: '#a3937d',
};

export const WHILEUI_PRESET_ATELIER: ThemePreset = {
  name: 'atelier',
  description:
    'Editorial and tactile: sharp corners, dense controls, hairline borders, real shadows.',
  light: ATELIER_LIGHT,
  dark: ATELIER_DARK,
  visual: {
    radiusSm: 4,
    radiusMd: 6,
    radiusLg: 10,
    radiusXl: 14,
    controlHeightSm: 32,
    controlHeightDefault: 40,
    controlHeightLg: 48,
    controlPaddingXSm: 10,
    controlPaddingXDefault: 14,
    controlPaddingXLg: 20,
    controlPaddingYSm: 6,
    controlPaddingYDefault: 8,
    controlPaddingYLg: 12,
    surfacePaddingSm: 12,
    surfacePaddingDefault: 18,
    surfacePaddingLg: 26,
    badgeRadius: 4,
    badgePaddingX: 8,
    badgePaddingY: 3,
    fontSizeXs: 11,
    fontSizeSm: 12,
    fontSizeBase: 14,
    fontSizeLg: 16,
    fontSizeXl: 19,
    fontSize2xl: 23,
    borderWidthHairline: 1,
    borderWidthControl: 1.25,
    borderWidthEmphasis: 2,
    shadowOpacitySm: 0.1,
    shadowOpacityMd: 0.16,
    shadowOpacityLg: 0.24,
    shadowRadiusSm: 2,
    shadowRadiusMd: 8,
    shadowRadiusLg: 22,
    shadowOffsetYSm: 1,
    shadowOffsetYMd: 3,
    shadowOffsetYLg: 10,
    blurIntensitySubtle: 0,
    blurIntensityMedium: 0,
    blurIntensityStrong: 0,
    frostedHighlightHeight: 0,
  },
};

export const WHILEUI_THEME_PRESETS: readonly ThemePreset[] = [
  WHILEUI_PRESET_SOFT,
  WHILEUI_PRESET_ATELIER,
];

function formatCssNumber(value: number | boolean): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  return String(value);
}

/**
 * Flatten a preset into CSS variable maps an app can drop into its theme CSS
 * (e.g. a Uniwind/Tailwind `@theme` block plus light/dark variants).
 */
export function themePresetToCssVariables(preset: ThemePreset): {
  light: Record<string, string>;
  dark: Record<string, string>;
  visual: Record<string, string>;
} {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  for (const spec of THEME_TOKEN_SPECS) {
    light[spec.cssVar] = preset.light[spec.key];
    light[spec.appVar] = preset.light[spec.key];
    dark[spec.cssVar] = preset.dark[spec.key];
    dark[spec.appVar] = preset.dark[spec.key];
  }

  const visual: Record<string, string> = {};
  for (const spec of VISUAL_TOKEN_SPECS) {
    const override = preset.visual[spec.key];
    visual[spec.cssVar] = formatCssNumber(override ?? spec.fallback);
  }

  return { light, dark, visual };
}

/** Render a preset as ready-to-paste CSS blocks. */
export function themePresetToCss(preset: ThemePreset): string {
  const { light, dark, visual } = themePresetToCssVariables(preset);
  const renderVars = (vars: Record<string, string>, indent: string) =>
    Object.entries(vars)
      .map(([name, value]) => `${indent}${name}: ${value};`)
      .join('\n');

  return [
    `/* WhileUI preset: ${preset.name} — ${preset.description} */`,
    `@theme {`,
    renderVars(visual, '  '),
    `}`,
    ``,
    `@layer theme {`,
    `  :root {`,
    `    @variant light {`,
    renderVars(light, '      '),
    `    }`,
    `    @variant dark {`,
    renderVars(dark, '      '),
    `    }`,
    `  }`,
    `}`,
  ].join('\n');
}
