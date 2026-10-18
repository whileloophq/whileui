import React from 'react';
import { View, type ViewInstance, type ViewProps } from 'react-native';
import { cn } from '../../lib/cn';
import { tv, type VariantProps } from '../../lib/tv';
import type { ForwardRefComponent } from '../../lib/ref-types';

const progressVariants = tv({
  base: 'h-3 w-full overflow-hidden rounded-full bg-secondary',
  variants: {
    size: {
      sm: 'h-1.5',
      default: 'h-3',
      lg: 'h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface ProgressProps extends ViewProps, VariantProps<typeof progressVariants> {
  value?: number; // 0-100
  indicatorClassName?: string;
}

const Progress: ForwardRefComponent<ViewInstance, ProgressProps> = React.forwardRef(
  ({ className, value = 0, size, indicatorClassName, ...props }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
      <View
        ref={ref}
        className={cn(progressVariants({ size }), className)}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
        // A progress bar announcing "60 percent" of nothing is not useful, and a
        // progressbar with no name fails WCAG 4.1.2. Callers should say what is
        // progressing; this is the floor, not the answer.
        accessibilityLabel="Progress"
        {...props}
      >
        <View
          className={cn('h-full rounded-full bg-primary', indicatorClassName)}
          style={{ width: `${clampedValue}%` }}
        />
      </View>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress, progressVariants };
