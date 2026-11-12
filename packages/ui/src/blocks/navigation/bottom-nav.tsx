import React from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface BottomNavProps extends ViewProps {
  items: BottomNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export interface BottomNavItemProps extends Omit<PressableProps, 'children'> {
  item: BottomNavItem;
  isActive: boolean;
}

function BottomNavItemComponent({
  item,
  isActive,
  className,
  style: styleProp,
  ...props
}: BottomNavItemProps) {
  const { label, icon, badge } = item;
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
    pressedVariant: 'default',
  });

  return (
    <Pressable
      accessibilityRole="tab"
      // Named here rather than from the children: iOS built "3, Home" from them, badge
      // first, and on device the active tab also exposed its icon glyph on its own.
      accessibilityLabel={badge ? `${label}, ${badge > 99 ? '99+' : badge}` : label}
      accessibilityState={{ selected: isActive }}
      aria-selected={isActive}
      className={cn('flex-1 flex-col-reverse items-center justify-center py-2', className)}
      style={interactiveStyle}
      {...props}
    >
      {/* Label first in the document, drawn below the icon by `flex-col-reverse`: the
          visible text then reads "Inbox 12", matching the name, where "12 Inbox" failed
          WCAG 2.5.3 (label in name). */}
      <Text
        className={cn('mt-1 font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}
        style={typographyStyle(visual, 'caption')}
      >
        {label}
      </Text>
      <View
        aria-hidden
        className="relative"
        style={!isActive ? { opacity: interaction.inactiveOpacity } : undefined}
      >
        <View>{icon}</View>
        {badge !== undefined && badge > 0 && (
          <View className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1">
            <Text
              className="font-bold text-destructive-foreground"
              style={{ fontSize: visual.bottomNavBadgeFontSize }}
            >
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function BottomNav({ items, activeKey, onSelect, className, ...props }: BottomNavProps) {
  return (
    <View
      // The items below are `tab`s, and ARIA requires a `tablist` parent for that role.
      accessibilityRole="tablist"
      className={cn('flex-row border-t border-border bg-background px-2 pb-6 pt-2', className)}
      {...props}
    >
      {items.map((item) => (
        <BottomNavItemComponent
          key={item.key}
          item={item}
          isActive={activeKey === item.key}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </View>
  );
}
