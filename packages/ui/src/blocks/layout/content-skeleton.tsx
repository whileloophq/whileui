import { View, type ViewProps } from 'react-native';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, surfaceRadius } from '../../lib/recipes';

export interface ContentSkeletonProps extends ViewProps {
  /** Layout preset. `list` = avatar + lines rows, `card` = card with image/body, `generic` = simple page lines. */
  variant?: 'list' | 'card' | 'generic';
  /** Number of list rows (list variant only). Default 4. */
  rows?: number;
}

function ListRow() {
  const visual = useVisualTokens();

  return (
    <View
      className="flex-row items-center gap-3 border-border mb-4"
      style={{
        borderBottomWidth: visual.borderWidthHairline,
        paddingBottom: surfacePadding(visual, 'sm'),
      }}
    >
      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </View>
    </View>
  );
}

function ListVariant({ className, rows = 4, style, ...props }: ContentSkeletonProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={className}
      style={[{ padding: surfacePadding(visual, 'sm') }, style]}
      {...props}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <ListRow key={i} />
      ))}
    </View>
  );
}

function CardVariant({ className, style, ...props }: ContentSkeletonProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={cn('overflow-hidden bg-card border-border', className)}
      style={[
        {
          borderRadius: surfaceRadius(visual, 'xl'),
          borderWidth: visual.borderWidthHairline,
        },
        style,
      ]}
      {...props}
    >
      <Skeleton className="aspect-video w-full" />
      <View className="gap-3" style={{ padding: surfacePadding(visual, 'sm') }}>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </View>
    </View>
  );
}

function GenericVariant({ className, style, ...props }: ContentSkeletonProps) {
  const visual = useVisualTokens();

  return (
    <View
      className={cn('gap-4', className)}
      style={[{ padding: surfacePadding(visual, 'sm') }, style]}
      {...props}
    >
      <Skeleton className="h-6 w-1/2" />
      <View className="gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </View>
    </View>
  );
}

export function ContentSkeleton({
  variant = 'list',
  rows = 4,
  className,
  ...props
}: ContentSkeletonProps) {
  if (variant === 'list') {
    return <ListVariant rows={rows} className={className} {...props} />;
  }
  if (variant === 'card') {
    return <CardVariant className={className} {...props} />;
  }
  return <GenericVariant className={className} {...props} />;
}
