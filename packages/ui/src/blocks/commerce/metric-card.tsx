import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '../../components/text';
import { Card } from '../../components/card';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import { useVisualTokens } from '../../lib/visual-tokens';

const metricCardVariants = tv({
  base: '',
  variants: {
    variant: {
      default: 'bg-card',
      outlined: 'bg-transparent border border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface MetricCardProps extends ViewProps, VariantProps<typeof metricCardVariants> {
  className?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  segments?: { value: number; color: string }[];
  icon?: React.ReactNode;
  /** Show a skeleton placeholder instead of content. */
  loading?: boolean;
}

function MetricCardSkeleton({
  className,
  variant,
}: {
  className?: string;
  variant?: 'default' | 'outlined';
}) {
  return (
    <Card className={cn(metricCardVariants({ variant }), className)}>
      <View className="flex-row items-start justify-between mb-2">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-5 rounded-sm" />
      </View>
      <Skeleton className="h-6 w-1/2 rounded-md mb-1" />
      <Skeleton className="h-3 w-2/5 rounded-md" />
      <View className="mt-3">
        <Skeleton className="h-2 w-full rounded-full" />
      </View>
    </Card>
  );
}

function MetricCard({
  className,
  label,
  value,
  subtitle,
  progress,
  segments,
  icon,
  variant,
  loading = false,
  ...props
}: MetricCardProps) {
  const visual = useVisualTokens();

  if (loading) {
    return <MetricCardSkeleton className={className} variant={variant ?? 'default'} />;
  }

  return (
    <Card className={cn(metricCardVariants({ variant }), className)} {...props}>
      <View className="flex-row items-start justify-between mb-2">
        <Text variant="caption" className="text-muted-foreground">
          {label}
        </Text>
        {icon && <View>{icon}</View>}
      </View>

      <Text variant="heading" className="mb-1">
        {value}
      </Text>

      {subtitle && (
        <Text variant="caption" className="text-muted-foreground">
          {subtitle}
        </Text>
      )}

      {progress !== undefined && (
        <View className="mt-3">
          <View className="h-2 bg-muted overflow-hidden" style={{ borderRadius: visual.radiusSm }}>
            <View
              className="h-full bg-primary"
              style={{
                borderRadius: visual.radiusSm,
                width: `${Math.min(100, Math.max(0, progress))}%`,
              }}
            />
          </View>
        </View>
      )}

      {segments && segments.length > 0 && (
        <View
          className="mt-3 flex-row h-3 overflow-hidden"
          style={{ borderRadius: visual.radiusSm }}
        >
          {segments.map((seg) => (
            <View
              key={`${seg.color}:${seg.value}`}
              className="h-full"
              style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

export { MetricCard, metricCardVariants };
