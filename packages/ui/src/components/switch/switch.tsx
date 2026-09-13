import { useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface SwitchProps extends Omit<ViewProps, 'children'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const interactiveStyle = withInteractivePressableStyle(undefined, interaction, {
    disabled,
    pressedVariant: 'default',
  });
  const trackHeight = Math.max(24, Math.round(visual.controlHeightSm * 0.9));
  const trackWidth = Math.round(trackHeight * 1.45);
  const inset = Math.max(2, Math.round(trackHeight * 0.08));
  const thumbSize = trackHeight - inset * 2 - 2;
  const thumbOffset = Math.max(0, trackWidth - thumbSize - inset * 2 - 2);

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
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled }}
      aria-checked={isChecked}
    >
      <View
        className={cn(
          'flex-row items-center justify-start',
          isChecked ? 'border-primary bg-primary' : 'border-input bg-muted',
          focusRing,
          className
        )}
        style={{
          width: trackWidth,
          height: trackHeight,
          borderWidth: visual.borderWidthEmphasis,
          borderRadius: trackHeight / 2,
          padding: inset,
        }}
        {...props}
      >
        <View
          className="border-border bg-background shadow-sm"
          style={{
            width: thumbSize,
            height: thumbSize,
            borderWidth: visual.borderWidthEmphasis,
            borderRadius: thumbSize / 2,
            transform: [{ translateX: isChecked ? thumbOffset : 0 }],
          }}
        />
      </View>
    </Pressable>
  );
}

Switch.displayName = 'Switch';

export { Switch };
