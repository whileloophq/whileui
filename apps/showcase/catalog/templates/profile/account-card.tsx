/**
 * AccountCard — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import { View, Pressable, type PressableProps } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage, Text, cn, focusRing } from '@thewhileloop/whileui';

export interface AccountCardProps extends Omit<PressableProps, 'children'> {
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  badge?: string;
  rightElement?: React.ReactNode;
}

export function AccountCard({
  name,
  email,
  avatarUrl,
  avatarFallback,
  badge,
  rightElement,
  className,
  ...props
}: AccountCardProps) {
  // A button only when it does something; React Native Web makes every Pressable a Tab
  // stop unless `tabIndex` says otherwise.
  const pressable = Boolean(props.onPress);

  return (
    <Pressable
      accessibilityRole={pressable ? 'button' : undefined}
      focusable={pressable}
      tabIndex={pressable ? 0 : -1}
      className={cn(
        'flex-row items-center rounded-xl bg-card p-4',
        pressable && 'active:opacity-90',
        pressable && focusRing,
        className
      )}
      {...props}
    >
      <Avatar className="h-14 w-14">
        {avatarUrl && <AvatarImage src={avatarUrl} />}
        <AvatarFallback className="text-lg">
          {avatarFallback || name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <View className="ml-4 flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-foreground">{name}</Text>
          {badge && (
            <View className="rounded-full bg-primary/10 px-2 py-0.5">
              <Text className="text-xs font-medium text-primary">{badge}</Text>
            </View>
          )}
        </View>
        {email && <Text className="text-sm text-muted-foreground">{email}</Text>}
      </View>

      {rightElement ||
        (pressable ? (
          <Text aria-hidden className="text-xl text-muted-foreground">
            ›
          </Text>
        ) : null)}
    </Pressable>
  );
}
