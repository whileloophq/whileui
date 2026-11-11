/**
 * SettingsSection — Copy-paste template
 * Copy this file into your app and customize. Uses @thewhileloop/whileui primitives.
 */
import { View, type ViewProps } from 'react-native';
import { Text, cn } from '@thewhileloop/whileui';

export interface SettingsSectionProps extends ViewProps {
  title?: string;
  description?: string;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  ...props
}: SettingsSectionProps) {
  return (
    <View className={cn('mb-6', className)} {...props}>
      {title && (
        <Text className="mb-1 px-4 text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </Text>
      )}
      {description && (
        <Text className="mb-2 px-4 text-sm text-muted-foreground">{description}</Text>
      )}
      <View className="overflow-hidden rounded-xl bg-card">{children}</View>
    </View>
  );
}
