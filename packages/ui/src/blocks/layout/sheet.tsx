import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  type ScrollViewProps,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { composeEventHandlers, type AsChildElement } from '../../lib/compose-event-handlers';
import { useThemeColors } from '../../lib/theme-colors';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { OverlayHost } from '../../lib/overlay-host';
import { useOverlayPresence } from '../../lib/overlay-presence';
import { useTapOnly } from '../../lib/tap-only';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';
import {
  useFrostedSurface,
  useFrostedBackdrop,
  type FrostedSurfaceProps,
} from '../../lib/frosted-surface';

interface SheetContextValue {
  onClose: () => void;
}

const SheetContext = createContext<SheetContextValue>({ onClose: () => {} });

export interface SheetProps extends FrostedSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Max height: 'half' | 'full' | number (px). Default 'full' */
  maxHeight?: 'half' | 'full' | number;
  /** Web: max width. Default ~360 for mobile-first. */
  maxWidth?: number;
}

export interface SheetHeaderProps extends ViewProps {
  title?: string;
  description?: string;
}

export interface SheetContentProps extends ScrollViewProps {
  scrollEnabled?: boolean;
}

export interface SheetFooterProps extends ViewProps {}

export interface SheetCloseProps extends PressableProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  maxHeight = 'full',
  maxWidth: maxWidthProp,
  frosted = false,
  blurIntensity,
  blurTintToken,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const interaction = useInteractionTokens();
  const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);
  const backdropPress = useTapOnly(onClose);
  const contextValue = useMemo(() => ({ onClose }), [onClose]);
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
  const { height: screenHeight, width: windowWidth } = useWindowDimensions();
  // The host Modal does not animate: the backdrop fades in place while the panel slides,
  // so the dim layer never rises with the sheet.
  const { mounted, progress } = useOverlayPresence({
    visible: open,
    openDuration: interaction.motionSlow,
    closeDuration: interaction.motionNormal,
  });
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [screenHeight, 0]) }],
  }));

  const maxWidth = maxWidthProp ?? visual.sheetMaxWidth;

  const widthStyle =
    typeof maxWidth === 'number' && windowWidth >= visual.sheetTabletBreakpoint
      ? { maxWidth, alignSelf: 'center' as const, width: maxWidth }
      : {};

  const maxHeightStyle =
    maxHeight === 'full'
      ? { flex: 1 }
      : maxHeight === 'half'
        ? {
            maxHeight: screenHeight * visual.sheetHalfMaxHeightRatio,
            minHeight: Math.min(
              screenHeight * visual.sheetHalfMaxHeightRatio,
              visual.sheetHalfMinHeight
            ),
          }
        : { maxHeight };

  // A full-height sheet reaches the top of the screen, and the host Modal is
  // status-bar-translucent, so its header lands underneath the clock and battery. A
  // shorter sheet starts below the status bar and needs no inset of its own.
  const isFullHeight = maxHeight === 'full';

  const sheetStyle: StyleProp<ViewStyle> = [
    maxHeightStyle,
    {
      paddingTop: isFullHeight ? insets.top : 0,
      paddingBottom: Math.max(insets.bottom, 16),
      // Rounded top corners only read as "a sheet over something" when there is
      // something behind them. At full height they just fight the device's own corners.
      borderTopLeftRadius: isFullHeight ? 0 : surfaceRadius(visual, 'xl'),
      borderTopRightRadius: isFullHeight ? 0 : surfaceRadius(visual, 'xl'),
      borderWidth: visual.borderWidthHairline,
    },
    widthStyle,
    frostedSurface.surfaceStyle,
  ];

  return (
    <OverlayHost open={mounted} animationType="none" onRequestClose={open ? onClose : undefined}>
      <View className="flex-1 justify-end">
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: frosted ? 'transparent' : colors.overlay },
            backdropStyle,
          ]}
        >
          {frostedBackdrop}
        </Animated.View>
        {/* Tap-to-dismiss only, and a tap only: a drag across it must not close the sheet.
            Not an accessibility element; screen reader users close from inside. */}
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          className="flex-1"
          {...backdropPress}
        />
        <Animated.View
          className={cn(
            'border-border overflow-hidden relative',
            frosted ? 'bg-transparent' : 'bg-background'
          )}
          style={[sheetStyle, panelStyle]}
        >
          {frostedSurface.overlay}
          <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>
        </Animated.View>
      </View>
    </OverlayHost>
  );
}

export function SheetHeader({
  title,
  description,
  className,
  children,
  style,
  ...props
}: SheetHeaderProps) {
  const { onClose } = useContext(SheetContext);
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  return (
    <View
      className={cn('flex-row items-center justify-between gap-3 border-border', className)}
      style={[
        {
          borderBottomWidth: visual.borderWidthHairline,
          paddingHorizontal: surfacePadding(visual, 'sm'),
          paddingVertical: visual.controlPaddingYDefault,
        },
        style,
      ]}
      {...props}
    >
      <View className="flex-1 min-w-0 gap-0.5 self-stretch justify-center">
        {title && (
          <Text
            className="font-semibold text-foreground text-left"
            style={typographyStyle(visual, 'body')}
          >
            {title}
          </Text>
        )}
        {description && (
          <Text
            className="text-muted-foreground text-left"
            style={typographyStyle(visual, 'label')}
          >
            {description}
          </Text>
        )}
      </View>
      {children ?? (
        <Pressable
          onPress={onClose}
          className="p-2 -mr-2 -mt-2 -mb-2"
          style={withInteractivePressableStyle({ borderRadius: visual.radiusMd }, interaction, {
            pressedVariant: 'default',
          })}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text
            className="text-muted-foreground leading-none"
            style={typographyStyle(visual, 'title')}
          >
            ×
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export function SheetContent({
  scrollEnabled = true,
  className,
  children,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  nestedScrollEnabled = true,
  ...props
}: SheetContentProps) {
  const visual = useVisualTokens();
  const contentPadding = surfacePadding(visual, 'sm');

  if (scrollEnabled) {
    return (
      <ScrollView
        className={cn('flex-1', className)}
        style={style}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        nestedScrollEnabled={nestedScrollEnabled}
        contentContainerStyle={[{ padding: contentPadding }, contentContainerStyle]}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View
      className={cn('flex-1', className)}
      style={[{ padding: contentPadding }, contentContainerStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function SheetFooter({ className, style, ...props }: SheetFooterProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={cn('flex-row gap-2 justify-end border-border', className)}
      style={[
        {
          borderTopWidth: visual.borderWidthHairline,
          paddingHorizontal: surfacePadding(visual, 'sm'),
          paddingVertical: visual.controlPaddingYDefault,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function SheetClose({ children, asChild, className, onPress, ...props }: SheetCloseProps) {
  const { onClose } = useContext(SheetContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onPress: composeEventHandlers(composeEventHandlers(child.props.onPress, onPress), () =>
        onClose()
      ),
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      className={cn(className)}
      onPress={composeEventHandlers(onPress, () => onClose())}
    >
      {children}
    </Pressable>
  );
}
