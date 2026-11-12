import React from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../components/button';
import { Text } from '../../components/text';
import { Spinner } from '../../components/spinner';
import { cn } from '../../lib/cn';
import { KeyboardAwareScrollView } from './keyboard-aware-scroll-view';
import { useVisualTokens } from '../../lib/visual-tokens';

export interface FormModalScreenProps extends Omit<ViewProps, 'className'> {
  className?: string;
  title: string;
  subtitle?: string;
  /** Replaces the Cancel button. */
  leftSlot?: React.ReactNode;
  /** Replaces the Save button. */
  rightSlot?: React.ReactNode;
  /** Draws a Cancel text button that calls this. */
  onClose?: () => void;
  /** @default 'Cancel' */
  closeLabel?: string;
  /** Draws a primary Save button that calls this. */
  onSave?: () => void;
  /** @default 'Save' */
  saveLabel?: string;
  /** Disable Save, for a form that is not ready to submit. */
  saveDisabled?: boolean;
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
  closeLabel = 'Cancel',
  onSave,
  saveLabel = 'Save',
  saveDisabled = false,
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
        {/* Each side takes the width its button needs and never shrinks; the title takes
            the rest and truncates. A fixed 48px slot let a Save button spill into the
            title, and equal flexible sides let a long title push over both buttons. */}
        <View className="flex-row items-center gap-2 px-4 py-3 border-b border-border">
          <View className="shrink-0 items-start">
            {leftSlot ??
              (onClose ? (
                <Button variant="ghost" size="sm" onPress={onClose} disabled={saving}>
                  <ButtonText>{closeLabel}</ButtonText>
                </Button>
              ) : null)}
          </View>

          <View className="min-w-0 flex-1 items-center">
            <Text
              variant="title"
              accessibilityRole="header"
              className="text-center"
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                variant="caption"
                className="text-center text-muted-foreground"
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>

          <View className="shrink-0 items-end">
            {rightSlot ??
              (onSave ? (
                <Button
                  size="sm"
                  onPress={onSave}
                  disabled={saveDisabled || saving}
                  loading={saving}
                >
                  <ButtonText>{saveLabel}</ButtonText>
                </Button>
              ) : null)}
          </View>
        </View>

        {saving && (
          <View className="bg-primary px-4 py-2 flex-row items-center justify-center gap-2">
            <Spinner size="sm" color={savingSpinnerColor} />
            <Text className="text-primary-foreground text-sm">{savingText}</Text>
          </View>
        )}

        <KeyboardAwareScrollView
          className="bg-transparent"
          contentContainerStyle={{
            padding: 16,
            minHeight: screenHeight * visual.formModalContentMinHeightRatio,
          }}
          scrollEnabled={!saving && scrollEnabled}
        >
          {children}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaProvider style={{ flex: 1, minHeight: screenHeight }}>{content}</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

export { FormModalScreen };
