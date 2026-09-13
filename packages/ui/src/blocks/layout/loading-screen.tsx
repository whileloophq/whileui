import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Spinner } from '../../components/spinner';
import { cn } from '../../lib/cn';

const SPINNER_SIZE_CLASS = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
} as const;

export interface LoadingScreenProps extends ViewProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Hex color for spinner. ActivityIndicator requires hex. */
  spinnerColor?: string;
}

export function LoadingScreen({
  message,
  size = 'md',
  spinnerColor,
  className,
  ...props
}: LoadingScreenProps) {
  return (
    <View className={cn('flex-1 items-center justify-center bg-background', className)} {...props}>
      <View className={SPINNER_SIZE_CLASS[size]}>
        <Spinner color={spinnerColor} />
      </View>
      {message && <Text className="mt-4 text-muted-foreground">{message}</Text>}
    </View>
  );
}
