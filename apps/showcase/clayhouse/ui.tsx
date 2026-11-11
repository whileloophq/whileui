import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Text, cn, focusRing, useMotionPolicy, useThemeColors } from '@thewhileloop/whileui';
import { mono } from './fonts';

export type IconName = keyof typeof Feather.glyphMap;

/** Horizontal margin every screen aligns to. Full-bleed media ignores it on purpose. */
export const GUTTER = 20;

/** Small uppercase mono label, the studio's instrument voice. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={cn('text-xs uppercase tracking-widest text-muted-foreground', className)}
      style={mono}
    >
      {children}
    </Text>
  );
}

/** Title block for screens without a hero image; clears the status bar itself. */
export function ScreenHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + 28, paddingHorizontal: GUTTER }}>
      <Text accessibilityRole="header" className="text-6xl font-bold text-foreground">
        {title}
      </Text>
      <Text className="mt-1 text-base text-muted-foreground">{subtitle}</Text>
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View
      className="mb-4 mt-10 flex-row items-end justify-between"
      style={{ paddingHorizontal: GUTTER }}
    >
      <Text accessibilityRole="header" className="text-3xl font-bold text-foreground">
        {title}
      </Text>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          hitSlop={12}
          className={cn('rounded-sm active:opacity-60', focusRing)}
        >
          <Text className="text-sm font-medium text-primary">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Staggers a screen's blocks in on mount. Renders still under reduced motion. */
export function Reveal({ order, children }: { order: number; children: React.ReactNode }) {
  const motion = useMotionPolicy();
  if (!motion.animationsEnabled) return <>{children}</>;
  return (
    <Animated.View entering={FadeInDown.delay(60 + order * 70).duration(motion.durations.slow)}>
      {children}
    </Animated.View>
  );
}

const SHADE = 'rgba(12, 8, 6, 0.65)';
const CLEAR = 'rgba(12, 8, 6, 0)';

/**
 * A gradient laid over photography. `shade` darkens an edge so light text stays legible
 * in either theme; `page` dissolves the photo into the background. LinearGradient is a
 * native view that Uniwind does not wrap, so it is positioned with style, not className.
 */
export function Scrim({
  edge,
  height,
  tone,
}: {
  edge: 'top' | 'bottom';
  height: number;
  tone: 'shade' | 'page';
}) {
  const { background } = useThemeColors();
  const solid = tone === 'shade' ? SHADE : background;
  const clear = tone === 'shade' ? CLEAR : `${background}00`;
  return (
    <LinearGradient
      pointerEvents="none"
      colors={edge === 'top' ? [solid, clear] : [clear, solid]}
      style={{ position: 'absolute', left: 0, right: 0, height, [edge]: 0 }}
    />
  );
}
