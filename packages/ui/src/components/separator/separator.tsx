import React from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import type { ForwardRefComponent } from '../../lib/ref-types';

export interface SeparatorProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

const Separator: ForwardRefComponent<ViewInstance, SeparatorProps> = React.forwardRef(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          'bg-border',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
