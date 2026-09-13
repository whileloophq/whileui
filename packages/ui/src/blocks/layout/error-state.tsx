import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Button, ButtonText } from '../../components/button';
import { cn } from '../../lib/cn';

export interface ErrorStateProps extends ViewProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  icon,
  title = 'Something went wrong',
  description,
  error,
  onRetry,
  retryLabel = 'Try again',
  className,
  ...props
}: ErrorStateProps) {
  const errorMessage =
    description ||
    (error instanceof Error ? error.message : error) ||
    'An unexpected error occurred';

  return (
    <View className={cn('flex-1 items-center justify-center p-8', className)} {...props}>
      {icon && <View className="mb-6 text-destructive">{icon}</View>}

      <Text className="mb-2 text-center text-xl font-semibold text-foreground">{title}</Text>

      <Text className="mb-6 max-w-xs text-center text-muted-foreground">{errorMessage}</Text>

      {onRetry && (
        <Button onPress={onRetry}>
          <ButtonText>{retryLabel}</ButtonText>
        </Button>
      )}
    </View>
  );
}
