import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import { cn } from '../../lib/cn';
import { tv } from '../../lib/tv';
import { Pressable, type PressableProps } from '../pressable';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

const segmentedControlVariants = tv({
  base: 'w-full flex-row items-center',
  variants: {
    variant: {
      default: '',
      pill: '',
    },
    wrap: {
      true: 'flex-wrap justify-center gap-1',
      false: 'flex-nowrap gap-1',
    },
    /** Sized to its segments inside a horizontal scroll view. */
    scroll: {
      true: 'w-auto',
      false: '',
    },
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    wrap: true,
    scroll: false,
    size: 'default',
  },
});

const segmentedControlItemVariants = tv({
  base: 'min-w-0 flex-row items-center justify-center',
  variants: {
    variant: {
      default: '',
      pill: '',
    },
    selected: {
      true: '',
      false: '',
    },
    size: {
      default: '',
      compact: '',
    },
    disabled: {
      true: '',
      false: '',
    },
    wrap: {
      true: 'grow-0',
      false: 'flex-1',
    },
    /** As wide as its label, so segments overflow into the scroll view rather than shrink. */
    scroll: {
      true: 'flex-none',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    selected: false,
    size: 'default',
    disabled: false,
    wrap: true,
    scroll: false,
  },
});

const segmentedControlItemTextVariants = tv({
  base: 'font-medium',
  variants: {
    selected: {
      true: 'text-foreground',
      false: 'text-muted-foreground',
    },
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    selected: false,
    size: 'default',
  },
});

function getSegmentedContainerStyle(
  visual: ReturnType<typeof useVisualTokens>,
  colors: ReturnType<typeof useThemeColors>,
  variant: 'default' | 'pill'
) {
  const inset = Math.max(4, Math.round(visual.controlPaddingYSm * 0.5));
  return {
    borderRadius: variant === 'pill' ? 999 : visual.radiusXl,
    backgroundColor: colors.muted,
    padding: inset,
  };
}

function getSegmentedItemStyle(
  visual: ReturnType<typeof useVisualTokens>,
  colors: ReturnType<typeof useThemeColors>,
  size: 'default' | 'compact',
  variant: 'default' | 'pill',
  selected: boolean
) {
  const compact = size === 'compact';
  return {
    minHeight: compact ? visual.controlHeightSm : visual.controlHeightDefault,
    borderRadius: variant === 'pill' ? 999 : visual.radiusLg,
    paddingHorizontal: compact ? visual.controlPaddingXSm : visual.controlPaddingXDefault,
    paddingVertical: compact ? visual.controlPaddingYSm : visual.controlPaddingYDefault,
    borderWidth: selected ? visual.borderWidthHairline : 0,
    borderColor: selected ? colors.surfaceBorder : 'transparent',
    backgroundColor: selected ? colors.surfaceElevated : 'transparent',
  };
}

interface SegmentedControlContextValue {
  value: string;
  variant: 'default' | 'pill';
  size: 'default' | 'compact';
  wrap: boolean;
  scroll: boolean;
  disabled: boolean;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>({
  value: '',
  variant: 'default',
  size: 'default',
  wrap: true,
  scroll: false,
  disabled: false,
});

interface SegmentedControlItemContextValue {
  selected: boolean;
  size: 'default' | 'compact';
}

const SegmentedControlItemContext = createContext<SegmentedControlItemContextValue>({
  selected: false,
  size: 'default',
});

export interface SegmentedControlProps extends ViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Pill = rounded-full items. */
  variant?: 'default' | 'pill';
  /**
   * `true` wraps segments onto more rows; `false` keeps one row and shares its width.
   * `'scroll'` keeps one row with each segment as wide as its label and scrolls
   * sideways when they do not fit — for labels a phone cannot show in full.
   * `'auto'` wraps above three segments.
   * @default 'auto'
   */
  wrap?: boolean | 'auto' | 'scroll';
  size?: 'default' | 'compact';
  disabled?: boolean;
  className?: string;
}

export interface SegmentedControlItemProps extends Omit<PressableProps, 'children'> {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export interface SegmentedControlItemTextProps extends TextProps {
  className?: string;
}

function SegmentedControl({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  variant = 'default',
  wrap = 'auto',
  size = 'default',
  disabled = false,
  className,
  children,
  style: styleProp,
  ...props
}: SegmentedControlProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const itemCount = useMemo(
    () => React.Children.toArray(children).filter((child) => React.isValidElement(child)).length,
    [children]
  );
  const scroll = wrap === 'scroll';
  const shouldWrap = wrap === 'auto' ? itemCount > 3 : wrap === true;

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (disabled || value === nextValue) {
        return;
      }
      setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [disabled, onValueChange, value]
  );

  const contextValue = useMemo(
    () => ({
      value,
      variant,
      size,
      wrap: shouldWrap,
      scroll,
      disabled,
    }),
    [disabled, scroll, shouldWrap, size, value, variant]
  );

  // One Tab stop, with the arrow keys moving the selection: the radio group pattern,
  // from `@rn-primitives/radio-group` (Radix on web).
  const group = (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      className={cn(
        segmentedControlVariants({ variant, wrap: shouldWrap, scroll, size }),
        className
      )}
      // Flattened: on web the primitive's Radix root spreads this into an object, and a style
      // array became numeric keys the browser rejects.
      style={StyleSheet.flatten([getSegmentedContainerStyle(visual, colors, variant), styleProp])}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {group}
        </ScrollView>
      ) : (
        group
      )}
    </SegmentedControlContext.Provider>
  );
}

function SegmentedControlItem({
  value: itemValue,
  className,
  children,
  disabled: itemDisabled,
  style: styleProp,
  ...props
}: SegmentedControlItemProps) {
  const { value, variant, size, wrap, scroll, disabled } = useContext(SegmentedControlContext);
  const selected = value === itemValue;
  const finalDisabled = disabled || Boolean(itemDisabled);
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const wrapBasisStyle: ViewStyle | undefined = wrap
    ? { flexBasis: `${visual.segmentedWrapBasisRatio * 100}%` }
    : undefined;
  const tokenStyle = getSegmentedItemStyle(visual, colors, size, variant, selected);
  const contextValue = useMemo(() => ({ selected, size }), [selected, size]);

  return (
    <SegmentedControlItemContext.Provider value={contextValue}>
      <RadioGroupPrimitive.Item value={itemValue} disabled={finalDisabled} asChild>
        <Pressable
          className={cn(
            segmentedControlItemVariants({
              variant,
              selected,
              size,
              disabled: finalDisabled,
              wrap,
              scroll,
            }),
            className
          )}
          focusIndicator="inset"
          feedback="default"
          disabled={finalDisabled}
          style={(state) => [
            typeof styleProp === 'function' ? styleProp(state) : styleProp,
            tokenStyle,
            wrapBasisStyle ?? null,
          ]}
          hitSlop={4}
          {...props}
        >
          {typeof children === 'string' ? (
            <SegmentedControlItemText>{children}</SegmentedControlItemText>
          ) : (
            children
          )}
        </Pressable>
      </RadioGroupPrimitive.Item>
    </SegmentedControlItemContext.Provider>
  );
}

function SegmentedControlItemText({ className, style, ...props }: SegmentedControlItemTextProps) {
  const { selected, size } = useContext(SegmentedControlItemContext);
  const visual = useVisualTokens();
  const typography = typographyStyle(visual, size === 'compact' ? 'caption' : 'label');

  return (
    <Text
      className={cn(segmentedControlItemTextVariants({ selected, size }), className)}
      style={[typography, style]}
      numberOfLines={1}
      {...props}
    />
  );
}

SegmentedControl.displayName = 'SegmentedControl';
SegmentedControlItem.displayName = 'SegmentedControlItem';
SegmentedControlItemText.displayName = 'SegmentedControlItemText';

export {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlItemText,
  segmentedControlVariants,
  segmentedControlItemVariants,
  segmentedControlItemTextVariants,
};
