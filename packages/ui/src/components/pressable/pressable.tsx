import React from 'react';
import {
  Platform,
  Pressable as RNPressable,
  type PressableInstance,
  type PressableProps as RNPressableProps,
  type PressableStateCallbackType,
  type ViewStyle,
} from 'react-native';
import { cn } from '../../lib/cn';
import { focusRing, focusRingInset } from '../../lib/focus-ring';
import {
  useInteractionTokens,
  type DisabledVariant,
  type PressedVariant,
} from '../../lib/interaction-tokens';
import { useMotionPolicy } from '../../lib/motion-policy';
import type { ForwardRefComponent } from '../../lib/ref-types';

export type FocusIndicator = 'ring' | 'inset' | 'none';

export interface PressableProps extends RNPressableProps {
  /** Additional Tailwind classes. */
  className?: string;
  /** Semantic press feedback. `none` preserves a plain React Native Pressable. */
  feedback?: PressedVariant;
  /** Opacity used while the control is unavailable. */
  disabledFeedback?: DisabledVariant;
  /** Loading controls are busy and non-interactive, just like disabled controls. */
  loading?: boolean;
  /**
   * Keyboard focus on web: `inset` inside a track, `none` when a proxy draws it.
   * @default 'ring'
   */
  focusIndicator?: FocusIndicator;
}

const FOCUS_CLASSES: Record<FocusIndicator, string | undefined> = {
  ring: focusRing,
  inset: focusRingInset,
  none: undefined,
};

/** WCAG 2.5.8 on web, where `hitSlop` does nothing. Native targets use `hitSlop`. */
const WEB_MIN_TARGET = 'web:min-h-6 web:min-w-6';

function pressedOpacity(variant: PressedVariant, tokens: ReturnType<typeof useInteractionTokens>) {
  if (variant === 'none') return 1;
  return variant === 'strong' ? tokens.pressOpacityStrong : tokens.pressOpacity;
}

function disabledOpacity(
  variant: DisabledVariant,
  tokens: ReturnType<typeof useInteractionTokens>
) {
  if (variant === 'none') return 1;
  if (variant === 'soft') return tokens.disabledOpacitySoft;
  if (variant === 'subtle') return tokens.disabledOpacitySubtle;
  return tokens.disabledOpacity;
}

/**
 * The base every control renders through.
 *
 * It decides from the handlers whether it is a control at all. With a press handler it
 * is a `button` unless told otherwise, a Tab stop on web, shows a focus ring and is at
 * least 24px there. Without one it is plain content: no role, no feedback, and not a
 * Tab stop — React Native Web otherwise makes every Pressable focusable, which put
 * role-less stops on static rows and cards.
 *
 * State goes through `aria-*` props (`aria-checked`, `aria-selected`, `aria-expanded`).
 * React Native folds them into native accessibility state and React Native Web emits
 * them as written, so one prop serves every target.
 */
const Pressable: ForwardRefComponent<PressableInstance, PressableProps> = React.forwardRef(
  (
    {
      className,
      feedback = 'none',
      disabledFeedback = 'default',
      focusIndicator = 'ring',
      loading = false,
      disabled = false,
      accessibilityRole,
      role,
      tabIndex,
      style,
      ...props
    },
    ref
  ) => {
    const interaction = useInteractionTokens();
    const motion = useMotionPolicy();
    const interactive = Boolean(
      props.onPress || props.onLongPress || props.onPressIn || props.onPressOut
    );
    const unavailable = disabled || loading;
    const restingOpacity = unavailable ? disabledOpacity(disabledFeedback, interaction) : 1;
    const activeOpacity = pressedOpacity(feedback, interaction);
    const resolveStyle = (state: PressableStateCallbackType) => {
      const callerStyle = typeof style === 'function' ? style(state) : style;
      const feedbackOpacity = unavailable
        ? restingOpacity
        : state.pressed && feedback !== 'none'
          ? activeOpacity
          : undefined;
      const feedbackStyle =
        feedbackOpacity === undefined ? null : ({ opacity: feedbackOpacity } as ViewStyle);

      if (Platform.OS !== 'web') return [callerStyle, feedbackStyle];

      const transition = motion.animationsEnabled
        ? ({
            transitionProperty: 'opacity',
            transitionDuration: `${motion.durations.fast}ms`,
            transitionTimingFunction: 'ease-out',
          } as ViewStyle)
        : null;
      return [callerStyle, transition, feedbackStyle];
    };

    return (
      <RNPressable
        ref={ref}
        className={cn(interactive && [FOCUS_CLASSES[focusIndicator], WEB_MIN_TARGET], className)}
        accessibilityRole={accessibilityRole ?? (role || !interactive ? undefined : 'button')}
        role={role}
        tabIndex={tabIndex ?? (Platform.OS === 'web' && !interactive ? -1 : undefined)}
        disabled={unavailable}
        aria-busy={loading || undefined}
        style={resolveStyle}
        {...props}
      />
    );
  }
);

Pressable.displayName = 'Pressable';

export { Pressable };
