import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  View,
  Pressable,
  type GestureResponderEvent,
  type ViewProps,
  type PressableProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '../../lib/cn';

interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
  disabled: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue>({
  isOpen: false,
  toggle: () => {},
  disabled: false,
});

export function useCollapsible() {
  return useContext(CollapsibleContext);
}

export interface CollapsibleProps extends ViewProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface CollapsibleTriggerProps extends PressableProps {
  className?: string;
  asChild?: boolean;
}

export interface CollapsibleContentProps extends ViewProps {
  className?: string;
  forceMount?: boolean;
}

function Collapsible({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  }, [disabled, isOpen, onOpenChange]);
  const contextValue = useMemo(() => ({ isOpen, toggle, disabled }), [disabled, isOpen, toggle]);

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <View className={cn(className)} {...props}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  className,
  children,
  asChild,
  onPress,
  ...props
}: CollapsibleTriggerProps) {
  const { toggle, disabled } = useContext(CollapsibleContext);

  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e);
    toggle();
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        disabled={disabled}
        className={cn(className)}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(className)}
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
}

function CollapsibleContent({
  className,
  children,
  forceMount,
  ...props
}: CollapsibleContentProps) {
  const { isOpen } = useContext(CollapsibleContext);
  const opacity = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(isOpen ? 1 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  }, [isOpen, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isOpen && !forceMount) return null;

  return (
    <Animated.View style={animatedStyle} className={cn(className)} {...props}>
      {children}
    </Animated.View>
  );
}

Collapsible.displayName = 'Collapsible';
CollapsibleTrigger.displayName = 'CollapsibleTrigger';
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
