export interface VisualTokens {
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  controlHeightSm: number;
  controlHeightDefault: number;
  controlHeightLg: number;
  controlPaddingXSm: number;
  controlPaddingXDefault: number;
  controlPaddingXLg: number;
  controlPaddingYSm: number;
  controlPaddingYDefault: number;
  controlPaddingYLg: number;
  surfacePaddingSm: number;
  surfacePaddingDefault: number;
  surfacePaddingLg: number;
  badgeRadius: number;
  badgePaddingX: number;
  badgePaddingY: number;
  fontSizeXs: number;
  fontSizeSm: number;
  fontSizeBase: number;
  fontSizeLg: number;
  fontSizeXl: number;
  fontSize2xl: number;
  letterSpacingCaption: number;
  letterSpacingLabel: number;
  letterSpacingBody: number;
  letterSpacingTitle: number;
  letterSpacingHeadline: number;
  borderWidthHairline: number;
  borderWidthControl: number;
  borderWidthEmphasis: number;
  focusRingWidth: number;
  shadowOpacitySm: number;
  shadowOpacityMd: number;
  shadowOpacityLg: number;
  shadowRadiusSm: number;
  shadowRadiusMd: number;
  shadowRadiusLg: number;
  shadowOffsetYSm: number;
  shadowOffsetYMd: number;
  shadowOffsetYLg: number;
  shadowElevationSm: number;
  shadowElevationMd: number;
  shadowElevationLg: number;
  touchTargetMinSize: number;
  drawerWidthRatio: number;
  drawerMaxWidthWeb: number;
  drawerFrostedInset: number;
  drawerFrostedRadius: number;
  drawerContentTopPadding: number;
  drawerItemFontSize: number;
  drawerBadgeMinWidth: number;
  navSectionTitleFontSize: number;
  navItemBadgeFontSize: number;
  bottomNavBadgeFontSize: number;
  dataRowCompactDescriptionSize: number;
  dataRowRightMaxWidthRatio: number;
  segmentedWrapBasisRatio: number;
  textareaMinHeightDefault: number;
  textareaMinHeightSm: number;
  textareaMinHeightLg: number;
  chatBubbleMaxWidthRatio: number;
  chatSystemBubbleMaxWidthRatio: number;
  smartInputMaxHeight: number;
  formModalContentMinHeightRatio: number;
  sheetTabletBreakpoint: number;
  sheetMaxWidth: number;
  sheetHalfMaxHeightRatio: number;
  sheetHalfMinHeight: number;
  swipeActionWidth: number;
  skeletonShimmerBandWidth: number;
  blurIntensitySubtle: number;
  blurIntensityMedium: number;
  blurIntensityStrong: number;
  blurSaturationPct: number;
  frostedHighlightHeight: number;
  frostedBackdropBlurIntensity: number;
  frostedBackdropBlurScale: number;
  androidFrostedTintAlphaScale: number;
  androidExperimentalBlurEnabled: boolean;
}

export type VisualTokenKey = keyof VisualTokens;
export type VisualTokenGroup =
  'foundation' | 'typography' | 'depth' | 'motion' | 'surface' | 'component';
export type VisualTokenKind = 'pixel' | 'ratio' | 'scalar' | 'number' | 'boolean';

export interface VisualTokenSpec {
  key: VisualTokenKey;
  cssVar: string;
  fallback: number;
  kind: VisualTokenKind;
  group: VisualTokenGroup;
  min?: number;
  max?: number;
}

/**
 * App-owned visual tuning contract for WhileUI.
 * These are intentionally exhaustive because the package is primarily for internal app use.
 */
export const VISUAL_TOKEN_SPECS: readonly VisualTokenSpec[] = [
  { key: 'radiusSm', cssVar: '--ui-radius-sm', fallback: 10, kind: 'pixel', group: 'foundation' },
  { key: 'radiusMd', cssVar: '--ui-radius-md', fallback: 14, kind: 'pixel', group: 'foundation' },
  { key: 'radiusLg', cssVar: '--ui-radius-lg', fallback: 18, kind: 'pixel', group: 'foundation' },
  { key: 'radiusXl', cssVar: '--ui-radius-xl', fallback: 24, kind: 'pixel', group: 'foundation' },
  {
    key: 'controlHeightSm',
    cssVar: '--ui-control-height-sm',
    fallback: 36,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlHeightDefault',
    cssVar: '--ui-control-height-default',
    fallback: 44,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlHeightLg',
    cssVar: '--ui-control-height-lg',
    fallback: 52,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingXSm',
    cssVar: '--ui-control-padding-x-sm',
    fallback: 12,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingXDefault',
    cssVar: '--ui-control-padding-x-default',
    fallback: 16,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingXLg',
    cssVar: '--ui-control-padding-x-lg',
    fallback: 24,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingYSm',
    cssVar: '--ui-control-padding-y-sm',
    fallback: 8,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingYDefault',
    cssVar: '--ui-control-padding-y-default',
    fallback: 10,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'controlPaddingYLg',
    cssVar: '--ui-control-padding-y-lg',
    fallback: 14,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'surfacePaddingSm',
    cssVar: '--ui-surface-padding-sm',
    fallback: 16,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'surfacePaddingDefault',
    cssVar: '--ui-surface-padding-default',
    fallback: 24,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'surfacePaddingLg',
    cssVar: '--ui-surface-padding-lg',
    fallback: 32,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'badgeRadius',
    cssVar: '--ui-badge-radius',
    fallback: 999,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'badgePaddingX',
    cssVar: '--ui-badge-padding-x',
    fallback: 10,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'badgePaddingY',
    cssVar: '--ui-badge-padding-y',
    fallback: 4,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'fontSizeXs',
    cssVar: '--ui-font-size-xs',
    fallback: 11,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'fontSizeSm',
    cssVar: '--ui-font-size-sm',
    fallback: 13,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'fontSizeBase',
    cssVar: '--ui-font-size-base',
    fallback: 15,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'fontSizeLg',
    cssVar: '--ui-font-size-lg',
    fallback: 17,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'fontSizeXl',
    cssVar: '--ui-font-size-xl',
    fallback: 20,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'fontSize2xl',
    cssVar: '--ui-font-size-2xl',
    fallback: 24,
    kind: 'pixel',
    group: 'typography',
  },
  {
    key: 'letterSpacingCaption',
    cssVar: '--ui-letter-spacing-caption',
    fallback: 0.2,
    kind: 'number',
    group: 'typography',
  },
  {
    key: 'letterSpacingLabel',
    cssVar: '--ui-letter-spacing-label',
    fallback: 0.1,
    kind: 'number',
    group: 'typography',
  },
  {
    key: 'letterSpacingBody',
    cssVar: '--ui-letter-spacing-body',
    fallback: 0,
    kind: 'number',
    group: 'typography',
  },
  {
    key: 'letterSpacingTitle',
    cssVar: '--ui-letter-spacing-title',
    fallback: -0.2,
    kind: 'number',
    group: 'typography',
  },
  {
    key: 'letterSpacingHeadline',
    cssVar: '--ui-letter-spacing-headline',
    fallback: -0.4,
    kind: 'number',
    group: 'typography',
  },
  {
    key: 'borderWidthHairline',
    cssVar: '--ui-border-width-hairline',
    fallback: 1,
    kind: 'scalar',
    group: 'depth',
  },
  {
    key: 'borderWidthControl',
    cssVar: '--ui-border-width-control',
    fallback: 1,
    kind: 'scalar',
    group: 'depth',
  },
  {
    key: 'borderWidthEmphasis',
    cssVar: '--ui-border-width-emphasis',
    fallback: 2,
    kind: 'scalar',
    group: 'depth',
  },
  {
    key: 'focusRingWidth',
    cssVar: '--ui-focus-ring-width',
    fallback: 2,
    kind: 'scalar',
    group: 'depth',
  },
  {
    key: 'shadowOpacitySm',
    cssVar: '--ui-shadow-opacity-sm',
    fallback: 0.06,
    kind: 'ratio',
    group: 'depth',
  },
  {
    key: 'shadowOpacityMd',
    cssVar: '--ui-shadow-opacity-md',
    fallback: 0.1,
    kind: 'ratio',
    group: 'depth',
  },
  {
    key: 'shadowOpacityLg',
    cssVar: '--ui-shadow-opacity-lg',
    fallback: 0.16,
    kind: 'ratio',
    group: 'depth',
  },
  {
    key: 'shadowRadiusSm',
    cssVar: '--ui-shadow-radius-sm',
    fallback: 3,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowRadiusMd',
    cssVar: '--ui-shadow-radius-md',
    fallback: 12,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowRadiusLg',
    cssVar: '--ui-shadow-radius-lg',
    fallback: 28,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowOffsetYSm',
    cssVar: '--ui-shadow-offset-y-sm',
    fallback: 1,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowOffsetYMd',
    cssVar: '--ui-shadow-offset-y-md',
    fallback: 4,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowOffsetYLg',
    cssVar: '--ui-shadow-offset-y-lg',
    fallback: 12,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowElevationSm',
    cssVar: '--ui-shadow-elevation-sm',
    fallback: 1,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowElevationMd',
    cssVar: '--ui-shadow-elevation-md',
    fallback: 4,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'shadowElevationLg',
    cssVar: '--ui-shadow-elevation-lg',
    fallback: 10,
    kind: 'pixel',
    group: 'depth',
  },
  {
    key: 'touchTargetMinSize',
    cssVar: '--ui-touch-target-min-size',
    fallback: 44,
    kind: 'pixel',
    group: 'foundation',
  },
  {
    key: 'drawerWidthRatio',
    cssVar: '--ui-drawer-width-ratio',
    fallback: 0.84,
    kind: 'ratio',
    group: 'component',
    min: 0.4,
    max: 1,
  },
  {
    key: 'drawerMaxWidthWeb',
    cssVar: '--ui-drawer-max-width-web',
    fallback: 380,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'drawerFrostedInset',
    cssVar: '--ui-drawer-frosted-inset',
    fallback: 10,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'drawerFrostedRadius',
    cssVar: '--ui-drawer-frosted-radius',
    fallback: 34,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'drawerContentTopPadding',
    cssVar: '--ui-drawer-content-top-padding',
    fallback: 0,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'drawerItemFontSize',
    cssVar: '--ui-drawer-item-font-size',
    fallback: 15,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'drawerBadgeMinWidth',
    cssVar: '--ui-drawer-badge-min-width',
    fallback: 20,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'navSectionTitleFontSize',
    cssVar: '--ui-nav-section-title-font-size',
    fallback: 11,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'navItemBadgeFontSize',
    cssVar: '--ui-nav-item-badge-font-size',
    fallback: 11,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'bottomNavBadgeFontSize',
    cssVar: '--ui-bottom-nav-badge-font-size',
    fallback: 10,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'dataRowCompactDescriptionSize',
    cssVar: '--ui-data-row-compact-description-size',
    fallback: 11,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'dataRowRightMaxWidthRatio',
    cssVar: '--ui-data-row-right-max-width-ratio',
    fallback: 0.45,
    kind: 'ratio',
    group: 'component',
    min: 0.2,
    max: 1,
  },
  {
    key: 'segmentedWrapBasisRatio',
    cssVar: '--ui-segmented-wrap-basis-ratio',
    fallback: 0.48,
    kind: 'ratio',
    group: 'component',
    min: 0.2,
    max: 1,
  },
  {
    key: 'textareaMinHeightDefault',
    cssVar: '--ui-textarea-min-height-default',
    fallback: 80,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'textareaMinHeightSm',
    cssVar: '--ui-textarea-min-height-sm',
    fallback: 60,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'textareaMinHeightLg',
    cssVar: '--ui-textarea-min-height-lg',
    fallback: 120,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'chatBubbleMaxWidthRatio',
    cssVar: '--ui-chat-bubble-max-width-ratio',
    fallback: 0.85,
    kind: 'ratio',
    group: 'component',
    min: 0.2,
    max: 1,
  },
  {
    key: 'chatSystemBubbleMaxWidthRatio',
    cssVar: '--ui-chat-system-bubble-max-width-ratio',
    fallback: 0.9,
    kind: 'ratio',
    group: 'component',
    min: 0.2,
    max: 1,
  },
  {
    key: 'smartInputMaxHeight',
    cssVar: '--ui-smart-input-max-height',
    fallback: 120,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'formModalContentMinHeightRatio',
    cssVar: '--ui-form-modal-content-min-height-ratio',
    fallback: 0.4,
    kind: 'ratio',
    group: 'component',
    min: 0.1,
    max: 1,
  },
  {
    key: 'sheetTabletBreakpoint',
    cssVar: '--ui-sheet-tablet-breakpoint',
    fallback: 600,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'sheetMaxWidth',
    cssVar: '--ui-sheet-max-width',
    fallback: 400,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'sheetHalfMaxHeightRatio',
    cssVar: '--ui-sheet-half-max-height-ratio',
    fallback: 0.56,
    kind: 'ratio',
    group: 'component',
    min: 0.1,
    max: 1,
  },
  {
    key: 'sheetHalfMinHeight',
    cssVar: '--ui-sheet-half-min-height',
    fallback: 340,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'swipeActionWidth',
    cssVar: '--ui-swipe-action-width',
    fallback: 80,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'skeletonShimmerBandWidth',
    cssVar: '--ui-skeleton-shimmer-band-width',
    fallback: 56,
    kind: 'pixel',
    group: 'component',
  },
  {
    key: 'blurIntensitySubtle',
    cssVar: '--ui-blur-intensity-subtle',
    fallback: 18,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'blurIntensityMedium',
    cssVar: '--ui-blur-intensity-medium',
    fallback: 26,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'blurIntensityStrong',
    cssVar: '--ui-blur-intensity-strong',
    fallback: 34,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'blurSaturationPct',
    cssVar: '--ui-blur-saturation-pct',
    fallback: 145,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'frostedHighlightHeight',
    cssVar: '--ui-frosted-highlight-height',
    fallback: 2,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'frostedBackdropBlurIntensity',
    cssVar: '--ui-frosted-backdrop-blur-intensity',
    fallback: 22,
    kind: 'pixel',
    group: 'surface',
  },
  {
    key: 'frostedBackdropBlurScale',
    cssVar: '--ui-frosted-backdrop-blur-scale',
    fallback: 0.72,
    kind: 'ratio',
    group: 'surface',
    min: 0,
    max: 3,
  },
  {
    key: 'androidFrostedTintAlphaScale',
    cssVar: '--ui-frosted-android-tint-alpha-scale',
    fallback: 1.18,
    kind: 'ratio',
    group: 'surface',
    min: 0,
    max: 3,
  },
  {
    key: 'androidExperimentalBlurEnabled',
    cssVar: '--ui-frosted-android-experimental-blur',
    fallback: 1,
    kind: 'boolean',
    group: 'surface',
  },
] as const;

export const VISUAL_TOKEN_VARIABLES = VISUAL_TOKEN_SPECS.map(({ cssVar }) => cssVar);

export const VISUAL_TOKEN_GROUPS = {
  foundation: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'foundation'),
  typography: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'typography'),
  depth: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'depth'),
  motion: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'motion'),
  surface: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'surface'),
  component: VISUAL_TOKEN_SPECS.filter((token) => token.group === 'component'),
} as const;
