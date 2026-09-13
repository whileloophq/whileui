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

function RadioGroupItem({ value: itemValue, className, ...props }: RadioGroupItemProps) {
  const { value, onValueChange } = useContext(RadioGroupContext);
  const visual = useVisualTokens();
  const isSelected = value === itemValue;
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const dotSize = Math.max(8, Math.round(size * 0.5));

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      aria-checked={isSelected}
      className={cn(
        'items-center justify-center',
        isSelected ? 'border-primary' : 'border-border',
        focusRing,
        className
      )}
      style={{
        width: size,
        height: size,
        borderWidth: visual.borderWidthEmphasis,
        borderRadius: size / 2,
      }}
      onPress={() => onValueChange(itemValue)}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      {...props}
    >
      {isSelected && (
        <View
          className="bg-primary"
          style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2 }}
        />
      )}
    </Pressable>
  );
}

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
