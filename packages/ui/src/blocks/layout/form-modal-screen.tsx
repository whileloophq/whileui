import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from '../../components/text';
import { Spinner } from '../../components/spinner';
import { cn } from '../../lib/cn';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface FormModalScreenProps extends Omit<ViewProps, 'className'> {
  className?: string;
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onClose?: () => void;
  loading?: boolean;
  saving?: boolean;
  savingText?: string;
  /** Hex color for spinner in loading state. ActivityIndicator requires hex. */
  loadingSpinnerColor?: string;
  /** Hex color for spinner in saving banner. Defaults to platform (Android blue) when not set. */
  savingSpinnerColor?: string;
  scrollEnabled?: boolean;
  children: React.ReactNode;
}

function FormModalScreen({
  className,
  title,
  subtitle,
  leftSlot,
  rightSlot,
  onClose,
  loading = false,
  saving = false,
  savingText = 'Saving...',
  loadingSpinnerColor,
  savingSpinnerColor,
  scrollEnabled = true,
  children,
  ...props
}: FormModalScreenProps) {
  const { height: screenHeight } = useWindowDimensions();
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();

  // `className` is silently dropped on react-native-safe-area-context's `SafeAreaView`:
  // it is a native view, and Uniwind only wraps React Native's own components. The
  // background — and any `className` a caller passes — has to go on a child.
  const content = loading ? (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <View style={styles.fill} className="bg-background items-center justify-center">
        <Spinner color={loadingSpinnerColor} />
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <View style={styles.fill} className={cn('bg-background', className)} {...props}>
        <View className="flex-row items-center px-4 py-3 border-b border-border">
          <View className="w-12">
            {leftSlot ? (
              leftSlot
            ) : onClose ? (
              <Pressable
                onPress={onClose}
                disabled={saving}
                className="p-2 -m-2 items-center justify-center"
                style={(state) => {
                  const interactiveStyle = withInteractivePressableStyle(undefined, interaction, {
                    disabled: saving,
                    pressedVariant: 'default',
                  });
                  const resolved =
                    typeof interactiveStyle === 'function'
                      ? interactiveStyle(state)
                      : interactiveStyle;
                  return [
                    {
                      minWidth: visual.touchTargetMinSize,
                      minHeight: visual.touchTargetMinSize,
                    },
                    resolved,
                  ];
                }}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text className="text-foreground text-xl font-medium">×</Text>
              </Pressable>
            ) : null}
          </View>

          <View className="flex-1 items-center">
            <Text variant="title" className="text-center">
              {title}
            </Text>
            {subtitle && (
              <Text variant="caption" className="text-center text-muted-foreground">
                {subtitle}
              </Text>
            )}
          </View>

          <View className="w-12 items-end">{rightSlot}</View>
        </View>

        {saving && (
          <View className="bg-primary px-4 py-2 flex-row items-center justify-center gap-2">
            <Spinner size="sm" color={savingSpinnerColor} />
            <Text className="text-primary-foreground text-sm">{savingText}</Text>
          </View>
        )}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            minHeight: screenHeight * visual.formModalContentMinHeightRatio,
          }}
          scrollEnabled={!saving && scrollEnabled}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaProvider style={{ flex: 1, minHeight: screenHeight }}>{content}</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

export { FormModalScreen };
