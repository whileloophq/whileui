import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  type TextProps,
  type PressableProps,
} from 'react-native';
import { cn } from '../../lib/cn';
import { composeEventHandlers, type AsChildElement } from '../../lib/compose-event-handlers';
import { useThemeColors } from '../../lib/theme-colors';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { shadowStyle, typographyStyle } from '../../lib/recipes';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},
});

export interface DialogProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface DialogTriggerProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

export interface DialogContentProps extends ViewProps, FrostedSurfaceProps {
  className?: string;
}

export interface DialogOverlayProps extends ViewProps {
  className?: string;
}

export interface DialogHeaderProps extends ViewProps {
  className?: string;
}

export interface DialogFooterProps extends ViewProps {
  className?: string;
}

export interface DialogTitleProps extends TextProps {
  className?: string;
}

export interface DialogDescriptionProps extends TextProps {
  className?: string;
}

export interface DialogCloseProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

function Dialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange]
  );
  const contextValue = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

function DialogTrigger({ className, children, asChild, onPress, ...props }: DialogTriggerProps) {
  const { setOpen } = useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onPress: composeEventHandlers(composeEventHandlers(child.props.onPress, onPress), () =>
        setOpen(true)
      ),
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      className={cn(className)}
      onPress={composeEventHandlers(onPress, () => setOpen(true))}
    >
      {children}
    </Pressable>
  );
}

function DialogContent({
  className,
  children,
  frosted = false,
  blurIntensity,
  blurTintToken,
  style,
  ...props
}: DialogContentProps) {
  const { open, setOpen } = useContext(DialogContext);
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });
  const contentStyle: StyleProp<ViewStyle> = [frostedSurface.surfaceStyle, style];

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        // Tap-to-dismiss is a pointer affordance. Left accessible it would swallow the
        // whole panel into one element; screen reader users close from inside.
        accessible={false}
        importantForAccessibility="no"
        className="flex-1 justify-center items-center px-4"
        style={{ backgroundColor: colors.overlayStrong }}
        onPress={() => setOpen(false)}
      >
        <Pressable
          // Container, not a control — Pressable defaults to `accessible: true`, which
          // on iOS collapses every descendant into one accessibility element.
          accessible={false}
          className={cn(
            'w-full border-border relative overflow-hidden',
            frosted ? 'bg-transparent' : 'bg-background',
            className
          )}
          style={[
            {
              maxWidth: visual.sheetMaxWidth,
              borderWidth: visual.borderWidthHairline,
              borderRadius: visual.radiusXl,
              padding: visual.surfacePaddingDefault,
            },
            shadowStyle(visual, colors, 'lg'),
            contentStyle,
          ]}
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

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <View className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />;
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <View className={cn('flex flex-row justify-end gap-2 pt-4', className)} {...props} />;
}

function DialogTitle({ className, style, ...props }: DialogTitleProps) {
  const visual = useVisualTokens();
  return (
    <Text
      className={cn('font-semibold text-foreground', className)}
      style={[typographyStyle(visual, 'title'), style]}
      {...props}
    />
  );
}

function DialogDescription({ className, style, ...props }: DialogDescriptionProps) {
  const visual = useVisualTokens();
  return (
    <Text
      className={cn('text-muted-foreground', className)}
      style={[typographyStyle(visual, 'label'), style]}
      {...props}
    />
  );
}

// ... (interfaces update needed too)

function DialogClose({ className, children, asChild, onPress, ...props }: DialogCloseProps) {
  const { setOpen } = useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onPress: composeEventHandlers(composeEventHandlers(child.props.onPress, onPress), () =>
        setOpen(false)
      ),
    });
  }

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      className={cn(className)}
      onPress={composeEventHandlers(onPress, () => setOpen(false))}
    >
      {children}
    </Pressable>
  );
}

Dialog.displayName = 'Dialog';
DialogTrigger.displayName = 'DialogTrigger';
DialogContent.displayName = 'DialogContent';
DialogHeader.displayName = 'DialogHeader';
DialogFooter.displayName = 'DialogFooter';
DialogTitle.displayName = 'DialogTitle';
DialogDescription.displayName = 'DialogDescription';
DialogClose.displayName = 'DialogClose';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
