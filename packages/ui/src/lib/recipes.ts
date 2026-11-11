import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import { formatRgb, parse } from 'culori';
import { useThemeColors, type ThemeColors } from './theme-colors';
import { useVisualTokens, type VisualTokens } from './visual-tokens';

/**
 * Shared style recipes.
 * Components consume these instead of hardcoding radius/height/padding/font
 * classes so a theme (color contract + visual token contract) can fully
 * restyle the package.
 */

export type ControlSize = 'sm' | 'default' | 'lg' | 'icon';
export type SurfacePaddingSize = 'none' | 'sm' | 'default' | 'lg';
export type ShadowTier = 'none' | 'sm' | 'md' | 'lg';
export type TypographyRole = 'caption' | 'label' | 'body' | 'emphasis' | 'title' | 'headline';

export function controlRecipe(visual: VisualTokens, size: ControlSize = 'default'): ViewStyle {
  if (size === 'sm') {
    return {
      minHeight: visual.controlHeightSm,
      borderRadius: visual.radiusMd,
      paddingHorizontal: visual.controlPaddingXSm,
      paddingVertical: visual.controlPaddingYSm,
    };
  }

  if (size === 'lg') {
    return {
      minHeight: visual.controlHeightLg,
      borderRadius: visual.radiusXl,
      paddingHorizontal: visual.controlPaddingXLg,
      paddingVertical: visual.controlPaddingYLg,
    };
  }

  if (size === 'icon') {
    return {
      minHeight: visual.controlHeightDefault,
      minWidth: visual.controlHeightDefault,
      width: visual.controlHeightDefault,
      borderRadius: visual.radiusLg,
      paddingHorizontal: 0,
      paddingVertical: 0,
    };
  }

  return {
    minHeight: visual.controlHeightDefault,
    borderRadius: visual.radiusLg,
    paddingHorizontal: visual.controlPaddingXDefault,
    paddingVertical: visual.controlPaddingYDefault,
  };
}

export function fieldRecipe(visual: VisualTokens, size: ControlSize = 'default'): ViewStyle {
  const base = controlRecipe(visual, size);
  return {
    ...base,
    borderWidth: visual.borderWidthControl,
  };
}

export interface SurfaceRecipeOptions {
  padding?: SurfacePaddingSize;
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
}

export function surfacePadding(
  visual: VisualTokens,
  padding: SurfacePaddingSize = 'default'
): number {
  if (padding === 'none') return 0;
  if (padding === 'sm') return visual.surfacePaddingSm;
  if (padding === 'lg') return visual.surfacePaddingLg;
  return visual.surfacePaddingDefault;
}

export function surfaceRadius(
  visual: VisualTokens,
  radius: 'sm' | 'md' | 'lg' | 'xl' = 'xl'
): number {
  if (radius === 'sm') return visual.radiusSm;
  if (radius === 'md') return visual.radiusMd;
  if (radius === 'lg') return visual.radiusLg;
  return visual.radiusXl;
}

export function surfaceRecipe(visual: VisualTokens, options: SurfaceRecipeOptions = {}): ViewStyle {
  const { padding = 'default', radius = 'xl', bordered = true } = options;
  return {
    borderRadius: surfaceRadius(visual, radius),
    padding: surfacePadding(visual, padding),
    ...(bordered ? { borderWidth: visual.borderWidthHairline } : null),
  };
}

export function shadowStyle(
  visual: VisualTokens,
  colors: ThemeColors,
  tier: ShadowTier
): ViewStyle {
  if (tier === 'none') return {};

  const opacity =
    tier === 'sm'
      ? visual.shadowOpacitySm
      : tier === 'md'
        ? visual.shadowOpacityMd
        : visual.shadowOpacityLg;
  const radius =
    tier === 'sm'
      ? visual.shadowRadiusSm
      : tier === 'md'
        ? visual.shadowRadiusMd
        : visual.shadowRadiusLg;
  const offsetY =
    tier === 'sm'
      ? visual.shadowOffsetYSm
      : tier === 'md'
        ? visual.shadowOffsetYMd
        : visual.shadowOffsetYLg;
  const elevation =
    tier === 'sm'
      ? visual.shadowElevationSm
      : tier === 'md'
        ? visual.shadowElevationMd
        : visual.shadowElevationLg;

  if (opacity <= 0) return {};

  // Android below 9 cannot draw an outset box shadow and keeps the elevation fallback.
  if (Platform.OS === 'android' && typeof Platform.Version === 'number' && Platform.Version < 28) {
    return { elevation };
  }

  // A box shadow is clipped outside the border box, so it never shows through a
  // translucent surface. Elevation and the legacy `shadow*` props draw under the whole
  // view, which greyed every translucent card on Android. CSS blur is twice the
  // Core Animation radius the tokens were tuned for.
  return {
    boxShadow: [
      {
        offsetX: 0,
        offsetY,
        blurRadius: radius * 2,
        color: colorWithOpacity(colors.shadow, opacity),
      },
    ],
  };
}

function colorWithOpacity(color: string, opacity: number): string {
  const parsed = parse(color);
  if (!parsed) return color;
  return formatRgb({ ...parsed, alpha: opacity });
}

/**
 * Caret and selection colours for a text field: the theme's primary, where React Native
 * would otherwise use the platform blue. iOS tints the caret, handles and highlight from
 * `selectionColor` alone. Android paints `selectionColor` as the highlight at full
 * strength, which would hide the selected text, so it gets a translucent highlight and
 * the caret and handles take the solid colour. The web keeps the browser's caret.
 */
export function textCursorColors(colors: ThemeColors) {
  if (Platform.OS === 'android') {
    return {
      cursorColor: colors.primary,
      selectionHandleColor: colors.primary,
      selectionColor: colorWithOpacity(colors.primary, 0.3),
    };
  }
  return Platform.OS === 'ios' ? { selectionColor: colors.primary } : {};
}

// Component-owned text sizes. Font family/weight stays on className
// (font-medium etc.) so app font mappings keep working.

export function typographyStyle(visual: VisualTokens, role: TypographyRole): TextStyle {
  if (role === 'caption')
    return {
      fontSize: visual.fontSizeXs,
      letterSpacing: visual.letterSpacingCaption,
    };
  if (role === 'label')
    return { fontSize: visual.fontSizeSm, letterSpacing: visual.letterSpacingLabel };
  if (role === 'emphasis')
    return { fontSize: visual.fontSizeLg, letterSpacing: visual.letterSpacingBody };
  if (role === 'title')
    return { fontSize: visual.fontSizeXl, letterSpacing: visual.letterSpacingTitle };
  if (role === 'headline')
    return {
      fontSize: visual.fontSize2xl,
      letterSpacing: visual.letterSpacingHeadline,
    };
  return { fontSize: visual.fontSizeBase, letterSpacing: visual.letterSpacingBody };
}

export function useControlRecipe(size: ControlSize = 'default'): ViewStyle {
  return controlRecipe(useVisualTokens(), size);
}

export function useFieldRecipe(size: ControlSize = 'default'): ViewStyle {
  return fieldRecipe(useVisualTokens(), size);
}

export function useSurfaceRecipe(options: SurfaceRecipeOptions = {}): ViewStyle {
  return surfaceRecipe(useVisualTokens(), options);
}

export function useShadowStyle(tier: ShadowTier): ViewStyle {
  return shadowStyle(useVisualTokens(), useThemeColors(), tier);
}

export function useTypography(role: TypographyRole): TextStyle {
  return typographyStyle(useVisualTokens(), role);
}
