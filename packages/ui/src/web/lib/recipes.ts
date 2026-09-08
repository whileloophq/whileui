import type { CSSProperties } from 'react';

// DOM mirror of `lib/recipes.ts` — keep the two in step. Emits `var()` so the
// cascade resolves tokens. Visual tokens are unitless (`--ui-radius-md: 14`),
// hence `calc(... * 1px)`.

const px = (token: string) => `calc(var(${token}) * 1px)`;

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

export type SurfacePadding = 'none' | 'sm' | 'default' | 'lg';

export function surfacePadding(padding: SurfacePadding = 'default'): CSSProperties {
  if (padding === 'none') return {};
  if (padding === 'sm') return { padding: px('--ui-surface-padding-sm') };
  if (padding === 'lg') return { padding: px('--ui-surface-padding-lg') };
  return { padding: px('--ui-surface-padding-default') };
}
