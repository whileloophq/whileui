import React from 'react';
import { View, type PressableInstance, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../pressable';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { shadowStyle } from '../../lib/recipes';
import { useThemeColors } from '../../lib/theme-colors';
import type { ForwardRefComponent } from '../../lib/ref-types';

const fabVariants = tv({
  base: 'items-center justify-center rounded-full',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      surface: 'border border-border bg-card',
    },
    size: {
      // 56 and 40 are Material's FAB and small-FAB sizes. Both clear the iOS 44pt
      // and Android 48dp minimums on their own, so a FAB never needs hitSlop.
      default: 'h-14 w-14',
      sm: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
    placement: {
      /** Positioned by the caller — inside a toolbar, a row, anywhere. */
      inline: '',
      /** Floating over the nearest positioned ancestor, bottom-right. */
      floating: 'absolute bottom-6 right-6',
      'floating-left': 'absolute bottom-6 left-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    placement: 'floating',
  },
});

export interface FabProps
  extends Omit<PressableProps, 'children'>,
    VariantProps<typeof fabVariants> {
  /**
   * What the action does, for screen readers. Required: a FAB is an icon with no
   * text, so without this it announces as an unlabelled button.
   */
  label: string;
  /** The glyph. Icon libraries need a concrete colour, so read it from `useIconColors`. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * A floating action button: one primary action, raised above the content.
 *
 * It owns no icon dependency. `@expo/vector-icons` and friends need hex colours
 * rather than classes, so the caller passes the glyph and colours it from
 * `useIconColors()` or `useThemeColors()`.
 */
const FAB: ForwardRefComponent<PressableInstance, FabProps> = React.forwardRef(
  ({ className, variant, size, placement, label, children, style, ...props }, ref) => {
    const visual = useVisualTokens();
    const colors = useThemeColors();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={cn(fabVariants({ variant, size, placement }), className)}
        style={(state) => [
          shadowStyle(visual, colors, 'lg'),
          typeof style === 'function' ? style(state) : style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);

FAB.displayName = 'FAB';

export interface FabGroupProps extends ViewProps {
  className?: string;
}

/** Stacks secondary actions above a FAB, bottom-aligned. */
const FABGroup: ForwardRefComponent<React.ComponentRef<typeof View>, FabGroupProps> =
  React.forwardRef(({ className, ...props }, ref) => (
    <View ref={ref} className={cn('absolute bottom-6 right-6 items-end gap-3', className)} {...props} />
  ));

FABGroup.displayName = 'FABGroup';

export { FAB, FABGroup, fabVariants };
