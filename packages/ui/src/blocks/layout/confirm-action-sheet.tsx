import { useMemo } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { Pressable } from '../../components/pressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { OverlayBackdrop } from '../../lib/overlay-backdrop';
import { OverlayHost } from '../../lib/overlay-host';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { controlRecipe, surfacePadding, surfaceRadius, typographyStyle } from '../../lib/recipes';
import { useFrostedSurface, type FrostedSurfaceProps } from '../../lib/frosted-surface';

export type ConfirmActionSheetActionVariant = 'default' | 'destructive' | 'cancel';

export interface ConfirmActionSheetAction {
  key: string;
  label: string;
  onPress?: () => void;
  variant?: ConfirmActionSheetActionVariant;
  disabled?: boolean;
  closeOnPress?: boolean;
}

export interface ConfirmActionSheetProps extends Omit<ViewProps, 'children'>, FrostedSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actions?: ConfirmActionSheetAction[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

export function ConfirmActionSheet({
  open,
  onOpenChange,
  title,
  description,
  actions,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = true,
  className,
  style,
  frosted = false,
  blurIntensity,
  blurTintToken,
  ...props
}: ConfirmActionSheetProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const visual = useVisualTokens();
  const frostedSurface = useFrostedSurface({
    frosted,
    blurIntensity,
    blurTintToken,
    defaultTintToken: 'surfaceTranslucent',
    defaultBlurPreset: 'medium',
  });

  const resolvedActions = useMemo<ConfirmActionSheetAction[]>(() => {
    if (actions && actions.length > 0) {
      return actions;
    }

    return [
      {
        key: 'cancel',
        label: cancelLabel,
        variant: 'cancel',
        onPress: onCancel,
      },
      {
        key: 'confirm',
        label: confirmLabel,
        variant: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ];
  }, [actions, cancelLabel, confirmLabel, destructive, onCancel, onConfirm]);

  const handleClose = () => onOpenChange(false);

  const handleActionPress = (action: ConfirmActionSheetAction) => {
    action.onPress?.();
    if (action.closeOnPress ?? true) {
      onOpenChange(false);
    }
  };

  return (
    <OverlayHost open={open} animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: colors.overlay }}>
        {/* In the layout, above the panel: it is what holds the panel at the bottom. */}
        <OverlayBackdrop onDismiss={handleClose} className="relative flex-1" />
        <View
          className={cn(
            'border-border relative overflow-hidden',
            frosted ? 'bg-transparent' : 'bg-background',
            className
          )}
          style={[
            {
              borderTopLeftRadius: surfaceRadius(visual, 'xl'),
              borderTopRightRadius: surfaceRadius(visual, 'xl'),
              borderWidth: visual.borderWidthHairline,
              paddingHorizontal: surfacePadding(visual, 'sm'),
              paddingTop: surfacePadding(visual, 'sm'),
              paddingBottom: Math.max(insets.bottom, 12),
            } as ViewStyle,
            frostedSurface.surfaceStyle,
            style as StyleProp<ViewStyle>,
          ]}
          {...props}
        >
          {frostedSurface.overlay}
          <View className="mb-4 gap-1.5">
            <Text className="font-semibold text-foreground" style={typographyStyle(visual, 'body')}>
              {title}
            </Text>
            {description ? (
              <Text className="text-muted-foreground" style={typographyStyle(visual, 'label')}>
                {description}
              </Text>
            ) : null}
          </View>

          <View className="gap-2">
            {resolvedActions.map((action) => {
              const isDestructive = action.variant === 'destructive';
              const isCancel = action.variant === 'cancel';

              return (
                <Pressable
                  key={action.key}
                  className={cn(
                    'items-center justify-center',
                    isCancel ? 'border-border bg-muted' : 'border-transparent bg-secondary',
                    isDestructive && 'bg-destructive-soft border-destructive-soft-border'
                  )}
                  feedback="default"
                  style={{
                    ...controlRecipe(visual, 'default'),
                    borderWidth: visual.borderWidthControl,
                  }}
                  onPress={() => handleActionPress(action)}
                  disabled={action.disabled}
                >
                  <Text
                    className={cn(
                      'font-medium',
                      isCancel ? 'text-foreground' : 'text-secondary-foreground',
                      isDestructive && 'text-destructive'
                    )}
                    style={typographyStyle(visual, 'label')}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </OverlayHost>
  );
}
