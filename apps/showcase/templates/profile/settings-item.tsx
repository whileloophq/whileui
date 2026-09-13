/**
 * SettingsItem — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import React from 'react';
import { View, Pressable, type PressableProps } from 'react-native';
import { Text, Switch, cn, focusRing } from '@thewhileloop/whileui';

export interface SettingsItemProps extends Omit<PressableProps, 'children'> {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  value?: string;
  type?: 'navigate' | 'toggle' | 'action';
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
  showBorder?: boolean;
}

export function SettingsItem({
  icon,
  label,
  description,
  value,
  type = 'navigate',
  toggleValue,
  onToggle,
  destructive = false,
  showBorder = true,
  className,
  ...props
}: SettingsItemProps) {
  const isToggle = type === 'toggle';

  return (
    <Pressable
      className={cn(
        'flex-row items-center px-4 py-3',
        showBorder && 'border-b border-border',
        !isToggle && 'active:bg-muted',
        focusRing,
        className
      )}
      disabled={isToggle}
      {...props}
    >
      {icon && (
        <View className={cn('mr-3', destructive ? 'text-destructive' : 'text-muted-foreground')}>
          {icon}
        </View>
      )}

      <View className="flex-1">
        <Text className={cn('text-base', destructive ? 'text-destructive' : 'text-foreground')}>
          {label}
        </Text>
        {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
      </View>

      {type === 'toggle' && onToggle && (
        <Switch
          checked={toggleValue || false}
          onCheckedChange={onToggle}
          // The row's label is a sibling Text, not something the switch owns.
          accessibilityLabel={label}
        />
      )}

      {type === 'navigate' && (
        <View className="flex-row items-center">
          {value && <Text className="mr-2 text-muted-foreground">{value}</Text>}
          <Text className="text-lg text-muted-foreground">›</Text>
        </View>
      )}
    </Pressable>
  );
}
