import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { View, Pressable, type ViewProps, type PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '../../lib/cn';
import { useInteractionTokens, withInteractivePressableStyle } from '../../lib/interaction-tokens';

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  type: AccordionType;
  value: string[];
  onValueChange: (itemValue: string) => void;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue>({
  type: 'single',
  value: [],
  onValueChange: () => {},
  collapsible: true,
});

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isOpen: false,
});

export interface AccordionProps extends ViewProps {
  type?: AccordionType;
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
}

export interface AccordionItemProps extends ViewProps {
  value: string;
  className?: string;
}

export interface AccordionTriggerProps extends Omit<PressableProps, 'children'> {
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionContentProps extends ViewProps {
  className?: string;
}

function Accordion({
  type = 'single',
  defaultValue,
  collapsible = true,
  className,
  children,
  ...props
}: AccordionProps) {
  const [value, setValue] = useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const onValueChange = useCallback(
    (itemValue: string) => {
      setValue((prev) => {
        if (type === 'single') {
          if (prev.includes(itemValue) && collapsible) return [];
          if (prev.includes(itemValue)) return prev;
          return [itemValue];
        }
        if (prev.includes(itemValue)) return prev.filter((v) => v !== itemValue);
        return [...prev, itemValue];
      });
    },
    [type, collapsible]
  );
  const contextValue = useMemo(
    () => ({ type, value, onValueChange, collapsible }),
    [collapsible, onValueChange, type, value]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { value: selectedValues } = useContext(AccordionContext);
  const isOpen = selectedValues.includes(value);
  const contextValue = useMemo(() => ({ value, isOpen }), [isOpen, value]);

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <View className={cn('border-b border-border', className)} {...props}>
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  className,
  children,
  style: styleProp,
  ...props
}: AccordionTriggerProps) {
  const { onValueChange } = useContext(AccordionContext);
  const { value, isOpen } = useContext(AccordionItemContext);
  const interaction = useInteractionTokens();
  const interactiveStyle = withInteractivePressableStyle(styleProp, interaction, {
    pressedVariant: 'default',
  });

  return (
    <Pressable
      accessibilityRole="button"
      className={cn('flex flex-row items-center justify-between py-4', className)}
      onPress={() => onValueChange(value)}
      style={interactiveStyle}
      {...props}
    >
      {children}
      <View
        className={cn(
          'border-foreground h-2 w-2 rotate-45 border-b-2 border-r-2 transition-transform',
          isOpen && 'rotate-[225deg]'
        )}
      />
    </Pressable>
  );
}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { isOpen } = useContext(AccordionItemContext);
  const interaction = useInteractionTokens();
  const opacity = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(isOpen ? 1 : 0, {
      duration: interaction.motionNormal,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isOpen, opacity, interaction.motionNormal]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className={cn('pb-4 overflow-hidden', className)}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
