import React from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import type { ForwardRefComponent } from '../../lib/ref-types';

const rowVariants = tv({
  base: 'flex-row',
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
    align: 'center',
    justify: 'start',
  },
});

export interface RowProps extends Omit<ViewProps, 'className'>, VariantProps<typeof rowVariants> {
  className?: string;
}

const Row: ForwardRefComponent<ViewInstance, RowProps> = React.forwardRef(
  ({ className, gap, align, justify, ...props }, ref) => {
    return (
      <View ref={ref} className={cn(rowVariants({ gap, align, justify }), className)} {...props} />
    );
  }
);

Row.displayName = 'Row';

export { Row, rowVariants };
