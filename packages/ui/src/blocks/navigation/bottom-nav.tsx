import { View, type ViewProps } from 'react-native';
import { Pressable, type PressableProps } from '../../components/pressable';
import { Text } from '../../components/text';
import { cn } from '../../lib/cn';
import { rovingTabIndex, useRovingFocus } from '../../lib/roving-focus';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';
import { renderNavIcon, type NavIcon } from './nav-icon';

const TAB_SELECTOR = '[role="tab"]:not([aria-disabled="true"])';
export interface BottomNavItem {
  key: string;
  label: string;
  /** A function receives the tab's colour; see `NavIcon`. */
  icon: NavIcon;
  /** A count drawn on the icon; nothing at 0, `99+` above 99. */
  badge?: number;
}

export interface BottomNavProps extends ViewProps {
  items: BottomNavItem[];
  /** Key of the selected item. */
  value: string;
  /** Called with the key of the item the user chose. */
  onValueChange: (key: string) => void;
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
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const color = isActive ? colors.primary : colors.mutedForeground;

  return (
    <Pressable
      accessibilityRole="tab"
      // Named here rather than from the children: iOS built "3, Home" from them, badge
      // first, and on device the active tab also exposed its icon glyph on its own.
      accessibilityLabel={badge ? `${label}, ${badge > 99 ? '99+' : badge}` : label}
      aria-selected={isActive}
      feedback="default"
      focusIndicator="inset"
      className={cn('flex-1 flex-col-reverse items-center justify-center py-2', className)}
      style={styleProp}
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
      {/* State is colour alone, as the label shows it. The icon was once dimmed to 54%,
          which took the badge inside it below contrast and the icon below 3:1. */}
      <View aria-hidden className="relative">
        <View>{renderNavIcon(icon, { active: isActive, color })}</View>
        {badge !== undefined && badge > 0 && <NavBadge count={badge} />}
      </View>
    </Pressable>
  );
}

/**
 * A count on a tab's icon. Its left half overlaps the icon's top-right corner and a longer
 * count grows to the right, away from the icon. The anchor is a zero-size view on that
 * corner, so the badge needs no percentage offset, which resolved differently on iOS.
 * The line box is the pill's height, so the digits sit in its centre whatever the font's
 * own metrics.
 */
function NavBadge({ count }: { count: number }) {
  const visual = useVisualTokens();
  const fontSize = visual.bottomNavBadgeFontSize;
  const size = fontSize + 6;
  return (
    <View className="absolute right-0 top-0">
      <View
        className="absolute items-center justify-center rounded-full bg-destructive"
        style={{
          left: -size / 2,
          top: -size / 2,
          height: size,
          minWidth: size,
          paddingHorizontal: size / 4,
        }}
      >
        <Text
          className="font-semibold text-destructive-foreground"
          style={{
            fontSize,
            lineHeight: size,
            textAlign: 'center',
            includeFontPadding: false,
            fontVariant: ['tabular-nums'],
          }}
        >
          {count > 99 ? '99+' : count}
        </Text>
      </View>
    </View>
  );
}

export function BottomNav({ items, value, onValueChange, className, ...props }: BottomNavProps) {
  const { ref: tablist, keyboardProps } = useRovingFocus(TAB_SELECTOR, 'horizontal');
  const tabStop = items.some((item) => item.key === value) ? value : items[0]?.key;
  return (
    <View
      ref={tablist}
      // The items below are `tab`s, and ARIA requires a `tablist` parent for that role.
      // One Tab stop, the active tab; the arrow keys move between them.
      accessibilityRole="tablist"
      // Even padding: the screen's safe area owns the bottom inset (`AppShell` applies
      // it), and a fixed extra bottom pad here doubled it and pushed the tabs up.
      className={cn('flex-row border-t border-border bg-background px-2 py-1', className)}
      {...keyboardProps}
      {...props}
    >
      {items.map((item) => (
        <BottomNavItemComponent
          key={item.key}
          item={item}
          isActive={value === item.key}
          tabIndex={rovingTabIndex(item.key === tabStop)}
          onPress={() => onValueChange(item.key)}
        />
      ))}
    </View>
  );
}
