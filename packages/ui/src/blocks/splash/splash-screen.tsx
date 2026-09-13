import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

export interface SplashScreenProps extends ViewProps {
  /** App name displayed below logo */
  appName?: string;
  /** Tagline displayed below app name */
  tagline?: string;
  /** Logo element (icon, image, or custom component) */
  logo?: React.ReactNode;
  /** Animation variant */
  variant?: 'fade' | 'scale' | 'slide';
  /** Animation duration in ms */
  duration?: number;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Whether to show loading indicator */
  showLoading?: boolean;
  /** Loading text */
  loadingText?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function LoadingDot({ delay }: { delay: number }) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
          withTiming(0.6, { duration: 400, easing: Easing.in(Easing.cubic) })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
          withTiming(0.3, { duration: 400, easing: Easing.in(Easing.cubic) })
        ),
        -1,
        false
      )
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={animatedStyle} className="h-2 w-2 rounded-full bg-muted-foreground" />
  );
}

export function SplashScreen({
  appName,
  tagline,
  logo,
  variant = 'scale',
  duration = 800,
  onAnimationComplete,
  showLoading = false,
  loadingText,
  className,
  ...props
}: SplashScreenProps) {
  const visual = useVisualTokens();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(variant === 'scale' ? 0.8 : 1);
  const translateY = useSharedValue(variant === 'slide' ? 30 : 0);
  const loadingOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: duration * 0.6,
      easing: Easing.out(Easing.cubic),
    });

    if (variant === 'scale') {
      scale.value = withTiming(1, {
        duration: duration * 0.8,
        easing: Easing.out(Easing.back(1.5)),
      });
    }

    if (variant === 'slide') {
      translateY.value = withTiming(0, {
        duration: duration * 0.7,
        easing: Easing.out(Easing.cubic),
      });
    }

    if (showLoading) {
      loadingOpacity.value = withDelay(duration * 0.5, withTiming(1, { duration: 400 }));
    }

    if (onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [
    duration,
    loadingOpacity,
    onAnimationComplete,
    opacity,
    scale,
    showLoading,
    translateY,
    variant,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  return (
    <View className={cn('flex-1 items-center justify-center bg-background', className)} {...props}>
      <AnimatedView style={containerStyle} className="items-center">
        {logo && <View className="mb-6">{logo}</View>}

        {appName && (
          <Text className="text-4xl font-bold text-foreground tracking-tight">{appName}</Text>
        )}

        {tagline && (
          <Text
            className="mt-2 text-muted-foreground text-center px-8"
            style={typographyStyle(visual, 'body')}
          >
            {tagline}
          </Text>
        )}
      </AnimatedView>

      {showLoading && (
        <AnimatedView style={loadingStyle} className="absolute bottom-20 items-center">
          <View className="flex-row items-center gap-2">
            <LoadingDot delay={0} />
            <LoadingDot delay={150} />
            <LoadingDot delay={300} />
          </View>
          {loadingText && (
            <Text className="mt-3 text-muted-foreground" style={typographyStyle(visual, 'label')}>
              {loadingText}
            </Text>
          )}
        </AnimatedView>
      )}
    </View>
  );
}

export interface MinimalSplashProps extends Omit<SplashScreenProps, 'variant'> {}

/** Minimal splash with just logo and name */
export function MinimalSplash(props: MinimalSplashProps) {
  return <SplashScreen variant="fade" duration={600} {...props} />;
}

export interface BrandedSplashProps extends Omit<SplashScreenProps, 'variant' | 'showLoading'> {}

/** Branded splash with scale animation and loading */
export function BrandedSplash(props: BrandedSplashProps) {
  return <SplashScreen variant="scale" showLoading {...props} />;
}
