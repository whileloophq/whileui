import * as React from 'react';
import { Platform, StyleSheet, type ViewStyle } from 'react-native';
import * as PopoverPrimitive from '@rn-primitives/popover';
import { cn } from '../../lib/cn';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useOverlayInsets, type OverlayInsets } from '../../lib/overlay-insets';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfacePadding, surfaceRadius } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface PopoverProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
> {
  className?: string;
}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, FrostedSurfaceProps {
  className?: string;
  portalHost?: string;
  /** Collision padding. Defaults to safe area plus a margin so the panel never sits flush against an edge. */
  insets?: Partial<OverlayInsets>;
}

export interface PopoverCloseProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Close
> {
  className?: string;
}

function Popover({ onOpenChange, children }: PopoverProps) {
  return <PopoverPrimitive.Root onOpenChange={onOpenChange}>{children}</PopoverPrimitive.Root>;
}

const PopoverTrigger: ForwardRefComponent<PopoverPrimitive.TriggerRef, PopoverTriggerProps> =
  React.forwardRef(({ className, ...props }, ref) => (
    <PopoverPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
  ));
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent: ForwardRefComponent<PopoverPrimitive.ContentRef, PopoverContentProps> =
  React.forwardRef(
    (
      {
        className,
        align = 'center',
        sideOffset = 4,
        insets,
        portalHost,
        children,
        style,
        frosted = false,
        blurIntensity,
        blurTintToken,
        ...props
      },
      ref
    ) => {
      const frostedSurface = useFrostedSurface({
        frosted,
        blurIntensity,
        blurTintToken,
        defaultTintToken: 'popover',
        defaultBlurPreset: 'subtle',
      });
      const visual = useVisualTokens();
      const colors = useThemeColors();
      // Keeps the panel off the screen edge and out from under the notch.
      const defaultInsets = useOverlayInsets();
      const resolvedInsets = { ...defaultInsets, ...insets };
      // NOTE: native only. `@rn-primitives/popover`'s web build destructures `insets`
      // away (`insets: _insets`) and hands Radix a fixed allowlist that has no room for
      // `collisionPadding`, so a web popover next to an edge still lands flush against it.
      // Fixing that needs a `.web.tsx` talking to Radix directly.
      const resolvedStyle = StyleSheet.flatten([
        Platform.OS === 'web' ? undefined : contentStyles,
        {
          borderRadius: surfaceRadius(visual, 'lg'),
          borderWidth: visual.borderWidthHairline,
          padding: surfacePadding(visual, 'sm'),
        },
        shadowStyle(visual, colors, 'md'),
        frostedSurface.surfaceStyle,
        style,
      ]) as ViewStyle;

      return (
        <PopoverPrimitive.Portal hostName={portalHost}>
          <PopoverPrimitive.Overlay
            style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}
          >
            <PopoverPrimitive.Content
              ref={ref}
              align={align}
              sideOffset={sideOffset}
              insets={resolvedInsets}
              className={cn(
                'z-50 w-72 border-border relative overflow-hidden',
                frosted ? 'bg-transparent' : 'bg-popover',
                'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                className
              )}
              style={resolvedStyle}
              {...props}
            >
              {frostedSurface.overlay}
              {children}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Overlay>
        </PopoverPrimitive.Portal>
      );
    }
  );
PopoverContent.displayName = 'PopoverContent';

const PopoverClose: ForwardRefComponent<PopoverPrimitive.CloseRef, PopoverCloseProps> =
  React.forwardRef(({ className, ...props }, ref) => (
    <PopoverPrimitive.Close ref={ref} className={cn(className)} {...props} />
  ));
PopoverClose.displayName = 'PopoverClose';

const contentStyles: ViewStyle = {
  position: 'absolute',
};

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
