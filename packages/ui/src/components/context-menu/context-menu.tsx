import React, { createContext, useContext, useMemo, useState } from 'react';
import { type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { View, Modal, Pressable, Text, type ViewProps, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';
import type { AsChildElement } from '../../lib/compose-event-handlers';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

interface ContextMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue>({
  open: false,
  setOpen: () => {},
});

export interface ContextMenuProps {
  children: React.ReactNode;
}

export interface ContextMenuTriggerProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

export interface ContextMenuContentProps extends ViewProps, FrostedSurfaceProps {
  className?: string;
}

export interface ContextMenuItemProps extends PressableProps {
  className?: string;
}

export interface ContextMenuLabelProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ContextMenuSeparatorProps extends ViewProps {
  className?: string;
}

function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const contextValue = useMemo(() => ({ open, setOpen }), [open]);
  return <ContextMenuContext.Provider value={contextValue}>{children}</ContextMenuContext.Provider>;
}

function ContextMenuTrigger({ className, children, asChild, ...props }: ContextMenuTriggerProps) {
  const { setOpen } = useContext(ContextMenuContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      onLongPress: (e: GestureResponderEvent) => {
        child.props.onLongPress?.(e);
        setOpen(true);
      },
      delayLongPress: 300,
      ...props,
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(className)}
      onLongPress={() => setOpen(true)}
      delayLongPress={300}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function ContextMenuContent({
  className,
  children,
  frosted = false,
  blurIntensity,
  blurTintToken,
  style,
  ...props
}: ContextMenuContentProps) {
  const { open, setOpen } = useContext(ContextMenuContext);
  const visual = useVisualTokens();
  const colors = useThemeColors();
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

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      {/* Both of these are containers. Pressable defaults to `accessible: true`, which on
          iOS collapses every descendant into a single accessibility element — the menu
          items inside would be unreachable. */}
      <Pressable
        accessible={false}
        importantForAccessibility="no"
        className="flex-1 justify-end"
        onPress={() => setOpen(false)}
      >
        <Pressable
          accessible={false}
          accessibilityRole="menu"
          className={cn(
            'w-full border-border p-2 pb-8 relative overflow-hidden',
            frosted ? 'bg-transparent' : 'bg-popover',
            className
          )}
          style={contentStyle}
          onPress={(e) => e.stopPropagation()}
          {...props}
        >
          {frostedSurface.overlay}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ContextMenuItem({ className, style, ...props }: ContextMenuItemProps) {
  const { setOpen } = useContext(ContextMenuContext);
  const visual = useVisualTokens();
  const tokenStyle: ViewStyle = {
    borderRadius: visual.radiusSm,
    minHeight: visual.touchTargetMinSize,
    paddingHorizontal: visual.controlPaddingXSm,
    paddingVertical: visual.controlPaddingYSm,
  };
  return (
    <Pressable
      accessibilityRole="menuitem"
      className={cn('flex flex-row items-center active:bg-accent', className)}
      style={(state) => [tokenStyle, typeof style === 'function' ? style(state) : style]}
      onPress={(e) => {
        props.onPress?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function ContextMenuLabel({ className, children, ...props }: ContextMenuLabelProps) {
  const visual = useVisualTokens();
  return (
    <View className={cn('px-2 py-1.5', className)} {...props}>
      {typeof children === 'string' ? (
        <Text
          // A menu section label is a heading — without this it announces as plain text
          // and rotor navigation cannot find it.
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

function ContextMenuSeparator({ className, style, ...props }: ContextMenuSeparatorProps) {
  const visual = useVisualTokens();
  return (
    <View
      className={cn('-mx-1 my-1 bg-border', className)}
      style={[{ height: visual.borderWidthHairline }, style]}
      {...props}
    />
  );
}

ContextMenu.displayName = 'ContextMenu';
ContextMenuTrigger.displayName = 'ContextMenuTrigger';
ContextMenuContent.displayName = 'ContextMenuContent';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuLabel.displayName = 'ContextMenuLabel';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
};
