import { View, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { rovingTabIndex, useRovingFocus } from '../../lib/roving-focus';
import { useVisualTokens } from '../../lib/visual-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { renderNavIcon, type NavIcon } from './nav-icon';
import { shadowStyle, surfaceRadius, typographyStyle } from '../../lib/recipes';

const TAB_SELECTOR = '[role="tab"]:not([aria-disabled="true"])';
export interface FloatingBottomNavItem {
  key: string;
  label: string;
  /** A function receives the tab's colour; see `NavIcon`. */
  icon: NavIcon;
}

export interface FloatingBottomNavProps extends ViewProps {
  items: FloatingBottomNavItem[];
  /** Key of the selected item. */
  value: string;
  /** Called with the key of the item the user chose. */
  onValueChange: (key: string) => void;
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
  const colors = useThemeColors();
  const color = isActive ? colors.primaryForeground : colors.mutedForeground;
  const pillStyle = {
    borderRadius: visual.badgeRadius,
    paddingHorizontal: visual.controlPaddingXDefault,
    paddingVertical: visual.controlPaddingYSm,
  };

  return (
    <Pressable
      accessibilityRole="tab"
      // Inactive tabs show only an icon, so the label must still name them.
      accessibilityLabel={label}
      aria-selected={isActive}
      className={cn(
        'flex-row items-center gap-2 active:scale-95',
        isActive && 'bg-primary',
        className
      )}
      style={(state) => [pillStyle, typeof styleProp === 'function' ? styleProp(state) : styleProp]}
      {...props}
    >
      <View aria-hidden>{renderNavIcon(icon, { active: isActive, color })}</View>
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
  value,
  onValueChange,
  className,
  ...props
}: FloatingBottomNavProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();

  const { ref: tablist, keyboardProps } = useRovingFocus(TAB_SELECTOR, 'horizontal');
  const tabStop = items.some((item) => item.key === value) ? value : items[0]?.key;
  return (
    <View className={cn('items-center pb-8', className)} {...props}>
      <View
        ref={tablist}
        accessibilityRole="tablist"
        className="flex-row items-center gap-1 bg-card p-1.5"
        style={[{ borderRadius: surfaceRadius(visual, 'xl') }, shadowStyle(visual, colors, 'md')]}
        {...keyboardProps}
      >
        {items.map((item) => (
          <FloatingNavItem
            key={item.key}
            item={item}
            isActive={value === item.key}
            tabIndex={rovingTabIndex(item.key === tabStop)}
            onPress={() => onValueChange(item.key)}
          />
        ))}
      </View>
    </View>
  );
}
