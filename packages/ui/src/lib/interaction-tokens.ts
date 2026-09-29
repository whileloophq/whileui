import {
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useCSSVariable } from 'uniwind';

function parseNumber(value: string | number | undefined, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampOpacity(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/** Motion values used when a `--ui-motion-*` token is absent, and by the provider-less motion policy. */
export const MOTION_TOKEN_DEFAULTS = {
  motionFast: 140,
  motionNormal: 200,
  motionSlow: 280,
  motionSpringDamping: 20,
  motionSpringStiffness: 260,
  motionSpringMass: 0.8,
} as const;

export interface InteractionTokens {
  pressOpacity: number;
  pressOpacityStrong: number;
  disabledOpacity: number;
  disabledOpacitySoft: number;
  disabledOpacitySubtle: number;
  inactiveOpacity: number;
  motionFast: number;
  motionNormal: number;
  motionSlow: number;
  motionSpringDamping: number;
  motionSpringStiffness: number;
  motionSpringMass: number;
  drawerOpenDuration: number;
  drawerCloseDuration: number;
}

export type PressedVariant = 'default' | 'strong' | 'none';
export type DisabledVariant = 'default' | 'soft' | 'subtle' | 'none';

export interface InteractivePressableOptions {
  disabled?: boolean;
  pressedVariant?: PressedVariant;
  disabledVariant?: DisabledVariant;
}

export function useInteractionTokens(): InteractionTokens {
  const [
    pressOpacity,
    pressOpacityStrong,
    disabledOpacity,
    disabledOpacitySoft,
    disabledOpacitySubtle,
    inactiveOpacity,
    motionFast,
    motionNormal,
    motionSlow,
    motionSpringDamping,
    motionSpringStiffness,
    motionSpringMass,
    drawerOpenDuration,
    drawerCloseDuration,
  ] = useCSSVariable([
    '--ui-press-opacity',
    '--ui-press-opacity-strong',
    '--ui-disabled-opacity',
    '--ui-disabled-opacity-soft',
    '--ui-disabled-opacity-subtle',
    '--ui-inactive-opacity',
    '--ui-motion-fast',
    '--ui-motion-normal',
    '--ui-motion-slow',
    '--ui-motion-spring-damping',
    '--ui-motion-spring-stiffness',
    '--ui-motion-spring-mass',
    '--ui-drawer-open-duration',
    '--ui-drawer-close-duration',
  ]);

  return {
    pressOpacity: clampOpacity(parseNumber(pressOpacity, 0.82)),
    pressOpacityStrong: clampOpacity(parseNumber(pressOpacityStrong, 0.92)),
    disabledOpacity: clampOpacity(parseNumber(disabledOpacity, 0.46)),
    disabledOpacitySoft: clampOpacity(parseNumber(disabledOpacitySoft, 0.56)),
    disabledOpacitySubtle: clampOpacity(parseNumber(disabledOpacitySubtle, 0.36)),
    inactiveOpacity: clampOpacity(parseNumber(inactiveOpacity, 0.54)),
    motionFast: Math.max(0, Math.round(parseNumber(motionFast, MOTION_TOKEN_DEFAULTS.motionFast))),
    motionNormal: Math.max(
      0,
      Math.round(parseNumber(motionNormal, MOTION_TOKEN_DEFAULTS.motionNormal))
    ),
    motionSlow: Math.max(0, Math.round(parseNumber(motionSlow, MOTION_TOKEN_DEFAULTS.motionSlow))),
    motionSpringDamping: Math.max(
      0,
      parseNumber(motionSpringDamping, MOTION_TOKEN_DEFAULTS.motionSpringDamping)
    ),
    motionSpringStiffness: Math.max(
      0,
      parseNumber(motionSpringStiffness, MOTION_TOKEN_DEFAULTS.motionSpringStiffness)
    ),
    motionSpringMass: Math.max(
      0.01,
      parseNumber(motionSpringMass, MOTION_TOKEN_DEFAULTS.motionSpringMass)
    ),
    drawerOpenDuration: Math.max(0, Math.round(parseNumber(drawerOpenDuration, 260))),
    drawerCloseDuration: Math.max(0, Math.round(parseNumber(drawerCloseDuration, 180))),
  };
}

type PressableStyle = PressableProps['style'];

function resolveDisabledOpacity(
  tokens: InteractionTokens,
  variant: DisabledVariant
): number | undefined {
  if (variant === 'none') return undefined;
  if (variant === 'soft') return tokens.disabledOpacitySoft;
  if (variant === 'subtle') return tokens.disabledOpacitySubtle;
  return tokens.disabledOpacity;
}

function resolvePressedOpacity(
  tokens: InteractionTokens,
  variant: PressedVariant
): number | undefined {
  if (variant === 'none') return undefined;
  if (variant === 'strong') return tokens.pressOpacityStrong;
  return tokens.pressOpacity;
}

export function withInteractivePressableStyle(
  styleProp: PressableStyle | undefined,
  tokens: InteractionTokens,
  options: InteractivePressableOptions = {}
): PressableStyle {
  const { disabled = false, pressedVariant = 'default', disabledVariant = 'default' } = options;
  return (state: PressableStateCallbackType) => {
    const baseStyle =
      typeof styleProp === 'function'
        ? styleProp(state)
        : (styleProp as StyleProp<ViewStyle> | undefined);

    const disabledOpacity = resolveDisabledOpacity(tokens, disabledVariant);
    const pressedOpacity = resolvePressedOpacity(tokens, pressedVariant);
    const feedbackOpacity = disabled ? disabledOpacity : state.pressed ? pressedOpacity : undefined;

    return [
      baseStyle,
      feedbackOpacity !== undefined ? ({ opacity: feedbackOpacity } as ViewStyle) : null,
    ];
  };
}
