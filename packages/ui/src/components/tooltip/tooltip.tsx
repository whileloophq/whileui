import * as React from 'react';
import { Platform, StyleSheet, Text, type ViewStyle } from 'react-native';
import * as TooltipPrimitive from '@rn-primitives/tooltip';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface TooltipProps {
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
  children: React.ReactNode;
}

export interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
> {
  className?: string;
}

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {
  className?: string;
  portalHost?: string;
}

function Tooltip({
  onOpenChange,
  delayDuration,
  skipDelayDuration,
  disableHoverableContent,
  children,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </TooltipPrimitive.Root>
  );
}

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Trigger ref={ref} className={cn(className)} {...props} />
));
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, portalHost, children, style, ...props }, ref) => {
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const resolvedStyle = StyleSheet.flatten([
    Platform.OS === 'web' ? undefined : contentStyles,
    {
      borderRadius: surfaceRadius(visual, 'md'),
      borderWidth: visual.borderWidthHairline,
      borderColor: colors.border,
      paddingHorizontal: visual.controlPaddingXSm,
      paddingVertical: visual.controlPaddingYSm,
    },
    shadowStyle(visual, colors, 'md'),
    style,
  ]) as ViewStyle;

  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <TooltipPrimitive.Overlay style={Platform.OS !== 'web' ? StyleSheet.absoluteFill : undefined}>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'z-50 overflow-hidden bg-primary',
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className
          )}
          style={resolvedStyle}
          {...props}
        >
          {typeof children === 'string' ? (
            <Text className="text-primary-foreground" style={typographyStyle(visual, 'caption')}>
              {children}
            </Text>
          ) : (
            children
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Overlay>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = 'TooltipContent';

const contentStyles: ViewStyle = {
  position: 'absolute',
};

export { Tooltip, TooltipTrigger, TooltipContent };
