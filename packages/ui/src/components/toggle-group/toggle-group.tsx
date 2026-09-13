import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  View,
  Pressable,
  Text,
  type ViewProps,
  type PressableProps,
  type TextProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { tv } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle, type TypographyRole } from '../../lib/recipes';

type ToggleGroupType = 'single' | 'multiple';

interface ToggleGroupContextValue {
  type: ToggleGroupType;
  value: string[];
  onValueChange: (itemValue: string) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  type: 'single',
  value: [],
  onValueChange: () => {},
});

interface ToggleGroupItemContextValue {
  pressed: boolean;
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroupItemContext = createContext<ToggleGroupItemContextValue>({
  pressed: false,
  size: 'default',
});

const toggleGroupItemVariants = tv({
  base: 'inline-flex items-center justify-center',
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border border-input bg-transparent',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
    },
    pressed: {
      true: 'bg-accent',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    pressed: false,
  },
});

const TOGGLE_GROUP_TEXT_ROLE: Record<string, TypographyRole> = {
  default: 'label',
  sm: 'caption',
  lg: 'body',
};

const toggleGroupItemTextVariants = tv({
  base: 'font-medium',
  variants: {
    pressed: {
      true: 'text-accent-foreground',
      false: 'text-muted-foreground',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    pressed: false,
    size: 'default',
  },
});

export interface ToggleGroupProps extends ViewProps {
  type?: ToggleGroupType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export interface ToggleGroupItemProps extends Omit<PressableProps, 'children'> {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export interface ToggleGroupItemTextProps extends TextProps {
  className?: string;
}

function ToggleGroup({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
  size = 'default',
  className,
  children,
  ...props
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const value = useMemo(
    () =>
      controlledValue
        ? Array.isArray(controlledValue)
          ? controlledValue
          : [controlledValue]
        : internalValue,
    [controlledValue, internalValue]
  );

  const handleValueChange = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (type === 'single') {
        next = value.includes(itemValue) ? [] : [itemValue];
      } else {
        next = value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue];
      }
      setInternalValue(next);
      onValueChange?.(type === 'single' ? next[0] || '' : next);
    },
    [type, value, onValueChange]
  );

  const contextValue = useMemo(
    () => ({ type, value, onValueChange: handleValueChange, variant, size }),
    [handleValueChange, size, type, value, variant]
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <View className={cn('flex flex-row items-center gap-1', className)} {...props}>
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  value: itemValue,
  className,
  children,
  style: styleProp,
  ...props
}: ToggleGroupItemProps) {
  const { value, onValueChange, variant, size } = useContext(ToggleGroupContext);
  const pressed = value.includes(itemValue);
  const visual = useVisualTokens();
  const contextValue = useMemo(() => ({ pressed, size }), [pressed, size]);

  const tokenStyle = {
    ...controlRecipe(visual, size ?? 'default'),
    ...(variant === 'outline' ? { borderWidth: visual.borderWidthControl } : null),
  };

  return (
    <ToggleGroupItemContext.Provider value={contextValue}>
      <Pressable
        className={cn(toggleGroupItemVariants({ variant, size, pressed }), focusRing, className)}
        style={(state) => [
          tokenStyle,
          typeof styleProp === 'function' ? styleProp(state) : styleProp,
        ]}
        onPress={() => onValueChange(itemValue)}
        accessibilityRole="button"
        accessibilityState={{ selected: pressed }}
        {...props}
      >
        {children}
      </Pressable>
    </ToggleGroupItemContext.Provider>
  );
}

function ToggleGroupItemText({ className, style, ...props }: ToggleGroupItemTextProps) {
  const { pressed, size } = useContext(ToggleGroupItemContext);
  const visual = useVisualTokens();
  const typography = typographyStyle(visual, TOGGLE_GROUP_TEXT_ROLE[size ?? 'default'] ?? 'label');
  return (
    <Text
      className={cn(toggleGroupItemTextVariants({ pressed, size }), className)}
      style={[typography, style]}
      {...props}
    />
  );
}

ToggleGroup.displayName = 'ToggleGroup';
ToggleGroupItem.displayName = 'ToggleGroupItem';
ToggleGroupItemText.displayName = 'ToggleGroupItemText';

export {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupItemText,
  toggleGroupItemVariants,
  toggleGroupItemTextVariants,
};
