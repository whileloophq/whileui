import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { View, type GestureResponderEvent, type ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '../../lib/cn';
import { composeEventHandlers, type AsChildElement } from '../../lib/compose-event-handlers';
import { Pressable, type PressableProps } from '../pressable';

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
  const { isOpen, toggle, disabled } = useContext(CollapsibleContext);

  const handlePress = (e: GestureResponderEvent) => {
    onPress?.(e);
    toggle();
  };

  // `asChild` gives the child the press and the state; wrapping it in another Pressable,
  // as this once did, put one control inside another.
  if (asChild && React.isValidElement(children)) {
    const child = children as AsChildElement;
    return React.cloneElement(child, {
      ...props,
      className: cn(child.props.className, className),
      onPress: composeEventHandlers(child.props.onPress, handlePress),
      disabled,
      'aria-expanded': isOpen,
    } as Partial<PressableProps>);
  }

  return (
    <Pressable
      className={cn(className)}
      onPress={handlePress}
      disabled={disabled}
      aria-expanded={isOpen}
      feedback="default"
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
