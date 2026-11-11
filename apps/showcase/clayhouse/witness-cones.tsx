import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, cn, useMotionPolicy, useThemeColors } from '@thewhileloop/whileui';
import { WITNESS_CONES } from './data';
import { mono } from './fonts';

const MAX_BEND_DEG = 78;
/** A cone starts to soften about 40°C before its rating. */
const SOFTEN_RANGE = 40;

function bendFor(temp: number, bendsAt: number) {
  return Math.max(0, Math.min(1, (temp - (bendsAt - SOFTEN_RANGE)) / SOFTEN_RANGE));
}

function Cone({ label, bendsAt, temp }: { label: string; bendsAt: number; temp: number }) {
  const colors = useThemeColors();
  const motion = useMotionPolicy();
  const bend = bendFor(temp, bendsAt);
  const down = bend === 1;
  const angle = useSharedValue(0);

  useEffect(() => {
    const target = bend * MAX_BEND_DEG;
    angle.value = motion.animationsEnabled
      ? withTiming(target, { duration: motion.durations.slow })
      : target;
  }, [angle, bend, motion.animationsEnabled, motion.durations.slow]);

  const tilt = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));

  return (
    <View
      accessible
      accessibilityLabel={`Cone ${label}, ${down ? 'down' : bend > 0 ? 'bending' : 'standing'}`}
      className="items-center gap-1.5"
    >
      <View className="h-10 w-10 items-center justify-end">
        <Animated.View
          style={[
            {
              width: 0,
              height: 0,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderBottomWidth: 32,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: down ? colors.primary : colors.mutedForeground,
              transformOrigin: 'bottom',
            },
            tilt,
          ]}
        />
        <View className="h-1 w-9 rounded-sm bg-foreground/20" />
      </View>
      <Text className={cn('text-xs', down ? 'text-primary' : 'text-muted-foreground')} style={mono}>
        {label}
      </Text>
    </View>
  );
}

/** The potter's real thermometer: each cone slumps as the kiln passes its rating. */
export function WitnessCones({ temp }: { temp: number }) {
  return (
    <View className="flex-row gap-3">
      {WITNESS_CONES.map((cone) => (
        <Cone key={cone.label} label={cone.label} bendsAt={cone.bendsAt} temp={temp} />
      ))}
    </View>
  );
}
