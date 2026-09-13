import React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

export interface FloatingBottomNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export interface FloatingBottomNavProps extends ViewProps {
  items: FloatingBottomNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export interface FloatingBottomNavItemProps extends Omit<PressableProps, 'children'> {
  item: FloatingBottomNavItem;
  isActive: boolean;
}

function FloatingNavItem({
  item,
  isActive,
  className,
  style: styleProp,
  ...props
}: FloatingBottomNavItemProps) {
  const { label, icon } = item;
  const visual = useVisualTokens();
  const pillStyle = {
    borderRadius: visual.badgeRadius,
    paddingHorizontal: visual.controlPaddingXDefault,
    paddingVertical: visual.controlPaddingYSm,
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      aria-selected={isActive}
      className={cn(
        'flex-row items-center gap-2 active:scale-95',
        isActive && 'bg-primary',
        className
      )}
      style={(state) => [pillStyle, typeof styleProp === 'function' ? styleProp(state) : styleProp]}
      {...props}
    >
      <View className={cn(isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>
        {icon}
      </View>
      {isActive && (
        <Text
          className="font-semibold text-primary-foreground"
          style={typographyStyle(visual, 'label')}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function FloatingBottomNav({
  items,
  activeKey,
  onSelect,
  className,
  ...props
}: FloatingBottomNavProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();

  return (
    <View className={cn('items-center pb-8', className)} {...props}>
      <View
        accessibilityRole="tablist"
        className="flex-row items-center gap-1 bg-card p-1.5"
        style={[{ borderRadius: surfaceRadius(visual, 'xl') }, shadowStyle(visual, colors, 'md')]}
      >
        {items.map((item) => (
          <FloatingNavItem
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onPress={() => onSelect(item.key)}
          />
        ))}
      </View>
    </View>
  );
}
