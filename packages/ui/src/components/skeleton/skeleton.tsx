import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';

const skeletonVariants = tv({
  base: 'bg-muted',
  variants: {
    variant: {
      pulse: '',
      shimmer: '',
    },
  },
  defaultVariants: { variant: 'pulse' },
});

export interface SkeletonProps extends ViewProps, VariantProps<typeof skeletonVariants> {
  className?: string;
}

function Skeleton({ className, variant = 'pulse', style, ...props }: SkeletonProps) {
  const progress = useSharedValue(0);
  const colors = useThemeColors();
  const visual = useVisualTokens();

  // Circular skeletons keep their class-driven radius; everything else gets the token radius.
  const isCircular = className?.includes('rounded-full') ?? false;
  const radiusStyle = isCircular ? null : { borderRadius: visual.radiusMd };

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: variant === 'shimmer' ? 1400 : 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, [progress, variant]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: variant === 'pulse' ? interpolate(progress.value, [0, 0.5, 1], [1, 0.35, 1]) : 1,
  }));

  const shimmerBandWidth = visual.skeletonShimmerBandWidth;
  const shimmerStyle = useAnimatedStyle(() => {
    if (variant !== 'shimmer') return {};
    return {
      transform: [{ translateX: interpolate(progress.value, [0, 1], [-shimmerBandWidth, 999]) }],
    };
  });

  if (variant === 'shimmer') {
    return (
      <View
        className={cn(skeletonVariants({ variant }), 'overflow-hidden', className)}
        style={[radiusStyle, style]}
        {...props}
      >
        <Animated.View
          style={[
            shimmerStyle,
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: shimmerBandWidth,
              backgroundColor: colors.surfaceHighlight,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[pulseStyle, radiusStyle, style]}
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton, skeletonVariants };
