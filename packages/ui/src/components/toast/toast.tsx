import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { Text } from '../text';
import { cn } from '../../lib/cn';
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

const TEXT_COLOR_BY_VARIANT = {
  default: 'text-foreground',
  destructive: 'text-destructive-foreground',
  success: 'text-success-foreground',
} as const;

const DESCRIPTION_COLOR_BY_VARIANT = {
  default: 'text-muted-foreground',
  destructive: 'text-destructive-foreground-muted',
  success: 'text-success-foreground-muted',
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
  base: 'w-full flex-row items-center justify-between border',
  variants: {
    variant: {
      default: 'border-border bg-background',
      destructive: 'border-destructive bg-destructive',
      success: 'border-success bg-success',
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

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const textColor = TEXT_COLOR_BY_VARIANT[variant];
  const descColor = DESCRIPTION_COLOR_BY_VARIANT[variant];

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutUp.duration(200)}
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
      <View className="flex-1 gap-1">
        {title && (
          <Text className={cn('font-semibold', textColor)} style={typographyStyle(visual, 'label')}>
            {title}
          </Text>
        )}
        {description && (
          <Text className={cn(descColor)} style={typographyStyle(visual, 'label')}>
            {description}
          </Text>
        )}
      </View>
      <View className="flex-row items-center gap-2">
        {action && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              action.onPress();
              onDismiss();
            }}
            className="border border-border"
            style={{
              borderRadius: visual.radiusMd,
              borderWidth: visual.borderWidthControl,
              paddingHorizontal: visual.controlPaddingXSm,
              paddingVertical: visual.controlPaddingYSm,
            }}
          >
            <Text className={cn('font-medium', textColor)} style={typographyStyle(visual, 'label')}>
              {action.label}
            </Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          className="p-1"
        >
          <Text className={cn(textColor)} style={typographyStyle(visual, 'emphasis')}>
            ×
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export interface ToastContainerProps extends ViewProps {
  position?: 'top' | 'bottom';
}

export function ToastContainer({
  position = 'top',
  className,
  style,
  ...props
}: ToastContainerProps) {
  const { toasts, dismiss } = useToast();
  const visual = useVisualTokens();

  const positionClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <View
      className={cn('absolute left-0 right-0 z-50 py-2', positionClass, className)}
      style={[{ paddingHorizontal: visual.surfacePaddingSm }, style]}
      pointerEvents="box-none"
      {...props}
    >
      {toasts.map((toast) => (
        <View key={toast.id} className="mb-2">
          <Toast toast={toast} onDismiss={() => dismiss(toast.id)} />
        </View>
      ))}
    </View>
  );
}

export { Toast, toastVariants };
