import * as React from 'react';
import { Platform, StyleSheet, type ViewStyle } from 'react-native';
import * as HoverCardPrimitive from '@rn-primitives/hover-card';
import { cn } from '../../lib/cn';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfacePadding, surfaceRadius } from '../../lib/recipes';

export interface HoverCardProps {
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactNode;
}

export interface HoverCardTriggerProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Trigger
> {
  className?: string;
}

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>, FrostedSurfaceProps {
  className?: string;
  portalHost?: string;
}

function HoverCard({ onOpenChange, openDelay, closeDelay, children }: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root
      onOpenChange={onOpenChange}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      {children}
    </HoverCardPrimitive.Root>
  );
}

const HoverCardTrigger = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Trigger>,
  HoverCardTriggerProps
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
));
HoverCardTrigger.displayName = 'HoverCardTrigger';

const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
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
      <HoverCardPrimitive.Portal hostName={portalHost}>
        <HoverCardPrimitive.Overlay
          style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}
        >
          <HoverCardPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              'z-50 w-64 border-border relative overflow-hidden',
              frosted ? 'bg-transparent' : 'bg-popover',
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
              className
            )}
            style={resolvedStyle}
            {...props}
          >
            {frostedSurface.overlay}
            {children}
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Overlay>
      </HoverCardPrimitive.Portal>
    );
  }
);
HoverCardContent.displayName = 'HoverCardContent';

const contentStyles: ViewStyle = {
  position: 'absolute',
};

export { HoverCard, HoverCardTrigger, HoverCardContent };
