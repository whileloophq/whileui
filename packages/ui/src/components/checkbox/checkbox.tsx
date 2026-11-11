import { useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
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
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked ?? internalChecked;
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const size = Math.max(18, Math.round(visual.controlHeightSm * 0.55));
  const boxRadius = Math.max(6, Math.round(visual.radiusSm * 0.7));
  // The ring belongs on the pressable, which is what takes keyboard focus. On the inner
  // box it never matched `:focus-visible`, so the checkbox showed no focus on web.
  const interactiveStyle = withInteractivePressableStyle(
    { borderRadius: label ? visual.radiusSm : boxRadius },
    interaction,
    { disabled, pressedVariant: 'default' }
  );
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
      style={interactiveStyle}
      className={cn(focusRing, label && 'flex-row items-start gap-3')}
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
          className
        )}
        style={{
          width: size,
          height: size,
          borderWidth: visual.borderWidthControl,
          borderRadius: boxRadius,
        }}
        {...props}
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
