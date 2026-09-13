import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';
import { useThemeColors } from '../../lib/theme-colors';
import { cn } from '../../lib/cn';

export interface PullToRefreshScrollViewProps extends ScrollViewProps {
  refreshing: boolean;
  /**
   * Refreshing is almost always async, so the signature says so. Nothing here awaits it —
   * the spinner is driven by `refreshing`, which the owner controls — so a handler that
   * can reject must catch its own errors.
   */
  onRefresh: () => void | Promise<void>;
  /** Override tint/colors. Defaults to theme primary. */
  refreshColor?: string;
}

export function PullToRefreshScrollView({
  refreshing,
  onRefresh,
  refreshColor,
  className,
  children,
  ...props
}: PullToRefreshScrollViewProps) {
  const colors = useThemeColors();
  const tintColor = refreshColor ?? colors.primary;

  return (
    <ScrollView
      className={cn('flex-1', className)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void onRefresh()}
          tintColor={tintColor}
          colors={[tintColor]}
        />
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}
