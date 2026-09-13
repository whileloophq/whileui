import { useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface CheckboxProps extends Omit<ViewProps, 'children'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const interactiveStyle = withInteractivePressableStyle(undefined, interaction, {
    disabled,
    pressedVariant: 'default',
  });
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const checkSize = Math.max(8, Math.round(size * 0.5));

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setInternalChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      style={interactiveStyle}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      // React Native Web no longer derives `aria-checked` from `accessibilityState`, and
      // ARIA requires it on this role — without it a screen reader cannot tell checked
      // from unchecked. React Native maps the `aria-` form on native, so both are correct.
      aria-checked={isChecked}
    >
      <View
        className={cn(
          'items-center justify-center',
          isChecked ? 'border-primary bg-primary' : 'border-border bg-muted',
          focusRing,
          className
        )}
        style={{
          width: size,
          height: size,
          borderWidth: visual.borderWidthControl,
          borderRadius: Math.max(6, Math.round(visual.radiusSm * 0.7)),
        }}
        {...props}
      >
        {isChecked && (
          <View
            className="bg-primary-foreground"
            style={{
              width: checkSize,
              height: checkSize,
              borderRadius: Math.max(3, Math.round(visual.radiusSm * 0.35)),
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

Checkbox.displayName = 'Checkbox';

export { Checkbox };
