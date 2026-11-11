import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cn, focusRing, Text, useIconColors } from '@thewhileloop/whileui';

export type CategoryKey =
  | 'primitives'
  | 'controls'
  | 'overlays'
  | 'forms'
  | 'auth'
  | 'navigation'
  | 'layout'
  | 'chat'
  | 'profile'
  | 'lists'
  | 'commerce';

export const categories: {
  key: CategoryKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: 'primitives', label: 'All Components', icon: 'box' },
  { key: 'controls', label: 'Controls', icon: 'sliders' },
  { key: 'overlays', label: 'Overlays', icon: 'layers' },
  { key: 'forms', label: 'Forms', icon: 'edit-3' },
  { key: 'auth', label: 'Auth', icon: 'lock' },
  { key: 'navigation', label: 'Navigation', icon: 'compass' },
  { key: 'layout', label: 'Layout', icon: 'layout' },
  { key: 'chat', label: 'Chat', icon: 'message-circle' },
  { key: 'profile', label: 'Profile', icon: 'user' },
  { key: 'lists', label: 'Lists', icon: 'list' },
  { key: 'commerce', label: 'Commerce', icon: 'shopping-bag' },
];

type ShowcaseIconColors = ReturnType<typeof useIconColors>;

type ShowcaseCategory = (typeof categories)[number];

export function toDrawerItem(
  category: ShowcaseCategory,
  activeKey: CategoryKey,
  colors: ShowcaseIconColors
) {
  return {
    key: category.key,
    label: category.label,
    icon: (
      <Feather
        name={category.icon}
        size={20}
        color={activeKey === category.key ? colors.primary : colors.muted}
      />
    ),
  };
}

export function createShowcaseDrawerSections(activeKey: CategoryKey, colors: ShowcaseIconColors) {
  return [
    {
      title: 'Components',
      items: categories.slice(0, 4).map((item) => toDrawerItem(item, activeKey, colors)),
    },
    {
      title: 'Blocks',
      items: categories.slice(4).map((item) => toDrawerItem(item, activeKey, colors)),
    },
  ];
}

function CategoryPill({
  category,
  active,
  onSelect,
  colors,
}: {
  category: ShowcaseCategory;
  active: boolean;
  onSelect: (key: CategoryKey) => void;
  colors: ShowcaseIconColors;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      aria-pressed={active}
      onPress={() => onSelect(category.key)}
      className={cn(
        'flex-row items-center gap-2 rounded-full px-4 py-2.5',
        focusRing,
        active ? 'bg-primary' : 'bg-muted'
      )}
    >
      <Feather
        aria-hidden
        name={category.icon}
        size={14}
        color={active ? colors.primaryForeground : colors.muted}
      />
      <Text
        className={cn(
          'text-sm font-medium',
          active ? 'text-primary-foreground' : 'text-muted-foreground'
        )}
      >
        {category.label}
      </Text>
    </Pressable>
  );
}

export function CategoryStrip({
  activeKey,
  onSelect,
  colors,
}: {
  activeKey: CategoryKey;
  onSelect: (key: CategoryKey) => void;
  colors: ShowcaseIconColors;
}) {
  const renderItem = React.useCallback(
    ({ item }: { item: ShowcaseCategory }) => (
      <CategoryPill
        category={item}
        active={activeKey === item.key}
        onSelect={onSelect}
        colors={colors}
      />
    ),
    [activeKey, colors, onSelect]
  );
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
    />
  );
}
