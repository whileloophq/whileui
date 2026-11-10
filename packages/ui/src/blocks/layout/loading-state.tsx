import { View, type ViewProps } from 'react-native';
import { Spinner } from '../../components/spinner';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding } from '../../lib/recipes';

export interface LoadingStateProps extends ViewProps {
  /** Read by assistive technology as the spinner's name; shown under it when given. */
  label?: string;
  size?: 'sm' | 'default' | 'lg';
}

/** The in-flow sibling of `EmptyState` and `ErrorState`, for a section still fetching. */
export function LoadingState({
  label,
  size = 'default',
  className,
  style,
  ...props
}: LoadingStateProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={[{ paddingVertical: surfacePadding(visual, 'lg') }, style]}
      {...props}
    >
      <Spinner size={size} accessibilityLabel={label ?? 'Loading'} />
      {label ? (
        <Text variant="caption" className="mt-3 text-center">
          {label}
        </Text>
      ) : null}
    </View>
  );
}
