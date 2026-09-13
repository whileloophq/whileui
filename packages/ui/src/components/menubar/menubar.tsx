import React, { createContext, useContext, useMemo, useState } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { View, Modal, Pressable, Text, type ViewProps, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { controlRecipe, shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

interface MenubarMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenubarMenuContext = createContext<MenubarMenuContextValue>({
  open: false,
  setOpen: () => {},
});

export interface MenubarProps extends ViewProps {
  className?: string;
}

export interface MenubarMenuProps {
  children: React.ReactNode;
}

export interface MenubarTriggerProps extends PressableProps {
  className?: string;
}

export interface MenubarContentProps extends ViewProps, FrostedSurfaceProps {
  className?: string;
}

export interface MenubarItemProps extends PressableProps {
  className?: string;
}

export interface MenubarLabelProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarSeparatorProps extends ViewProps {
  className?: string;
}

function Menubar({ className, style, ...props }: MenubarProps) {
  const visual = useVisualTokens();
  return (
    <View
      className={cn('flex flex-row items-center gap-1 border-border bg-background p-1', className)}
      style={[{ borderRadius: visual.radiusLg, borderWidth: visual.borderWidthHairline }, style]}
      {...props}
    />
  );
}

function MenubarMenu({ children }: MenubarMenuProps) {
  const [open, setOpen] = useState(false);
  const contextValue = useMemo(() => ({ open, setOpen }), [open]);
  return <MenubarMenuContext.Provider value={contextValue}>{children}</MenubarMenuContext.Provider>;
}

function MenubarTrigger({ className, style, ...props }: MenubarTriggerProps) {
  const { setOpen } = useContext(MenubarMenuContext);
  const visual = useVisualTokens();
  const tokenStyle = controlRecipe(visual, 'sm');
  return (
    <Pressable
      accessibilityRole="button"
      className={cn('active:bg-accent', className)}
      style={(state) => [tokenStyle, typeof style === 'function' ? style(state) : style]}
      onPress={() => setOpen(true)}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  children,
  frosted = false,
  blurIntensity,
  blurTintToken,
  style,
  ...props
}: MenubarContentProps) {
  const { open, setOpen } = useContext(MenubarMenuContext);
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

function MenubarItem({ className, style, ...props }: MenubarItemProps) {
  const { setOpen } = useContext(MenubarMenuContext);
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

function MenubarLabel({ className, children, ...props }: MenubarLabelProps) {
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

function MenubarSeparator({ className, style, ...props }: MenubarSeparatorProps) {
  const visual = useVisualTokens();
  return (
    <View
      className={cn('-mx-1 my-1 bg-border', className)}
      style={[{ height: visual.borderWidthHairline }, style]}
      {...props}
    />
  );
}

Menubar.displayName = 'Menubar';
MenubarMenu.displayName = 'MenubarMenu';
MenubarTrigger.displayName = 'MenubarTrigger';
MenubarContent.displayName = 'MenubarContent';
MenubarItem.displayName = 'MenubarItem';
MenubarLabel.displayName = 'MenubarLabel';
MenubarSeparator.displayName = 'MenubarSeparator';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarSeparator,
};
