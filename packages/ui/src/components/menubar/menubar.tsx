import React from 'react';
import { View, type GestureResponderEvent, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { composeEventHandlers } from '../../lib/compose-event-handlers';
import {
  MenuSheetContent,
  MenuSheetItem,
  MenuSheetLabel,
  MenuSheetRoot,
  MenuSheetSeparator,
  useMenuSheet,
  type MenuSheetContentProps,
  type MenuSheetItemProps,
  type MenuSheetLabelProps,
  type MenuSheetSeparatorProps,
} from '../../lib/menu-sheet';
import { controlRecipe } from '../../lib/recipes';
import { useVisualTokens } from '../../lib/visual-tokens';
import { Pressable, type PressableProps } from '../pressable';

export interface MenubarProps extends ViewProps {
  className?: string;
}

export interface MenubarMenuProps {
  children: React.ReactNode;
}

export interface MenubarTriggerProps extends PressableProps {
  className?: string;
}

export type MenubarContentProps = MenuSheetContentProps;
export type MenubarItemProps = MenuSheetItemProps;
export type MenubarLabelProps = MenuSheetLabelProps;
export type MenubarSeparatorProps = MenuSheetSeparatorProps;

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
  return <MenuSheetRoot>{children}</MenuSheetRoot>;
}

function MenubarTrigger({ className, style, onPress, ...props }: MenubarTriggerProps) {
  const { open, setOpen } = useMenuSheet();
  const visual = useVisualTokens();
  const tokenStyle = controlRecipe(visual, 'sm');
  return (
    <Pressable
      className={cn('active:bg-state-pressed', className)}
      style={(state) => [tokenStyle, typeof style === 'function' ? style(state) : style]}
      aria-expanded={open}
      {...props}
      onPress={composeEventHandlers<GestureResponderEvent>(onPress ?? undefined, () =>
        setOpen(true)
      )}
    />
  );
}

function MenubarContent(props: MenubarContentProps) {
  return <MenuSheetContent {...props} />;
}

function MenubarItem(props: MenubarItemProps) {
  return <MenuSheetItem {...props} />;
}

function MenubarLabel(props: MenubarLabelProps) {
  return <MenuSheetLabel {...props} />;
}

function MenubarSeparator(props: MenubarSeparatorProps) {
  return <MenuSheetSeparator {...props} />;
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
