import React from 'react';
import { View, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from '../../components/text';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/avatar';
import { Skeleton } from '../../components/skeleton';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';
import { useVisualTokens } from '../../lib/visual-tokens';
import { surfacePadding, typographyStyle } from '../../lib/recipes';

export interface NotificationItemProps extends Omit<PressableProps, 'children'> {
  icon?: React.ReactNode;
  avatarUrl?: string;
  avatarFallback?: string;
  title: string;
  message: string;
  time: string;
  read?: boolean;
  showDot?: boolean;
  /** Show a skeleton placeholder instead of content. */
  loading?: boolean;
}

function useNotificationRowStyle(): ViewStyle {
  const visual = useVisualTokens();
  return {
    paddingHorizontal: surfacePadding(visual, 'sm'),
    paddingVertical: visual.controlPaddingYDefault,
  };
}

function NotificationItemSkeleton({ className }: { className?: string }) {
  const rowStyle = useNotificationRowStyle();

  return (
    <View className={cn('flex-row items-start', className)} style={rowStyle}>
      <Skeleton className="h-10 w-10 rounded-full" />
      <View className="ml-3 flex-1 gap-2">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-12" />
        </View>
        <Skeleton className="h-3 w-4/5" />
      </View>
    </View>
  );
}

export function NotificationItem({
  icon,
  avatarUrl,
  avatarFallback,
  title,
  message,
  time,
  read = false,
  showDot = true,
  loading = false,
  className,
  style: styleProp,
  ...props
}: NotificationItemProps) {
  const visual = useVisualTokens();
  const rowStyle = useNotificationRowStyle();

  if (loading) {
    return <NotificationItemSkeleton className={className} />;
  }

  const pressable = Boolean(props.onPress || props.onLongPress);

  return (
    <Pressable
      // Only a row with a press handler is a control. A Pressable is a Tab stop on web
      // whether or not it does anything, so a static row was focusable with no role.
      accessibilityRole={pressable ? 'button' : undefined}
      focusable={pressable}
      // React Native Web ignores `focusable` on a Pressable; only `tabIndex` removes the Tab stop.
      tabIndex={pressable ? 0 : -1}
      className={cn(
        'flex-row items-start',
        pressable && 'active:bg-muted',
        focusRing,
        !read && 'bg-primary-soft-subtle',
        className
      )}
      style={(state) => {
        const callerStyle = typeof styleProp === 'function' ? styleProp(state) : styleProp;
        return [rowStyle, callerStyle];
      }}
      {...props}
    >
      {avatarUrl || avatarFallback ? (
        <Avatar className="h-10 w-10">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      ) : (
        icon && (
          <View aria-hidden className="h-10 w-10 items-center justify-center rounded-full bg-muted">
            {icon}
          </View>
        )
      )}

      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={cn(!read ? 'font-semibold text-foreground' : 'text-foreground')}
            style={typographyStyle(visual, 'label')}
          >
            {title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-muted-foreground" style={typographyStyle(visual, 'caption')}>
              {time}
            </Text>
            {!read && showDot && <View className="h-2 w-2 rounded-full bg-primary" />}
          </View>
        </View>
        <Text
          className="mt-0.5 text-muted-foreground"
          style={typographyStyle(visual, 'label')}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
    </Pressable>
  );
}
