import React from 'react';
import {
  View,
  type StyleProp,
  type ViewInstance,
  type ViewProps,
  type ViewStyle,
  type TextInstance,
  type TextProps,
} from 'react-native';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfacePadding, typographyStyle, type ShadowTier } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

const cardVariants = tv({
  base: 'border border-border bg-card',
  variants: {
    padding: {
      none: '',
      sm: '',
      default: '',
      lg: '',
    },
    unstyled: {
      true: 'rounded-none border-0 bg-transparent shadow-none',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'default',
    unstyled: false,
  },
});

export interface CardProps
  extends ViewProps, VariantProps<typeof cardVariants>, FrostedSurfaceProps {
  /** Elevation tier; 'sm' by default, 'none' for flat cards. */
  shadow?: ShadowTier;
}

const Card: ForwardRefComponent<ViewInstance, CardProps> = React.forwardRef(
  (
    {
      className,
      padding,
      unstyled,
      shadow = 'sm',
      frosted = false,
      blurIntensity,
      blurTintToken,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const visual = useVisualTokens();
    const colors = useThemeColors();
    const frostedSurface = useFrostedSurface({
      frosted,
      blurIntensity,
      blurTintToken,
      defaultTintToken: 'card',
      defaultBlurPreset: 'subtle',
    });
    const effectivePadding = surfacePadding(visual, padding ?? 'default');
    const cardStyle: StyleProp<ViewStyle> = [
      {
        borderRadius: unstyled ? 0 : visual.radiusXl,
        padding: unstyled ? 0 : effectivePadding,
        borderWidth: unstyled ? 0 : visual.borderWidthHairline,
      },
      unstyled ? null : shadowStyle(visual, colors, shadow),
      frostedSurface.surfaceStyle,
      style,
    ];

    return (
      <View
        ref={ref}
        className={cn(
          cardVariants({ padding, unstyled }),
          frosted && 'relative overflow-hidden bg-transparent',
          className
        )}
        style={cardStyle}
        {...props}
      >
        {frostedSurface.overlay}
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends ViewProps {}

const CardHeader: ForwardRefComponent<ViewInstance, CardHeaderProps> = React.forwardRef(
  ({ className, ...props }, ref) => {
    return <View ref={ref} className={cn('pb-3', className)} {...props} />;
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends TextProps {}

const CardTitle: ForwardRefComponent<TextInstance, CardTitleProps> = React.forwardRef(
  ({ className, style, ...props }, ref) => {
    const visual = useVisualTokens();
    return (
      <Text
        ref={ref}
        className={cn('font-semibold text-card-foreground tracking-tight', className)}
        style={[typographyStyle(visual, 'title'), style]}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends TextProps {}

const CardDescription: ForwardRefComponent<TextInstance, CardDescriptionProps> = React.forwardRef(
  ({ className, style, ...props }, ref) => {
    const visual = useVisualTokens();
    return (
      <Text
        ref={ref}
        className={cn('text-muted-foreground', className)}
        style={[typographyStyle(visual, 'label'), style]}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends ViewProps {}

const CardContent: ForwardRefComponent<ViewInstance, CardContentProps> = React.forwardRef(
  ({ className, ...props }, ref) => {
    return <View ref={ref} className={cn('pb-3', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends ViewProps {}

const CardFooter: ForwardRefComponent<ViewInstance, CardFooterProps> = React.forwardRef(
  ({ className, ...props }, ref) => {
    return <View ref={ref} className={cn('flex-row items-center pt-1', className)} {...props} />;
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
