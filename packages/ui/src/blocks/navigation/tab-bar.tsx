import { View, ScrollView, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { useThemeColors } from '../../lib/theme-colors';
import { rovingTabIndex, useRovingFocus } from '../../lib/roving-focus';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';
import { renderNavIcon, type NavIcon } from './nav-icon';

const TAB_SELECTOR = '[role="tab"]:not([aria-disabled="true"])';
export interface TabBarItem {
  key: string;
  label: string;
  /** A function receives the tab's colour; see `NavIcon`. */
  icon?: NavIcon;
}

export interface TabBarProps extends ViewProps {
  items: TabBarItem[];
  /** Key of the selected item. */
  value: string;
  /** Called with the key of the item the user chose. */
  onValueChange: (key: string) => void;
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
  const colors = useThemeColors();
  // The icon takes the colour the label's class gives it in each variant.
  const iconColor = !isActive
    ? colors.mutedForeground
    : variant === 'pills'
      ? colors.primaryForeground
      : variant === 'underline'
        ? colors.foreground
        : colors.primary;
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
      {icon ? (
        <View aria-hidden>{renderNavIcon(icon, { active: isActive, color: iconColor })}</View>
      ) : null}
      <Text className={cn(textStyles[variant])} style={typographyStyle(visual, 'label')}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TabBar({
  items,
  value,
  onValueChange,
  variant = 'default',
  scrollable = false,
  className,
  style,
  ...props
}: TabBarProps) {
  const visual = useVisualTokens();

  const { ref: tablist, keyboardProps } = useRovingFocus(TAB_SELECTOR, 'horizontal');
  const tabStop = items.some((item) => item.key === value) ? value : items[0]?.key;
  const content = (
    <View
      ref={tablist}
      accessibilityRole="tablist"
      className={cn(
        'flex-row',
        variant === 'pills' && 'gap-1 bg-muted p-1',
        variant === 'default' && 'border-b border-border',
        !scrollable && 'justify-around',
        className
      )}
      style={[variant === 'pills' ? { borderRadius: visual.badgeRadius } : null, style]}
      {...keyboardProps}
      {...props}
    >
      {items.map((item) => (
        <TabBarItemComponent
          key={item.key}
          item={item}
          isActive={value === item.key}
          variant={variant}
          tabIndex={rovingTabIndex(item.key === tabStop)}
          onPress={() => onValueChange(item.key)}
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
