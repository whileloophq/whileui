import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, type TextProps, type ViewProps } from 'react-native';
import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import { cn } from '../../lib/cn';
import { tv } from '../../lib/tv';
import { Pressable, type PressableProps } from '../pressable';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, typographyStyle, type TypographyRole } from '../../lib/recipes';

type ToggleGroupType = 'single' | 'multiple';

interface ToggleGroupContextValue {
  type: ToggleGroupType;
  value: string[];
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  type: 'single',
  value: [],
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
  // Label size: a small control is shorter, not harder to read. Caption text (11px in
  // most presets) made the action look like a footnote.
  sm: 'label',
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
  style,
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
    (next: string[]) => {
      setInternalValue(next);
      onValueChange?.(type === 'single' ? next[0] || '' : next);
    },
    [type, onValueChange]
  );

  const contextValue = useMemo(
    () => ({ type, value, variant, size }),
    [size, type, value, variant]
  );

  // One Tab stop, arrow keys between items: `@rn-primitives/toggle-group` (Radix on web).
  const selection =
    type === 'single'
      ? {
          type: 'single' as const,
          value: value[0],
          onValueChange: (next: string | undefined) => handleValueChange(next ? [next] : []),
        }
      : { type: 'multiple' as const, value, onValueChange: handleValueChange };

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <ToggleGroupPrimitive.Root
        {...selection}
        // One choice is a radio group; several are a group of toggles. Radix calls both a
        // `group`, which leaves single-choice radios without the group a radio belongs to.
        // Add `flex-wrap` to `className` for chips that wrap.
        role={type === 'single' ? 'radiogroup' : 'group'}
        className={cn('flex flex-row items-center gap-1', className)}
        // Flattened: on web the primitive's Radix root spreads this into an object, and a style
        // array became numeric keys the browser rejects.
        style={StyleSheet.flatten(style)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
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
  const { type, value, variant, size } = useContext(ToggleGroupContext);
  const pressed = value.includes(itemValue);
  const visual = useVisualTokens();
  const contextValue = useMemo(() => ({ pressed, size }), [pressed, size]);

  const tokenStyle = {
    ...controlRecipe(visual, size ?? 'default'),
    ...(variant === 'outline' ? { borderWidth: visual.borderWidthControl } : null),
  };

  return (
    <ToggleGroupItemContext.Provider value={contextValue}>
      <ToggleGroupPrimitive.Item value={itemValue} disabled={props.disabled ?? undefined} asChild>
        <Pressable
          className={cn(toggleGroupItemVariants({ variant, size, pressed }), className)}
          style={(state) => [
            tokenStyle,
            typeof styleProp === 'function' ? styleProp(state) : styleProp,
          ]}
          feedback="default"
          // One choice is a radio, checked. The primitive's web item says `button`, so the
          // role is set here, where it wins. Several are toggles: a pressed button on web,
          // a checked checkbox on native, both from the primitive.
          {...(type === 'single' ? { role: 'radio' as const, 'aria-checked': pressed } : null)}
          {...props}
        >
          {children}
        </Pressable>
      </ToggleGroupPrimitive.Item>
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
