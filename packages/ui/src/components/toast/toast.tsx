import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, View, type ViewProps } from 'react-native';
import Animated, { FadeOut, SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../text';
import { cn } from '../../lib/cn';
import { CrossGlyph } from '../../lib/cross-glyph';
import { focusRing } from '../../lib/focus-ring';
import { useMotionPolicy } from '../../lib/motion-policy';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextValue {
  toasts: ToastData[];
  toast: (data: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

let toastId = 0;

/** Status variants carry a small dot, not a fill, so every toast sits on the theme's surface. */
const ACCENT_BY_VARIANT = {
  default: undefined,
  destructive: 'bg-destructive',
  success: 'bg-success',
} as const;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = `toast-${++toastId}`;
    setToasts((prev) => [...prev, { ...data, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = useMemo(
    () => ({ toasts, toast, dismiss, dismissAll }),
    [dismiss, dismissAll, toast, toasts]
  );

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
}

const toastVariants = tv({
  base: 'w-full flex-row items-center gap-3 border bg-popover',
  variants: {
    variant: {
      default: 'border-border',
      destructive: 'border-destructive-soft-border',
      success: 'border-success-soft-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ToastProps extends ViewProps, VariantProps<typeof toastVariants> {
  toast: ToastData;
  onDismiss: () => void;
}

function Toast({ toast: toastData, onDismiss, className, style, ...props }: ToastProps) {
  const { title, description, variant = 'default', duration = 4000, action } = toastData;
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const motion = useMotionPolicy();
  const accent = ACCENT_BY_VARIANT[variant];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  // Android and the web announce through the live region below; iOS has no live
  // regions, so it is told once, when the toast appears.
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const message = [title, description].filter(Boolean).join('. ');
    if (message) AccessibilityInfo.announceForAccessibility(message);
    // Announce on appearance only; a re-render must not repeat it.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per toast, by design
  }, []);

  return (
    <Animated.View
      entering={motion.animationsEnabled ? SlideInUp.duration(motion.durations.normal) : undefined}
      exiting={motion.animationsEnabled ? FadeOut.duration(motion.durations.fast) : undefined}
    >
      <View
        // Announced where it appears, without moving focus. Set before the spread so a
        // caller can still override.
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        className={cn(toastVariants({ variant }), className)}
        style={[
          {
            borderRadius: surfaceRadius(visual, 'lg'),
            borderWidth: visual.borderWidthHairline,
            padding: surfacePadding(visual, 'sm'),
          },
          shadowStyle(visual, colors, 'lg'),
          style,
        ]}
        {...props}
      >
        <View className="flex-1 gap-0.5">
          {title ? (
            <View className="flex-row items-center gap-2">
              {accent ? <View className={cn('h-2 w-2 rounded-full', accent)} /> : null}
              <Text
                className="font-semibold text-popover-foreground"
                style={typographyStyle(visual, 'label')}
              >
                {title}
              </Text>
            </View>
          ) : null}
          {description ? (
            <Text className="text-muted-foreground" style={typographyStyle(visual, 'label')}>
              {description}
            </Text>
          ) : null}
        </View>
        {action ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              action.onPress();
              onDismiss();
            }}
            className={cn('border border-border active:bg-state-pressed', focusRing)}
            style={{
              borderRadius: visual.radiusMd,
              borderWidth: visual.borderWidthControl,
              paddingHorizontal: visual.controlPaddingXSm,
              paddingVertical: visual.controlPaddingYSm,
            }}
          >
            <Text
              className="font-medium text-popover-foreground"
              style={typographyStyle(visual, 'label')}
            >
              {action.label}
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          // 44 px everywhere, since hitSlop does nothing on the web; the negative margin
          // keeps the toast as compact as the old 32 px button left it.
          hitSlop={2}
          className={cn(
            '-my-1.5 -mr-1.5 h-11 w-11 items-center justify-center rounded-full active:bg-state-pressed',
            focusRing
          )}
        >
          <CrossGlyph size={12} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export interface ToastContainerProps extends ViewProps {
  position?: 'top' | 'bottom';
}

function ToastContainerItem({
  toast,
  dismiss,
}: {
  toast: ToastData;
  dismiss: (id: string) => void;
}) {
  const handleDismiss = useCallback(() => dismiss(toast.id), [dismiss, toast.id]);
  return (
    <View className="mb-2">
      <Toast toast={toast} onDismiss={handleDismiss} />
    </View>
  );
}

export function ToastContainer({
  position = 'top',
  className,
  style,
  ...props
}: ToastContainerProps) {
  const { toasts, dismiss } = useToast();
  const visual = useVisualTokens();
  const insets = useSafeAreaInsets();

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';
  // The container is absolutely positioned at the screen edge, so it clears the status
  // bar or home indicator itself; every app was padding it by hand, each by a guess.
  const edgeInset =
    position === 'top' ? { paddingTop: insets.top + 8 } : { paddingBottom: insets.bottom + 8 };

  return (
    <View
      className={cn('absolute left-0 right-0 z-50 py-2', positionClass, className)}
      style={[{ paddingHorizontal: visual.surfacePaddingSm }, edgeInset, style]}
      pointerEvents="box-none"
      {...props}
    >
      {/* A notice is a sentence, not a banner. The cap is wider than any phone, so it
          only engages on tablets and the web. */}
      <View className="w-full max-w-md self-center" pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastContainerItem key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </View>
    </View>
  );
}

export { Toast, toastVariants };
