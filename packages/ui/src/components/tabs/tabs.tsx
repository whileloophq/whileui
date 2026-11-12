import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, type ViewProps } from 'react-native';
import * as TabsPrimitive from '@rn-primitives/tabs';
import { cn } from '../../lib/cn';
import { tv } from '../../lib/tv';
import { Pressable, type PressableProps } from '../pressable';
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
      // A web click reports twice — Radix selects on mousedown, the press on click — and
      // the second finds the value already set.
      if (newValue === value) return;
      setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange, value]
  );
  const contextValue = useMemo(
    () => ({ value, onValueChange: handleValueChange }),
    [handleValueChange, value]
  );

  // One Tab stop in the list, arrow keys between tabs, and panels labelled by their tab:
  // `@rn-primitives/tabs` (Radix on web), drawn here.
  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        value={value}
        onValueChange={handleValueChange}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
}

function TabsList({ className, style, ...props }: TabsListProps) {
  const visual = useVisualTokens();
  const colors = useThemeColors();
  return (
    <TabsPrimitive.List
      className={cn('flex flex-row items-center justify-center', className)}
      // Flattened: on web the primitive's Radix root spreads this into an object, and a style
      // array became numeric keys the browser rejects.
      style={StyleSheet.flatten([getTabsListStyle(visual, colors), style])}
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
  const visual = useVisualTokens();
  const colors = useThemeColors();
  const tokenStyle = getTabsTriggerStyle(visual, colors, isActive);

  return (
    <TabsPrimitive.Trigger value={tabValue} disabled={disabled ?? undefined} asChild>
      <Pressable
        className={cn(
          tabsTriggerVariants({ state: isActive ? 'active' : 'inactive' }),
          'flex-1',
          className
        )}
        style={(state) => [
          typeof styleProp === 'function' ? styleProp(state) : styleProp,
          tokenStyle,
        ]}
        // The native primitive presses the tab itself. Its web trigger selects through
        // Radix's mouse and key handlers and passes no `onPress`, which the base needs
        // before it treats the tab as a control (focus ring, click, Space).
        onPress={Platform.OS === 'web' ? () => onValueChange(tabValue) : undefined}
        focusIndicator="inset"
        feedback="default"
        disabled={disabled}
        {...props}
      >
        {children}
      </Pressable>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ value: tabValue, className, children, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content value={tabValue} className={cn('mt-2', className)} {...props}>
      {children}
    </TabsPrimitive.Content>
  );
}

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsTriggerVariants };
