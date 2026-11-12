import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewInstance,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { Pressable, type PressableProps } from '../components/pressable';
import { cn } from './cn';
import { composeEventHandlers } from './compose-event-handlers';
import { useFrostedSurface, type FrostedSurfaceProps } from './frosted-surface';
import { OverlayBackdrop } from './overlay-backdrop';
import { OverlayHost } from './overlay-host';
import { shadowStyle, surfaceRadius, typographyStyle } from './recipes';
import { useThemeColors } from './theme-colors';
import { useVisualTokens } from './visual-tokens';

/**
 * The one menu behind DropdownMenu, ContextMenu and Menubar, which differ only in what
 * opens them. It rises as a sheet from the bottom edge on every platform.
 *
 * The three used to be copies of each other, and shared a defect: an item spread the
 * caller's props after its own `onPress`, so any item with an `onPress` — every real
 * one — never closed its menu.
 */

interface MenuSheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuSheetContext = createContext<MenuSheetContextValue>({
  open: false,
  setOpen: () => {},
});

export function MenuSheetRoot({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MenuSheetContext.Provider value={value}>{children}</MenuSheetContext.Provider>;
}

export function useMenuSheet() {
  return useContext(MenuSheetContext);
}

export interface MenuSheetContentProps extends ViewProps, FrostedSurfaceProps {
  className?: string;
}

const ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])';

/** The DOM members the web keyboard handling needs; the package builds without DOM types. */
interface WebElement {
  focus(): void;
  querySelectorAll(selector: string): ArrayLike<WebElement>;
  ownerDocument: { activeElement: unknown };
}

export function MenuSheetContent({
  className,
  children,
  frosted = false,
  blurIntensity,
  blurTintToken,
  style,
  ...props
}: MenuSheetContentProps) {
  const { open, setOpen } = useMenuSheet();
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const panel = useRef<ViewInstance>(null);
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'popover',
    defaultBlurPreset: 'medium',
  });
  const contentStyle: StyleProp<ViewStyle> = [
    {
      borderTopLeftRadius: surfaceRadius(visual, 'lg'),
      borderTopRightRadius: surfaceRadius(visual, 'lg'),
      borderTopWidth: visual.borderWidthHairline,
      borderLeftWidth: visual.borderWidthHairline,
      borderRightWidth: visual.borderWidthHairline,
    },
    shadowStyle(visual, colors, 'md'),
    frostedSurface.surfaceStyle,
    style,
  ];

  // Web keyboard, as the WAI-ARIA menu pattern asks: focus starts on the first item, and
  // the arrow keys, Home and End move between items. On the web a React Native view is
  // its DOM element. The Modal restores focus to the trigger when it closes.
  const items = useCallback(() => {
    const node = panel.current as unknown as WebElement | null;
    return node ? Array.from(node.querySelectorAll(ITEM_SELECTOR)) : [];
  }, []);
  const focusFirst = useCallback(() => {
    if (Platform.OS === 'web') items()[0]?.focus();
  }, [items]);
  const onKeyDown = (event: { nativeEvent: { key: string }; preventDefault(): void }) => {
    const list = items();
    if (list.length === 0) return;
    const at = list.findIndex((item) => item === item.ownerDocument.activeElement);
    const next: Record<string, number> = {
      ArrowDown: (at + 1) % list.length,
      ArrowUp: (at - 1 + list.length) % list.length,
      Home: 0,
      End: list.length - 1,
    };
    const target = next[event.nativeEvent.key];
    if (target === undefined) return;
    event.preventDefault();
    list[target]?.focus();
  };

  return (
    <OverlayHost
      open={open}
      animationType="slide"
      onRequestClose={() => setOpen(false)}
      onShow={focusFirst}
    >
      <View className="flex-1 justify-end">
        <OverlayBackdrop onDismiss={() => setOpen(false)} />
        <View
          ref={panel}
          role="menu"
          className={cn(
            'w-full border-border p-2 pb-8 relative overflow-hidden',
            frosted ? 'bg-transparent' : 'bg-popover',
            className
          )}
          style={contentStyle}
          {...(Platform.OS === 'web' ? { onKeyDown } : null)}
          {...props}
        >
          {frostedSurface.overlay}
          {children}
        </View>
      </View>
    </OverlayHost>
  );
}

export interface MenuSheetItemProps extends PressableProps {
  className?: string;
}

export function MenuSheetItem({ className, style, onPress, ...props }: MenuSheetItemProps) {
  const { setOpen } = useMenuSheet();
  const visual = useVisualTokens();
  const tokenStyle: ViewStyle = {
    borderRadius: visual.radiusSm,
    minHeight: visual.touchTargetMinSize,
    paddingHorizontal: visual.controlPaddingXSm,
    paddingVertical: visual.controlPaddingYSm,
  };
  return (
    <Pressable
      role="menuitem"
      focusIndicator="inset"
      className={cn('flex flex-row items-center active:bg-state-pressed', className)}
      style={(state) => [tokenStyle, typeof style === 'function' ? style(state) : style]}
      {...props}
      // After the spread, so the menu always closes; a caller keeps it open with
      // `event.preventDefault()`.
      onPress={composeEventHandlers<GestureResponderEvent>(onPress ?? undefined, () =>
        setOpen(false)
      )}
    />
  );
}

export interface MenuSheetLabelProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

export function MenuSheetLabel({ className, children, ...props }: MenuSheetLabelProps) {
  const visual = useVisualTokens();
  return (
    <View className={cn('px-2 py-1.5', className)} {...props}>
      {typeof children === 'string' ? (
        <Text
          // A section label is a heading, so rotor navigation can find it.
          accessibilityRole="header"
          className="font-semibold text-foreground"
          style={typographyStyle(visual, 'label')}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export interface MenuSheetSeparatorProps extends ViewProps {
  className?: string;
}

export function MenuSheetSeparator({ className, style, ...props }: MenuSheetSeparatorProps) {
  const visual = useVisualTokens();
  return (
    <View
      className={cn('-mx-1 my-1 bg-border', className)}
      style={[{ height: visual.borderWidthHairline }, style]}
      {...props}
    />
  );
}
