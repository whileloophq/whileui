import { createContext, useContext, useMemo } from 'react';
import { View, type ViewProps, type TextProps } from 'react-native';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

interface BadgeContextValue {
  variant: VariantProps<typeof badgeVariants>['variant'];
}

const BadgeContext = createContext<BadgeContextValue>({
  variant: 'default',
});

const badgeVariants = tv({
  base: 'inline-flex items-center',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      outline: 'border-border bg-transparent',
      success: 'bg-success',
      warning: 'bg-warning',
      info: 'bg-info',
      soft: 'bg-primary-soft',
      'soft-secondary': 'bg-secondary-soft',
      'soft-destructive': 'bg-destructive-soft',
      'soft-success': 'bg-success-soft',
      'soft-warning': 'bg-warning-soft',
      'soft-info': 'bg-info-soft',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = tv({
  base: 'font-semibold',
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      success: 'text-success-foreground',
      warning: 'text-warning-foreground',
      info: 'text-info-foreground',
      soft: 'text-primary',
      'soft-secondary': 'text-secondary-foreground',
      'soft-destructive': 'text-destructive',
      'soft-success': 'text-success',
      'soft-warning': 'text-warning',
      'soft-info': 'text-info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {}

export interface BadgeTextProps extends TextProps, VariantProps<typeof badgeTextVariants> {}

function Badge({ className, variant = 'default', children, style, ...props }: BadgeProps) {
  const visual = useVisualTokens();
  const contextValue = useMemo(() => ({ variant }), [variant]);
  return (
    <BadgeContext.Provider value={contextValue}>
      <View
        className={cn(badgeVariants({ variant }), className)}
        style={[
          {
            borderRadius: visual.badgeRadius,
            paddingHorizontal: visual.badgePaddingX,
            paddingVertical: visual.badgePaddingY,
            ...(variant === 'outline' ? { borderWidth: visual.borderWidthHairline } : null),
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </BadgeContext.Provider>
  );
}

function BadgeText({ className, variant: variantProp, style, ...props }: BadgeTextProps) {
  const context = useContext(BadgeContext);
  const visual = useVisualTokens();
  const variant = variantProp ?? context.variant;

  return (
    <Text
      className={cn(badgeTextVariants({ variant }), className)}
      style={[typographyStyle(visual, 'caption'), style]}
      {...props}
    />
  );
}

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';

export { Badge, BadgeText, badgeVariants, badgeTextVariants };
