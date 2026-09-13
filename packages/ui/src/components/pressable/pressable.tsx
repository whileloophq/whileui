import React from 'react';
import { Pressable as RNPressable, type PressableProps as RNPressableProps } from 'react-native';
import { cn } from '../../lib/cn';

export interface PressableProps extends RNPressableProps {
  className?: string;
}

const Pressable = React.forwardRef<React.ComponentRef<typeof RNPressable>, PressableProps>(
  ({ className, ...props }, ref) => {
    return <RNPressable ref={ref} className={cn(className)} {...props} />;
  }
);

Pressable.displayName = 'Pressable';

export { Pressable };
