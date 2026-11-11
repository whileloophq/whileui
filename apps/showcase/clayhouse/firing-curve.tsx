import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { Text, useMotionPolicy, useThemeColors } from '@thewhileloop/whileui';
import { FIRING_PEAK, FIRING_PLAN } from './data';
import { mono } from './fonts';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const HEIGHT = 168;
const TOP = 18;
const BOTTOM = 22;
const PLAN_HOURS = FIRING_PLAN[FIRING_PLAN.length - 1][0];

/** Where on the planned schedule the kiln is, in hours, for a given temperature. */
function hoursAt(temp: number) {
  for (let i = 1; i < FIRING_PLAN.length; i++) {
    const [h0, t0] = FIRING_PLAN[i - 1];
    const [h1, t1] = FIRING_PLAN[i];
    if (temp <= t1 && t1 > t0) return h0 + ((temp - t0) / (t1 - t0)) * (h1 - h0);
  }
  return PLAN_HOURS;
}

function PulseRing({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  const motion = useMotionPolicy();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (motion.animationsEnabled) pulse.value = withRepeat(withTiming(1, { duration: 1600 }), -1);
  }, [motion.animationsEnabled, pulse]);

  const ring = useAnimatedProps(() => ({
    r: 5 + pulse.value * 12,
    opacity: 0.45 * (1 - pulse.value),
  }));

  return <AnimatedCircle cx={cx} cy={cy} fill={color} animatedProps={ring} />;
}

/**
 * Tonight's firing as a potter reads it: the planned ramp, the climb so far, and where
 * cone 10 sits. Redraws on every reading from the kiln.
 */
export function FiringCurve({ temp }: { temp: number }) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);

  const x = (hours: number) => (hours / PLAN_HOURS) * width;
  const y = (celsius: number) => TOP + (1 - celsius / FIRING_PEAK) * (HEIGHT - TOP - BOTTOM);

  const now = hoursAt(temp);
  const planned = FIRING_PLAN.map(([h, t], i) => `${i ? 'L' : 'M'}${x(h)},${y(t)}`).join(' ');
  const climbed = [...FIRING_PLAN.filter(([h]) => h < now), [now, temp] as const]
    .map(([h, t], i) => `${i ? 'L' : 'M'}${x(h)},${y(t)}`)
    .join(' ');
  const baseline = y(0);
  const area = `${climbed} L${x(now)},${baseline} L0,${baseline} Z`;

  return (
    <View
      accessible
      accessibilityLabel={`Firing curve. ${Math.round(now * 10) / 10} of ${PLAN_HOURS} hours, ${temp} degrees.`}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height: HEIGHT }}
    >
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="heat" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity={0.35} />
              <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Line
            x1={0}
            x2={width}
            y1={y(FIRING_PEAK)}
            y2={y(FIRING_PEAK)}
            stroke={colors.mutedForeground}
            strokeOpacity={0.5}
            strokeDasharray="2 5"
          />
          <Path
            d={planned}
            stroke={colors.mutedForeground}
            strokeOpacity={0.45}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />
          <Path d={area} fill="url(#heat)" />
          <Path
            d={climbed}
            stroke={colors.primary}
            strokeWidth={2.5}
            strokeLinejoin="round"
            fill="none"
          />
          <PulseRing cx={x(now)} cy={y(temp)} color={colors.primary} />
          <Circle cx={x(now)} cy={y(temp)} r={5} fill={colors.primary} />
          <Circle cx={x(now)} cy={y(temp)} r={2} fill={colors.background} />
        </Svg>
      ) : null}
      <Text className="absolute right-0 top-0 text-xs text-muted-foreground" style={mono}>
        CONE 10 · {FIRING_PEAK}°
      </Text>
      <View className="absolute inset-x-0 bottom-0 flex-row justify-between">
        {['LIT', '4H', '8H', `${PLAN_HOURS}H`].map((label) => (
          <Text key={label} className="text-xs text-muted-foreground" style={mono}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
