import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  Alert,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  type TextProps,
  type PressableProps,
  type PressableStateCallbackType,
} from 'react-native';
import { cn } from '../../lib/cn';
import { composeEventHandlers, type AsChildElement } from '../../lib/compose-event-handlers';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';
import { useVisualTokens } from '../../lib/visual-tokens';
import { shadowStyle, typographyStyle } from '../../lib/recipes';

/** `overlay` = themed UI as an absolute layer inside the parent (no second RN Modal). Mount inside your sheet `Modal` for app-styled confirms. */
export type AlertDialogPresentation = 'modal' | 'native' | 'overlay';

type NativeAlertCopy = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
};

function emptyNativeCopy(): NativeAlertCopy {
  return {
    title: '',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel',
    onConfirm: null,
    onCancel: null,
  };
}

function textFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) {
    return node
      .reduce<string[]>((parts, child) => {
        const text = textFromNode(child);
        if (text) parts.push(text);
        return parts;
      }, [])
      .join(' ');
  }
  if (React.isValidElement(node)) {
    return textFromNode((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

/**
 * Finds the `AlertDialogTitle` in a subtree and returns its text, so the panel can carry
 * an accessible name from the same render that draws it. The native-alert path's copy ref
 * cannot serve this: it is populated by child layout effects, which run after this render
 * and never schedule another.
 */
function titleTextFromChildren(node: React.ReactNode): string {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = titleTextFromChildren(child);
      if (found) return found;
    }
    return '';
  }
  if (!React.isValidElement(node)) return '';

  const children = (node.props as { children?: React.ReactNode }).children;
  if (node.type === AlertDialogTitle) return textFromNode(children);
  return titleTextFromChildren(children);
}

/** Pressable children may be a render function; native alert only supports static labels. */
function textFromPressableChildren(
  children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)
): string {
  if (typeof children === 'function') return '';
  return textFromNode(children);
}

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  nativeCopyRef: React.RefObject<NativeAlertCopy>;
}

const fallbackNativeRef: React.RefObject<NativeAlertCopy> = { current: emptyNativeCopy() };

const AlertDialogContext = createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
  nativeCopyRef: fallbackNativeRef,
});

export interface AlertDialogProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface AlertDialogTriggerProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

export interface AlertDialogContentProps extends ViewProps, FrostedSurfaceProps {
  className?: string;
  /**
   * `modal` — RN `Modal` + themed card (default).
   * `native` — `Alert.alert` on iOS/Android (system chrome); ignored on web.
   * `overlay` — same themed card as `modal`, but absolute fill inside the parent view (nest inside your `Modal`).
   */
  presentation?: AlertDialogPresentation;
}

export interface AlertDialogHeaderProps extends ViewProps {
  className?: string;
}

export interface AlertDialogFooterProps extends ViewProps {
  className?: string;
}

export interface AlertDialogTitleProps extends TextProps {
  className?: string;
}

export interface AlertDialogDescriptionProps extends TextProps {
  className?: string;
}

export interface AlertDialogActionProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

export interface AlertDialogCancelProps extends PressableProps {
  className?: string;
}

function AlertDialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const [nativeCopyRef] = useState<React.RefObject<NativeAlertCopy>>(() => ({
    current: emptyNativeCopy(),
  }));

  const setOpen = useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange]
  );
  const contextValue = useMemo(
    () => ({ open, setOpen, nativeCopyRef }),
    [nativeCopyRef, open, setOpen]
  );

  return <AlertDialogContext.Provider value={contextValue}>{children}</AlertDialogContext.Provider>;
}

function AlertDialogTrigger({
  className,
  children,
  asChild,
  onPress,
  ...props
}: AlertDialogTriggerProps) {
  const { setOpen } = useContext(AlertDialogContext);

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

const nativeHiddenStyle = StyleSheet.create({
  root: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
    left: -4096,
    top: 0,
  },
}).root;

function AlertDialogContent({
  className,
  children,
  presentation = 'modal',
  frosted = false,
  blurIntensity,
  blurTintToken,
  style,
  ...props
}: AlertDialogContentProps) {
  const { open, setOpen, nativeCopyRef } = useContext(AlertDialogContext);
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

  const useNativeAlert =
    presentation === 'native' && (Platform.OS === 'ios' || Platform.OS === 'android');
  const useOverlay = presentation === 'overlay';

  const prevOpenRef = useRef(false);
  const nativeAlertShownForOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (!useNativeAlert) return;

    if (!open) {
      nativeAlertShownForOpenRef.current = false;
      prevOpenRef.current = false;
      return;
    }

    const isNewOpenCycle = !prevOpenRef.current;
    prevOpenRef.current = true;

    if (!isNewOpenCycle || nativeAlertShownForOpenRef.current) {
      return;
    }
    nativeAlertShownForOpenRef.current = true;

    let cancelled = false;

    const showNativeAlert = () => {
      if (cancelled) return;
      const snap: NativeAlertCopy = { ...nativeCopyRef.current };

      const buttons = [
        {
          text: snap.cancelLabel || 'Cancel',
          style: 'cancel' as const,
          onPress: () => {
            snap.onCancel?.();
            setOpen(false);
          },
        },
        {
          text: snap.confirmLabel || 'OK',
          style: 'destructive' as const,
          onPress: () => {
            snap.onConfirm?.();
            setOpen(false);
          },
        },
      ];

      const options =
        Platform.OS === 'android'
          ? {
              cancelable: true,
              onDismiss: () => setOpen(false),
            }
          : undefined;

      Alert.alert(snap.title || '', snap.message || undefined, buttons, options);
    };

    // After all layout effects in this commit (Title/Description/Action register copy).
    // Also avoids presenting UIAlertController in the same turn as an RN fullscreen Modal,
    // which often yields no visible alert on iOS.
    queueMicrotask(showNativeAlert);

    return () => {
      cancelled = true;
      // Strict Mode (dev) runs this cleanup before the microtask; reset guards so the
      // remounted effect can schedule Alert.alert again. Safe when open becomes false:
      // the next effect run also clears these refs.
      nativeAlertShownForOpenRef.current = false;
      prevOpenRef.current = false;
    };
  }, [open, useNativeAlert, setOpen, nativeCopyRef]);

  const themedBody = (
    <Pressable
      // Tap-to-dismiss is a pointer affordance. Left accessible, this Pressable would be
      // a single accessibility element wrapping the entire dialog, so VoiceOver would
      // reach one "dismiss" target and none of the buttons inside it. Screen reader users
      // dismiss with Cancel.
      accessible={false}
      importantForAccessibility="no"
      className="flex-1 justify-center items-center px-4"
      style={{ backgroundColor: colors.overlayStrong }}
      onPress={() => setOpen(false)}
    >
      <Pressable
        // This Pressable is a container: its only `onPress` stops the backdrop from
        // dismissing. `accessible={false}` is what keeps it that way — Pressable defaults
        // to `accessible: true`, which on iOS collapses every descendant into one element
        // and makes the confirm and cancel buttons unreachable.
        accessible={false}
        // A destructive confirmation is the worst place for a screen reader to wander
        // out of. `accessibilityViewIsModal` keeps VoiceOver inside the panel; Android
        // gets the same containment from the host Modal.
        accessibilityViewIsModal
        accessibilityRole="alert"
        // Names the panel where the container is exposed (Android contentDescription,
        // web `aria-label`). Read from the element tree because the native-alert copy ref
        // is filled by child layout effects, which run after this render.
        accessibilityLabel={titleTextFromChildren(children) || undefined}
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
        onPress={(event) => event.stopPropagation()}
        {...props}
      >
        {frostedSurface.overlay}
        {children}
      </Pressable>
    </Pressable>
  );

  if (useNativeAlert) {
    return (
      <View
        pointerEvents="none"
        style={nativeHiddenStyle}
        collapsable={false}
        importantForAccessibility="no-hide-descendants"
      >
        {children}
      </View>
    );
  }

  if (useOverlay) {
    if (!open) {
      return (
        <View
          pointerEvents="none"
          style={nativeHiddenStyle}
          collapsable={false}
          importantForAccessibility="no-hide-descendants"
        >
          {children}
        </View>
      );
    }
    return (
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
        {themedBody}
      </View>
    );
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      navigationBarTranslucent={Platform.OS === 'android'}
      onRequestClose={() => setOpen(false)}
    >
      {themedBody}
    </Modal>
  );
}

function useAlertDialogNativeCopy() {
  return useContext(AlertDialogContext).nativeCopyRef;
}

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return <View className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return <View className={cn('flex flex-row justify-end gap-2 pt-4', className)} {...props} />;
}

function AlertDialogTitle({ className, children, style, ...props }: AlertDialogTitleProps) {
  const nativeCopyRef = useAlertDialogNativeCopy();
  const visual = useVisualTokens();

  useLayoutEffect(() => {
    const copy = nativeCopyRef.current;
    copy.title = textFromNode(children);
    return () => {
      copy.title = '';
    };
  }, [children, nativeCopyRef]);

  return (
    <Text
      // Gives VoiceOver and TalkBack something to land on first inside the modal, and
      // lets rotor navigation find it. Set before the spread so callers can override.
      accessibilityRole="header"
      className={cn('font-semibold text-foreground', className)}
      style={[typographyStyle(visual, 'title'), style]}
      {...props}
    >
      {children}
    </Text>
  );
}

function AlertDialogDescription({
  className,
  children,
  style,
  ...props
}: AlertDialogDescriptionProps) {
  const nativeCopyRef = useAlertDialogNativeCopy();
  const visual = useVisualTokens();

  useLayoutEffect(() => {
    const copy = nativeCopyRef.current;
    copy.message = textFromNode(children);
    return () => {
      copy.message = '';
    };
  }, [children, nativeCopyRef]);

  return (
    <Text
      className={cn('text-muted-foreground', className)}
      style={[typographyStyle(visual, 'label'), style]}
      {...props}
    >
      {children}
    </Text>
  );
}

function AlertDialogAction({
  className,
  children,
  asChild,
  onPress,
  ...props
}: AlertDialogActionProps) {
  const { setOpen, nativeCopyRef } = useContext(AlertDialogContext);
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const onPressRef = useRef(onPress);
  useLayoutEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);
  const interactiveStyle = withInteractivePressableStyle(undefined, interaction, {
    pressedVariant: 'strong',
  });

  useLayoutEffect(() => {
    const copy = nativeCopyRef.current;
    copy.confirmLabel = textFromPressableChildren(children);
    copy.onConfirm = () => {
      const h = onPressRef.current;
      if (h) (h as (e?: unknown) => void)();
    };
    return () => {
      copy.confirmLabel = 'OK';
      copy.onConfirm = null;
    };
  }, [children, nativeCopyRef]);

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
      // Pressable sets no role of its own, so without this the confirm button in a
      // destructive dialog announces as a plain view. Before the spread, so a caller can
      // still override it.
      accessibilityRole="button"
      {...props}
      className={cn('inline-flex items-center justify-center bg-primary', className)}
      style={(state) => {
        const baseStyle =
          typeof interactiveStyle === 'function' ? interactiveStyle(state) : interactiveStyle;
        return [
          baseStyle,
          {
            minHeight: visual.controlHeightDefault,
            borderRadius: visual.radiusLg,
            paddingHorizontal: visual.controlPaddingXDefault,
            paddingVertical: visual.controlPaddingYDefault,
          },
        ];
      }}
      onPress={composeEventHandlers(onPress, () => setOpen(false))}
    >
      {typeof children === 'string' ? (
        <Text
          className="font-medium text-primary-foreground"
          style={typographyStyle(visual, 'label')}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function AlertDialogCancel({ className, children, onPress, ...props }: AlertDialogCancelProps) {
  const { setOpen, nativeCopyRef } = useContext(AlertDialogContext);
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const onPressRef = useRef(onPress);
  useLayoutEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);
  const interactiveStyle = withInteractivePressableStyle(undefined, interaction, {
    pressedVariant: 'default',
  });

  useLayoutEffect(() => {
    const copy = nativeCopyRef.current;
    copy.cancelLabel = textFromPressableChildren(children);
    copy.onCancel = () => {
      const h = onPressRef.current;
      if (h) (h as (e?: unknown) => void)();
    };
    return () => {
      copy.cancelLabel = 'Cancel';
      copy.onCancel = null;
    };
  }, [children, nativeCopyRef]);

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      className={cn(
        'inline-flex items-center justify-center border-border bg-transparent',
        className
      )}
      style={(state) => {
        const baseStyle =
          typeof interactiveStyle === 'function' ? interactiveStyle(state) : interactiveStyle;
        return [
          baseStyle,
          {
            minHeight: visual.controlHeightDefault,
            borderWidth: visual.borderWidthControl,
            borderRadius: visual.radiusLg,
            paddingHorizontal: visual.controlPaddingXDefault,
            paddingVertical: visual.controlPaddingYDefault,
          },
        ];
      }}
      onPress={composeEventHandlers(onPress, () => setOpen(false))}
    >
      {typeof children === 'string' ? (
        <Text className="font-medium text-foreground" style={typographyStyle(visual, 'label')}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

AlertDialog.displayName = 'AlertDialog';
AlertDialogTrigger.displayName = 'AlertDialogTrigger';
AlertDialogContent.displayName = 'AlertDialogContent';
AlertDialogHeader.displayName = 'AlertDialogHeader';
AlertDialogFooter.displayName = 'AlertDialogFooter';
AlertDialogTitle.displayName = 'AlertDialogTitle';
AlertDialogDescription.displayName = 'AlertDialogDescription';
AlertDialogAction.displayName = 'AlertDialogAction';
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
