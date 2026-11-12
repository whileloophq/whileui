import React from 'react';
import { Platform, type GestureResponderEvent } from 'react-native';
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

export interface ContextMenuProps {
  children: React.ReactNode;
}

export interface ContextMenuTriggerProps extends PressableProps {
  className?: string;
  /** Give the long press to the single child instead of wrapping it in another pressable. */
  asChild?: boolean;
}

export type ContextMenuContentProps = MenuSheetContentProps;
export type ContextMenuItemProps = MenuSheetItemProps;
export type ContextMenuLabelProps = MenuSheetLabelProps;
export type ContextMenuSeparatorProps = MenuSheetSeparatorProps;

const LONG_PRESS_MS = 300;
const OPEN_KEYS = new Set(['ContextMenu', 'Enter', ' ']);

function ContextMenu({ children }: ContextMenuProps) {
  return <MenuSheetRoot>{children}</MenuSheetRoot>;
}

function ContextMenuTrigger({
  className,
  children,
  asChild,
  onLongPress,
  ...props
}: ContextMenuTriggerProps) {
  const { open, setOpen } = useMenuSheet();
  const openMenu = composeEventHandlers<GestureResponderEvent>(onLongPress ?? undefined, () =>
    setOpen(true)
  );
  // A long press has no keyboard or mouse equivalent, so on web the menu also opens on
  // right-click and from the keyboard: the context-menu key, Shift+F10, Enter or Space.
  const web =
    Platform.OS === 'web'
      ? {
          onContextMenu: (event: { preventDefault(): void }) => {
            event.preventDefault();
            setOpen(true);
          },
          onKeyDown: (event: {
            nativeEvent: { key: string; shiftKey?: boolean };
            preventDefault(): void;
          }) => {
            const { key, shiftKey } = event.nativeEvent;
            if (OPEN_KEYS.has(key) || (shiftKey && key === 'F10')) {
              event.preventDefault();
              setOpen(true);
            }
          },
        }
      : null;

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      ...web,
      className: cn(child.props.className, className),
      onLongPress: composeEventHandlers(child.props.onLongPress, openMenu),
      delayLongPress: LONG_PRESS_MS,
      'aria-expanded': open,
    } as Partial<PressableProps>);
  }

  return (
    <Pressable
      className={className}
      aria-expanded={open}
      delayLongPress={LONG_PRESS_MS}
      {...props}
      {...web}
      onLongPress={openMenu}
    >
      {children}
    </Pressable>
  );
}

function ContextMenuContent(props: ContextMenuContentProps) {
  return <MenuSheetContent {...props} />;
}

function ContextMenuItem(props: ContextMenuItemProps) {
  return <MenuSheetItem {...props} />;
}

function ContextMenuLabel(props: ContextMenuLabelProps) {
  return <MenuSheetLabel {...props} />;
}

function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  return <MenuSheetSeparator {...props} />;
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
