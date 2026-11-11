import React from 'react';
import { Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@thewhileloop/whileui';

export const triggerHaptic = (type: 'light' | 'medium' | 'selection' = 'light') => {
  if (Platform.OS === 'web') return;
  switch (type) {
    case 'light':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'selection':
      void Haptics.selectionAsync();
      break;
  }
};

export function SectionGroup({ label }: { label: string }) {
  return (
    <View className="mb-4 mt-6">
      <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-10">
      <View className="mb-4">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {subtitle && <Text className="text-sm text-muted-foreground mt-0.5">{subtitle}</Text>}
      </View>
      <View className="gap-4">{children}</View>
    </View>
  );
}
