import React from 'react';
import { View, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from '../../components/text';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, typographyStyle } from '../../lib/recipes';

export interface ListItemProps extends Omit<PressableProps, 'children'> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  rightIcon?: React.ReactNode;
  rightText?: string;
  action?: React.ReactNode;
  showBorder?: boolean;
  compact?: boolean;
  /** Show a skeleton placeholder instead of content. */
  loading?: boolean;
}

function useListRowStyle(compact: boolean, showBorder: boolean): ViewStyle {
  const visual = useVisualTokens();
  return {
    paddingHorizontal: surfacePadding(visual, 'sm'),
    paddingVertical: compact ? visual.controlPaddingYSm : visual.controlPaddingYDefault,
    borderBottomWidth: showBorder ? visual.borderWidthHairline : 0,
  };
}

function ListItemSkeleton({
  showBorder = true,
  compact = false,
  className,
}: {
  showBorder?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const rowStyle = useListRowStyle(compact, showBorder);

  return (
    <View
      className={cn('flex-row items-center bg-card', showBorder && 'border-border', className)}
      style={rowStyle}
    >
      <Skeleton className="mr-3 h-8 w-8" />
      <View className="flex-1 gap-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </View>
      <Skeleton className="h-4 w-4" />
    </View>
  );
}

export function ListItem({
  icon,
  title,
  subtitle,
  description,
  rightIcon,
  rightText,
  action,
  showBorder = true,
  compact = false,
  loading = false,
  className,
  style: styleProp,
  ...props
}: ListItemProps) {
  const visual = useVisualTokens();
  const rowStyle = useListRowStyle(compact, showBorder);

  if (loading) {
    return <ListItemSkeleton showBorder={showBorder} compact={compact} className={className} />;
  }

  return (
    <Pressable
      accessibilityRole={props.onPress || props.onLongPress ? 'button' : undefined}
      className={cn(
        'flex-row items-center bg-card',
        focusRing,
        showBorder && 'border-border',
        'active:bg-muted',
        className
      )}
      style={(state) => {
        const callerStyle = typeof styleProp === 'function' ? styleProp(state) : styleProp;
        return [rowStyle, callerStyle];
      }}
      {...props}
    >
      {icon && <View className="mr-3 text-muted-foreground">{icon}</View>}

      <View className="flex-1">
        <Text className="text-foreground" style={typographyStyle(visual, 'body')}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-muted-foreground" style={typographyStyle(visual, 'label')}>
            {subtitle}
          </Text>
        )}
        {description && (
          <Text
            className="mt-1 text-muted-foreground"
            style={typographyStyle(visual, 'label')}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>

      {rightText && (
        <Text className="mr-2 text-muted-foreground" style={typographyStyle(visual, 'label')}>
          {rightText}
        </Text>
      )}
      {rightIcon && <View className="text-muted-foreground">{rightIcon}</View>}
      {action}
      {!action && !rightIcon && (
        <Text className="text-muted-foreground" style={typographyStyle(visual, 'emphasis')}>
          ›
        </Text>
      )}
    </Pressable>
  );
}
