import React from 'react';
import {
  View,
  Pressable,
  Platform,
  Modal,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { shadowStyle, surfaceRadius } from '../../lib/recipes';
import { useMotionPolicy } from '../../lib/motion-policy';
import {
  useFrostedSurface,
  useFrostedBackdrop,
  type FrostedSurfaceProps,
} from '../../lib/frosted-surface';

export interface DrawerMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  destructive?: boolean;
}

export interface DrawerMenuSection {
  title?: string;
  items: DrawerMenuItem[];
}

export interface DrawerMenuProps extends FrostedSurfaceProps {
  visible: boolean;
  onClose: () => void;
  sections: DrawerMenuSection[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Max width in px. On web, defaults to 360 when not provided. */
  maxWidth?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function DrawerMenu({
  visible,
  onClose,
  sections,
  activeKey,
  onSelect,
  header,
  footer,
  maxWidth,
  className,
  style,
  frosted = false,
  blurIntensity,
  blurTintToken,
}: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const motion = useMotionPolicy();
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });
  const frostedBackdrop = useFrostedBackdrop({
    frosted,
    blurIntensity:
      typeof blurIntensity === 'number' && Number.isFinite(blurIntensity)
        ? blurIntensity * visual.frostedBackdropBlurScale
        : undefined,
    tintColor: colors.overlay,
  });
  const { width: screenWidth } = useWindowDimensions();
  const rawWidth = screenWidth * visual.drawerWidthRatio;
  const effectiveMaxWidth =
    maxWidth ?? (Platform.OS === 'web' ? visual.drawerMaxWidthWeb : undefined);
  const drawerWidth = effectiveMaxWidth != null ? Math.min(rawWidth, effectiveMaxWidth) : rawWidth;
  const frostedInset = frosted ? visual.drawerFrostedInset : 0;
  const cornerRadius = frosted ? visual.drawerFrostedRadius : surfaceRadius(visual, 'xl');
  const useFloatingFrostedDrawer = frosted && frostedInset > 0;
  const contentTopPadding = insets.top + visual.drawerContentTopPadding;
  const progress = useSharedValue(0);
  const [mounted, setMounted] = React.useState(visible);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mounting has to happen in the same commit that `visible` flips, or the drawer's
  // entrance animation loses its first frame. React's documented way to do that is to
  // adjust state during render on a props change rather than in an effect; the close
  // path is the asymmetric one and stays below, on a timer, so the exit can finish.
  const [prevVisible, setPrevVisible] = React.useState(visible);
  if (prevVisible !== visible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  React.useEffect(() => {
    if (!mounted) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const duration =
      motion.reduceMotion || !motion.animationsEnabled
        ? 0
        : visible
          ? interaction.drawerOpenDuration
          : interaction.drawerCloseDuration;
    progress.value = withTiming(visible ? 1 : 0, {
      duration,
      reduceMotion: motion.reanimatedReduceMotion,
      easing: visible
        ? Easing.bezier(0.2, 0.8, 0.2, 1) // Swift, decelerating entrance
        : Easing.bezier(0.4, 0, 1, 1), // Accelerating, sharp exit
    });

    if (!visible) {
      closeTimerRef.current = setTimeout(() => {
        setMounted(false);
      }, duration);
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [
    mounted,
    visible,
    progress,
    interaction.drawerOpenDuration,
    interaction.drawerCloseDuration,
    motion.animationsEnabled,
    motion.reduceMotion,
    motion.reanimatedReduceMotion,
  ]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-drawerWidth, 0]) }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  const handleItemPress = (key: string) => {
    onSelect?.(key);
  };

  if (!mounted) return null;

  const drawerTree = (
    <Animated.View style={[StyleSheet.absoluteFill, containerStyle]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: frosted ? 'transparent' : colors.overlayStrong },
          backdropStyle,
        ]}
      >
        {frostedBackdrop}
        {/* Backdrop: tap-to-dismiss only, not a control. */}
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: frostedInset,
            bottom: frostedInset,
            left: frostedInset,
            width: Math.max(drawerWidth - frostedInset, 0),
            borderTopRightRadius: cornerRadius,
            borderBottomRightRadius: cornerRadius,
            borderTopLeftRadius: useFloatingFrostedDrawer ? cornerRadius : 0,
            borderBottomLeftRadius: useFloatingFrostedDrawer ? cornerRadius : 0,
          },
          shadowStyle(visual, colors, frosted ? 'lg' : 'md'),
          drawerStyle,
          frostedSurface.surfaceStyle,
          style,
        ]}
        className={cn(
          frosted
            ? 'border border-border relative overflow-hidden'
            : 'border-r border-border relative overflow-hidden',
          frosted ? 'bg-transparent' : 'bg-background',
          className
        )}
      >
        {frostedSurface.overlay}
        <View className="flex-1 pb-8" style={{ paddingTop: contentTopPadding }}>
          {header && <View className="px-5 pb-4 mb-2 border-b border-border">{header}</View>}

          <ScrollView
            className="flex-1 px-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section, sectionIndex) => (
              <View key={sectionIndex} className="mb-4">
                {section.title && (
                  <Text
                    className="font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2"
                    style={{ fontSize: visual.navSectionTitleFontSize }}
                  >
                    {section.title}
                  </Text>
                )}
                <View className="gap-0.5">
                  {section.items.map((item) => {
                    const isActive = activeKey === item.key;
                    return (
                      <Pressable
                        key={item.key}
                        accessibilityRole="button"
                        onPress={() => handleItemPress(item.key)}
                        className={cn(
                          'flex-row items-center gap-3 mx-1 transition-colors',
                          isActive && 'bg-primary-soft-subtle'
                        )}
                        style={withInteractivePressableStyle(
                          {
                            borderRadius: visual.radiusLg,
                            paddingHorizontal: visual.controlPaddingXDefault,
                            paddingVertical: visual.controlPaddingYDefault,
                            minHeight: visual.touchTargetMinSize,
                          },
                          interaction,
                          {
                            pressedVariant: 'default',
                          }
                        )}
                      >
                        {item.icon}
                        <Text
                          className={cn(
                            'flex-1 font-semibold tracking-tight',
                            item.destructive
                              ? 'text-destructive'
                              : isActive
                                ? 'text-primary'
                                : 'text-foreground'
                          )}
                          style={{ fontSize: visual.drawerItemFontSize }}
                        >
                          {item.label}
                        </Text>
                        {item.badge !== undefined && (
                          <View
                            className="bg-primary px-2 py-0.5 items-center"
                            style={{
                              minWidth: visual.drawerBadgeMinWidth,
                              borderRadius: visual.badgeRadius,
                            }}
                          >
                            <Text
                              className="font-semibold text-primary-foreground"
                              style={{ fontSize: visual.navItemBadgeFontSize }}
                            >
                              {item.badge}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {footer && <View className="px-5 py-4 mt-auto border-t border-border">{footer}</View>}
        </View>
      </Animated.View>
    </Animated.View>
  );

  if (Platform.OS !== 'android') return drawerTree;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
    >
      {drawerTree}
    </Modal>
  );
}
