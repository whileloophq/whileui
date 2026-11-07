import React from 'react';
import { Text as RNText, type TextInstance, type TextProps as RNTextProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useResolveFontFamily } from '../../lib/font-context';
import { useTypography, type TypographyRole } from '../../lib/recipes';
import type { ForwardRefComponent } from '../../lib/ref-types';

const textVariants = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      default: 'font-normal',
      heading: 'font-bold tracking-tight',
      title: 'font-semibold',
      subtitle: 'font-medium',
      body: 'font-normal',
      caption: 'text-muted-foreground font-normal',
      label: 'font-medium leading-tight',
      code: 'font-mono bg-muted rounded px-1 py-0.5',
    },
    size: {
      xs: '',
      sm: '',
      base: '',
      lg: '',
      xl: '',
      '2xl': '',
      '3xl': '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {}

const VARIANT_ROLES: Record<NonNullable<TextProps['variant']>, TypographyRole> = {
  default: 'body',
  heading: 'headline',
  title: 'title',
  subtitle: 'emphasis',
  body: 'body',
  caption: 'caption',
  label: 'label',
  code: 'label',
};

const SIZE_ROLES: Record<NonNullable<TextProps['size']>, TypographyRole> = {
  xs: 'caption',
  sm: 'label',
  base: 'body',
  lg: 'emphasis',
  xl: 'title',
  '2xl': 'headline',
  '3xl': 'headline',
};

const Text: ForwardRefComponent<TextInstance, TextProps> = React.forwardRef(
  ({ className, variant, size, style, accessibilityRole, ...props }, ref) => {
    const effectiveVariant = variant ?? 'default';
    const resolved = cn(textVariants({ variant: effectiveVariant, size }), className);
    const font = useResolveFontFamily(resolved);
    const semanticStyle = useTypography(size ? SIZE_ROLES[size] : VARIANT_ROLES[effectiveVariant]);

    return (
      <RNText
        ref={ref}
        className={font ? font.className : resolved}
        accessibilityRole={
          accessibilityRole ?? (effectiveVariant === 'heading' ? 'header' : undefined)
        }
        style={[variant || size ? semanticStyle : undefined, font?.style, style]}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
