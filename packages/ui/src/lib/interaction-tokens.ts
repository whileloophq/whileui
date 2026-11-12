/**
 * Press, disabled, and motion timing for the whole package.
 *
 * These are not theme tokens. A generated preset does not emit them, and reading the
 * matching `--ui-*` variables warned in every app on that preset while resolving to
 * these same numbers. One table, no CSS lookup.
 */
export const INTERACTION_TOKENS = {
  pressOpacity: 0.82,
  pressOpacityStrong: 0.92,
  disabledOpacity: 0.46,
  disabledOpacitySoft: 0.56,
  disabledOpacitySubtle: 0.36,
  inactiveOpacity: 0.54,
  motionFast: 140,
  motionNormal: 200,
  motionSlow: 280,
  motionSpringDamping: 20,
  motionSpringStiffness: 260,
  motionSpringMass: 0.8,
  drawerOpenDuration: 260,
  drawerCloseDuration: 180,
} as const satisfies InteractionTokens;

/** Motion slice of {@link INTERACTION_TOKENS}, for the provider-less policy. */
export const MOTION_TOKEN_DEFAULTS = {
  motionFast: INTERACTION_TOKENS.motionFast,
  motionNormal: INTERACTION_TOKENS.motionNormal,
  motionSlow: INTERACTION_TOKENS.motionSlow,
  motionSpringDamping: INTERACTION_TOKENS.motionSpringDamping,
  motionSpringStiffness: INTERACTION_TOKENS.motionSpringStiffness,
  motionSpringMass: INTERACTION_TOKENS.motionSpringMass,
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

export function useInteractionTokens(): InteractionTokens {
  return INTERACTION_TOKENS;
}
