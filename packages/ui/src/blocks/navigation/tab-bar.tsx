import React from 'react';
import { View, ScrollView, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

export interface TabBarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabBarProps extends ViewProps {
  items: TabBarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  scrollable?: boolean;
}

export interface TabBarItemProps extends Omit<PressableProps, 'children'> {
  item: TabBarItem;
  isActive: boolean;
  variant: 'default' | 'pills' | 'underline';
}

function TabBarItemComponent({
  item,
  isActive,
  variant,
  className,
  style: styleProp,
  ...props
}: TabBarItemProps) {
  const { label, icon } = item;
  const visual = useVisualTokens();

  const showUnderline = variant === 'default' || (variant === 'underline' && isActive);
  const tokenStyle = {
    paddingHorizontal: visual.controlPaddingXDefault,
    paddingVertical: visual.controlPaddingYSm,
    ...(variant === 'pills' ? { borderRadius: visual.badgeRadius } : null),
    ...(showUnderline ? { borderBottomWidth: visual.borderWidthEmphasis } : null),
  };

  const baseStyles = 'flex-row items-center justify-center gap-2';
  const variantStyles = {
    default: isActive ? 'border-primary' : 'border-transparent',
    pills: isActive ? 'bg-primary' : '',
    underline: isActive ? 'border-primary' : '',
  };
  const textStyles = {
    default: isActive ? 'text-primary font-medium' : 'text-muted-foreground font-medium',
    pills: isActive ? 'text-primary-foreground font-medium' : 'text-muted-foreground font-medium',
    underline: isActive ? 'text-foreground font-medium' : 'text-muted-foreground font-medium',
  };

  return (
    <Pressable
      accessibilityRole="tab"
      aria-selected={isActive}
      feedback="default"
      focusIndicator="inset"
      className={cn(baseStyles, variantStyles[variant], className)}
      style={(state) => [
        tokenStyle,
        typeof styleProp === 'function' ? styleProp(state) : styleProp,
      ]}
      {...props}
    >
      {icon && (
        <View
          aria-hidden
          className={isActive && variant === 'pills' ? 'text-primary-foreground' : ''}
        >
          {icon}
        </View>
      )}
      <Text className={cn(textStyles[variant])} style={typographyStyle(visual, 'label')}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TabBar({
  items,
  activeKey,
  onSelect,
  variant = 'default',
  scrollable = false,
  className,
  style,
  ...props
}: TabBarProps) {
  const visual = useVisualTokens();

  const content = (
    <View
      accessibilityRole="tablist"
      className={cn(
        'flex-row',
        variant === 'pills' && 'gap-1 bg-muted p-1',
        variant === 'default' && 'border-b border-border',
        !scrollable && 'justify-around',
        className
      )}
      style={[variant === 'pills' ? { borderRadius: visual.badgeRadius } : null, style]}
      {...props}
    >
      {items.map((item) => (
        <TabBarItemComponent
          key={item.key}
          item={item}
          isActive={activeKey === item.key}
          variant={variant}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: visual.surfacePaddingSm }}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}
