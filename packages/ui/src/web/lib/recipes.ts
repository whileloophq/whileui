import type { CSSProperties } from 'react';

// DOM mirror of `lib/recipes.ts` — keep the two in step. Emits `var()` so the
// cascade resolves tokens. Visual tokens are unitless (`--ui-radius-md: 14`),
// hence `calc(... * 1px)`.

export const tokenPx = (token: string) => `calc(var(${token}) * 1px)`;

const px = tokenPx;

export type ControlSize = 'default' | 'sm' | 'lg' | 'icon';

export function controlRecipe(size: ControlSize = 'default'): CSSProperties {
  if (size === 'sm') {
    return {
      minHeight: px('--ui-control-height-sm'),
      borderRadius: px('--ui-radius-md'),
      paddingInline: px('--ui-control-padding-x-sm'),
      paddingBlock: px('--ui-control-padding-y-sm'),
    };
  }

  if (size === 'lg') {
    return {
      minHeight: px('--ui-control-height-lg'),
      borderRadius: px('--ui-radius-xl'),
      paddingInline: px('--ui-control-padding-x-lg'),
      paddingBlock: px('--ui-control-padding-y-lg'),
    };
  }

  if (size === 'icon') {
    return {
      minHeight: px('--ui-control-height-default'),
      minWidth: px('--ui-control-height-default'),
      width: px('--ui-control-height-default'),
      borderRadius: px('--ui-radius-lg'),
      paddingInline: 0,
      paddingBlock: 0,
    };
  }

  return {
    minHeight: px('--ui-control-height-default'),
    borderRadius: px('--ui-radius-lg'),
    paddingInline: px('--ui-control-padding-x-default'),
    paddingBlock: px('--ui-control-padding-y-default'),
  };
}

export function fieldRecipe(size: ControlSize = 'default'): CSSProperties {
  return { ...controlRecipe(size), borderWidth: px('--ui-border-width-control') };
}

export type SurfacePadding = 'none' | 'sm' | 'default' | 'lg';

export function surfacePadding(padding: SurfacePadding = 'default'): CSSProperties {
  if (padding === 'none') return {};
  if (padding === 'sm') return { padding: px('--ui-surface-padding-sm') };
  if (padding === 'lg') return { padding: px('--ui-surface-padding-lg') };
  return { padding: px('--ui-surface-padding-default') };
}

export type SurfaceRadius = 'sm' | 'md' | 'lg' | 'xl';

export function surfaceRadius(radius: SurfaceRadius = 'xl'): string {
  return px(`--ui-radius-${radius}`);
}

export type TypographyRole = 'caption' | 'label' | 'body' | 'emphasis' | 'title' | 'headline';

const TYPOGRAPHY: Record<TypographyRole, { size: string; tracking: string }> = {
  caption: { size: '--ui-font-size-xs', tracking: '--ui-letter-spacing-caption' },
  label: { size: '--ui-font-size-sm', tracking: '--ui-letter-spacing-label' },
  body: { size: '--ui-font-size-base', tracking: '--ui-letter-spacing-body' },
  emphasis: { size: '--ui-font-size-lg', tracking: '--ui-letter-spacing-body' },
  title: { size: '--ui-font-size-xl', tracking: '--ui-letter-spacing-title' },
  headline: { size: '--ui-font-size-2xl', tracking: '--ui-letter-spacing-headline' },
};

/** Size and tracking only — weight and family stay on className. */
export function typographyRecipe(role: TypographyRole): CSSProperties {
  const { size, tracking } = TYPOGRAPHY[role];
  return { fontSize: px(size), letterSpacing: px(tracking) };
}
