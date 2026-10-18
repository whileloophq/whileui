import React from 'react';
import {
  View,
  Pressable,
  Platform,
  Modal,
  I18nManager,
  SectionList,
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
import { useTapOnly } from '../../lib/tap-only';
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

interface DrawerItemRowProps {
  item: DrawerMenuItem;
  active: boolean;
  onSelect: (key: string) => void;
  interaction: ReturnType<typeof useInteractionTokens>;
  visual: ReturnType<typeof useVisualTokens>;
}

function DrawerItemRow({ item, active, onSelect, interaction, visual }: DrawerItemRowProps) {
  const handlePress = React.useCallback(() => onSelect(item.key), [item.key, onSelect]);
  const pressStyle = React.useMemo(
    () =>
      withInteractivePressableStyle(
        {
          borderRadius: visual.radiusLg,
          paddingHorizontal: visual.controlPaddingXDefault,
          paddingVertical: visual.controlPaddingYDefault,
          minHeight: visual.touchTargetMinSize,
        },
        interaction,
        { pressedVariant: 'default' }
      ),
    [interaction, visual]
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      className={cn(
        'flex-row items-center gap-3 mx-1 transition-colors',
        active && 'bg-primary-soft-subtle'
      )}
      style={pressStyle}
    >
      {item.icon}
      <Text
        className={cn(
          'flex-1 font-semibold tracking-tight',
          item.destructive ? 'text-destructive' : active ? 'text-primary' : 'text-foreground'
        )}
        style={{ fontSize: visual.drawerItemFontSize }}
      >
        {item.label}
      </Text>
      {item.badge === undefined ? null : (
        <View
          className="bg-primary px-2 py-0.5 items-center"
          style={{ minWidth: visual.drawerBadgeMinWidth, borderRadius: visual.badgeRadius }}
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
}

function DrawerSectionGap() {
  return <View className="mb-4" />;
}

function DrawerItemGap() {
  return <View className="h-0.5" />;
}

interface DrawerSectionListProps {
  sections: DrawerMenuSection[];
  activeKey: string | undefined;
  onSelect: (key: string) => void;
  interaction: ReturnType<typeof useInteractionTokens>;
  visual: ReturnType<typeof useVisualTokens>;
}

function DrawerSectionList({
  sections,
  activeKey,
  onSelect,
  interaction,
  visual,
}: DrawerSectionListProps) {
  const data = React.useMemo(
    () => sections.map((section) => ({ title: section.title, data: section.items })),
    [sections]
  );
  const renderItem = React.useCallback(
    ({ item }: { item: DrawerMenuItem }) => (
      <DrawerItemRow
        item={item}
        active={activeKey === item.key}
        onSelect={onSelect}
        interaction={interaction}
        visual={visual}
      />
    ),
    [activeKey, interaction, onSelect, visual]
  );
  const renderSectionHeader = React.useCallback(
    ({ section }: { section: { title?: string } }) =>
      section.title ? (
        <Text
          accessibilityRole="header"
          className="font-medium text-muted-foreground uppercase tracking-wide px-3 mb-2"
          style={{ fontSize: visual.navSectionTitleFontSize }}
        >
          {section.title}
        </Text>
      ) : null,
    [visual.navSectionTitleFontSize]
  );

  return (
    <SectionList
      sections={data}
      keyExtractor={(item) => item.key}
      className="flex-1 px-3"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={DrawerSectionGap}
      ItemSeparatorComponent={DrawerItemGap}
      renderItem={renderItem}
    />
  );
}

interface DrawerAnimationOptions {
  visible: boolean;
  drawerWidth: number;
  interaction: ReturnType<typeof useInteractionTokens>;
  motion: ReturnType<typeof useMotionPolicy>;
}

function useDrawerAnimation({ visible, drawerWidth, interaction, motion }: DrawerAnimationOptions) {
  const progress = useSharedValue(0);
  const [mounted, setMounted] = React.useState(visible);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevVisible, setPrevVisible] = React.useState(visible);

  // Open in the prop-change render so the first animation frame has a mounted panel;
  // closing stays mounted on the timer until the exit animation finishes.
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
      easing: visible ? Easing.bezier(0.2, 0.8, 0.2, 1) : Easing.bezier(0.4, 0, 1, 1),
    });

    if (!visible) {
      closeTimerRef.current = setTimeout(() => setMounted(false), duration);
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
  // RN mirrors the anchored edge in RTL, so the off-screen translation mirrors too.
  const offscreenX = I18nManager.isRTL ? drawerWidth : -drawerWidth;
  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [offscreenX, 0]) }],
  }));
  const containerStyle = useAnimatedStyle(() => ({
    pointerEvents: progress.value > 0 ? 'auto' : 'none',
  }));

  return { mounted, backdropStyle, drawerStyle, containerStyle };
}

function resolveDrawerLayout(
  screenWidth: number,
  maxWidth: number | undefined,
  frosted: boolean,
  visual: ReturnType<typeof useVisualTokens>
) {
  const rawWidth = screenWidth * visual.drawerWidthRatio;
  const effectiveMaxWidth =
    maxWidth ?? (Platform.OS === 'web' ? visual.drawerMaxWidthWeb : undefined);
  const width = effectiveMaxWidth == null ? rawWidth : Math.min(rawWidth, effectiveMaxWidth);
  const inset = frosted ? visual.drawerFrostedInset : 0;
  const radius = frosted ? visual.drawerFrostedRadius : surfaceRadius(visual, 'xl');
  return { width, inset, radius, floating: frosted && inset > 0 };
}

function resolveBackdropBlur(blurIntensity: number | undefined, scale: number): number | undefined {
  return typeof blurIntensity === 'number' && Number.isFinite(blurIntensity)
    ? blurIntensity * scale
    : undefined;
}

function drawerPanelClassName(frosted: boolean, className: string | undefined) {
  return cn(
    frosted
      ? 'border border-border relative overflow-hidden'
      : 'border-r border-border relative overflow-hidden',
    frosted ? 'bg-transparent' : 'bg-background',
    className
  );
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
  const backdropPress = useTapOnly(onClose);
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });
  const frostedBackdrop = useFrostedBackdrop({
    frosted,
    blurIntensity: resolveBackdropBlur(blurIntensity, visual.frostedBackdropBlurScale),
    tintColor: colors.overlay,
  });
  const { width: screenWidth } = useWindowDimensions();
  const layout = resolveDrawerLayout(screenWidth, maxWidth, frosted, visual);
  const contentTopPadding = insets.top + visual.drawerContentTopPadding;
  const { mounted, backdropStyle, drawerStyle, containerStyle } = useDrawerAnimation({
    visible,
    drawerWidth: layout.width,
    interaction,
    motion,
  });

  const handleItemPress = React.useCallback(
    (key: string) => {
      onSelect?.(key);
    },
    [onSelect]
  );

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
        {/* Backdrop: tap-to-dismiss only, not a control, and a drag across it is not a tap. */}
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          style={StyleSheet.absoluteFill}
          {...backdropPress}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: layout.inset,
            bottom: layout.inset,
            left: layout.inset,
            width: Math.max(layout.width - layout.inset, 0),
            borderTopRightRadius: layout.radius,
            borderBottomRightRadius: layout.radius,
            borderTopLeftRadius: layout.floating ? layout.radius : 0,
            borderBottomLeftRadius: layout.floating ? layout.radius : 0,
          },
          shadowStyle(visual, colors, frosted ? 'lg' : 'md'),
          drawerStyle,
          frostedSurface.surfaceStyle,
          style,
        ]}
        className={drawerPanelClassName(frosted, className)}
      >
        {frostedSurface.overlay}
        <View className="flex-1 pb-8" style={{ paddingTop: contentTopPadding }}>
          {header && <View className="px-5 pb-4 mb-2 border-b border-border">{header}</View>}

          <DrawerSectionList
            sections={sections}
            activeKey={activeKey}
            onSelect={handleItemPress}
            interaction={interaction}
            visual={visual}
          />

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
