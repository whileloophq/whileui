import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { cn } from '../../lib/cn';
import { composeEventHandlers, type AsChildElement } from '../../lib/compose-event-handlers';
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
import { Pressable, type PressableProps } from '../pressable';

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export interface DropdownMenuTriggerProps extends PressableProps {
  className?: string;
  /** Give the press to the single child instead of wrapping it in another pressable. */
  asChild?: boolean;
}

export type DropdownMenuContentProps = MenuSheetContentProps;
export type DropdownMenuItemProps = MenuSheetItemProps;
export type DropdownMenuLabelProps = MenuSheetLabelProps;
export type DropdownMenuSeparatorProps = MenuSheetSeparatorProps;

function DropdownMenu({ children }: DropdownMenuProps) {
  return <MenuSheetRoot>{children}</MenuSheetRoot>;
}

function DropdownMenuTrigger({
  className,
  children,
  asChild,
  onPress,
  ...props
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useMenuSheet();
  const openMenu = composeEventHandlers<GestureResponderEvent>(onPress ?? undefined, () =>
    setOpen(true)
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onPress: composeEventHandlers(child.props.onPress, openMenu),
      'aria-expanded': open,
    } as Partial<PressableProps>);
  }

  return (
    <Pressable className={className} aria-expanded={open} {...props} onPress={openMenu}>
      {children}
    </Pressable>
  );
}

function DropdownMenuContent(props: DropdownMenuContentProps) {
  return <MenuSheetContent {...props} />;
}

function DropdownMenuItem(props: DropdownMenuItemProps) {
  return <MenuSheetItem {...props} />;
}

function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  return <MenuSheetLabel {...props} />;
}

function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  return <MenuSheetSeparator {...props} />;
}

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
DropdownMenuContent.displayName = 'DropdownMenuContent';
DropdownMenuItem.displayName = 'DropdownMenuItem';
DropdownMenuLabel.displayName = 'DropdownMenuLabel';
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
