import React, { createContext, useContext } from 'react';
import { View, type PressableInstance, type ViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';
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
      // 56, 48 and 64pt, as FAB_SIZE below. 56 is Material's FAB size; all three clear
      // the iOS 44pt and Android 48dp minimums on their own, so a FAB never needs hitSlop.
      default: 'h-14 w-14',
      sm: 'h-12 w-12',
      lg: 'h-16 w-16',
    },
    // The position is a style (`floatingStyle`), so it can add the safe-area insets.
    placement: {
      /** Positioned by the caller — inside a toolbar, a row, anywhere. */
      inline: '',
      /** Floating over the nearest positioned ancestor, bottom-right. */
      floating: '',
      'floating-left': '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    placement: 'floating',
  },
});

/** The `size` classes in points, and the floating inset from the edges. */
const FAB_SIZE = { default: 56, sm: 48, lg: 64 } as const;
const FAB_EDGE_INSET = 24;
const FAB_CONTENT_GAP = 16;
const NO_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

/**
 * Bottom padding that keeps a floating FAB off the last row of a scrolling screen: its
 * inset from the edge, its height and a gap. Nothing stops the FAB covering content, so a
 * list under one ends with `contentContainerStyle={{ paddingBottom: fabClearance() }}`.
 * For a `safeArea` FAB, pass the bottom inset it is lifted by.
 */
export function fabClearance(size: keyof typeof FAB_SIZE = 'default', bottomInset = 0) {
  return FAB_EDGE_INSET + FAB_SIZE[size] + FAB_CONTENT_GAP + bottomInset;
}

function floatingStyle(side: 'left' | 'right', insets: EdgeInsets): ViewStyle {
  return {
    position: 'absolute',
    bottom: FAB_EDGE_INSET + insets.bottom,
    [side]: FAB_EDGE_INSET + insets[side],
  };
}

/** A FAB inside a `FABGroup` is laid out by the group, not floated a second time. */
const FabGroupContext = createContext(false);

export interface FabProps
  extends Omit<PressableProps, 'children'>, VariantProps<typeof fabVariants> {
  /**
   * What the action does, for screen readers. Required: a FAB is an icon with no
   * text, so without this it announces as an unlabelled button.
   */
  label: string;
  /** The glyph. Icon libraries need a concrete colour, so read it from `useIconColors`. */
  children?: React.ReactNode;
  /**
   * Add the safe-area insets to the floating position, for a FAB over a full-screen view;
   * without them it sits in the home indicator and the curved corner. Leave it off above
   * a tab bar: the tab bar already clears the inset, though the screen still reports it.
   * @default false
   */
  safeArea?: boolean;
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
  (
    {
      className,
      variant,
      size,
      placement = 'floating',
      label,
      children,
      style,
      safeArea,
      ...props
    },
    ref
  ) => {
    const visual = useVisualTokens();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const grouped = useContext(FabGroupContext);
    const where = grouped ? 'inline' : placement;
    const position =
      where === 'inline'
        ? null
        : floatingStyle(
            where === 'floating-left' ? 'left' : 'right',
            safeArea ? insets : NO_INSETS
          );

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={cn(fabVariants({ variant, size, placement: where }), className)}
        style={(state) => [
          position,
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
  /** As on `FAB`: add the safe-area insets, for a full-screen view. @default false */
  safeArea?: boolean;
  className?: string;
}

/**
 * Stacks secondary actions above a FAB, bottom-right. The group floats; the FABs inside
 * it are laid out in its column whatever their `placement`.
 */
const FABGroup: ForwardRefComponent<
  React.ComponentRef<typeof View>,
  FabGroupProps
> = React.forwardRef(({ className, style, safeArea, ...props }, ref) => {
  const insets = useSafeAreaInsets();
  return (
    <FabGroupContext.Provider value>
      <View
        ref={ref}
        className={cn('items-end gap-3', className)}
        style={[floatingStyle('right', safeArea ? insets : NO_INSETS), style]}
        {...props}
      />
    </FabGroupContext.Provider>
  );
});

FABGroup.displayName = 'FABGroup';

export { FAB, FABGroup, fabVariants };
