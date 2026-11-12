import { useState } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { Pressable } from '../pressable';
import { ControlLabel } from '../checkbox/control-label';

export interface SwitchProps extends Omit<ViewProps, 'children'> {
  /** Controlled state. Leave unset to let the control hold its own. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next state on every press. */
  onCheckedChange?: (checked: boolean) => void;
  /** Ignore presses and dim the control. */
  disabled?: boolean;
  /**
   * Text before the switch. The row becomes one pressable switch named by it, so do not
   * wrap a labelled switch in another pressable.
   */
  label?: string;
  /** Secondary text under `label`. Ignored without a `label`. */
  description?: string;
  /** Classes for the control itself (the box or the track), not the labelled row. */
  className?: string;
}

function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
  style,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;
  const visual = useVisualTokens();
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
      feedback="default"
      // The ring sits on the pressable, which is what takes keyboard focus.
      style={{ borderRadius: label ? visual.radiusSm : trackHeight / 2 }}
      className={label ? 'flex-row items-center gap-3' : undefined}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="switch"
      aria-checked={isChecked}
      // The pressable is the control, so names, test IDs and layout handlers belong on it.
      // Spread on the inner view, a caller's `accessibilityLabel` named nothing on web.
      {...props}
    >
      {label ? <ControlLabel label={label} description={description} /> : null}
      <View
        className={cn(
          'flex-row items-center justify-start',
          isChecked ? 'border-primary bg-primary' : 'border-input bg-muted',
          className
        )}
        style={[
          {
            width: trackWidth,
            height: trackHeight,
            borderWidth: visual.borderWidthEmphasis,
            borderRadius: trackHeight / 2,
            padding: inset,
          },
          style,
        ]}
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
