import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { ControlLabel } from '../checkbox/control-label';
import { Pressable, type PressableProps } from '../pressable';

const RadioGroupValueContext = createContext<string | undefined>(undefined);

export interface RadioGroupProps extends ViewProps {
  /** Initial selection when uncontrolled. */
  defaultValue?: string;
  /** Controlled selection. Leave unset to let the group hold its own. */
  value?: string;
  /** Called with the newly selected item's value. */
  onValueChange?: (value: string) => void;
  /** Disable every item. */
  disabled?: boolean;
  className?: string;
}

export interface RadioGroupItemProps extends Omit<PressableProps, 'children'> {
  /** The value this item selects. */
  value: string;
  /**
   * Text beside the circle. The row becomes one radio named by it, so do not put a
   * separate `Label` next to a labelled item.
   */
  label?: string;
  /** Secondary text under `label`. Ignored without a `label`. */
  description?: string;
  className?: string;
}

/**
 * A set of radios that is one Tab stop on web: the arrow keys move the selection, as
 * the WAI-ARIA radio group pattern asks. Behaviour comes from `@rn-primitives/radio-group`
 * (Radix on web); WhileUI draws it.
 */
function RadioGroup({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  disabled,
  className,
  style,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = useCallback(
    (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange]
  );

  return (
    <RadioGroupValueContext.Provider value={value}>
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={cn('gap-2', className)}
        // Flattened: on web the primitive's Radix root spreads this into an object, and a style
        // array became numeric keys the browser rejects.
        style={StyleSheet.flatten(style)}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioGroupValueContext.Provider>
  );
}

function RadioGroupItem({
  value: itemValue,
  label,
  description,
  disabled,
  className,
  ...props
}: RadioGroupItemProps) {
  const selected = useContext(RadioGroupValueContext) === itemValue;
  const visual = useVisualTokens();
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const dotSize = Math.max(8, Math.round(size * 0.5));
  const circleStyle = useMemo(
    () => ({
      width: size,
      height: size,
      borderWidth: visual.borderWidthEmphasis,
      borderRadius: size / 2,
    }),
    [size, visual.borderWidthEmphasis]
  );

  return (
    <RadioGroupPrimitive.Item value={itemValue} disabled={disabled} asChild>
      <Pressable
        disabled={disabled}
        feedback="default"
        className={cn(
          label ? 'flex-row items-start gap-3' : 'items-center justify-center',
          className
        )}
        style={{ borderRadius: label ? visual.radiusSm : size / 2 }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        {...props}
      >
        <View
          className={cn(
            'items-center justify-center',
            selected ? 'border-primary' : 'border-border'
          )}
          style={circleStyle}
        >
          {selected && (
            <View
              className="bg-primary"
              style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2 }}
            />
          )}
        </View>
        {label ? <ControlLabel label={label} description={description} /> : null}
      </Pressable>
    </RadioGroupPrimitive.Item>
  );
}

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
