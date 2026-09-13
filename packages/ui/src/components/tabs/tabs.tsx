import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import { cn } from '../../lib/cn';
import { focusRingInset } from '../../lib/focus-ring';
import { tv } from '../../lib/tv';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';
import { useThemeColors } from '../../lib/theme-colors';
import { useVisualTokens } from '../../lib/visual-tokens';
import { typographyStyle } from '../../lib/recipes';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
});

const tabsTriggerVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap font-medium',
  variants: {
    state: {
      active: 'text-foreground',
      inactive: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    state: 'inactive',
  },
});

function getTabsListStyle(
  visual: ReturnType<typeof useVisualTokens>,
  colors: ReturnType<typeof useThemeColors>
) {
  const inset = Math.max(4, Math.round(visual.controlPaddingYSm * 0.5));
  return {
    borderRadius: visual.radiusXl,
    backgroundColor: colors.muted,
    padding: inset,
  };
}

function getTabsTriggerStyle(
  visual: ReturnType<typeof useVisualTokens>,
  colors: ReturnType<typeof useThemeColors>,
  active: boolean
) {
  return {
    ...typographyStyle(visual, 'label'),
    minHeight: visual.controlHeightDefault,
    borderRadius: visual.radiusLg,
    paddingHorizontal: visual.controlPaddingXDefault,
    paddingVertical: visual.controlPaddingYDefault,
    borderWidth: active ? visual.borderWidthHairline : 0,
    borderColor: active ? colors.surfaceBorder : 'transparent',
    backgroundColor: active ? colors.surfaceElevated : 'transparent',
  };
}

export interface TabsProps extends ViewProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export interface TabsListProps extends ViewProps {
  className?: string;
}

export interface TabsTriggerProps extends PressableProps {
  value: string;
  children?: ReactNode;
  className?: string;
}

export interface TabsContentProps extends ViewProps {
  value: string;
  className?: string;
}

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );
  const contextValue = useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [handleValueChange, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

function TabsList({ className, style, ...props }: TabsListProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();
  return (
    <View
      accessibilityRole="tablist"
      className={cn('flex flex-row items-center justify-center', className)}
      style={[getTabsListStyle(visual, colors), style]}
      {...props}
    />
  );
}

function TabsTrigger({
  value: tabValue,
  children,
  className,
  disabled,
  style: styleProp,
  ...props
}: TabsTriggerProps) {
  const { value, onValueChange } = useContext(TabsContext);
  const isActive = value === tabValue;
  const interaction = useInteractionTokens();
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
    disabled: Boolean(disabled),
    pressedVariant: 'default',
  });
  const tokenStyle = getTabsTriggerStyle(visual, colors, isActive);

  return (
    <Pressable
      className={cn(
        tabsTriggerVariants({ state: isActive ? 'active' : 'inactive' }),
        'flex-1',
        focusRingInset,
        className
      )}
      style={(state) => {
        const baseStyle =
          typeof interactiveStyle === 'function' ? interactiveStyle(state) : interactiveStyle;
        return [baseStyle, tokenStyle];
      }}
      onPress={() => onValueChange(tabValue)}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: Boolean(disabled) }}
      aria-selected={isActive}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function TabsContent({ value: tabValue, className, children, ...props }: TabsContentProps) {
  const { value } = useContext(TabsContext);
  if (value !== tabValue) return null;

  return (
    <View className={cn('mt-2', className)} {...props}>
      {children}
    </View>
  );
}

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsTriggerVariants };
