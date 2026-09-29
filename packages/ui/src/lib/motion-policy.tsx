import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { ReduceMotion, useReducedMotion } from 'react-native-reanimated';
import { MOTION_TOKEN_DEFAULTS, useInteractionTokens } from './interaction-tokens';

export type MotionMode = 'system' | 'reduced' | 'full' | 'disabled';
export type MotionDuration = 'fast' | 'normal' | 'slow';
export type MotionSpring = 'responsive';

export interface MotionSpringConfig {
  damping: number;
  stiffness: number;
  mass: number;
  reduceMotion: ReduceMotion;
}

export interface MotionPolicy {
  mode: MotionMode;
  reduceMotion: boolean;
  animationsEnabled: boolean;
  durations: Readonly<Record<MotionDuration, number>>;
  springs: Readonly<Record<MotionSpring, Readonly<MotionSpringConfig>>>;
  reanimatedReduceMotion: ReduceMotion;
}

export interface MotionProviderProps {
  children: React.ReactNode;
  mode?: MotionMode;
}

// Without a provider, components still render and Reanimated still follows the system
// setting. Only `--ui-motion-*` overrides and the non-Reanimated reduced-motion paths
// need `MotionProvider` at the root.
const DEFAULT_MOTION_POLICY: MotionPolicy = {
  mode: 'system',
  reduceMotion: false,
  animationsEnabled: true,
  durations: {
    fast: MOTION_TOKEN_DEFAULTS.motionFast,
    normal: MOTION_TOKEN_DEFAULTS.motionNormal,
    slow: MOTION_TOKEN_DEFAULTS.motionSlow,
  },
  springs: {
    responsive: {
      damping: MOTION_TOKEN_DEFAULTS.motionSpringDamping,
      stiffness: MOTION_TOKEN_DEFAULTS.motionSpringStiffness,
      mass: MOTION_TOKEN_DEFAULTS.motionSpringMass,
      reduceMotion: ReduceMotion.System,
    },
  },
  reanimatedReduceMotion: ReduceMotion.System,
};

const MotionPolicyContext = createContext<MotionPolicy>(DEFAULT_MOTION_POLICY);

function useSystemReducedMotion(active: boolean) {
  const initialValue = useReducedMotion();
  const [enabled, setEnabled] = useState(initialValue);

  useEffect(() => {
    if (!active) return;

    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setEnabled(value);
      })
      .catch(() => {
        // Keep Reanimated's startup snapshot if the native query is unavailable.
      });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setEnabled);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [active]);

  return enabled;
}

export function MotionProvider({ children, mode = 'system' }: MotionProviderProps) {
  const interaction = useInteractionTokens();
  const systemReducedMotion = useSystemReducedMotion(mode === 'system');
  const relevantSystemValue = mode === 'system' ? systemReducedMotion : false;

  const policy = useMemo<MotionPolicy>(() => {
    const reduceMotion =
      mode === 'reduced' || mode === 'disabled' || (mode === 'system' && relevantSystemValue);
    const animationsEnabled = mode !== 'disabled';
    const reanimatedReduceMotion =
      mode === 'system'
        ? ReduceMotion.System
        : mode === 'full'
          ? ReduceMotion.Never
          : ReduceMotion.Always;

    return {
      mode,
      reduceMotion,
      animationsEnabled,
      durations: {
        fast: animationsEnabled ? interaction.motionFast : 0,
        normal: animationsEnabled ? interaction.motionNormal : 0,
        slow: animationsEnabled ? interaction.motionSlow : 0,
      },
      springs: {
        responsive: {
          damping: interaction.motionSpringDamping,
          stiffness: interaction.motionSpringStiffness,
          mass: interaction.motionSpringMass,
          reduceMotion: reanimatedReduceMotion,
        },
      },
      reanimatedReduceMotion,
    };
  }, [
    interaction.motionFast,
    interaction.motionNormal,
    interaction.motionSlow,
    interaction.motionSpringDamping,
    interaction.motionSpringMass,
    interaction.motionSpringStiffness,
    mode,
    relevantSystemValue,
  ]);

  return <MotionPolicyContext.Provider value={policy}>{children}</MotionPolicyContext.Provider>;
}

export function useMotionPolicy() {
  return useContext(MotionPolicyContext);
}
