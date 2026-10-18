import React from 'react';
import { Text as RNText, type TextInstance, type TextProps as RNTextProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useResolveFontFamily } from '../../lib/font-context';
import type { ForwardRefComponent } from '../../lib/ref-types';

const textVariants = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      default: 'font-normal',
      heading: 'text-2xl font-bold tracking-tight',
      title: 'text-xl font-semibold',
      subtitle: 'text-lg font-medium',
      body: 'text-base font-normal',
      caption: 'text-sm text-muted-foreground font-normal',
      label: 'text-sm font-medium leading-tight',
      code: 'font-mono text-sm bg-muted rounded px-1 py-0.5',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {}

const Text: ForwardRefComponent<TextInstance, TextProps> = React.forwardRef(
  ({ className, variant, size, style, ...props }, ref) => {
    const resolved = cn(textVariants({ variant, size }), className);
    const font = useResolveFontFamily(resolved);

    return (
      <RNText
        ref={ref}
        className={font ? font.className : resolved}
        style={font ? [font.style, style] : style}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text, textVariants };
