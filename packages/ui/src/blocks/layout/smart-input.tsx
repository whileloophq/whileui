import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View, TextInput, type TextInputProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface SmartInputProps extends TextInputProps {
  /** Left slot: emoji, attach, etc. */
  leftSlot?: React.ReactNode;
  /** Center slot: intent selector, model picker, etc. */
  centerSlot?: React.ReactNode;
  /** Right slot: send button, etc. */
  rightSlot?: React.ReactNode;
  /** Bar = sticky bottom with border-t. Card = floating, no top border, rounded. */
  variant?: 'bar' | 'card';
  /** Container className */
  className?: string;
  /** Input field className */
  inputClassName?: string;
  /** 'newline' = Enter adds newline. 'submit' = Enter triggers onSubmitEditing. Default 'newline'. */
  submitBehavior?: 'newline' | 'submit' | 'blurAndSubmit';
  /** Use safe area insets for bottom padding */
  safeArea?: boolean;
  /** Rotating examples used as the placeholder when `placeholder` is omitted. */
  placeholderExamples?: readonly string[];
  placeholderPrefix?: string;
  placeholderTypingInterval?: number;
  placeholderPauseDuration?: number;
  placeholderClearInterval?: number;
}

// The examples list is joined into one string so it can be an effect dependency without
// re-running on every render. A NUL byte cannot appear in a placeholder.
const SEPARATOR = '\0';

interface RotatingPlaceholderOptions {
  active: boolean;
  examplesKey: string;
  prefix: string;
  typingInterval: number;
  pauseDuration: number;
  clearInterval: number;
}

function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

function useRotatingPlaceholder({
  active,
  examplesKey,
  prefix,
  typingInterval,
  pauseDuration,
  clearInterval: clearIntervalMs,
}: RotatingPlaceholderOptions) {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const exampleIndexRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const examples = examplesKey ? examplesKey.split(SEPARATOR) : [];
    // The reduced-motion placeholder is derived below, not animated — there is no timer
    // to start and nothing for this effect to do.
    if (!active || reduceMotion || examples.length === 0) return;

    let charIndex = 0;
    let elapsed = 0;
    let phase: 'typing' | 'pause' | 'clearing' = 'typing';
    let exampleIndex = exampleIndexRef.current;
    const resolution = Math.max(16, Math.min(typingInterval, clearIntervalMs));

    // Clearing before the first tick is part of starting the timer: without it the
    // previous example's tail stays on screen until the next interval fires.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimatedPlaceholder('');
    const timer = setInterval(() => {
      elapsed += resolution;
      const target = `${prefix}${examples[exampleIndex % examples.length]}`;
      const phaseDuration =
        phase === 'typing'
          ? Math.max(typingInterval, 1)
          : phase === 'pause'
            ? Math.max(pauseDuration, 1)
            : Math.max(clearIntervalMs, 1);

      if (elapsed < phaseDuration) return;
      elapsed = 0;

      if (phase === 'typing') {
        charIndex += 1;
        setAnimatedPlaceholder(target.slice(0, charIndex));
        if (charIndex >= target.length) phase = 'pause';
        return;
      }

      if (phase === 'pause') {
        phase = 'clearing';
        return;
      }

      charIndex -= 1;
      setAnimatedPlaceholder(target.slice(0, Math.max(0, charIndex)));
      if (charIndex <= 0) {
        phase = 'typing';
        exampleIndex += 1;
        exampleIndexRef.current = exampleIndex;
      }
    }, resolution);

    return () => clearInterval(timer);
  }, [active, clearIntervalMs, examplesKey, pauseDuration, prefix, reduceMotion, typingInterval]);

  if (!active) return '';
  if (reduceMotion) {
    const examples = examplesKey ? examplesKey.split(SEPARATOR) : [];
    return examples.length > 0 ? `${prefix}${examples[0]}` : prefix;
  }
  return animatedPlaceholder || prefix;
}

export const SmartInput = forwardRef<TextInput, SmartInputProps>(function SmartInput(
  {
    leftSlot,
    centerSlot,
    rightSlot,
    variant = 'bar',
    className,
    inputClassName,
    submitBehavior = 'newline',
    safeArea = true,
    placeholderExamples,
    placeholderPrefix = 'e.g. ',
    placeholderTypingInterval = 65,
    placeholderPauseDuration = 2200,
    placeholderClearInterval = 25,
    placeholderTextColor,
    placeholder,
    value,
    defaultValue,
    onChangeText,
    editable = true,
    style,
    ...props
  },
  ref
) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const bottomPadding = safeArea
    ? Math.max(insets.bottom, visual.controlPaddingYSm)
    : visual.controlPaddingYSm;
  // When the field is controlled its owner already holds the answer, so derive it rather
  // than mirroring it into state — mirroring cost a frame in which the rotating
  // placeholder kept animating over text the user had already typed.
  const [uncontrolledHasText, setUncontrolledHasText] = useState(() => Boolean(defaultValue));
  const hasText = value !== undefined ? Boolean(value) : uncontrolledHasText;
  const examplesKey = placeholderExamples?.join(SEPARATOR) ?? '';
  const animatePlaceholder = placeholder === undefined && !hasText && Boolean(examplesKey);
  const animatedPlaceholder = useRotatingPlaceholder({
    active: animatePlaceholder,
    examplesKey,
    prefix: placeholderPrefix,
    typingInterval: placeholderTypingInterval,
    pauseDuration: placeholderPauseDuration,
    clearInterval: placeholderClearInterval,
  });

  const resolvedPlaceholder =
    placeholder ?? (hasText || !examplesKey ? undefined : animatedPlaceholder);

  return (
    <View
      className={cn(
        'w-full flex-row items-center gap-2 bg-background',
        variant === 'bar' && 'border-border',
        variant === 'card' && 'border-border',
        className
      )}
      style={[
        {
          paddingHorizontal: visual.controlPaddingXSm,
          paddingTop: visual.controlPaddingYSm,
          paddingBottom: bottomPadding,
        },
        variant === 'bar' ? { borderTopWidth: visual.borderWidthHairline } : null,
        variant === 'card'
          ? {
              borderRadius: surfaceRadius(visual, 'xl'),
              borderWidth: visual.borderWidthHairline,
              ...shadowStyle(visual, colors, 'md'),
            }
          : null,
      ]}
    >
      {leftSlot && <View className="shrink-0">{leftSlot}</View>}
      {centerSlot && <View className="shrink-0">{centerSlot}</View>}
      <TextInput
        ref={ref}
        style={[
          controlRecipe(visual, 'default'),
          typographyStyle(visual, 'label'),
          variant === 'bar' ? { borderWidth: visual.borderWidthControl } : null,
          { maxHeight: visual.smartInputMaxHeight },
          !editable ? { opacity: interaction.disabledOpacity } : null,
          style,
        ]}
        className={cn(
          'flex-1 text-foreground placeholder:text-muted-foreground',
          focusRing,
          variant === 'bar' && 'border-border bg-muted',
          variant === 'card' && 'bg-transparent',
          inputClassName
        )}
        multiline
        submitBehavior={submitBehavior}
        textAlignVertical="top"
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        placeholder={resolvedPlaceholder}
        value={value}
        defaultValue={defaultValue}
        onChangeText={(text) => {
          if (value === undefined) setUncontrolledHasText(Boolean(text));
          onChangeText?.(text);
        }}
        editable={editable}
        {...props}
      />
      {rightSlot && <View className="shrink-0">{rightSlot}</View>}
    </View>
  );
});
