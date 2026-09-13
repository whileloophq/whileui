import React, { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

const numericInputVariants = tv({
  base: 'w-full flex-row items-center border-border bg-muted',
  variants: {
    variant: {
      default: 'border-border',
      error: 'border-destructive',
    },
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const numericInputTextVariants = tv({
  base: 'text-foreground',
  variants: {
    size: {
      default: '',
      compact: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function toInputText(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '';
  }
  return Number.isFinite(value) ? String(value) : '';
}

function parseNumericText(text: string) {
  const normalized = text.replace(',', '.').trim();
  if (!normalized || normalized === '-' || normalized === '.' || normalized === '-.') {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampValue(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined && next < min) {
    next = min;
  }
  if (max !== undefined && next > max) {
    next = max;
  }
  return next;
}

/** JS float math is imprecise (72.8 + 0.1 → 72.899...). Round to clean display. */
function roundToStepPrecision(value: number, step: number): number {
  const decimals = step >= 1 ? 0 : (step.toString().split('.')[1]?.length ?? 2);
  return Number(value.toFixed(decimals));
}

export interface NumericInputProps
  extends
    Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText' | 'keyboardType'>,
    VariantProps<typeof numericInputVariants> {
  className?: string;
  inputClassName?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  showSteppers?: boolean;
  /** Drop the field shell (border, background, radius, padding) for embedding inside another field shell like LabeledField. */
  unstyled?: boolean;
}

const NumericInput = React.forwardRef<TextInput, NumericInputProps>(
  (
    {
      className,
      inputClassName,
      prefix,
      suffix,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      showSteppers = false,
      unstyled = false,
      variant = 'default',
      size = 'default',
      editable = true,
      placeholderTextColor,
      onBlur,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const colors = useThemeColors();
    const interaction = useInteractionTokens();
    const visual = useVisualTokens();
    const [internalText, setInternalText] = useState(() => toInputText(defaultValue));
    const isControlled = value !== undefined;
    const textValue = isControlled ? toInputText(value) : internalText;

    const currentValue = useMemo(() => parseNumericText(textValue), [textValue]);

    const setTextAndValue = useCallback(
      (nextText: string) => {
        if (!isControlled) {
          setInternalText(nextText);
        }
        onValueChange?.(parseNumericText(nextText));
      },
      [isControlled, onValueChange]
    );

    const applyNumericValue = useCallback(
      (nextValue: number | null) => {
        if (nextValue === null) {
          if (!isControlled) {
            setInternalText('');
          }
          onValueChange?.(null);
          return;
        }

        const clamped = clampValue(nextValue, min, max);
        if (!isControlled) {
          setInternalText(toInputText(clamped));
        }
        onValueChange?.(clamped);
      },
      [isControlled, max, min, onValueChange]
    );

    const handleTextChange = (nextText: string) => {
      const isNumericLike = /^-?\d*(?:[.,]\d*)?$/.test(nextText);
      if (!isNumericLike) {
        return;
      }

      setTextAndValue(nextText);
    };

    const handleBlur: TextInputProps['onBlur'] = (event) => {
      const parsed = parseNumericText(textValue);
      if (parsed !== null) {
        const rounded = roundToStepPrecision(parsed, step);
        const clamped = clampValue(rounded, min, max);
        if (!isControlled) {
          setInternalText(toInputText(clamped));
        }
        onValueChange?.(clamped);
      }
      onBlur?.(event);
    };

    const canDecrease =
      editable && (min === undefined || currentValue === null || currentValue > min);
    const canIncrease =
      editable && (max === undefined || currentValue === null || currentValue < max);
    const stepDownStyle = withInteractivePressableStyle(undefined, interaction, {
      disabled: !canDecrease,
      disabledVariant: 'subtle',
      pressedVariant: 'default',
    });
    const stepUpStyle = withInteractivePressableStyle(undefined, interaction, {
      disabled: !canIncrease,
      disabledVariant: 'subtle',
      pressedVariant: 'default',
    });

    const nudge = (delta: -1 | 1) => {
      const baseline = currentValue ?? min ?? 0;
      const raw = baseline + delta * step;
      applyNumericValue(roundToStepPrecision(raw, step));
    };

    const controlHeight = size === 'compact' ? visual.controlHeightSm : visual.controlHeightDefault;
    // Steppers render as inset soft buttons, centered inside the field shell.
    const stepInset = Math.max(3, Math.round(controlHeight * 0.1));
    const stepSize = controlHeight - stepInset * 2;
    const stepRadius = Math.max(3, Math.min(visual.radiusMd, Math.round(stepSize / 3)));

    return (
      <View
        className={cn(
          numericInputVariants({ variant, size }),
          unstyled && 'bg-transparent',
          className
        )}
        style={[
          {
            // Definite height (not minHeight) so inner elements can center reliably.
            height: controlHeight,
            borderWidth: unstyled ? 0 : visual.borderWidthControl,
            borderRadius: unstyled ? 0 : visual.radiusLg,
            paddingLeft: !unstyled && prefix ? visual.controlPaddingXDefault : 0,
            paddingRight: unstyled ? 0 : showSteppers ? stepInset : 0,
          },
          !editable ? { opacity: interaction.disabledOpacity } : undefined,
        ]}
      >
        {prefix ? (
          <View
            style={{ paddingRight: Math.max(8, Math.round(visual.controlPaddingXDefault * 0.5)) }}
          >
            {prefix}
          </View>
        ) : null}
        <View
          className="min-w-0 flex-1"
          style={Platform.OS === 'web' ? { minWidth: 0, flex: 1 } : undefined}
        >
          <TextInput
            ref={ref}
            className={cn(numericInputTextVariants({ size }), 'w-full', focusRing, inputClassName)}
            style={
              Platform.OS === 'web'
                ? [
                    {
                      ...typographyStyle(visual, size === 'compact' ? 'caption' : 'label'),
                      width: '100%',
                      minWidth: 0,
                      paddingVertical:
                        size === 'compact'
                          ? visual.controlPaddingYSm
                          : visual.controlPaddingYDefault,
                      paddingHorizontal: unstyled ? 0 : visual.controlPaddingXDefault,
                    },
                    styleProp,
                  ]
                : [
                    {
                      ...typographyStyle(visual, size === 'compact' ? 'caption' : 'label'),
                      paddingVertical:
                        size === 'compact'
                          ? visual.controlPaddingYSm
                          : visual.controlPaddingYDefault,
                      paddingHorizontal: unstyled ? 0 : visual.controlPaddingXDefault,
                    },
                    styleProp,
                  ]
            }
            value={textValue}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            keyboardType="decimal-pad"
            editable={editable}
            placeholderTextColor={placeholderTextColor ?? colors.placeholder}
            {...props}
          />
        </View>
        {suffix ? (
          <View
            style={{ paddingLeft: Math.max(8, Math.round(visual.controlPaddingXDefault * 0.5)) }}
          >
            {suffix}
          </View>
        ) : null}

        {showSteppers ? (
          <View
            className="shrink-0 flex-row items-center"
            style={{ gap: stepInset, paddingLeft: Math.max(6, stepInset) }}
          >
            <Pressable
              className="shrink-0 items-center justify-center bg-secondary"
              style={(state) => {
                const baseStyle =
                  typeof stepDownStyle === 'function' ? stepDownStyle(state) : stepDownStyle;
                return [baseStyle, { width: stepSize, height: stepSize, borderRadius: stepRadius }];
              }}
              onPress={() => nudge(-1)}
              disabled={!canDecrease}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Decrease value"
            >
              <Text className="font-medium text-foreground" style={typographyStyle(visual, 'body')}>
                −
              </Text>
            </Pressable>
            <Pressable
              className="shrink-0 items-center justify-center bg-secondary"
              style={(state) => {
                const baseStyle =
                  typeof stepUpStyle === 'function' ? stepUpStyle(state) : stepUpStyle;
                return [baseStyle, { width: stepSize, height: stepSize, borderRadius: stepRadius }];
              }}
              onPress={() => nudge(1)}
              disabled={!canIncrease}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Increase value"
            >
              <Text className="font-medium text-foreground" style={typographyStyle(visual, 'body')}>
                +
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }
);

NumericInput.displayName = 'NumericInput';

export { NumericInput, numericInputVariants, numericInputTextVariants };
