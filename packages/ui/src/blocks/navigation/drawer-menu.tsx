import React, { useCallback } from 'react';
import {
  View,
  Platform,
  I18nManager,
  SectionList,
  useWindowDimensions,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { shadowStyle, surfaceRadius } from '../../lib/recipes';
import { OverlayBackdrop } from '../../lib/overlay-backdrop';
import { OverlayHost } from '../../lib/overlay-host';
import { useOverlayPresence } from '../../lib/overlay-presence';
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
  /** Whether the drawer is open. */
  open: boolean;
  /** Called with `false` when the user dismisses the drawer. */
  onOpenChange: (open: boolean) => void;
  sections: DrawerMenuSection[];
  /** Key of the item to mark as current. */
  value?: string;
  /** Called with the key of the item the user chose. */
  onValueChange?: (key: string) => void;
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
  visual: ReturnType<typeof useVisualTokens>;
}

function DrawerItemRow({ item, active, onSelect, visual }: DrawerItemRowProps) {
  const handlePress = React.useCallback(() => onSelect(item.key), [item.key, onSelect]);
  const pressStyle = React.useMemo(
    () => ({
      borderRadius: visual.radiusLg,
      paddingHorizontal: visual.controlPaddingXDefault,
      paddingVertical: visual.controlPaddingYDefault,
      minHeight: visual.touchTargetMinSize,
    }),
    [visual]
  );

  return (
    <Pressable
      onPress={handlePress}
      feedback="default"
      className={cn(
        'flex-row items-center gap-3 mx-1 transition-colors',
        active && 'bg-primary-soft-subtle'
      )}
      style={pressStyle}
    >
      <View aria-hidden>{item.icon}</View>
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
  visual: ReturnType<typeof useVisualTokens>;
}

function DrawerSectionList({ sections, activeKey, onSelect, visual }: DrawerSectionListProps) {
  const data = React.useMemo(
    () => sections.map((section) => ({ title: section.title, data: section.items })),
    [sections]
  );
  // Every row in the first render: a drawer is short, and the rows a virtualized list
  // mounted in later batches were drawn but never reached the iOS accessibility tree,
  // so VoiceOver could not reach them. A header and a footer count as rows too.
  const rowCount = sections.reduce((count, section) => count + section.items.length + 2, 0);
  const renderItem = React.useCallback(
    ({ item }: { item: DrawerMenuItem }) => (
      <DrawerItemRow
        item={item}
        active={activeKey === item.key}
        onSelect={onSelect}
        visual={visual}
      />
    ),
    [activeKey, onSelect, visual]
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
      initialNumToRender={rowCount}
    />
  );
}

interface DrawerAnimationOptions {
  visible: boolean;
  drawerWidth: number;
  interaction: ReturnType<typeof useInteractionTokens>;
}

function useDrawerAnimation({ visible, drawerWidth, interaction }: DrawerAnimationOptions) {
  const { mounted, progress } = useOverlayPresence({
    visible,
    openDuration: interaction.drawerOpenDuration,
    closeDuration: interaction.drawerCloseDuration,
  });

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
  open: visible,
  onOpenChange,
  sections,
  value: activeKey,
  onValueChange: onSelect,
  header,
  footer,
  maxWidth,
  className,
  style,
  frosted = false,
  blurIntensity,
  blurTintToken,
}: DrawerMenuProps) {
  const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
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
        <OverlayBackdrop onDismiss={onClose} />
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
            visual={visual}
          />

          {footer && <View className="px-5 py-4 mt-auto border-t border-border">{footer}</View>}
        </View>
      </Animated.View>
    </Animated.View>
  );

  return (
    <OverlayHost open={mounted} animationType="none" onRequestClose={visible ? onClose : undefined}>
      {drawerTree}
    </OverlayHost>
  );
}
