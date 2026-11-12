import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useVisualTokens } from '../../lib/visual-tokens';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  value: '',
  onValueChange: () => {},
});

export interface RadioGroupProps extends ViewProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export interface RadioGroupItemProps extends PressableProps {
  value: string;
  className?: string;
}

function RadioGroup({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );
  const contextValue = useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [handleValueChange, value]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <View className={cn('gap-2', className)} {...props}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

/** The smallest target WCAG 2.5.8 accepts, and the one web gets, since it ignores hitSlop. */
const MIN_TARGET = 24;

function RadioGroupItem({ value: itemValue, className, ...props }: RadioGroupItemProps) {
  const { value, onValueChange } = useContext(RadioGroupContext);
  const visual = useVisualTokens();
  const isSelected = value === itemValue;
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const dotSize = Math.max(8, Math.round(size * 0.5));

  return (
    // The pressable is a 24px target (WCAG 2.5.8) with the circle drawn inside it:
    // `hitSlop` enlarges the target on native only, so web was left with the 20px circle.
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      aria-checked={isSelected}
      className={cn('items-center justify-center', focusRing, className)}
      style={{ minWidth: MIN_TARGET, minHeight: MIN_TARGET, borderRadius: MIN_TARGET / 2 }}
      onPress={() => onValueChange(itemValue)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...props}
    >
      <View
        className={cn(
          'items-center justify-center',
          isSelected ? 'border-primary' : 'border-border'
        )}
        style={{
          width: size,
          height: size,
          borderWidth: visual.borderWidthEmphasis,
          borderRadius: size / 2,
        }}
      >
        {isSelected && (
          <View
            className="bg-primary"
            style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2 }}
          />
        )}
      </View>
    </Pressable>
  );
}

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
