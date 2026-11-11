export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  foreground: string;
  background: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
  overlay: string;
  overlayStrong: string;
  surfaceElevated: string;
  surfaceTranslucent: string;
  surfaceTranslucentBorder: string;
  surfaceBorder: string;
  surfaceHighlight: string;
  stateHover: string;
  statePressed: string;
  stateDisabled: string;
  shadow: string;
  primaryActive: string;
  secondaryActive: string;
  destructiveActive: string;
  primarySoft: string;
  primarySoftSubtle: string;
  secondarySoft: string;
  mutedSoft: string;
  destructiveSoft: string;
  destructiveSoftBorder: string;
  successSoft: string;
  successSoftBorder: string;
  warningSoft: string;
  warningSoftBorder: string;
  infoSoft: string;
  infoSoftBorder: string;
  /** For placeholder text (aliases mutedForeground; override via placeholderTextColor when needed) */
  placeholder: string;
}

export type ThemeTokenKey = keyof Omit<ThemeColors, 'placeholder'>;
export type ThemeTokenGroup = 'core' | 'status' | 'surface' | 'feedback';

export interface ThemeTokenSpec {
  key: ThemeTokenKey;
  cssVar: string;
  appVar: string;
  fallback: string;
  group: ThemeTokenGroup;
}

export const WHILEUI_LIGHT_THEME_COLORS: ThemeColors = {
  primary: '#4457ff',
  primaryForeground: '#fffdf8',
  foreground: '#271f48',
  background: '#fff8ef',
  card: 'rgba(255, 255, 255, 0.82)',
  cardForeground: '#271f48',
  popover: 'rgba(255, 252, 248, 0.92)',
  popoverForeground: '#271f48',
  secondary: 'rgba(255, 123, 92, 0.10)',
  secondaryForeground: '#41206e',
  muted: 'rgba(74, 55, 122, 0.07)',
  mutedForeground: '#645783',
  border: 'rgba(68, 87, 255, 0.16)',
  input: 'rgba(255, 255, 255, 0.84)',
  ring: '#3d8bff',
  accent: '#a7f432',
  accentForeground: '#163218',
  destructive: '#d03d31',
  destructiveForeground: '#fff8f6',
  success: '#00864d',
  successForeground: '#f5fff9',
  warning: '#ffb224',
  warningForeground: '#3d2200',
  info: '#2070e1',
  infoForeground: '#f8fbff',
  overlay: 'rgba(39, 31, 72, 0.14)',
  overlayStrong: 'rgba(39, 31, 72, 0.22)',
  surfaceElevated: 'rgba(255, 255, 255, 0.88)',
  surfaceTranslucent: 'rgba(255, 255, 255, 0.62)',
  surfaceTranslucentBorder: 'rgba(255, 255, 255, 0.42)',
  surfaceBorder: 'rgba(68, 87, 255, 0.16)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.74)',
  stateHover: 'rgba(68, 87, 255, 0.06)',
  statePressed: 'rgba(68, 87, 255, 0.12)',
  stateDisabled: 'rgba(100, 87, 131, 0.28)',
  shadow: '#271f48',
  primaryActive: '#3346e6',
  secondaryActive: 'rgba(255, 123, 92, 0.18)',
  destructiveActive: '#bb261d',
  primarySoft: 'rgba(68, 87, 255, 0.13)',
  primarySoftSubtle: 'rgba(68, 87, 255, 0.07)',
  secondarySoft: 'rgba(255, 123, 92, 0.16)',
  mutedSoft: 'rgba(74, 55, 122, 0.05)',
  destructiveSoft: 'rgba(208, 61, 49, 0.12)',
  destructiveSoftBorder: 'rgba(208, 61, 49, 0.30)',
  successSoft: 'rgba(0, 134, 77, 0.12)',
  successSoftBorder: 'rgba(0, 134, 77, 0.30)',
  warningSoft: 'rgba(255, 178, 36, 0.14)',
  warningSoftBorder: 'rgba(255, 178, 36, 0.34)',
  infoSoft: 'rgba(32, 112, 225, 0.12)',
  infoSoftBorder: 'rgba(32, 112, 225, 0.30)',
  placeholder: '#645783',
};

export const WHILEUI_DARK_THEME_COLORS: ThemeColors = {
  primary: '#ff5ca8',
  primaryForeground: '#2c1032',
  foreground: '#fff7eb',
  background: '#170f2d',
  card: 'rgba(38, 24, 69, 0.78)',
  cardForeground: '#fff7eb',
  popover: 'rgba(28, 18, 52, 0.90)',
  popoverForeground: '#fff7eb',
  secondary: 'rgba(255, 92, 168, 0.12)',
  secondaryForeground: '#fff3fa',
  muted: 'rgba(255, 247, 235, 0.08)',
  mutedForeground: '#c5bad9',
  border: 'rgba(255, 255, 255, 0.12)',
  input: 'rgba(27, 18, 49, 0.86)',
  ring: '#7ff0c5',
  accent: '#7ff0c5',
  accentForeground: '#0f2d24',
  destructive: '#ff6b57',
  destructiveForeground: '#2c0c0a',
  success: '#39db9b',
  successForeground: '#06241a',
  warning: '#ffbe42',
  warningForeground: '#2d1700',
  info: '#78a7ff',
  infoForeground: '#09162d',
  overlay: 'rgba(9, 4, 20, 0.50)',
  overlayStrong: 'rgba(9, 4, 20, 0.68)',
  surfaceElevated: 'rgba(45, 27, 79, 0.80)',
  surfaceTranslucent: 'rgba(34, 20, 61, 0.58)',
  surfaceTranslucentBorder: 'rgba(255, 255, 255, 0.12)',
  surfaceBorder: 'rgba(255, 255, 255, 0.12)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.07)',
  stateHover: 'rgba(255, 92, 168, 0.08)',
  statePressed: 'rgba(255, 92, 168, 0.16)',
  stateDisabled: 'rgba(197, 186, 217, 0.22)',
  shadow: '#000000',
  primaryActive: '#ff74b6',
  secondaryActive: 'rgba(255, 92, 168, 0.20)',
  destructiveActive: '#ff8271',
  primarySoft: 'rgba(255, 92, 168, 0.16)',
  primarySoftSubtle: 'rgba(255, 92, 168, 0.10)',
  secondarySoft: 'rgba(127, 240, 197, 0.08)',
  mutedSoft: 'rgba(255, 247, 235, 0.05)',
  destructiveSoft: 'rgba(255, 107, 87, 0.20)',
  destructiveSoftBorder: 'rgba(255, 107, 87, 0.40)',
  successSoft: 'rgba(57, 219, 155, 0.20)',
  successSoftBorder: 'rgba(57, 219, 155, 0.40)',
  warningSoft: 'rgba(255, 190, 66, 0.20)',
  warningSoftBorder: 'rgba(255, 190, 66, 0.45)',
  infoSoft: 'rgba(120, 167, 255, 0.20)',
  infoSoftBorder: 'rgba(120, 167, 255, 0.40)',
  placeholder: '#c5bad9',
};

/**
 * App-owned theme contract for WhileUI.
 * The package owns token names and fallbacks; apps own the actual values.
 */
export const THEME_TOKEN_SPECS: readonly ThemeTokenSpec[] = [
  {
    key: 'primary',
    cssVar: '--color-primary',
    appVar: '--app-color-primary',
    fallback: WHILEUI_LIGHT_THEME_COLORS.primary,
    group: 'core',
  },
  {
    key: 'primaryForeground',
    cssVar: '--color-primary-foreground',
    appVar: '--app-color-primary-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.primaryForeground,
    group: 'core',
  },
  {
    key: 'foreground',
    cssVar: '--color-foreground',
    appVar: '--app-color-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.foreground,
    group: 'core',
  },
  {
    key: 'background',
    cssVar: '--color-background',
    appVar: '--app-color-background',
    fallback: WHILEUI_LIGHT_THEME_COLORS.background,
    group: 'core',
  },
  {
    key: 'card',
    cssVar: '--color-card',
    appVar: '--app-color-card',
    fallback: WHILEUI_LIGHT_THEME_COLORS.card,
    group: 'core',
  },
  {
    key: 'cardForeground',
    cssVar: '--color-card-foreground',
    appVar: '--app-color-card-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.cardForeground,
    group: 'core',
  },
  {
    key: 'popover',
    cssVar: '--color-popover',
    appVar: '--app-color-popover',
    fallback: WHILEUI_LIGHT_THEME_COLORS.popover,
    group: 'core',
  },
  {
    key: 'popoverForeground',
    cssVar: '--color-popover-foreground',
    appVar: '--app-color-popover-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.popoverForeground,
    group: 'core',
  },
  {
    key: 'secondary',
    cssVar: '--color-secondary',
    appVar: '--app-color-secondary',
    fallback: WHILEUI_LIGHT_THEME_COLORS.secondary,
    group: 'core',
  },
  {
    key: 'secondaryForeground',
    cssVar: '--color-secondary-foreground',
    appVar: '--app-color-secondary-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.secondaryForeground,
    group: 'core',
  },
  {
    key: 'muted',
    cssVar: '--color-muted',
    appVar: '--app-color-muted',
    fallback: WHILEUI_LIGHT_THEME_COLORS.muted,
    group: 'core',
  },
  {
    key: 'mutedForeground',
    cssVar: '--color-muted-foreground',
    appVar: '--app-color-muted-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.mutedForeground,
    group: 'core',
  },
  {
    key: 'border',
    cssVar: '--color-border',
    appVar: '--app-color-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.border,
    group: 'core',
  },
  {
    key: 'input',
    cssVar: '--color-input',
    appVar: '--app-color-input',
    fallback: WHILEUI_LIGHT_THEME_COLORS.input,
    group: 'core',
  },
  {
    key: 'ring',
    cssVar: '--color-ring',
    appVar: '--app-color-ring',
    fallback: WHILEUI_LIGHT_THEME_COLORS.ring,
    group: 'feedback',
  },
  {
    key: 'accent',
    cssVar: '--color-accent',
    appVar: '--app-color-accent',
    fallback: WHILEUI_LIGHT_THEME_COLORS.accent,
    group: 'core',
  },
  {
    key: 'accentForeground',
    cssVar: '--color-accent-foreground',
    appVar: '--app-color-accent-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.accentForeground,
    group: 'core',
  },
  {
    key: 'destructive',
    cssVar: '--color-destructive',
    appVar: '--app-color-destructive',
    fallback: WHILEUI_LIGHT_THEME_COLORS.destructive,
    group: 'status',
  },
  {
    key: 'destructiveForeground',
    cssVar: '--color-destructive-foreground',
    appVar: '--app-color-destructive-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.destructiveForeground,
    group: 'status',
  },
  {
    key: 'success',
    cssVar: '--color-success',
    appVar: '--app-color-success',
    fallback: WHILEUI_LIGHT_THEME_COLORS.success,
    group: 'status',
  },
  {
    key: 'successForeground',
    cssVar: '--color-success-foreground',
    appVar: '--app-color-success-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.successForeground,
    group: 'status',
  },
  {
    key: 'warning',
    cssVar: '--color-warning',
    appVar: '--app-color-warning',
    fallback: WHILEUI_LIGHT_THEME_COLORS.warning,
    group: 'status',
  },
  {
    key: 'warningForeground',
    cssVar: '--color-warning-foreground',
    appVar: '--app-color-warning-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.warningForeground,
    group: 'status',
  },
  {
    key: 'info',
    cssVar: '--color-info',
    appVar: '--app-color-info',
    fallback: WHILEUI_LIGHT_THEME_COLORS.info,
    group: 'status',
  },
  {
    key: 'infoForeground',
    cssVar: '--color-info-foreground',
    appVar: '--app-color-info-foreground',
    fallback: WHILEUI_LIGHT_THEME_COLORS.infoForeground,
    group: 'status',
  },
  {
    key: 'overlay',
    cssVar: '--color-overlay',
    appVar: '--app-color-overlay',
    fallback: WHILEUI_LIGHT_THEME_COLORS.overlay,
    group: 'surface',
  },
  {
    key: 'overlayStrong',
    cssVar: '--color-overlay-strong',
    appVar: '--app-color-overlay-strong',
    fallback: WHILEUI_LIGHT_THEME_COLORS.overlayStrong,
    group: 'surface',
  },
  {
    key: 'surfaceElevated',
    cssVar: '--color-surface-elevated',
    appVar: '--app-color-surface-elevated',
    fallback: WHILEUI_LIGHT_THEME_COLORS.surfaceElevated,
    group: 'surface',
  },
  {
    key: 'surfaceTranslucent',
    cssVar: '--color-surface-translucent',
    appVar: '--app-color-surface-translucent',
    fallback: WHILEUI_LIGHT_THEME_COLORS.surfaceTranslucent,
    group: 'surface',
  },
  {
    key: 'surfaceTranslucentBorder',
    cssVar: '--color-surface-translucent-border',
    appVar: '--app-color-surface-translucent-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.surfaceTranslucentBorder,
    group: 'surface',
  },
  {
    key: 'surfaceBorder',
    cssVar: '--color-surface-border',
    appVar: '--app-color-surface-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.surfaceBorder,
    group: 'surface',
  },
  {
    key: 'surfaceHighlight',
    cssVar: '--color-surface-highlight',
    appVar: '--app-color-surface-highlight',
    fallback: WHILEUI_LIGHT_THEME_COLORS.surfaceHighlight,
    group: 'surface',
  },
  {
    key: 'stateHover',
    cssVar: '--color-state-hover',
    appVar: '--app-color-state-hover',
    fallback: WHILEUI_LIGHT_THEME_COLORS.stateHover,
    group: 'feedback',
  },
  {
    key: 'statePressed',
    cssVar: '--color-state-pressed',
    appVar: '--app-color-state-pressed',
    fallback: WHILEUI_LIGHT_THEME_COLORS.statePressed,
    group: 'feedback',
  },
  {
    key: 'stateDisabled',
    cssVar: '--color-state-disabled',
    appVar: '--app-color-state-disabled',
    fallback: WHILEUI_LIGHT_THEME_COLORS.stateDisabled,
    group: 'feedback',
  },
  {
    key: 'shadow',
    cssVar: '--color-shadow',
    appVar: '--app-color-shadow',
    fallback: WHILEUI_LIGHT_THEME_COLORS.shadow,
    group: 'surface',
  },
  {
    key: 'primaryActive',
    cssVar: '--color-primary-active',
    appVar: '--app-color-primary-active',
    fallback: WHILEUI_LIGHT_THEME_COLORS.primaryActive,
    group: 'feedback',
  },
  {
    key: 'secondaryActive',
    cssVar: '--color-secondary-active',
    appVar: '--app-color-secondary-active',
    fallback: WHILEUI_LIGHT_THEME_COLORS.secondaryActive,
    group: 'feedback',
  },
  {
    key: 'destructiveActive',
    cssVar: '--color-destructive-active',
    appVar: '--app-color-destructive-active',
    fallback: WHILEUI_LIGHT_THEME_COLORS.destructiveActive,
    group: 'feedback',
  },
  {
    key: 'primarySoft',
    cssVar: '--color-primary-soft',
    appVar: '--app-color-primary-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.primarySoft,
    group: 'feedback',
  },
  {
    key: 'primarySoftSubtle',
    cssVar: '--color-primary-soft-subtle',
    appVar: '--app-color-primary-soft-subtle',
    fallback: WHILEUI_LIGHT_THEME_COLORS.primarySoftSubtle,
    group: 'feedback',
  },
  {
    key: 'secondarySoft',
    cssVar: '--color-secondary-soft',
    appVar: '--app-color-secondary-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.secondarySoft,
    group: 'feedback',
  },
  {
    key: 'mutedSoft',
    cssVar: '--color-muted-soft',
    appVar: '--app-color-muted-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.mutedSoft,
    group: 'feedback',
  },
  {
    key: 'destructiveSoft',
    cssVar: '--color-destructive-soft',
    appVar: '--app-color-destructive-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.destructiveSoft,
    group: 'status',
  },
  {
    key: 'destructiveSoftBorder',
    cssVar: '--color-destructive-soft-border',
    appVar: '--app-color-destructive-soft-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.destructiveSoftBorder,
    group: 'status',
  },
  {
    key: 'successSoft',
    cssVar: '--color-success-soft',
    appVar: '--app-color-success-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.successSoft,
    group: 'status',
  },
  {
    key: 'successSoftBorder',
    cssVar: '--color-success-soft-border',
    appVar: '--app-color-success-soft-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.successSoftBorder,
    group: 'status',
  },
  {
    key: 'warningSoft',
    cssVar: '--color-warning-soft',
    appVar: '--app-color-warning-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.warningSoft,
    group: 'status',
  },
  {
    key: 'warningSoftBorder',
    cssVar: '--color-warning-soft-border',
    appVar: '--app-color-warning-soft-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.warningSoftBorder,
    group: 'status',
  },
  {
    key: 'infoSoft',
    cssVar: '--color-info-soft',
    appVar: '--app-color-info-soft',
    fallback: WHILEUI_LIGHT_THEME_COLORS.infoSoft,
    group: 'status',
  },
  {
    key: 'infoSoftBorder',
    cssVar: '--color-info-soft-border',
    appVar: '--app-color-info-soft-border',
    fallback: WHILEUI_LIGHT_THEME_COLORS.infoSoftBorder,
    group: 'status',
  },
] as const;

export const THEME_TOKEN_VARIABLES = THEME_TOKEN_SPECS.flatMap(({ cssVar, appVar }) => [
  cssVar,
  appVar,
]);

export const THEME_TOKEN_GROUPS = {
  core: THEME_TOKEN_SPECS.filter((token) => token.group === 'core'),
  status: THEME_TOKEN_SPECS.filter((token) => token.group === 'status'),
  surface: THEME_TOKEN_SPECS.filter((token) => token.group === 'surface'),
  feedback: THEME_TOKEN_SPECS.filter((token) => token.group === 'feedback'),
} as const;
