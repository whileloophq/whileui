import React from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import type { ForwardRefComponent } from '../../lib/ref-types';

const stackVariants = tv({
  base: 'flex-col',
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
      '2xl': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export interface StackProps
  extends Omit<ViewProps, 'className'>, VariantProps<typeof stackVariants> {
  className?: string;
}

const Stack: ForwardRefComponent<ViewInstance, StackProps> = React.forwardRef(
  ({ className, gap, align, justify, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(stackVariants({ gap, align, justify }), className)}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';

export { Stack, stackVariants };
