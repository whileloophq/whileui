import { useState } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { Pressable } from '../pressable';
import { ControlLabel } from './control-label';

export interface CheckboxProps extends Omit<ViewProps, 'children'> {
  /** Controlled state. Leave unset to let the control hold its own. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next state on every press. */
  onCheckedChange?: (checked: boolean) => void;
  /** Ignore presses and dim the control. */
  disabled?: boolean;
  /**
   * Text beside the box. The row becomes one pressable checkbox named by it, so do not
   * wrap a labelled checkbox in another pressable.
   */
  label?: string;
  /** Secondary text under `label`. Ignored without a `label`. */
  description?: string;
  /** Classes for the control itself (the box or the track), not the labelled row. */
  className?: string;
}

function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
  style,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;
  const visual = useVisualTokens();
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const boxRadius = Math.max(6, Math.round(visual.radiusSm * 0.7));
  const tickStroke = Math.max(2, Math.round(size * 0.12));

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
      style={{ borderRadius: label ? visual.radiusSm : boxRadius }}
      className={label ? 'flex-row items-start gap-3' : 'items-center justify-center'}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="checkbox"
      aria-checked={isChecked}
      // The pressable is the control, so names, test IDs and layout handlers belong on it.
      // Spread on the inner view, a caller's `accessibilityLabel` named nothing on web.
      {...props}
    >
      <View
        className={cn(
          'items-center justify-center',
          isChecked ? 'border-primary bg-primary' : 'border-border bg-muted',
          className
        )}
        style={[
          {
            width: size,
            height: size,
            borderWidth: visual.borderWidthControl,
            borderRadius: boxRadius,
          },
          style,
        ]}
      >
        {/* A tick, drawn as the bottom and right edges of a rotated box: the package
            carries no icon set. A filled inner square, which this used to draw, reads
            as a radio or as unchecked. */}
        {isChecked && (
          <View
            testID="checkbox-tick"
            className="border-primary-foreground"
            style={{
              width: Math.round(size * 0.3),
              height: Math.round(size * 0.55),
              borderRightWidth: tickStroke,
              borderBottomWidth: tickStroke,
              transform: [{ translateY: -Math.round(size * 0.06) }, { rotate: '45deg' }],
            }}
          />
        )}
      </View>
      {label ? <ControlLabel label={label} description={description} /> : null}
    </Pressable>
  );
}

Checkbox.displayName = 'Checkbox';

export { Checkbox };
